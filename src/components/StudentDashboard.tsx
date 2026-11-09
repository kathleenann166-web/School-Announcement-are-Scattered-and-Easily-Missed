import React, { useState, useMemo } from 'react';
import {
  Search,
  Bookmark,
  CheckCircle2,
  Calendar,
  Clock,
  Filter,
  Layers,
  Sparkles,
  SlidersHorizontal,
  FolderOpen,
  ArrowUpDown,
  BookOpen,
  CheckCheck,
  AlertCircle
} from 'lucide-react';
import type { Announcement, AnnouncementCategory, AnnouncementPriority, User } from '../types.ts';
import { AnnouncementCard } from './AnnouncementCard.tsx';
import { EventsCalendarWidget } from './EventsCalendarWidget.tsx';
import { ALL_CATEGORIES, getCategoryConfig } from '../utils/categories.ts';

interface StudentDashboardProps {
  user: User;
  announcements: Announcement[];
  userReads: string[];
  userBookmarks: string[];
  onSelectAnnouncement: (announcement: Announcement) => void;
  onToggleRead: (id: string, e: React.MouseEvent) => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onMarkAllAsRead: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  announcements,
  userReads,
  userBookmarks,
  onSelectAnnouncement,
  onToggleRead,
  onToggleBookmark,
  onMarkAllAsRead
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'bookmarked' | 'urgent'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'priority' | 'views'>('newest');

  // Stats
  const totalCount = announcements.length;
  const unreadCount = announcements.filter(a => !userReads.includes(a.id)).length;
  const bookmarkedCount = userBookmarks.length;
  const eventsCount = announcements.filter(a => a.eventDate || a.deadlineDate).length;

