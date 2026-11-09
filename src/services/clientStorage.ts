import type {
  Announcement,
  User,
  AnnouncementStats,
  NotificationItem,
  AuthResponse,
  AnnouncementCategory,
  AnnouncementPriority
} from '../types.ts';
import { SEED_ANNOUNCEMENTS, SEED_USERS, type ClientUser } from './seedData.ts';

const LOCAL_STORAGE_DB_KEY = 'omsc_mamburao_client_db_v1';

interface ClientDatabase {
  users: ClientUser[];
  announcements: Announcement[];
  notifications: Record<string, NotificationItem[]>;
  logs: Array<{ id: string; action: string; actor: string; timestamp: string; details?: string }>;
}

function getStoredDB(): ClientDatabase {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.users && parsed.announcements) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read client db from localStorage', e);
  }

  const initial: ClientDatabase = {
    users: SEED_USERS,
    announcements: SEED_ANNOUNCEMENTS,
    notifications: {
      'user-student-1': [
        {
          id: 'notif-1',
          announcementId: 'ann-1',
          title: 'OMSC MAMBURAO EMERGENCY: Storm Weather Class Suspension',
          message: 'All classes at OMSC Mamburao Campus in Brgy. Tayamaan are suspended immediately.',
          priority: 'Emergency',
          category: 'Emergency Announcements',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          id: 'notif-2',
          announcementId: 'ann-2',
          title: 'OMSC Mamburao Midterm Schedules Posted',
          message: 'Room assignments for CTE, CBAM, CAST, and CCJE released at the Tayamaan campus.',
          priority: 'Important',
          category: 'Examination Schedules',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
        }
      ]
    },
    logs: [
      {
        id: 'log-1',
        action: 'MAMBURAO_PORTAL_CLIENT_INIT',
        actor: 'OMSC Mamburao Portal',
        timestamp: new Date().toISOString(),
        details: 'Standalone client database initialized for GitHub Pages / static hosting.'
      }
    ]
  };

  saveDB(initial);
  return initial;
}

