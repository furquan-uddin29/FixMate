'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, DEMO_ACCOUNTS } from '@/lib/auth/AuthContext';
import { getRoleHome } from '@/lib/auth/roles';
import { Wrench, Lock, Mail, ArrowRight, Shield, User, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const result = await login(email, password);
    if (!result.success) {
      setErrorMsg(result.error || 'Invalid credentials');
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (type) => {
    const demo = DEMO_ACCOUNTS[type];
    if (demo) {
      setEmail(demo.email);
      setPassword('demo1234');
      setSubmitting(true);
      await login(demo.email, 'demo1234');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-50/40">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-navy-100 shadow-xl overflow-hidden p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white mx-auto shadow-md shadow-primary-600/20">
              <Wrench className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-navy-900 tracking-tight">Sign In to FixMate</h2>
            <p className="text-xs text-navy-500">
              Access your personalized customer, technician, or admin portal
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-navy-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider">
                  Password *
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-navy-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Authenticating...' : 'Sign In to Portal'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Switcher for CSE 3292 Evaluator */}
          <div className="pt-4 border-t border-navy-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-navy-400 block text-center mb-2.5">
              Instant Demo Logins (Evaluation Shortcuts)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('customer')}
                className="p-2 text-center rounded-xl bg-primary-50 hover:bg-primary-100 border border-primary-200 transition text-[11px] font-bold text-primary-800"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('technician')}
                className="p-2 text-center rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 transition text-[11px] font-bold text-amber-800"
              >
                Technician
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2 text-center rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 transition text-[11px] font-bold text-purple-800"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-navy-500">
            Don't have an account yet?{' '}
            <Link href="/register" className="font-bold text-primary-600 hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
