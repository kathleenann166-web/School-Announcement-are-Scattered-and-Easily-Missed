import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbStore } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Helper auth check
  function getRequestUser(req: express.Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.replace(/^Bearer\s+/, '');
    // token format: token-{userId}-{timestamp}
    const match = token.match(/^token-(user-[a-zA-Z0-9_-]+)/);
    if (!match) return null;
    const userId = match[1];
    return dbStore.getUserById(userId);
  }

  // API Routes
  const apiRouter = express.Router();

  // Health
  apiRouter.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Auth: Login
  apiRouter.post('/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Please provide both email and password.' });
      }

      const result = dbStore.loginUser(email, password);
      if (!result) {
        return res.status(401).json({ error: 'Incorrect email or password. Please try again.' });
      }

      res.json(result);
    } catch (err: any) {
      res.status(403).json({ error: err.message || 'Login failed.' });
    }
  });

  // Auth: Register
  apiRouter.post('/auth/register', (req, res) => {
    try {
      const { name, email, password, role, studentId, gradeLevel, department } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      }

      const result = dbStore.registerUser({
        name,
        email,
        password,
        role: role === 'admin' ? 'admin' : 'student',
        studentId,
        gradeLevel,
        department
      });

      if (result.error) {
        return res.status(409).json({ error: result.error });
      }

      const loginData = dbStore.loginUser(email, password);
      res.status(201).json(loginData);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Registration failed.' });
    }
  });

  // Auth: Forgot Password
  apiRouter.post('/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Please enter your registered email address.' });
    }

    const result = dbStore.resetUserPassword(email);
    if (!result.success) {
      return res.status(404).json({ error: result.message });
    }

    res.json(result);
  });

  // Auth: Current User
  apiRouter.get('/auth/me', (req, res) => {
    const user = getRequestUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
    res.json({ user });
  });

  // Announcements: List
  apiRouter.get('/announcements', (req, res) => {
    const { search, category, priority, targetAudience, status, userId } = req.query;
    const result = dbStore.getAnnouncements({
      search: search ? String(search) : undefined,
      category: category ? String(category) : undefined,
      priority: priority ? String(priority) : undefined,
      targetAudience: targetAudience ? String(targetAudience) : undefined,
      status: status ? String(status) : undefined,
      userId: userId ? String(userId) : undefined
    });
    res.json(result);
  });

  // Announcements: Detail
  apiRouter.get('/announcements/:id', (req, res) => {
    const announcement = dbStore.getAnnouncementById(req.params.id, true);
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found.' });
    }
    res.json(announcement);
  });

  // Announcements: Create (Admin)
  apiRouter.post('/announcements', (req, res) => {
    const user = getRequestUser(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Only administrators can publish announcements.' });
    }

    const { title, category, priority, summary, content } = req.body;
    if (!title || !category || !content) {
      return res.status(400).json({ error: 'Title, category, and content are required fields.' });
    }

    const created = dbStore.createAnnouncement(req.body, user);
    res.status(201).json(created);
  });

  // Announcements: Update (Admin)
  apiRouter.put('/announcements/:id', (req, res) => {
    const user = getRequestUser(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Only administrators can edit announcements.' });
    }

    const updated = dbStore.updateAnnouncement(req.params.id, req.body, user);
    if (!updated) {
      return res.status(404).json({ error: 'Announcement not found.' });
    }
    res.json(updated);
  });

  // Announcements: Delete (Admin)
  apiRouter.delete('/announcements/:id', (req, res) => {
    const user = getRequestUser(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Only administrators can delete announcements.' });
    }

    const success = dbStore.deleteAnnouncement(req.params.id, user);
    if (!success) {
      return res.status(404).json({ error: 'Announcement not found.' });
    }
    res.json({ success: true, message: 'Announcement deleted successfully.' });
  });

  // Student action: Toggle read
  apiRouter.post('/announcements/:id/read', (req, res) => {
    const { userId, markRead } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required.' });
    }
    const result = dbStore.toggleReadAnnouncement(req.params.id, userId, markRead);
    res.json(result);
  });

  // Student action: Toggle bookmark
  apiRouter.post('/announcements/:id/bookmark', (req, res) => {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required.' });
    }
    const result = dbStore.toggleBookmarkAnnouncement(req.params.id, userId);
    res.json(result);
  });

  // Admin: Student directory
  apiRouter.get('/students', (req, res) => {
    const user = getRequestUser(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required.' });
    }
    const students = dbStore.getUsers().filter(u => u.role === 'student');
    res.json(students);
  });

  // Admin: Toggle student status
  apiRouter.patch('/students/:id/status', (req, res) => {
    const user = getRequestUser(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required.' });
    }
    const updated = dbStore.toggleUserStatus(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: 'Student account not found.' });
    }
    res.json(updated);
  });

  // Admin: Reset student password
  apiRouter.post('/students/:id/reset-password', (req, res) => {
    const user = getRequestUser(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required.' });
    }
    const target = dbStore.getUserById(req.params.id);
    if (!target) {
      return res.status(404).json({ error: 'Student not found.' });
    }
    const result = dbStore.resetUserPassword(target.email);
    res.json(result);
  });

  // Admin: Stats & Analytics
  apiRouter.get('/stats', (req, res) => {
    const user = getRequestUser(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required.' });
    }
    const stats = dbStore.getStats();
    res.json(stats);
  });

  // Admin: Logs
  apiRouter.get('/logs', (req, res) => {
    const user = getRequestUser(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required.' });
    }
    res.json(dbStore.getLogs());
  });

  // Notifications
  apiRouter.get('/notifications/:userId', (req, res) => {
    const list = dbStore.getNotifications(req.params.userId);
    res.json(list);
  });

  apiRouter.post('/notifications/:userId/read-all', (req, res) => {
    dbStore.markNotificationsAsRead(req.params.userId);
    res.json({ success: true });
  });

  // Mount API router
  app.use('/api', apiRouter);

  // Dev vs Production Vite handling
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 School Announcement Hub server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
