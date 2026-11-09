import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Paperclip,
  Bookmark,
  CheckCircle2,
  Share2,
  Download,
  AlertTriangle,
  User,
  Shield,
  Tag,
  Check,
  Printer
} from 'lucide-react';
import type { Announcement } from '../types.ts';
import { getCategoryConfig, getPriorityBadge } from '../utils/categories.ts';

interface AnnouncementModalProps {
  announcement: Announcement | null;
  isOpen: boolean;
  onClose: () => void;
  isRead: boolean;
  isBookmarked: boolean;
  onToggleRead: (id: string, e: React.MouseEvent) => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  announcement,
  isOpen,
  onClose,
  isRead,
  isBookmarked,
  onToggleRead,
  onToggleBookmark
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen || !announcement) return null;

  const catConfig = getCategoryConfig(announcement.category);
  const priorityBadge = getPriorityBadge(announcement.priority);
  const IconComponent = catConfig.icon;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${announcement.title} - ${window.location.origin}/#announcement-${announcement.id}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSimulateDownload = (fileName: string) => {
    // Generate a simple simulated download file
    const element = document.createElement('a');
    const fileContent = `OFFICIAL SCHOOL MEMORANDUM\nTitle: ${announcement.title}\nCategory: ${announcement.category}\nIssued by: ${announcement.authorName} (${announcement.authorRole})\nDate: ${new Date(announcement.publishDate).toLocaleDateString()}\n\nContent:\n${announcement.content}\n\n[Verified Official Document Attachment: ${fileName}]`;
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName.endsWith('.pdf') ? fileName.replace('.pdf', '.txt') : fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setDownloadSuccess(fileName);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 pb-4 border-b border-gray-100 flex items-center justify-between gap-4 bg-gray-50/70">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${catConfig.badgeBg}`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{announcement.category}</span>
            </span>

            {announcement.priority !== 'Normal' && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${priorityBadge.className}`}
              >
                {announcement.priority === 'Emergency' && <AlertTriangle className="w-3.5 h-3.5" />}
                <span>{priorityBadge.label}</span>
              </span>
            )}

            <span className="text-xs text-gray-500 font-medium">
              Audience: <strong className="text-gray-700">{announcement.targetAudience}</strong>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-full transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1 space-y-6">
          {/* Featured Image if present */}
          {announcement.imageUrl && (
            <div className="rounded-2xl overflow-hidden max-h-72 w-full bg-gray-100 border border-gray-200 shadow-inner">
              <img
                src={announcement.imageUrl}
                alt={announcement.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Official OMSC Institutional Header */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 font-black flex items-center justify-center text-xs flex-shrink-0 shadow-sm">
                OMSC
              </div>
              <div>
                <p className="text-xs font-black tracking-wider uppercase text-amber-300">
                  Occidental Mindoro State College - Mamburao Campus
                </p>
                <p className="text-[11px] text-blue-200">
                  Brgy. Tayamaan, Mamburao, Occidental Mindoro 5106 • Official Memorandum
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-[10px] font-bold bg-amber-400 text-blue-950 px-2.5 py-1 rounded-lg border border-amber-300">
              Mamburao Campus
            </span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {announcement.title}
            </h1>

            {/* Author & Date metadata */}
            <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-gray-500 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  {announcement.authorName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 leading-tight">{announcement.authorName}</p>
                  <p className="text-xs text-gray-500">{announcement.authorRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>
                  Published {new Date(announcement.publishDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Callout Info Cards for Event / Deadline / Location */}
          {(announcement.eventDate || announcement.deadlineDate || announcement.location) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
              {announcement.eventDate && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-purple-900 uppercase tracking-wide">
                      Scheduled Event Date
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(announcement.eventDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {announcement.deadlineDate && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-rose-900 uppercase tracking-wide">
                      Submission Deadline
                    </p>
                    <p className="text-sm font-bold text-rose-950">
                      {new Date(announcement.deadlineDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {announcement.location && (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="p-2 rounded-xl bg-gray-100 text-gray-700">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Venue / Location
                    </p>
                    <p className="text-sm font-bold text-gray-900">{announcement.location}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Main Body Content */}
          <div className="prose max-w-none text-gray-800 text-base leading-relaxed whitespace-pre-line font-normal space-y-4">
            {announcement.content}
          </div>

          {/* Attachments Section */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-blue-600" />
                <span>Official Attachments ({announcement.attachments.length})</span>
              </h4>

              {downloadSuccess && (
                <div className="mb-3 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Downloaded official document: <strong>{downloadSuccess}</strong></span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {announcement.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-blue-50/60 rounded-xl border border-gray-200 transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-red-100 text-red-700 font-bold text-xs">
                        PDF
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{file.name}</p>
                        <p className="text-[10px] text-gray-500">{file.size}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSimulateDownload(file.name)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-white rounded-lg transition shadow-xs cursor-pointer"
                      title="Download document"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {announcement.tags && announcement.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              {announcement.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs rounded-lg bg-gray-100 text-gray-600 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-6 bg-gray-50/90 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onToggleBookmark(announcement.id, e)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <button
              onClick={(e) => onToggleRead(announcement.id, e)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
                isRead
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isRead ? 'Marked as Read' : 'Mark as Read'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition cursor-pointer"
              title="Share announcement link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:flex px-3 py-2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium items-center gap-1.5 transition cursor-pointer"
              title="Print announcement"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
