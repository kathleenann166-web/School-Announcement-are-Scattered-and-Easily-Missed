import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Eye,
  CheckCircle,
  Users,
  AlertTriangle,
  FolderOpen,
  Calendar,
  Layers,
  Activity,
  RefreshCw
} from 'lucide-react';
import type { AnnouncementStats } from '../types.ts';
import { api } from '../services/api.ts';
import { getCategoryConfig } from '../utils/categories.ts';

export const AdminAnalytics: React.FC = () => {
  const [stats, setStats] = useState<AnnouncementStats | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, logsData] = await Promise.all([
        api.getStats(),
        api.getLogs()
      ]);
      setStats(statsData);
      setLogs(logsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading && !stats) {
    return (
      <div className="py-12 text-center text-gray-400 text-sm">
        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" />
        <span>Loading institutional announcement analytics...</span>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Announcements */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Total Announcements
            </p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">
              {stats.totalAnnouncements}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium">
              {stats.publishedCount} published • {stats.scheduledCount} scheduled
            </p>
          </div>
        </div>

        {/* Student Engagement & Read Rate */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Avg. Read Rate
            </p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">
              {stats.averageReadRate}%
            </h3>
            <p className="text-[11px] text-gray-500 font-medium">
              {stats.totalReads} total confirmed reads
            </p>
          </div>
        </div>

        {/* Registered Active Students */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Enrolled Students
            </p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">
              {stats.totalStudents}
            </h3>
            <p className="text-[11px] text-purple-700 font-medium">
              {stats.activeStudents} active accounts
            </p>
          </div>
        </div>

        {/* Urgent & Emergency Bulletins */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Urgent & Emergency
            </p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">
              {stats.emergencyCount + stats.urgentCount}
            </h3>
            <p className="text-[11px] text-rose-600 font-medium">
              {stats.emergencyCount} emergency alerts active
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Category Distribution & Most Viewed Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-blue-600" />
              <span>Announcements by Category</span>
            </h3>
            <span className="text-xs text-gray-400">8 Institutional Pillars</span>
          </div>

          <div className="space-y-3">
            {stats.categoryBreakdown.map((item) => {
              const catConfig = getCategoryConfig(item.category);
              const percent = stats.totalAnnouncements > 0
                ? Math.round((item.count / stats.totalAnnouncements) * 100)
                : 0;

              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: catConfig.color }}
                      />
                      <span>{item.category}</span>
                    </span>
                    <span className="text-gray-500 font-mono">
                      {item.count} ({percent}%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: catConfig.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Viewed & Engaged Announcements */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span>Top Read & Viewed Bulletins</span>
              </h3>
              <span className="text-xs text-gray-400">Read Receipts</span>
            </div>

            <div className="space-y-3">
              {stats.mostViewedAnnouncements.map((ann, i) => (
                <div
                  key={ann.id}
                  className="p-3 bg-gray-50 hover:bg-blue-50/40 rounded-xl border border-gray-200/80 flex items-center justify-between gap-3 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center flex-shrink-0">
                      #{i + 1}
                    </span>
                    <p className="text-xs font-bold text-gray-900 truncate">{ann.title}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs flex-shrink-0">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Eye className="w-3.5 h-3.5 text-gray-400" />
                      <span>{ann.views}</span>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{ann.reads} reads</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Read tracking updates in real-time as students browse</span>
            <button
              onClick={loadData}
              className="text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Stats</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Audit Logs */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Administrative Activity & Broadcast Log</span>
          </h3>
          <span className="text-xs text-gray-400">Permanent Record</span>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-xl bg-gray-50/70 border border-gray-100 flex items-start justify-between text-xs gap-3"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded uppercase">
                  {log.action}
                </span>
                <span className="font-medium text-gray-800">{log.details}</span>
              </div>
              <div className="text-[10px] text-gray-400 flex-shrink-0">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
