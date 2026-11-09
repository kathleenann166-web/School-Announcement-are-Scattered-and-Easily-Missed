import React, { useState, useEffect, useCallback } from 'react';
import type { Announcement, User, NotificationItem } from './types.ts';
import { api } from './services/api.ts';
import { Navbar } from './components/Navbar.tsx';
import { EmergencyBanner } from './components/EmergencyBanner.tsx';
import { StudentDashboard } from './components/StudentDashboard.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { AnnouncementModal } from './components/AnnouncementModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { RefreshCw, GraduationCap, Shield } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => api.getCurrentUser());
  const [activeView, setActiveView] = useState<'student' | 'admin'>('student');

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [userReads, setUserReads] = useState<string[]>([]);
  const [userBookmarks, setUserBookmarks] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync active view based on user role
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        setActiveView('admin');
      } else {
        setActiveView('student');
      }
    }
  }, [currentUser]);

  // Load announcements & user data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAnnouncements({
        userId: currentUser?.id
      });
      setAnnouncements(res.announcements);
      setUserReads(res.userReads || []);
      setUserBookmarks(res.userBookmarks || []);

      if (currentUser) {
        const notifs = await api.getNotifications(currentUser.id);
        setNotifications(notifs);
      }
    } catch (err: any) {
      console.error('Failed to load announcements:', err);
      setError(err.message || 'Failed to load school announcements.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers
  const handleToggleRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    const isCurrentlyRead = userReads.includes(id);
    // Optimistic UI update
    setUserReads(prev =>
      isCurrentlyRead ? prev.filter(item => item !== id) : [...prev, id]
    );

    try {
      await api.toggleRead(id, currentUser.id);
      // update announcement read count
      setAnnouncements(prev =>
        prev.map(ann => {
          if (ann.id !== id) return ann;
          const currentReads = ann.readByStudentIds || [];
          return {
            ...ann,
            readByStudentIds: isCurrentlyRead
              ? currentReads.filter(uid => uid !== currentUser.id)
              : [...currentReads, currentUser.id]
          };
        })
      );
    } catch (err) {
      console.error('Toggle read error:', err);
      // Revert if error
      setUserReads(prev =>
        isCurrentlyRead ? [...prev, id] : prev.filter(item => item !== id)
      );
    }
  };

  const handleToggleBookmark = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    const isBookmarked = userBookmarks.includes(id);
    setUserBookmarks(prev =>
      isBookmarked ? prev.filter(item => item !== id) : [...prev, id]
    );

    try {
      await api.toggleBookmark(id, currentUser.id);
    } catch (err) {
      console.error('Toggle bookmark error:', err);
      setUserBookmarks(prev =>
        isBookmarked ? [...prev, id] : prev.filter(item => item !== id)
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!currentUser) return;
    const unreadIds = announcements
      .filter(a => !userReads.includes(a.id))
      .map(a => a.id);

    if (unreadIds.length === 0) return;

    setUserReads(announcements.map(a => a.id));

    try {
      await Promise.all(
        unreadIds.map(id => api.toggleRead(id, currentUser.id, true))
      );
    } catch (err) {
      console.error('Mark all read error:', err);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await api.markAllNotificationsRead(currentUser.id);
    } catch (err) {
      console.error('Failed to mark notifications read:', err);
    }
  };

  const handleSelectNotification = async (announcementId: string) => {
    const target = announcements.find(a => a.id === announcementId);
    if (target) {
      setSelectedAnnouncement(target);
      if (currentUser && !userReads.includes(target.id)) {
        handleToggleRead(target.id, { stopPropagation: () => {} } as any);
      }
    } else {
      try {
        const fetched = await api.getAnnouncement(announcementId);
        setSelectedAnnouncement(fetched);
      } catch (err) {
        console.error('Could not fetch announcement for notification:', err);
      }
    }
  };

  const handleCreateAnnouncement = async (data: Partial<Announcement>) => {
    const created = await api.createAnnouncement(data);
    setAnnouncements(prev => [created, ...prev]);
    loadData();
  };

  const handleUpdateAnnouncement = async (id: string, data: Partial<Announcement>) => {
    const updated = await api.updateAnnouncement(id, data);
    setAnnouncements(prev => prev.map(a => a.id === id ? updated : a));
    if (selectedAnnouncement?.id === id) {
      setSelectedAnnouncement(updated);
    }
    loadData();
  };

  const handleDeleteAnnouncement = async (id: string) => {
    await api.deleteAnnouncement(id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    if (selectedAnnouncement?.id === id) {
      setSelectedAnnouncement(null);
    }
    loadData();
  };

  const handleLogout = () => {
    api.clearAuth();
    setCurrentUser(null);
  };

  const handleQuickSwitchRole = async () => {
    if (currentUser?.role === 'admin') {
      // Switch to Student
      const res = await api.login('student@school.edu', 'Student123!');
      setCurrentUser(res.user);
      setActiveView('student');
    } else {
      // Switch to Admin
      const res = await api.login('admin@school.edu', 'Admin123!');
      setCurrentUser(res.user);
      setActiveView('admin');
    }
  };

  // If user is not logged in, show Auth modal
  if (!currentUser) {
    return (
      <AuthModal
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    );
  }

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fb] text-[#1e293b]">
      {/* Emergency Advisory Flash Bar */}
      <EmergencyBanner
        announcements={announcements}
        onSelectAnnouncement={(ann) => setSelectedAnnouncement(ann)}
      />

      {/* Primary Top Navigation */}
      <Navbar
        user={currentUser}
        notifications={notifications}
        unreadCount={unreadNotifCount}
        onLogout={handleLogout}
        onQuickSwitchRole={handleQuickSwitchRole}
        onSelectNotification={handleSelectNotification}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        activeView={activeView}
        onChangeView={(view) => setActiveView(view)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading && announcements.length === 0 ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-3" />
            <p className="text-sm font-semibold text-gray-600">Loading School Announcement Hub...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center text-red-700 max-w-md mx-auto my-12">
            <p className="font-bold text-sm">Failed to connect to school server</p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
            <button
              onClick={loadData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
            >
              Retry Connection
            </button>
          </div>
        ) : activeView === 'admin' && currentUser.role === 'admin' ? (
          <AdminDashboard
            user={currentUser}
            announcements={announcements}
            onSelectAnnouncement={(ann) => setSelectedAnnouncement(ann)}
            onCreateAnnouncement={handleCreateAnnouncement}
            onUpdateAnnouncement={handleUpdateAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onRefreshData={loadData}
          />
        ) : (
          <StudentDashboard
            user={currentUser}
            announcements={announcements}
            userReads={userReads}
            userBookmarks={userBookmarks}
            onSelectAnnouncement={(ann) => setSelectedAnnouncement(ann)}
            onToggleRead={handleToggleRead}
            onToggleBookmark={handleToggleBookmark}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        )}
      </main>

      {/* Full Announcement Details Modal */}
      <AnnouncementModal
        announcement={selectedAnnouncement}
        isOpen={Boolean(selectedAnnouncement)}
        onClose={() => setSelectedAnnouncement(null)}
        isRead={selectedAnnouncement ? userReads.includes(selectedAnnouncement.id) : false}
        isBookmarked={selectedAnnouncement ? userBookmarks.includes(selectedAnnouncement.id) : false}
        onToggleRead={handleToggleRead}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Footer for OMSC Mamburao Campus */}
      <footer className="mt-auto border-t border-gray-200/80 bg-white py-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-blue-950 font-black flex items-center justify-center text-xs shadow-xs">
                OMSC
              </div>
              <div>
                <p className="font-extrabold text-sm text-gray-900 leading-tight">
                  Occidental Mindoro State College - Mamburao Campus
                </p>
                <p className="text-[11px] text-gray-500">
                  Brgy. Tayamaan, Mamburao, Occidental Mindoro 5106, Philippines
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-[11px] text-gray-500">
              <p className="font-semibold text-gray-700">Mamburao Campus Hotline: (043) 711-1002</p>
              <p>Email: <a href="mailto:mamburao@omsc.edu.ph" className="text-blue-600 hover:underline">mamburao@omsc.edu.ph</a> | <a href="mailto:registrar.mamburao@omsc.edu.ph" className="text-blue-600 hover:underline">registrar.mamburao@omsc.edu.ph</a></p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <p className="text-gray-500">
              <strong className="text-gray-700">Campus Programs:</strong> CTE (Education) • CBAM (Business) • CAST (Technology) • CCJE (Criminology) • Senior High
            </p>
            <p className="text-gray-400">
              © 2026 Occidental Mindoro State College - Mamburao Campus • All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
