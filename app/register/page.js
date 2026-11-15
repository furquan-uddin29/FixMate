'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { ROLES } from '@/lib/auth/roles';
import { Wrench, Lock, Mail, User, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: ROLES.CUSTOMER,
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    setSubmitting(true);
    const result = await register({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      accountType: formData.accountType,
    });

    if (!result.success) {
      setErrorMsg(result.error || 'Registration failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-50/40">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-navy-100 shadow-xl overflow-hidden p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white mx-auto shadow-md">
              <Wrench className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-navy-900 tracking-tight">Create a FixMate Account</h2>
            <p className="text-xs text-navy-500">
              Join thousands of homeowners and verified tradesmen on FixMate
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Type Selection */}
            <div>
              <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-2">
                I want to join as *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accountType: ROLES.CUSTOMER })}
                  className={`p-3 rounded-2xl border text-center transition font-bold text-xs ${
                    formData.accountType === ROLES.CUSTOMER
                      ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-500/20'
                      : 'border-navy-200 bg-white text-navy-700 hover:bg-navy-50'
                  }`}
                >
                  Customer (Book Services)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accountType: ROLES.TECHNICIAN })}
                  className={`p-3 rounded-2xl border text-center transition font-bold text-xs ${
                    formData.accountType === ROLES.TECHNICIAN
                      ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-500/20'
                      : 'border-navy-200 bg-white text-navy-700 hover:bg-navy-50'
                  }`}
                >
                  Technician (Offer Services)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-navy-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-navy-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-navy-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-navy-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-navy-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Creating Account...' : 'Complete Registration'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-navy-500 pt-2 border-t border-navy-100">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-primary-600 hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