function saveDB(db: ClientDatabase) {
  try {
    localStorage.setItem(LOCAL_STORAGE_DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn('Could not save client db to localStorage', e);
  }
}

export const clientStorage = {
  login(email: string, password: string): AuthResponse {
    const db = getStoredDB();
    const clean = email.toLowerCase().trim();
    const user = db.users.find(u => {
      const uEmail = u.email.toLowerCase();
      if (uEmail === clean) return true;
      if (clean === 'student@mamburao.omsc.edu.ph' && uEmail === 'student@school.edu') return true;
      if (clean === 'admin@mamburao.omsc.edu.ph' && uEmail === 'admin@school.edu') return true;
      return false;
    });

    if (!user) {
      throw new Error('Invalid email or password.');
    }
    if (user.password && user.password !== password) {
      throw new Error('Invalid email or password.');
    }
    if (!user.isActive) {
      throw new Error('This account has been deactivated. Please contact the OMSC Mamburao Campus Director Office.');
    }

    const { password: _, readAnnouncementIds, bookmarkedAnnouncementIds, ...safe } = user;
    return {
      token: `client-token-${user.id}-${Date.now()}`,
      user: safe
    };
  },

  register(params: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'admin';
    studentId?: string;
    gradeLevel?: string;
    department?: string;
  }): AuthResponse {
    const db = getStoredDB();
    const email = params.email.toLowerCase().trim();
    if (db.users.some(u => u.email.toLowerCase() === email)) {
      throw new Error('An account with this email already exists in OMSC Mamburao records.');
    }

    const newUser: ClientUser = {
      id: `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name: params.name.trim(),
      email,
      role: params.role,
      campus: 'OMSC Mamburao Campus',
      studentId: params.studentId?.trim() || `2026-MAMB-${Math.floor(10000 + Math.random() * 90000)}`,
      gradeLevel: params.gradeLevel?.trim() || 'Collegiate Undergraduate',
      department: params.department?.trim() || (params.role === 'admin' ? 'Office of the Campus Director' : 'College of Teacher Education (CTE)'),
      isActive: true,
      createdAt: new Date().toISOString(),
      password: params.password,
      bookmarkedAnnouncementIds: [],
      readAnnouncementIds: []
    };

    db.users.push(newUser);
    saveDB(db);

    const { password: _, readAnnouncementIds, bookmarkedAnnouncementIds, ...safe } = newUser;
    return {
      token: `client-token-${newUser.id}-${Date.now()}`,
      user: safe
    };
  },

  forgotPassword(email: string) {
    const db = getStoredDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      return { success: false, message: 'No registered OMSC Mamburao account found with that email address.' };
    }
    const tempPassword = `Mamburao${Math.floor(1000 + Math.random() * 9000)}!`;
    user.password = tempPassword;
    saveDB(db);
    return {
      success: true,
      tempPassword,
      message: `Password reset successfully! Your temporary password is: ${tempPassword}. You can now log in.`
    };
  },

  getAnnouncements(query?: {
    search?: string;
    category?: string;
    priority?: string;
    targetAudience?: string;
    status?: string;
    userId?: string;
  }) {
    const db = getStoredDB();
    let list = [...db.announcements];

    if (query?.status) {
      list = list.filter(a => a.status === query.status);
    } else {
      list = list.filter(a => a.status === 'published' || a.status === 'scheduled');
    }

    if (query?.category && query.category !== 'All') {
      list = list.filter(a => a.category.toLowerCase() === query.category!.toLowerCase());
    }

    if (query?.priority && query.priority !== 'All') {
      list = list.filter(a => a.priority.toLowerCase() === query.priority!.toLowerCase());
    }

    if (query?.targetAudience && query.targetAudience !== 'All') {
      list = list.filter(a => a.targetAudience === query.targetAudience || a.targetAudience === 'All Students');
    }

    if (query?.search) {
      const q = query.search.toLowerCase().trim();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.authorName.toLowerCase().includes(q) ||
        (a.location && a.location.toLowerCase().includes(q)) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.priority === 'Emergency' && b.priority !== 'Emergency') return -1;
      if (a.priority !== 'Emergency' && b.priority === 'Emergency') return 1;
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });

    let userReads: string[] = [];
    let userBookmarks: string[] = [];

    if (query?.userId) {
      const u = db.users.find(usr => usr.id === query.userId);
      if (u) {
        userReads = u.readAnnouncementIds || [];
        userBookmarks = u.bookmarkedAnnouncementIds || [];
      }
    }

    return { announcements: list, userReads, userBookmarks };
  },

  getAnnouncement(id: string): Announcement {
    const db = getStoredDB();
    const ann = db.announcements.find(a => a.id === id);
    if (!ann) throw new Error('Announcement not found');
    ann.viewsCount = (ann.viewsCount || 0) + 1;
    saveDB(db);
    return ann;
  },

  createAnnouncement(data: Partial<Announcement>, currentUser?: User | null): Announcement {
    const db = getStoredDB();
    const now = new Date().toISOString();
    const newAnn: Announcement = {
      id: `ann-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      title: data.title || 'Untitled Mamburao Announcement',
      category: (data.category as AnnouncementCategory) || 'Academic',
      priority: (data.priority as AnnouncementPriority) || 'Normal',
      summary: data.summary || '',
      content: data.content || '',
      authorName: data.authorName || currentUser?.name || 'Office of the Campus Director',
      authorRole: data.authorRole || currentUser?.department || 'Office of the Campus Director, OMSC Mamburao',
      targetAudience: data.targetAudience || 'All Students',
      campus: 'OMSC Mamburao Campus',
      publishDate: data.scheduledFor ? data.scheduledFor : now,
      scheduledFor: data.scheduledFor,
      status: data.scheduledFor && new Date(data.scheduledFor) > new Date() ? 'scheduled' : 'published',
      eventDate: data.eventDate,
      deadlineDate: data.deadlineDate,
      location: data.location || 'OMSC Mamburao Campus, Brgy. Tayamaan',
      imageUrl: data.imageUrl,
      attachments: data.attachments || [],
      tags: data.tags || ['OMSC', 'Mamburao'],
      isPinned: Boolean(data.isPinned),
      viewsCount: 0,
      readByStudentIds: [],
      createdAt: now,
      updatedAt: now
    };

    db.announcements.unshift(newAnn);

    // Broadcast notification to students
    const students = db.users.filter(u => u.role === 'student');
    students.forEach(s => {
      if (!db.notifications[s.id]) db.notifications[s.id] = [];
      db.notifications[s.id].unshift({
        id: `notif-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        announcementId: newAnn.id,
        title: newAnn.title,
        message: newAnn.summary || `New ${newAnn.category} bulletin published for OMSC Mamburao Campus.`,
        priority: newAnn.priority,
        category: newAnn.category,
        isRead: false,
        createdAt: now
      });
    });

    db.logs.push({
      id: `log-${Date.now()}`,
      action: 'CREATE_MAMBURAO_ANNOUNCEMENT',
      actor: currentUser?.email || 'admin',
      timestamp: now,
      details: `Created announcement: ${newAnn.title}`
    });

    saveDB(db);
    return newAnn;
  },

  updateAnnouncement(id: string, data: Partial<Announcement>): Announcement {
    const db = getStoredDB();
    const idx = db.announcements.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Announcement not found');
    const updated = {
      ...db.announcements[idx],
      ...data,
      campus: 'OMSC Mamburao Campus',
      updatedAt: new Date().toISOString()
    };
    db.announcements[idx] = updated;
    saveDB(db);
    return updated;
  },

  deleteAnnouncement(id: string): { success: boolean } {
    const db = getStoredDB();
    const idx = db.announcements.findIndex(a => a.id === id);
    if (idx !== -1) {
      db.announcements.splice(idx, 1);
      saveDB(db);
    }
    return { success: true };
  },

  toggleRead(id: string, userId: string, markRead?: boolean): { isRead: boolean } {
    const db = getStoredDB();
    const user = db.users.find(u => u.id === userId);
    const ann = db.announcements.find(a => a.id === id);
    if (!user || !ann) return { isRead: false };

    if (!user.readAnnouncementIds) user.readAnnouncementIds = [];
    if (!ann.readByStudentIds) ann.readByStudentIds = [];

    const isCurrentlyRead = user.readAnnouncementIds.includes(id);
    const targetState = markRead !== undefined ? markRead : !isCurrentlyRead;

    if (targetState) {
      if (!user.readAnnouncementIds.includes(id)) user.readAnnouncementIds.push(id);
      if (!ann.readByStudentIds.includes(userId)) ann.readByStudentIds.push(userId);
    } else {
      user.readAnnouncementIds = user.readAnnouncementIds.filter(x => x !== id);
      ann.readByStudentIds = ann.readByStudentIds.filter(x => x !== userId);
    }

    saveDB(db);
    return { isRead: targetState };
  },

  toggleBookmark(id: string, userId: string): { isBookmarked: boolean } {
    const db = getStoredDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) return { isBookmarked: false };

    if (!user.bookmarkedAnnouncementIds) user.bookmarkedAnnouncementIds = [];

    const isBookmarked = user.bookmarkedAnnouncementIds.includes(id);
    if (isBookmarked) {
      user.bookmarkedAnnouncementIds = user.bookmarkedAnnouncementIds.filter(x => x !== id);
    } else {
      user.bookmarkedAnnouncementIds.push(id);
    }

    saveDB(db);
    return { isBookmarked: !isBookmarked };
  },

  getStudents(): User[] {
    const db = getStoredDB();
    return db.users.map(({ password: _, readAnnouncementIds: __, bookmarkedAnnouncementIds: ___, ...u }) => u);
  },

  toggleStudentStatus(userId: string): User {
    const db = getStoredDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) throw new Error('Student not found');
    user.isActive = !user.isActive;
    saveDB(db);
    const { password: _, readAnnouncementIds, bookmarkedAnnouncementIds, ...safe } = user;
    return safe;
  },

  resetStudentPassword(userId: string) {
    const db = getStoredDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) throw new Error('Student not found');
    const tempPassword = `Mamburao${Math.floor(1000 + Math.random() * 9000)}!`;
    user.password = tempPassword;
    saveDB(db);
    return {
      success: true,
      tempPassword,
      message: `Password reset to: ${tempPassword}`
    };
  },

  getStats(): AnnouncementStats {
    const db = getStoredDB();
    const totalAnnouncements = db.announcements.length;
    const publishedCount = db.announcements.filter(a => a.status === 'published').length;
    const scheduledCount = db.announcements.filter(a => a.status === 'scheduled').length;
    const emergencyCount = db.announcements.filter(a => a.priority === 'Emergency').length;
    const urgentCount = db.announcements.filter(a => a.priority === 'Urgent').length;

    const students = db.users.filter(u => u.role === 'student');
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.isActive).length;

    const totalReads = db.announcements.reduce((acc, curr) => acc + (curr.readByStudentIds?.length || 0), 0);

    const categories: AnnouncementCategory[] = [
      'Academic',
      'School Activities',
      'Events',
      'Examination Schedules',
      'Enrollment',
      'Student Affairs',
      'Important Reminders',
      'Emergency Announcements'
    ];

    const categoryBreakdown = categories.map(cat => ({
      category: cat,
      count: db.announcements.filter(a => a.category === cat).length
    }));

    const audiences = ['All Students', 'Senior High School', 'Junior High School', 'College Department'];
    const audienceBreakdown = audiences.map(aud => ({
      audience: aud,
      count: db.announcements.filter(a => a.targetAudience === aud).length
    }));

    const mostViewedAnnouncements = [...db.announcements]
      .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
      .slice(0, 5)
      .map(a => ({
        id: a.id,
        title: a.title,
        views: a.viewsCount || 0,
        reads: a.readByStudentIds?.length || 0
      }));

    const averageReadRate = totalStudents > 0 && publishedCount > 0
      ? Math.round((totalReads / (totalStudents * publishedCount)) * 100)
      : 0;

    return {
      totalAnnouncements,
      publishedCount,
      scheduledCount,
      emergencyCount,
      urgentCount,
      totalStudents,
      activeStudents,
      totalReads,
      averageReadRate,
      categoryBreakdown,
      audienceBreakdown,
      mostViewedAnnouncements
    };
  },

  getLogs() {
    const db = getStoredDB();
    return db.logs.slice(-30).reverse();
  },

  getNotifications(userId: string): NotificationItem[] {
    const db = getStoredDB();
    return db.notifications[userId] || [];
  },

  markAllNotificationsRead(userId: string): { success: boolean } {
    const db = getStoredDB();
    const list = db.notifications[userId];
    if (list) {
      list.forEach(n => { n.isRead = true; });
      saveDB(db);
    }
    return { success: true };
  }
};