  // Filtered announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements
      .filter(a => {
        // Tab filter
        if (activeTab === 'unread' && userReads.includes(a.id)) return false;
        if (activeTab === 'bookmarked' && !userBookmarks.includes(a.id)) return false;
        if (activeTab === 'urgent' && a.priority === 'Normal') return false;

        // Category filter
        if (selectedCategory !== 'All' && a.category !== selectedCategory) return false;

        // Priority filter
        if (selectedPriority !== 'All' && a.priority !== selectedPriority) return false;

        // Department filter
        if (selectedDepartment !== 'All') {
          const deptMatch =
            (a.targetAudience && a.targetAudience.includes(selectedDepartment)) ||
            (a.content && a.content.includes(selectedDepartment)) ||
            (a.title && a.title.includes(selectedDepartment)) ||
            (a.tags && a.tags.some(t => t.includes(selectedDepartment)));
          if (!deptMatch) return false;
        }

        // Search text
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const matchTitle = a.title.toLowerCase().includes(q);
          const matchSummary = a.summary.toLowerCase().includes(q);
          const matchContent = a.content.toLowerCase().includes(q);
          const matchAuthor = a.authorName.toLowerCase().includes(q) || a.authorRole.toLowerCase().includes(q);
          const matchCategory = a.category.toLowerCase().includes(q);
          const matchLocation = a.location && a.location.toLowerCase().includes(q);
          const matchTags = a.tags.some(t => t.toLowerCase().includes(q));

          if (!matchTitle && !matchSummary && !matchContent && !matchAuthor && !matchCategory && !matchLocation && !matchTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          const weight: Record<string, number> = { Emergency: 4, Urgent: 3, Important: 2, Normal: 1 };
          return (weight[b.priority] || 1) - (weight[a.priority] || 1);
        }
        if (sortBy === 'views') {
          return (b.viewsCount || 0) - (a.viewsCount || 0);
        }
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      });
  }, [announcements, search, selectedCategory, selectedPriority, selectedDepartment, activeTab, sortBy, userReads, userBookmarks]);

  return (
    <div className="space-y-8">
      {/* Hero Welcome Section for OMSC Mamburao Campus */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 sm:p-10 shadow-lg border border-blue-800/60">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/30">
                OCCIDENTAL MINDORO STATE COLLEGE • MAMBURAO CAMPUS
              </span>
              <span className="text-xs text-blue-200">
                Brgy. Tayamaan, Mamburao, Occidental Mindoro 5106
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              OMSC Mamburao Announcement Hub
            </h1>
            <p className="text-sm sm:text-base text-blue-100 max-w-xl font-normal leading-relaxed">
              Welcome back, <strong className="text-white font-bold">{user.name}</strong>! Centralized official advisories, academic deadlines, and activity announcements for OMSC Mamburao Campus.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-blue-200 flex-wrap">
              {user.studentId && (
                <span className="px-2.5 py-0.5 rounded-md bg-blue-900/90 border border-blue-600/50 font-mono font-bold text-amber-300">
                  ID: {user.studentId}
                </span>
              )}
              {user.gradeLevel && <span>• {user.gradeLevel}</span>}
              <span className="text-amber-200 font-semibold bg-blue-950/80 px-2 py-0.5 rounded border border-blue-700/50">
                🏛️ Tayamaan, Mamburao Campus
              </span>
            </div>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-blue-900/40 p-4 rounded-2xl border border-blue-700/40 backdrop-blur-xs">
            <div className="text-center p-2">
              <p className="text-xs text-blue-200 font-medium">All Notices</p>
              <p className="text-2xl font-black text-white mt-0.5">{totalCount}</p>
            </div>
            <div className="text-center p-2 border-l border-blue-800/60">
              <p className="text-xs text-blue-200 font-medium">Unread</p>
              <p className="text-2xl font-black text-amber-300 mt-0.5">{unreadCount}</p>
            </div>
            <div className="text-center p-2 border-l border-blue-800/60">
              <p className="text-xs text-blue-200 font-medium">Bookmarked</p>
              <p className="text-2xl font-black text-blue-300 mt-0.5">{bookmarkedCount}</p>
            </div>
            <div className="text-center p-2 border-l border-blue-800/60">
              <p className="text-xs text-blue-200 font-medium">Deadlines</p>
              <p className="text-2xl font-black text-rose-300 mt-0.5">{eventsCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed Column (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Controls Bar: Search & Quick Filters */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search announcements by keywords, category, author, or #tags..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-sm transition bg-gray-50/50"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600 p-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Tabs: All, Unread, Bookmarked, Urgent */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-gray-100">
              <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-xl overflow-x-auto max-w-full">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white text-blue-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Bulletins ({totalCount})
                </button>

                <button
                  onClick={() => setActiveTab('unread')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'unread'
                      ? 'bg-white text-blue-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>Unread</span>
                  {unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('bookmarked')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'bookmarked'
                      ? 'bg-white text-blue-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Bookmarked ({bookmarkedCount})</span>
                </button>

                <button
                  onClick={() => setActiveTab('urgent')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'urgent'
                      ? 'bg-white text-rose-700 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Urgent & Important</span>
                </button>
              </div>

              {/* Mark all as read button & Sort selector */}
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                    title="Mark all current announcements as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Mark all read</span>
                  </button>
                )}

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent border-none text-xs font-semibold text-gray-700 focus:ring-0 cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="priority">Highest Urgency</option>
                    <option value="views">Most Viewed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mamburao Campus Academic Department Selector */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex-shrink-0 mr-1">
                  Mamburao Programs:
                </span>
                {[
                  { label: 'All Mamburao Programs', value: 'All' },
                  { label: 'CTE (Education)', value: 'CTE' },
                  { label: 'CBAM (Business)', value: 'CBAM' },
                  { label: 'CAST (Technology)', value: 'CAST' },
                  { label: 'CCJE (Criminology)', value: 'CCJE' },
                  { label: 'Senior High (SHS)', value: 'Senior High' }
                ].map((dept) => (
                  <button
                    key={dept.value}
                    type="button"
                    onClick={() => setSelectedDepartment(dept.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0 transition cursor-pointer ${
                      selectedDepartment === dept.value
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {dept.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Pills Slider (All 8 Categories) */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Filter by School Category</span>
              </p>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 transition cursor-pointer ${
                    selectedCategory === 'All'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Categories
                </button>

                {ALL_CATEGORIES.map((cat) => {
                  const config = getCategoryConfig(cat);
                  const Icon = config.icon;
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 transition cursor-pointer ${
                        isSelected
                          ? 'bg-blue-900 text-white shadow-xs font-bold'
                          : 'bg-gray-100/90 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Announcements Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 px-1">
              <span>
                Showing <strong className="text-gray-800">{filteredAnnouncements.length}</strong> announcement
                {filteredAnnouncements.length !== 1 ? 's' : ''}
              </span>
              {(selectedCategory !== 'All' || search || activeTab !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedPriority('All');
                    setSearch('');
                    setActiveTab('all');
                  }}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>

            {filteredAnnouncements.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No Announcements Found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
                  We couldn't find any announcements matching your current filters or search terms. Try searching for other keywords or reset your filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedPriority('All');
                    setSearch('');
                    setActiveTab('all');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  View All Announcements
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredAnnouncements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    isRead={userReads.includes(announcement.id)}
                    isBookmarked={userBookmarks.includes(announcement.id)}
                    onSelect={onSelectAnnouncement}
                    onToggleRead={onToggleRead}
                    onToggleBookmark={onToggleBookmark}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Side Panel: Calendar, Deadlines, Reminders (4 cols on desktop) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <EventsCalendarWidget
              announcements={announcements}
              onSelectAnnouncement={onSelectAnnouncement}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
