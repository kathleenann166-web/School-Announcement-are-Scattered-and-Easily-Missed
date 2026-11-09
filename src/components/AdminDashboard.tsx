import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Pin,
  Clock,
  Layers,
  Users,
  BarChart3,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  FolderOpen,
  Calendar,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import type { Announcement, User } from '../types.ts';
import { AdminAnnouncementEditor } from './AdminAnnouncementEditor.tsx';
import { AdminStudentDirectory } from './AdminStudentDirectory.tsx';
import { AdminAnalytics } from './AdminAnalytics.tsx';
import { ALL_CATEGORIES, getCategoryConfig, getPriorityBadge } from '../utils/categories.ts';

interface AdminDashboardProps {
  user: User;
  announcements: Announcement[];
  onSelectAnnouncement: (announcement: Announcement) => void;
  onCreateAnnouncement: (data: Partial<Announcement>) => Promise<void>;
  onUpdateAnnouncement: (id: string, data: Partial<Announcement>) => Promise<void>;
  onDeleteAnnouncement: (id: string) => Promise<void>;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  announcements,
  onSelectAnnouncement,
  onCreateAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'announcements' | 'students' | 'analytics'>('announcements');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Filters for announcement manager
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  const filteredAnnouncements = announcements.filter(a => {
    if (selectedCategory !== 'All' && a.category !== selectedCategory) return false;
    if (selectedPriority !== 'All' && a.priority !== selectedPriority) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        a.title.toLowerCase().includes(q) ||
        a.authorName.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenCreate = () => {
    setEditingAnnouncement(null);
    setEditorOpen(true);
  };

  const handleOpenEdit = (ann: Announcement, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAnnouncement(ann);
    setEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);
      await onDeleteAnnouncement(id);
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete announcement');
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePin = async (ann: Announcement, e: React.MouseEvent) => {
    e.stopPropagation();
    await onUpdateAnnouncement(ann.id, { isPinned: !ann.isPinned });
  };

  return (
    <div className="space-y-6">
      {/* Admin Header with Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-blue-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                OMSC Mamburao Admin Console
              </span>
              <span className="text-xs text-blue-300 font-mono">Office of the Campus Director & OSAS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              OMSC Mamburao Campus
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 max-w-xl">
              Brgy. Tayamaan, Mamburao, Occidental Mindoro 5106 • Centralized announcement management for CTE, CBAM, CAST, CCJE, and Senior High School.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transition flex items-center gap-2 cursor-pointer text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Announcement</span>
            </button>
          </div>
        </div>

        {/* Tab navigation buttons */}
        <div className="flex items-center gap-2 pt-6 border-t border-blue-800/80 mt-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer flex-shrink-0 ${
              activeTab === 'announcements'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-blue-200 hover:text-white hover:bg-blue-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Manage Announcements ({announcements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer flex-shrink-0 ${
              activeTab === 'students'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-blue-200 hover:text-white hover:bg-blue-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Accounts & Access</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer flex-shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-blue-200 hover:text-white hover:bg-blue-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Statistics & Read Rates</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ANNOUNCEMENT MANAGER */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-auto flex-1">
              <div className="relative flex-1 md:max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter announcements by title, author, or tag..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50/50 text-gray-700 font-medium"
              >
                <option value="All">All Categories</option>
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Priority Filter */}
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50/50 text-gray-700 font-medium"
              >
                <option value="All">All Priorities</option>
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
                <option value="Urgent">Urgent</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={onRefreshData}
                title="Refresh list"
                className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Announcements Table */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Title & Excerpt</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Audience</th>
                    <th className="py-3.5 px-4">Student Reads</th>
                    <th className="py-3.5 px-4">Published</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAnnouncements.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400">
                        No announcements matched your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAnnouncements.map((ann) => {
                      const catConfig = getCategoryConfig(ann.category);
                      const priorityConfig = getPriorityBadge(ann.priority);
                      return (
                        <tr
                          key={ann.id}
                          onClick={() => onSelectAnnouncement(ann)}
                          className="hover:bg-blue-50/40 transition cursor-pointer group"
                        >
                          <td className="py-3.5 px-4 max-w-sm">
                            <div className="flex items-start gap-2">
                              {ann.isPinned && (
                                <Pin className="w-3.5 h-3.5 text-amber-500 rotate-45 flex-shrink-0 mt-0.5" />
                              )}
                              <div>
                                <p className="font-bold text-gray-900 group-hover:text-blue-700 transition">
                                  {ann.title}
                                </p>
                                <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                                  {ann.summary || ann.content}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                  Issued by: {ann.authorRole}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${catConfig.badgeBg}`}
                            >
                              <span>{ann.category}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${priorityConfig.className}`}
                            >
                              {ann.priority === 'Emergency' && <AlertTriangle className="w-3 h-3" />}
                              <span>{ann.priority}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-gray-600 font-medium">
                            {ann.targetAudience}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-800">
                                {ann.readByStudentIds?.length || 0} reads
                              </span>
                              <span className="text-gray-400 text-[10px]">
                                ({ann.viewsCount || 0} views)
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-gray-500">
                            {new Date(ann.publishDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div
                              className="flex items-center justify-end gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Pin Toggle */}
                              <button
                                type="button"
                                onClick={(e) => handleTogglePin(ann, e)}
                                title={ann.isPinned ? 'Unpin from feed' : 'Pin to feed top'}
                                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                  ann.isPinned
                                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                                    : 'text-gray-400 hover:text-amber-600 hover:bg-gray-100 border-gray-200'
                                }`}
                              >
                                <Pin className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={(e) => handleOpenEdit(ann, e)}
                                title="Edit announcement"
                                className="p-1.5 rounded-lg border border-gray-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirmId(ann.id);
                                }}
                                title="Delete announcement"
                                className="p-1.5 rounded-lg border border-gray-200 text-red-600 hover:bg-red-50 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT ACCOUNTS */}
      {activeTab === 'students' && <AdminStudentDirectory />}

      {/* TAB 3: ANALYTICS & READ MONITORING */}
      {activeTab === 'analytics' && <AdminAnalytics />}

      {/* Announcement Editor Modal */}
      <AdminAnnouncementEditor
        announcement={editingAnnouncement}
        isOpen={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditingAnnouncement(null);
        }}
        onSave={async (data) => {
          if (editingAnnouncement) {
            await onUpdateAnnouncement(editingAnnouncement.id, data);
          } else {
            await onCreateAnnouncement(data);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-gray-900">Delete Announcement?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to permanently delete this official announcement? Students will no longer see it on their dashboards.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
                className="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
