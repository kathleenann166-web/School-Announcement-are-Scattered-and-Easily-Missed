import React from 'react';
import {
  BookOpen,
  Calendar,
  Sparkles,
  ClipboardList,
  FileCheck2,
  Users,
  BellRing,
  AlertOctagon,
  Pin
} from 'lucide-react';
import type { AnnouncementCategory, AnnouncementPriority } from '../types.ts';

export const ALL_CATEGORIES: AnnouncementCategory[] = [
  'Academic',
  'School Activities',
  'Events',
  'Examination Schedules',
  'Enrollment',
  'Student Affairs',
  'Important Reminders',
  'Emergency Announcements'
];

export function getCategoryConfig(category: AnnouncementCategory) {
  switch (category) {
    case 'Academic':
      return {
        label: 'Academic',
        icon: BookOpen,
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        chipBg: 'bg-emerald-100/70 text-emerald-900',
        accentBorder: 'border-t-emerald-600',
        color: '#059669'
      };
    case 'School Activities':
      return {
        label: 'School Activities',
        icon: Users,
        badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        chipBg: 'bg-indigo-100/70 text-indigo-900',
        accentBorder: 'border-t-indigo-600',
        color: '#4f46e5'
      };
    case 'Events':
      return {
        label: 'Events',
        icon: Calendar,
        badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
        chipBg: 'bg-purple-100/70 text-purple-900',
        accentBorder: 'border-t-purple-600',
        color: '#7c3aed'
      };
    case 'Examination Schedules':
      return {
        label: 'Examination Schedules',
        icon: ClipboardList,
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        chipBg: 'bg-amber-100/70 text-amber-900',
        accentBorder: 'border-t-amber-600',
        color: '#d97706'
      };
    case 'Enrollment':
      return {
        label: 'Enrollment',
        icon: FileCheck2,
        badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
        chipBg: 'bg-blue-100/70 text-blue-900',
        accentBorder: 'border-t-blue-600',
        color: '#2563eb'
      };
    case 'Student Affairs':
      return {
        label: 'Student Affairs',
        icon: Users,
        badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
        chipBg: 'bg-teal-100/70 text-teal-900',
        accentBorder: 'border-t-teal-600',
        color: '#0d9488'
      };
    case 'Important Reminders':
      return {
        label: 'Important Reminders',
        icon: BellRing,
        badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
        chipBg: 'bg-orange-100/70 text-orange-900',
        accentBorder: 'border-t-orange-600',
        color: '#ea580c'
      };
    case 'Emergency Announcements':
      return {
        label: 'Emergency Announcements',
        icon: AlertOctagon,
        badgeBg: 'bg-red-50 text-red-800 border-red-200',
        chipBg: 'bg-red-100/70 text-red-900',
        accentBorder: 'border-t-red-600',
        color: '#dc2626'
      };
    default:
      return {
        label: category,
        icon: BookOpen,
        badgeBg: 'bg-gray-100 text-gray-800 border-gray-200',
        chipBg: 'bg-gray-100 text-gray-800',
        accentBorder: 'border-t-blue-600',
        color: '#4b5563'
      };
  }
}

export function getPriorityBadge(priority: AnnouncementPriority) {
  switch (priority) {
    case 'Emergency':
      return {
        label: 'EMERGENCY',
        className: 'bg-red-600 text-white animate-pulse font-extrabold shadow-sm',
        border: 'border-red-600'
      };
    case 'Urgent':
      return {
        label: 'URGENT',
        className: 'bg-rose-500 text-white font-bold',
        border: 'border-rose-400'
      };
    case 'Important':
      return {
        label: 'IMPORTANT',
        className: 'bg-amber-500 text-white font-bold',
        border: 'border-amber-400'
      };
    default:
      return {
        label: 'REGULAR',
        className: 'bg-slate-100 text-slate-700 font-medium',
        border: 'border-slate-200'
      };
  }
}

export function formatDateRelative(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  } catch {
    return dateStr;
  }
}
