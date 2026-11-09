import React, { useState } from 'react';
import {
  GraduationCap,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  Shield,
  KeyRound,
  ArrowRight,
  Sparkles,
  Check,
  AlertCircle,
  HelpCircle,
  IdCard
} from 'lucide-react';
import type { UserRole } from '../types.ts';
import { api } from '../services/api.ts';

interface AuthModalProps {
  onSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [studentId, setStudentId] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Grade 11 - STEM');
  const [department, setDepartment] = useState('Senior High School');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotResult, setForgotResult] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.login(email, password);
      onSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Incorrect email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.register({
        name,
        email,
        password,
        role,
        studentId: role === 'student' ? studentId : undefined,
        gradeLevel: role === 'student' ? gradeLevel : undefined,
        department: role === 'admin' ? 'Office of the Principal' : department
      });
      onSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setForgotResult(null);

    if (!email) {
      setError('Please enter your registered email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.forgotPassword(email);
      setForgotResult(res.message);
    } catch (err: any) {
      setError(err.message || 'Email not found in our database.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Logins
  const handleDemoStudentLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.login('student@school.edu', 'Student123!');
      onSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdminLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.login('admin@school.edu', 'Admin123!');
      onSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
        {/* Top Header Card for OMSC Mamburao Campus */}
        <div className="p-8 pb-6 text-center bg-gradient-to-b from-blue-50/80 to-white border-b border-gray-100">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center shadow-lg shadow-blue-900/20 mb-3 border border-amber-300">
            <span className="text-xl font-black tracking-tight">OMSC</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-snug">
            OMSC Mamburao Campus
          </h1>
          <p className="text-xs font-bold text-blue-900 mt-0.5">
            Centralized Announcement Hub
          </p>
          <p className="text-[11px] text-gray-500 mt-1">
            Brgy. Tayamaan, Mamburao, Occidental Mindoro 5106
          </p>
        </div>

        {/* Error / Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Forgot password success */}
        {forgotResult && (
          <div className="mx-6 mt-4 p-4 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Password Reset Successful!</span>
            </div>
            <p>{forgotResult}</p>
            <button
              onClick={() => {
                setView('login');
                setForgotResult(null);
              }}
              className="mt-2 text-xs font-bold text-blue-700 hover:underline cursor-pointer"
            >
              Back to Login &rarr;
            </button>
          </div>
        )}

        <div className="p-6 sm:p-8 pt-4">
          {/* VIEW: LOGIN */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  School Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@school.edu or admin@school.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-sm transition"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setView('forgot');
                      setError(null);
                    }}
                    className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-sm transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
              >
                <span>{loading ? 'Logging in...' : 'Login to Hub'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo 1-Click Logins for OMSC */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">
                  Quick Demo Access (Instant)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleDemoStudentLogin}
                    disabled={loading}
                    className="py-2 px-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-blue-900 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                    <span>OMSC Student (Kathleen)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDemoAdminLogin}
                    disabled={loading}
                    className="py-2 px-2.5 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/70 text-indigo-900 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-indigo-700" />
                    <span>OMSC Admin (President Office)</span>
                  </button>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setView('signup');
                      setError(null);
                    }}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* VIEW: SIGNUP */}
          {view === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kathleen Ann Santos"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:border-blue-600 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Account Type / Role <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      role === 'student'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      role === 'admin'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Administrator</span>
                  </button>
                </div>
              </div>

              {role === 'student' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. 2026-08192"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Grade & Strand
                    </label>
                    <input
                      type="text"
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      placeholder="Grade 11 - STEM"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@school.edu"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:border-blue-600 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Password (min 6 characters) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 focus:border-blue-600 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 focus:border-blue-600 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm mt-2"
              >
                <span>{loading ? 'Registering...' : 'Create School Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setView('login');
                      setError(null);
                    }}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {view === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Enter Your Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student@school.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-blue-600 text-sm"
                    required
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  An instant temporary recovery password will be generated for your verified account.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
              >
                <KeyRound className="w-4 h-4" />
                <span>{loading ? 'Verifying...' : 'Reset Password'}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setError(null);
                  }}
                  className="text-xs font-bold text-gray-600 hover:text-blue-700"
                >
                  &larr; Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
