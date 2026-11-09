export type UserRole = 'student' | 'admin';

export type AnnouncementCategory =
  | 'Academic'
  | 'School Activities'
  | 'Events'
  | 'Examination Schedules'
  | 'Enrollment'
  | 'Student Affairs'
  | 'Important Reminders'
  | 'Emergency Announcements';

export type AnnouncementPriority = 'Normal' | 'Important' | 'Urgent' | 'Emergency';

export type TargetAudience =
  | 'All Students'
  | 'Senior High School'
  | 'Junior High School'
  | 'College Department'
  | 'Faculty & Staff';

export interface Attachment {
  name: string;
  size: string;
  type: string;
  downloadUrl?: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  summary: string;
  content: string;
  authorName: string;
  authorRole: string;
  targetAudience: TargetAudience;
  publishDate: string; // ISO date string
  scheduledFor?: string;
  status: 'published' | 'scheduled' | 'draft' | 'archived';
  eventDate?: string;
  deadlineDate?: string;
  location?: string;
  campus?: string;
  imageUrl?: string;
  attachments?: Attachment[];
  tags: string[];
  isPinned: boolean;
  viewsCount: number;
  readByStudentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  campus?: string;
  department?: string;
  gradeLevel?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserRecord extends User {
  passwordHash: string;
  bookmarkedAnnouncementIds: string[];
  readAnnouncementIds: string[];
}

export interface NotificationItem {
  id: string;
  announcementId: string;
  title: string;
  message: string;
  priority: AnnouncementPriority;
  category: AnnouncementCategory;
  isRead: boolean;
  createdAt: string;
}

export interface AnnouncementStats {
  totalAnnouncements: number;
  publishedCount: number;
  scheduledCount: number;
  emergencyCount: number;
  urgentCount: number;
  totalStudents: number;
  activeStudents: number;
  totalReads: number;
  averageReadRate: number;
  categoryBreakdown: { category: AnnouncementCategory; count: number }[];
  audienceBreakdown: { audience: string; count: number }[];
  mostViewedAnnouncements: { id: string; title: string; views: number; reads: number }[];
}

export interface AuthResponse {
  user: User;
  token: string;
}
