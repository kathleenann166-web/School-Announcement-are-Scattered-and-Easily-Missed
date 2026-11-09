import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Paperclip,
  Image as ImageIcon,
  AlertTriangle,
  Pin,
  Tag,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import type {
  Announcement,
  AnnouncementCategory,
  AnnouncementPriority,
  TargetAudience,
  Attachment
} from '../types.ts';
import { ALL_CATEGORIES } from '../utils/categories.ts';

interface AdminAnnouncementEditorProps {
  announcement: Announcement | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Announcement>) => Promise<void>;
}

const PRESET_IMAGES = [
  { label: 'Campus & Academic', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Examinations', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Enrollment', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Activities & Clean Up', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Student Organization', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Science & Tech Expo', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sports & Intramurals', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Health & Clinic', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Severe Weather / Emergency', url: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=80' }
];

export const AdminAnnouncementEditor: React.FC<AdminAnnouncementEditorProps> = ({
  announcement,
  isOpen,
  onClose,
  onSave
}) => {
  const isEditing = Boolean(announcement);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('Academic');
  const [priority, setPriority] = useState<AnnouncementPriority>('Normal');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('All Students');
  const [campus, setCampus] = useState<string>('OMSC Mamburao Campus');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('Dr. Arnulfo T. Ramos');
  const [authorRole, setAuthorRole] = useState('Office of the Campus Director, OMSC Mamburao');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('OMSC Mamburao Campus, Brgy. Tayamaan');
  const [eventDate, setEventDate] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [newAttachmentSize, setNewAttachmentSize] = useState('1.2 MB');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setCategory(announcement.category);
      setPriority(announcement.priority);
      setTargetAudience(announcement.targetAudience);
      setCampus('OMSC Mamburao Campus');
      setSummary(announcement.summary || '');
      setContent(announcement.content);
      setAuthorName(announcement.authorName);
      setAuthorRole(announcement.authorRole);
      setImageUrl(announcement.imageUrl || '');
      setLocation(announcement.location || 'OMSC Mamburao Campus, Brgy. Tayamaan');
      setEventDate(announcement.eventDate ? announcement.eventDate.slice(0, 16) : '');
      setDeadlineDate(announcement.deadlineDate ? announcement.deadlineDate.slice(0, 16) : '');
      setScheduledFor(announcement.scheduledFor ? announcement.scheduledFor.slice(0, 16) : '');
      setIsPinned(announcement.isPinned);
      setTags(announcement.tags || []);
      setAttachments(announcement.attachments || []);
    } else {
      // Defaults for new announcement
      setTitle('');
      setCategory('Academic');
      setPriority('Normal');
      setTargetAudience('All Students');
      setCampus('OMSC Mamburao Campus');
      setSummary('');
      setContent('');
      setAuthorName('Dr. Arnulfo T. Ramos');
      setAuthorRole('Office of the Campus Director, OMSC Mamburao');
      setImageUrl('');
      setLocation('OMSC Mamburao Campus, Brgy. Tayamaan');
      setEventDate('');
      setDeadlineDate('');
      setScheduledFor('');
      setIsPinned(false);
      setTags(['OMSC', 'Mamburao', 'Tayamaan']);
      setAttachments([]);
    }
    setError(null);
  }, [announcement, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const cleaned = tagInput.trim().replace(/^#/, '');
    if (cleaned && !tags.includes(cleaned)) {
      setTags([...tags, cleaned]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddAttachment = () => {
    if (!newAttachmentName.trim()) return;
    const item: Attachment = {
      name: newAttachmentName.trim().endsWith('.pdf') ? newAttachmentName.trim() : `${newAttachmentName.trim()}.pdf`,
      size: newAttachmentSize.trim() || '1.0 MB',
      type: 'application/pdf'
    };
    setAttachments([...attachments, item]);
    setNewAttachmentName('');
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachments(attachments.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an announcement title.');
      return;
    }
    if (!content.trim()) {
      setError('Please enter the announcement content.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await onSave({
        title: title.trim(),
        category,
        priority,
        targetAudience,
        campus,
        summary: summary.trim() || content.trim().slice(0, 160) + '...',
        content: content.trim(),
        authorName: authorName.trim(),
        authorRole: authorRole.trim(),
        imageUrl: imageUrl.trim() || undefined,
        location: location.trim() || undefined,
        eventDate: eventDate ? new Date(eventDate).toISOString() : undefined,
        deadlineDate: deadlineDate ? new Date(deadlineDate).toISOString() : undefined,
        scheduledFor: scheduledFor ? new Date(scheduledFor).toISOString() : undefined,
        isPinned,
        tags,
        attachments
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                {isEditing ? 'Edit School Announcement' : 'Publish New School Announcement'}
              </h2>
              <p className="text-xs text-blue-200">
                Official bulletin broadcast to students, parents, and academic departments
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 mt-4 p-3.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 flex-1 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Announcement Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Midterm Examination Timetable & Guidelines"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-sm font-semibold transition"
              required
            />
          </div>

          {/* Category & Priority & Audience & Campus Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-sm bg-white font-medium"
              >
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Priority Level <span className="text-red-500">*</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-sm bg-white font-medium"
              >
                <option value="Normal">Normal (Standard Bulletin)</option>
                <option value="Important">Important (Action Needed)</option>
                <option value="Urgent">Urgent (Immediate Attention)</option>
                <option value="Emergency">Emergency (Campus-Wide Flash Alert)</option>
              </select>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Target Audience <span className="text-red-500">*</span>
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as TargetAudience)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-sm bg-white font-medium"
              >
                <option value="All Students">All Students</option>
                <option value="Senior High School">Senior High School</option>
                <option value="Junior High School">Junior High School</option>
                <option value="College Department">College Department</option>
                <option value="Faculty & Staff">Faculty & Staff</option>
              </select>
            </div>

            {/* OMSC Campus & Scope */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Campus Location <span className="text-red-500">*</span>
              </label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-sm bg-white font-medium"
              >
                <option value="OMSC Mamburao Campus">OMSC Mamburao Campus (All)</option>
                <option value="OMSC Mamburao - CTE Building">Mamburao - CTE (Teacher Education)</option>
                <option value="OMSC Mamburao - CBAM Wing">Mamburao - CBAM (Business)</option>
                <option value="OMSC Mamburao - CAST Labs">Mamburao - CAST (Technology)</option>
                <option value="OMSC Mamburao - CCJE Facility">Mamburao - CCJE (Criminology)</option>
                <option value="OMSC Mamburao - Senior High">Mamburao - Senior High School</option>
              </select>
            </div>
          </div>

          {/* Summary / Lead */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Brief Summary (Short Teaser)
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A 1-2 sentence executive summary displayed on cards and notifications"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-sm transition"
            />
          </div>

          {/* Full Content */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Detailed Announcement Content <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full announcement instructions, steps, qualifications, or agenda..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-sm leading-relaxed transition"
              required
            />
          </div>

          {/* Author info & Pin */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Signatory / Author
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g., Dr. Evelyn Ramirez"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Issuing Department / Office
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="e.g., Office of Academic Affairs"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
              />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                  <Pin className="w-3.5 h-3.5 text-amber-500 rotate-45" />
                  Pin to Top of Feed
                </span>
              </label>
            </div>
          </div>

          {/* Image & Preset Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Featured Image (Optional URL or choose preset)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs"
              />
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="px-2.5 py-1 text-xs text-gray-500 hover:text-red-600 border rounded-xl"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Presets */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-[11px] text-gray-500 font-semibold self-center mr-1">
                Presets:
              </span>
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                    imageUrl === preset.url
                      ? 'bg-blue-100 text-blue-800 border-blue-300 font-bold'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dates & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                <span>Event Date (if event)</span>
              </label>
              <input
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-600" />
                <span>Deadline Date (if deadline)</span>
              </label>
              <input
                type="datetime-local"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Schedule Publish Time</span>
              </label>
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                <span>Venue / Room Location</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. University Gymnasium, AVR 2, or Main Auditorium"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
              />
            </div>
          </div>

          {/* Attachments Section */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Attachments ({attachments.length})
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newAttachmentName}
                onChange={(e) => setNewAttachmentName(e.target.value)}
                placeholder="e.g., Examination_Timetable_AY2026.pdf"
                className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs"
              />
              <input
                type="text"
                value={newAttachmentSize}
                onChange={(e) => setNewAttachmentSize(e.target.value)}
                placeholder="Size (e.g. 1.5 MB)"
                className="w-28 px-3 py-2 rounded-xl border border-gray-300 text-xs"
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-blue-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-1.5">
                {attachments.map((att, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-semibold text-gray-800">{att.name}</span>
                      <span className="text-gray-400">({att.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(i)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Search Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag and press Enter (e.g. Exams, Clearance, Guidelines)"
                className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
              >
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-medium border border-blue-200"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-red-600 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </form>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : isEditing ? 'Update Announcement' : 'Publish Announcement'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
