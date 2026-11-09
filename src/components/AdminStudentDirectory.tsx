import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  KeyRound,
  ShieldAlert,
  UserCheck,
  UserX,
  Copy,
  Check,
  GraduationCap,
  Calendar,
  RefreshCw,
  Mail,
  Hash
} from 'lucide-react';
import type { User } from '../types.ts';
import { api } from '../services/api.ts';

export const AdminStudentDirectory: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [resetResult, setResetResult] = useState<{ studentName: string; tempPass: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const list = await api.getStudents();
      setStudents(list);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleToggleStatus = async (studentId: string) => {
    try {
      setActionLoading(studentId);
      const updated = await api.toggleStudentStatus(studentId);
      setStudents(students.map(s => s.id === updated.id ? updated : s));
    } catch (err: any) {
      alert(err.message || 'Failed to update student status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetPassword = async (student: User) => {
    if (!window.confirm(`Are you sure you want to reset the password for ${student.name} (${student.email})?`)) {
      return;
    }

    try {
      setActionLoading(student.id);
      const res = await api.resetStudentPassword(student.id);
      if (res.tempPassword) {
        setResetResult({
          studentName: student.name,
          tempPass: res.tempPassword
        });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to reset password');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopyPass = () => {
    if (resetResult?.tempPass) {
      navigator.clipboard.writeText(resetResult.tempPass);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.studentId && s.studentId.toLowerCase().includes(search.toLowerCase())) ||
    (s.gradeLevel && s.gradeLevel.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Student Accounts Directory</span>
          </h2>
          <p className="text-xs text-gray-500">
            Manage student access, view enrolled profiles, and provide administrative password resets
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>

          <button
            onClick={fetchStudents}
            title="Refresh student list"
            className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Password Reset Modal Alert */}
      {resetResult && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl shadow-sm flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>Password Reset Completed for {resetResult.studentName}</span>
            </p>
            <p className="text-xs text-amber-800">
              Provide this temporary password to the student. They should log in and change it:
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="font-mono bg-white px-3 py-1 rounded-lg border border-amber-300 font-bold text-sm text-gray-900 select-all">
                {resetResult.tempPass}
              </span>
              <button
                onClick={handleCopyPass}
                className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-amber-700 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
          <button
            onClick={() => setResetResult(null)}
            className="text-amber-800 hover:text-amber-950 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Grade & Department</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Loading student directory...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No student accounts matched your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-blue-50/30 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{student.name}</p>
                          <p className="text-[10px] text-gray-400">
                            Registered {new Date(student.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-gray-700">
                      {student.studentId || 'N/A'}
                    </td>

                    <td className="py-3 px-4 text-gray-700">
                      <p className="font-medium">{student.gradeLevel || 'Standard'}</p>
                      <p className="text-[10px] text-gray-400">{student.department || 'High School'}</p>
                    </td>

                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {student.email}
                    </td>

                    <td className="py-3 px-4">
                      {student.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span>Deactivated</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Toggle Status */}
                        <button
                          onClick={() => handleToggleStatus(student.id)}
                          disabled={actionLoading === student.id}
                          title={student.isActive ? 'Deactivate student account' : 'Reactivate student account'}
                          className={`p-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                            student.isActive
                              ? 'border-gray-200 text-gray-600 hover:text-red-700 hover:bg-red-50'
                              : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {student.isActive ? (
                            <UserX className="w-3.5 h-3.5 text-red-500" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </button>

                        {/* Reset Password */}
                        <button
                          onClick={() => handleResetPassword(student)}
                          disabled={actionLoading === student.id}
                          title="Generate temporary password reset for student"
                          className="p-1.5 rounded-lg border border-gray-200 text-amber-700 hover:bg-amber-50 transition cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
