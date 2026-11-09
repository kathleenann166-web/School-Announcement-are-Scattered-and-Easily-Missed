import type {
  Announcement,
  User,
  AnnouncementStats,
  NotificationItem,
  AuthResponse
} from '../types.ts';
import { clientStorage } from './clientStorage.ts';

const TOKEN_KEY = 'schoolHubAuthToken';
const USER_KEY = 'schoolHubCurrentUser';

// Helper to check if we are hosted statically on GitHub Pages or file protocol
const isStaticHost = typeof window !== 'undefined' && (
  window.location.hostname.includes('github.io') ||
  window.location.protocol === 'file:'
);

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setAuth(token: string, user: User) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `HTTP error ${response.status}`);
    }

    return data as T;
  },

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    if (isStaticHost) {
      const res = clientStorage.login(email, password);
      this.setAuth(res.token, res.user);
      return res;
    }

    try {
      const res = await this.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      this.setAuth(res.token, res.user);
      return res;
    } catch (err: any) {
      // Fallback for standalone/offline static hosting
      if (err.message?.includes('Failed to fetch') || err.message?.includes('404')) {
        const res = clientStorage.login(email, password);
        this.setAuth(res.token, res.user);
        return res;
      }
      throw err;
    }
  },

  async register(params: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'admin';
    studentId?: string;
    gradeLevel?: string;
    department?: string;
  }): Promise<AuthResponse> {
    if (isStaticHost) {
      const res = clientStorage.register(params);
      this.setAuth(res.token, res.user);
      return res;
    }

    try {
      const res = await this.request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(params)
      });
      this.setAuth(res.token, res.user);
      return res;
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('404')) {
        const res = clientStorage.register(params);
        this.setAuth(res.token, res.user);
        return res;
      }
      throw err;
    }
  },

  async forgotPassword(email: string): Promise<{ success: boolean; tempPassword?: string; message: string }> {
    if (isStaticHost) {
      return clientStorage.forgotPassword(email);
    }
    try {
      return await this.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('404')) {
        return clientStorage.forgotPassword(email);
      }
      throw err;
    }
  },

  async getMe(): Promise<{ user: User }> {
    const local = this.getCurrentUser();
    if (isStaticHost && local) {
      return { user: local };
    }
    try {
      return await this.request<{ user: User }>('/auth/me');
    } catch (err) {
      if (local) return { user: local };
      throw err;
    }
  },

  // Announcements
  async getAnnouncements(query?: {
    search?: string;
    category?: string;
    priority?: string;
    targetAudience?: string;
    status?: string;
    userId?: string;
  }): Promise<{ announcements: Announcement[]; userReads: string[]; userBookmarks: string[] }> {
    if (isStaticHost) {
      return clientStorage.getAnnouncements(query);
    }

    const params = new URLSearchParams();
    if (query?.search) params.set('search', query.search);
    if (query?.category && query.category !== 'All') params.set('category', query.category);
    if (query?.priority && query.priority !== 'All') params.set('priority', query.priority);
    if (query?.targetAudience && query.targetAudience !== 'All') params.set('targetAudience', query.targetAudience);
    if (query?.status) params.set('status', query.status);
    if (query?.userId) params.set('userId', query.userId);

    const qs = params.toString() ? `?${params.toString()}` : '';
    try {
      return await this.request(`/announcements${qs}`);
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('404')) {
        return clientStorage.getAnnouncements(query);
      }
      throw err;
    }
  },

  async getAnnouncement(id: string): Promise<Announcement> {
    if (isStaticHost) {
      return clientStorage.getAnnouncement(id);
    }
    try {
      return await this.request(`/announcements/${id}`);
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('404')) {
        return clientStorage.getAnnouncement(id);
      }
      throw err;
    }
  },

  async createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
    if (isStaticHost) {
      return clientStorage.createAnnouncement(data, this.getCurrentUser());
    }
    try {
      return await this.request('/announcements', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('404')) {
        return clientStorage.createAnnouncement(data, this.getCurrentUser());
      }
      throw err;
    }
  },

  async updateAnnouncement(id: string, data: Partial<Announcement>): Promise<Announcement> {
    if (isStaticHost) {
      return clientStorage.updateAnnouncement(id, data);
    }
    try {
      return await this.request(`/announcements/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('404')) {
        return clientStorage.updateAnnouncement(id, data);
      }
      throw err;
    }
  },

  async deleteAnnouncement(id: string): Promise<{ success: boolean }> {
    if (isStaticHost) {
      return clientStorage.deleteAnnouncement(id);
    }
    try {
      return await this.request(`/announcements/${id}`, {
        method: 'DELETE'
      });
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('404')) {
        return clientStorage.deleteAnnouncement(id);
      }
      throw err;
    }
  },

  async toggleRead(id: string, userId: string, markRead?: boolean): Promise<{ isRead: boolean }> {
    if (isStaticHost) {
      return clientStorage.toggleRead(id, userId, markRead);
    }
    try {
      return await this.request(`/announcements/${id}/read`, {
        method: 'POST',
        body: JSON.stringify({ userId, markRead })
      });
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('404')) {
        return clientStorage.toggleRead(id, userId, markRead);
      }
      throw err;
    }
  },

  async toggleBookmark(id: string, userId: string): Promise<{ isBookmarked: boolean }> {
    if (isStaticHost) {
      return clientStorage.toggleBookmark(id, userId);
    }
    try {
      return await this.request(`/announcements/${id}/bookmark`, {
        method: 'POST',
        body: JSON.stringify({ userId })
      });
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('404')) {
        return clientStorage.toggleBookmark(id, userId);
      }
      throw err;
    }
  },

  // Students & Directory (Admin)
  async getStudents(): Promise<User[]> {
    if (isStaticHost) {
      return clientStorage.getStudents();
    }
    try {
      return await this.request('/students');
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('404')) {
        return clientStorage.getStudents();
      }
      throw err;
    }
  },

  async toggleStudentStatus(userId: string): Promise<User> {
    if (isStaticHost) {
      return clientStorage.toggleStudentStatus(userId);
    }
    try {
      return await this.request(`/students/${userId}/status`, {
        method: 'PATCH'
      });
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('404')) {
        return clientStorage.toggleStudentStatus(userId);
      }
      throw err;
    }
  },

  async resetStudentPassword(userId: string): Promise<{ success: boolean; tempPassword?: string; message: string }> {
    if (isStaticHost) {
      return clientStorage.resetStudentPassword(userId);
    }
    try {
      return await this.request(`/students/${userId}/reset-password`, {
        method: 'POST'
      });
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('404')) {
        return clientStorage.resetStudentPassword(userId);
      }
      throw err;
    }
  },

  // Stats & Logs (Admin)
  async getStats(): Promise<AnnouncementStats> {
    if (isStaticHost) {
      return clientStorage.getStats();
    }
    try {
      return await this.request('/stats');
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('404')) {
        return clientStorage.getStats();
      }
      throw err;
    }
  },

  async getLogs(): Promise<Array<{ id: string; action: string; actor: string; timestamp: string; details?: string }>> {
    if (isStaticHost) {
      return clientStorage.getLogs();
    }
    try {
      return await this.request('/logs');
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('404')) {
        return clientStorage.getLogs();
      }
      throw err;
    }
  },

  // Notifications
  async getNotifications(userId: string): Promise<NotificationItem[]> {
    if (isStaticHost) {
      return clientStorage.getNotifications(userId);
    }
    try {
      return await this.request(`/notifications/${userId}`);
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('404')) {
        return clientStorage.getNotifications(userId);
      }
      throw err;
    }
  },

  async markAllNotificationsRead(userId: string): Promise<{ success: boolean }> {
    if (isStaticHost) {
      return clientStorage.markAllNotificationsRead(userId);
    }
    try {
      return await this.request(`/notifications/${userId}/read-all`, {
        method: 'POST'
      });
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('404')) {
        return clientStorage.markAllNotificationsRead(userId);
      }
      throw err;
    }
  }
};
