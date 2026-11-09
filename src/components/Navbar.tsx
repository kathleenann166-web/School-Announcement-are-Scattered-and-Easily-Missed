import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  LogOut,
  User as UserIcon,
  Shield,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ChevronDown
} from 'lucide-react';
import type { User, NotificationItem, Announcement } from '../types.ts';

interface NavbarProps {
  user: User | null;
  notifications: NotificationItem[];
  unreadCount: number;
  onLogout: () => void;
  onQuickSwitchRole: () => void;
  onSelectNotification: (announcementId: string) => void;
  onMarkAllNotificationsRead: () => void;
  activeView: 'student' | 'admin';
  onChangeView: (view: 'student' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  notifications,
  unreadCount,
  onLogout,
  onQuickSwitchRole,
  onSelectNotification,
  onMarkAllNotificationsRead,
  activeView,
  onChangeView
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-850 to-indigo-900 text-white shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand for OMSC Mamburao Campus */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-400 text-blue-950 font-black shadow-inner flex-shrink-0 border border-amber-300">
              <span className="text-xs font-black tracking-tighter">OMSC</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-lg tracking-tight text-white leading-tight">
                  OMSC Mamburao Campus
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {user?.role === 'admin' ? 'Mamburao Admin' : 'Mamburao Student'}
                </span>
              </div>
              <p className="text-[11px] text-blue-200/90 hidden sm:flex items-center gap-1.5 mt-0.5">
                <span>Brgy. Tayamaan, Mamburao, Occidental Mindoro</span>
                <span className="text-blue-400">•</span>
                <span className="text-amber-300 font-semibold">Announcement Hub</span>
              </p>
            </div>
          </div>

          {/* Navigation & Controls */}
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Role Toggle Switch for Easy Previewing */}
              {user.role === 'admin' && (
                <div className="hidden md:flex items-center p-1 bg-blue-950/60 rounded-xl border border-blue-700/50">
                  <button
                    onClick={() => onChangeView('student')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeView === 'student'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Student View</span>
                  </button>
                  <button
                    onClick={() => onChangeView('admin')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeView === 'admin'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Console</span>
                  </button>
                </div>
              )}

              {/* Quick Switch Demo Button */}
              <button
                onClick={onQuickSwitchRole}
                title="Switch between Kathleen (Student) and Principal Office (Admin) to test both roles"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-800/60 hover:bg-blue-700/80 text-blue-100 border border-blue-600/40 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Switch to {user.role === 'admin' ? 'Student Demo' : 'Admin Demo'}</span>
              </button>

              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-2 rounded-xl text-blue-200 hover:text-white hover:bg-blue-800/60 transition cursor-pointer"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={onMarkAllNotificationsRead}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">
                          No notifications yet. You're completely up to date!
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              onSelectNotification(notif.announcementId);
                              setShowNotifs(false);
                            }}
                            className={`p-3.5 hover:bg-blue-50/60 transition cursor-pointer ${
                              !notif.isRead ? 'bg-blue-50/40 font-medium' : 'opacity-85'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="mt-0.5">
                                {notif.priority === 'Emergency' ? (
                                  <AlertCircle className="w-4 h-4 text-red-600" />
                                ) : notif.priority === 'Important' ? (
                                  <AlertCircle className="w-4 h-4 text-amber-500" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                )}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate">
                                  {notif.title}
                                </p>
                                <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                                  {notif.message}
                                </p>
                                <span className="text-[10px] text-gray-400 mt-1 inline-block">
                                  {new Date(notif.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile / Menu */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-blue-800/60 transition cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500/50 flex items-center justify-center font-bold text-sm text-white border border-blue-300/40">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-white leading-tight truncate max-w-[140px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-blue-200 leading-tight">
                      {user.role === 'admin' ? 'Administrator' : user.studentId || 'Student'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-200 hidden sm:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-bold text-sm text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                        {user.studentId && (
                          <span className="text-xs text-gray-500 font-mono">
                            ID: {user.studentId}
                          </span>
                        )}
                      </div>
                      {user.gradeLevel && (
                        <p className="text-xs text-gray-600 mt-1 font-medium">
                          {user.gradeLevel}
                        </p>
                      )}
                    </div>

                    <div className="p-1">
                      {user.role === 'admin' && (
                        <button
                          onClick={() => {
                            onChangeView(activeView === 'admin' ? 'student' : 'admin');
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2 cursor-pointer"
                        >
                          <Layers className="w-4 h-4 text-gray-500" />
                          <span>
                            Switch to {activeView === 'admin' ? 'Student View' : 'Admin Console'}
                          </span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onQuickSwitchRole();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span>Switch to {user.role === 'admin' ? 'Student Demo' : 'Admin Demo'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 cursor-pointer mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-200">Official Portal Access</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
