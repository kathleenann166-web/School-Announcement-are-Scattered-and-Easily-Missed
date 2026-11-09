import React from 'react';
import { Calendar, Clock, MapPin, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';
import type { Announcement } from '../types.ts';

interface EventsCalendarWidgetProps {
  announcements: Announcement[];
  onSelectAnnouncement: (announcement: Announcement) => void;
}

export const EventsCalendarWidget: React.FC<EventsCalendarWidgetProps> = ({
  announcements,
  onSelectAnnouncement
}) => {
  // Collect announcements with eventDate or deadlineDate
  const upcomingEvents = announcements
    .filter(a => a.eventDate && new Date(a.eventDate) >= new Date(Date.now() - 1000 * 60 * 60 * 24))
    .sort((a, b) => new Date(a.eventDate!).getTime() - new Date(b.eventDate!).getTime())
    .slice(0, 4);

  const upcomingDeadlines = announcements
    .filter(a => a.deadlineDate && new Date(a.deadlineDate) >= new Date(Date.now() - 1000 * 60 * 60 * 24))
    .sort((a, b) => new Date(a.deadlineDate!).getTime() - new Date(b.deadlineDate!).getTime())
    .slice(0, 4);

  const getDaysLeft = (dateStr: string) => {
    const target = new Date(dateStr).getTime();
    const diff = target - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  return (
    <div className="space-y-6">
      {/* Upcoming Events Box */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              <Calendar className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-sm text-gray-900">Upcoming Events</h3>
          </div>
          <span className="text-xs text-gray-400 font-medium">School Calendar</span>
        </div>

        {upcomingEvents.length === 0 ? (
          <p className="text-xs text-gray-400 py-3 text-center">No upcoming events scheduled.</p>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map(evt => {
              const eventDate = new Date(evt.eventDate!);
              return (
                <div
                  key={evt.id}
                  onClick={() => onSelectAnnouncement(evt)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-purple-50/50 border border-transparent hover:border-purple-200 transition cursor-pointer group"
                >
                  <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-purple-50 text-purple-800 font-bold border border-purple-200/60 flex-shrink-0">
                    <span className="text-[10px] uppercase font-semibold leading-none text-purple-600">
                      {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-base leading-none mt-1">
                      {eventDate.getDate()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 group-hover:text-purple-700 transition-colors truncate">
                      {evt.title}
                    </p>
                    {evt.location && (
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </p>
                    )}
                    <span className="text-[10px] text-purple-700 font-semibold mt-1 inline-block">
                      {getDaysLeft(evt.eventDate!)}
                    </span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-600 transition-colors self-center flex-shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Academic Deadlines Box */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
              <Clock className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-sm text-gray-900">Academic Deadlines</h3>
          </div>
          <span className="text-xs text-rose-500 font-bold">Important</span>
        </div>

        {upcomingDeadlines.length === 0 ? (
          <p className="text-xs text-gray-400 py-3 text-center">No active deadlines right now.</p>
        ) : (
          <div className="space-y-3">
            {upcomingDeadlines.map(item => {
              const deadline = new Date(item.deadlineDate!);
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectAnnouncement(item)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-rose-50/50 border border-transparent hover:border-rose-200 transition cursor-pointer group"
                >
                  <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-rose-50 text-rose-800 font-bold border border-rose-200/60 flex-shrink-0">
                    <span className="text-[10px] uppercase font-semibold leading-none text-rose-600">
                      {deadline.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-base leading-none mt-1">
                      {deadline.getDate()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 group-hover:text-rose-700 transition-colors truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {item.authorRole}
                    </p>
                    <span className="text-[10px] text-rose-700 font-bold bg-rose-100/70 px-1.5 py-0.5 rounded mt-1 inline-block">
                      Due: {getDaysLeft(item.deadlineDate!)}
                    </span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-rose-600 transition-colors self-center flex-shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Student Helpline / Support Tip */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-blue-200">
            OMSC Mamburao Student Help Desk
          </h4>
        </div>
        <p className="text-xs text-blue-100/90 leading-relaxed">
          Need verification on a campus bulletin? Visit the Office of the Campus Director or OSAS at the Admin Building, OMSC Mamburao Campus (Brgy. Tayamaan), or email{' '}
          <strong className="text-white">registrar.mamburao@omsc.edu.ph</strong>.
        </p>
      </div>
    </div>
  );
};
