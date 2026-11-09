import React from 'react';
import { AlertTriangle, ChevronRight, ShieldAlert } from 'lucide-react';
import type { Announcement } from '../types.ts';

interface EmergencyBannerProps {
  announcements: Announcement[];
  onSelectAnnouncement: (announcement: Announcement) => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  announcements,
  onSelectAnnouncement
}) => {
  const emergencies = announcements.filter(
    a => a.priority === 'Emergency' && a.status === 'published'
  );

  if (emergencies.length === 0) return null;

  const current = emergencies[0];

  return (
    <div className="bg-red-600 text-white shadow-md relative overflow-hidden z-20 border-b border-red-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 animate-pulse text-white flex-shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </span>
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="bg-white text-red-700 text-xs font-black px-2 py-0.5 rounded tracking-wide uppercase">
              URGENT ADVISORY
            </span>
            <span className="font-semibold text-sm sm:text-base truncate max-w-[280px] sm:max-w-xl">
              {current.title}
            </span>
          </div>
        </div>

        <button
          onClick={() => onSelectAnnouncement(current)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-white text-red-700 px-3.5 py-1.5 rounded-lg hover:bg-red-50 transition shadow-sm ml-auto cursor-pointer"
        >
          <span>Read Directive</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
