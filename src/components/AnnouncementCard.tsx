import React from 'react';
import {
  Bookmark,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Paperclip,
  Pin,
  Eye,
  ArrowRight,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import type { Announcement } from '../types.ts';
import { getCategoryConfig, getPriorityBadge, formatDateRelative } from '../utils/categories.ts';

interface AnnouncementCardProps {
  announcement: Announcement;
  isRead: boolean;
  isBookmarked: boolean;
  onSelect: (announcement: Announcement) => void;
  onToggleRead: (id: string, e: React.MouseEvent) => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  isRead,
  isBookmarked,
  onSelect,
  onToggleRead,
  onToggleBookmark
}) => {
  const catConfig = getCategoryConfig(announcement.category);
  const priorityBadge = getPriorityBadge(announcement.priority);
  const IconComponent = catConfig.icon;

  return (
    <article
      onClick={() => onSelect(announcement)}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer flex flex-col ${
        isRead ? 'border-gray-200/80 shadow-xs' : 'border-blue-200/90 shadow-md ring-1 ring-blue-500/10'
      } hover:shadow-xl hover:-translate-y-0.5 hover:border-blue-400`}
      style={{
        borderTopWidth: '5px',
        borderTopColor: catConfig.color
      }}
    >
      {/* Optional Card Top Banner Image if provided */}
      {announcement.imageUrl && (
        <div className="relative h-40 w-full overflow-hidden bg-slate-100">
          <img
            src={announcement.imageUrl}
            alt={announcement.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
              {announcement.targetAudience}
            </span>
          </div>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Category, Urgency, Pinned & Action Icons */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Category Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${catConfig.badgeBg}`}
              >
                <IconComponent className="w-3 h-3" />
                <span>{announcement.category}</span>
              </span>

              {/* Priority Badge if not normal */}
              {announcement.priority !== 'Normal' && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider ${priorityBadge.className}`}
                >
                  {announcement.priority === 'Emergency' && <AlertCircle className="w-3 h-3" />}
                  <span>{priorityBadge.label}</span>
                </span>
              )}

              {/* Pinned Indicator */}
              {announcement.isPinned && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <Pin className="w-2.5 h-2.5 rotate-45" />
                  <span>Pinned</span>
                </span>
              )}
            </div>

            {/* Quick Action Buttons: Read & Bookmark */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => onToggleBookmark(announcement.id, e)}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark announcement'}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  isBookmarked
                    ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                    : 'text-gray-400 hover:text-amber-600 hover:bg-gray-100'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
              </button>

              <button
                type="button"
                onClick={(e) => onToggleRead(announcement.id, e)}
                title={isRead ? 'Mark as unread' : 'Mark as read'}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  isRead
                    ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                    : 'text-gray-400 hover:text-blue-600 hover:bg-gray-100'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${isRead ? 'fill-emerald-100 text-emerald-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2 mb-2">
            {announcement.title}
          </h3>

          {/* Summary / Excerpt */}
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
            {announcement.summary || announcement.content}
          </p>

          {/* Extra metadata chips: Event date / deadline / location / attachments */}
          <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 font-semibold border border-amber-200">
              <span>🏛️ OMSC Mamburao Campus</span>
            </span>

            {announcement.eventDate && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 font-medium border border-purple-200">
                <Calendar className="w-3 h-3 text-purple-600" />
                <span>Event: {new Date(announcement.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </span>
            )}

            {announcement.deadlineDate && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 font-medium border border-rose-200">
                <Clock className="w-3 h-3 text-rose-600" />
                <span>Deadline: {new Date(announcement.deadlineDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </span>
            )}

            {announcement.location && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-normal">
                <MapPin className="w-3 h-3 text-gray-500" />
                <span>{announcement.location}</span>
              </span>
            )}

            {announcement.attachments && announcement.attachments.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                <Paperclip className="w-3 h-3" />
                <span>{announcement.attachments.length} attachment{announcement.attachments.length > 1 ? 's' : ''}</span>
              </span>
            )}
          </div>
        </div>

        {/* Footer Meta Row */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5 truncate max-w-[200px]">
            <span className="font-semibold text-gray-700 truncate">{announcement.authorRole}</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-gray-400 font-normal">
              {formatDateRelative(announcement.publishDate)}
            </span>
            <span className="inline-flex items-center text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
