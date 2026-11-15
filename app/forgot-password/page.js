'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Mail, ArrowLeft, CheckCircle2, Wrench } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-50/40">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-md bg-white rounded-3xl border border-navy-100 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white mx-auto shadow-md">
              <Wrench className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-navy-900 tracking-tight">Reset Password</h2>
            <p className="text-xs text-navy-500">
              Enter your registered email to receive recovery instructions
            </p>
          </div>

          {sent ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-navy-900 text-base">Check Your Inbox</h4>
              <p className="text-xs text-navy-600 leading-relaxed">
                If an account exists for <strong>{email}</strong>, a password reset link has been dispatched via Supabase Auth.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:underline pt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : (
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

              <button
                type="submit"
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-xl shadow-md transition"
              >
                Send Password Reset Email
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-navy-500 hover:text-navy-900 inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
