'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  Wrench,
  BellRing,
  Clock,
  CheckCircle2,
  DollarSign,
  Star,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Calendar,
} from 'lucide-react';
import JobCard from '@/components/technician/JobCard';
import StatusBadge from '@/components/common/StatusBadge';

export default function TechnicianOverviewPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.bookings) {
        setJobs(data.bookings);
      }
    } catch (err) {
      console.error('Failed to load technician jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const totalJobs = 142; // All-time completed + active
  const pendingRequests = jobs.filter(j => j.status === 'booking_confirmed' && !j.assigned_technician_id).length;
  const activeJobs = jobs.filter(j => ['technician_assigned', 'on_the_way', 'arrived', 'in_progress'].includes(j.status));
  const completedJobs = jobs.filter(j => j.status === 'completed').length;
  const totalEarnings = 142 * 85.50; // Aggregate demo technician payout
  const averageRating = 4.95;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Technician Dispatch Console
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online & Eligible for Dispatch
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {user?.full_name || 'David'}!
          </h1>
          <p className="text-xs sm:text-sm text-navy-300 mt-1 max-w-xl">
            You have <strong className="text-amber-400">{pendingRequests} unassigned job requests</strong> available in your primary category.
          </p>
        </div>

        <Link
          href="/technician/requests"
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-navy-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 shrink-0"
        >
          <BellRing className="w-4 h-4" />
          <span>View New Job Requests</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-navy-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-navy-400 uppercase block">Total Jobs</span>
          <p className="text-2xl font-black text-navy-900">{totalJobs}</p>
          <span className="text-[10px] text-navy-400">All-time</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-navy-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-navy-400 uppercase block">Available</span>
          <p className="text-2xl font-black text-amber-600">{pendingRequests}</p>
          <span className="text-[10px] text-navy-400">In queue</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-navy-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-navy-400 uppercase block">Active Jobs</span>
          <p className="text-2xl font-black text-sky-600">{activeJobs.length}</p>
          <span className="text-[10px] text-navy-400">In progress</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-navy-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-navy-400 uppercase block">Completed</span>
          <p className="text-2xl font-black text-emerald-600">{completedJobs}</p>
          <span className="text-[10px] text-navy-400">Verified</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-navy-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-navy-400 uppercase block">Earnings</span>
          <p className="text-2xl font-black text-navy-900">${totalEarnings.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-bold">+12% this mo</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-navy-100 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-navy-400 uppercase block">Avg Rating</span>
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <p className="text-2xl font-black text-navy-900">{averageRating}</p>
          </div>
          <span className="text-[10px] text-navy-400">142 reviews</span>
        </div>
      </div>

      {/* Active Jobs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-navy-900">Active Jobs Under Repair</h3>
            <p className="text-xs text-navy-500">Advance milestones as you travel, arrive, and execute work</p>
          </div>
          <Link
            href="/technician/jobs"
            className="text-xs font-bold text-primary-600 hover:text-primary-700"
          >
            View All My Jobs &rarr;
          </Link>
        </div>

        {activeJobs.length === 0 ? (
          <div className="p-8 bg-white rounded-3xl border border-navy-100 text-center text-xs text-navy-500">
            No active jobs in your immediate queue. Check "New Requests" to accept pending service orders.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeJobs.map((job) => (
              <JobCard key={job.id} booking={job} onStatusUpdated={fetchJobs} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
