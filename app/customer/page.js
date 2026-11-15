'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  Calendar,
  Clock,
  Wrench,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus,
  Compass,
  FileText,
  Star,
  ChevronRight,
} from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (data.bookings) {
          // In real app, filter for this customer or show user's bookings
          setBookings(data.bookings);
        }
      } catch (err) {
        console.error('Failed to load customer bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => ['booking_requested', 'booking_confirmed'].includes(b.status)).length;
  const activeRepairs = bookings.filter(b => ['technician_assigned', 'on_the_way', 'arrived', 'in_progress'].includes(b.status)).length;
  const completedServices = bookings.filter(b => b.status === 'completed').length;

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-primary-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-primary-400 uppercase tracking-wider block mb-1">
            FixMate Customer Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Sarah'}!
          </h1>
          <p className="text-xs sm:text-sm text-navy-300 mt-1 max-w-xl">
            Track active repair jobs, book verified local technicians, and inspect warranties and digital receipts.
          </p>
        </div>

        <Link
          href="/customer/book-service"
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary-600/30 transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Book a Service</span>
        </Link>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-3xl border border-navy-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-navy-400 uppercase tracking-wider">Total Bookings</span>
            <Calendar className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-navy-900">{totalBookings}</p>
          <span className="text-[11px] text-navy-500 block">Lifetime requests</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-navy-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-navy-400 uppercase tracking-wider">Pending</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">{pendingBookings}</p>
          <span className="text-[11px] text-navy-500 block">Awaiting confirmation</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-navy-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-navy-400 uppercase tracking-wider">Active Repairs</span>
            <Wrench className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-sky-600">{activeRepairs}</p>
          <span className="text-[11px] text-navy-500 block">In progress / en route</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-navy-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-navy-400 uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">{completedServices}</p>
          <span className="text-[11px] text-navy-500 block">Warrantied & paid</span>
        </div>
      </div>

      {/* Active Tracking Quick Link if any repair is active */}
      {activeRepairs > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h4 className="font-bold text-navy-900 text-sm">You have {activeRepairs} active service in progress</h4>
              <p className="text-xs text-navy-600">Track technician route, arrival time, and repair updates live.</p>
            </div>
          </div>
          <Link
            href="/customer/tracking"
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <span>Open Real-Time Tracker</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Recent Booking History Table */}
      <div className="bg-white rounded-3xl border border-navy-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-navy-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-navy-900 text-base">Recent Service Bookings</h3>
            <p className="text-xs text-navy-500">Overview of your most recent appointments</p>
          </div>
          <Link
            href="/customer/bookings"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-navy-500">Loading your bookings...</div>
        ) : recentBookings.length === 0 ? (
          <div className="p-12 text-center text-xs text-navy-500">
            No bookings found. Click "Book a Service" to schedule your first maintenance visit.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-50/70 border-b border-navy-100 text-navy-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-6 font-bold">Booking Code</th>
                  <th className="py-3 px-6 font-bold">Service & Issue</th>
                  <th className="py-3 px-6 font-bold">Technician</th>
                  <th className="py-3 px-6 font-bold">Date & Time</th>
                  <th className="py-3 px-6 font-bold">Status</th>
                  <th className="py-3 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-navy-50/50 transition">
                    <td className="py-4 px-6 font-bold font-mono text-navy-900">
                      {b.booking_code}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-navy-900 block">{b.service_name}</span>
                      <span className="text-navy-400 truncate max-w-xs block">{b.problem_title}</span>
                    </td>
                    <td className="py-4 px-6">
                      {b.technician_name ? (
                        <span className="font-semibold text-navy-800">{b.technician_name}</span>
                      ) : (
                        <span className="text-navy-400 italic">Matching...</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-navy-600">
                      <span>{b.preferred_date}</span>
                      <span className="text-[11px] text-navy-400 block">{b.preferred_time_slot}</span>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/customer/tracking?id=${b.id}`}
                        className="px-3 py-1.5 rounded-lg bg-navy-100 hover:bg-navy-200 text-navy-800 font-bold text-xs inline-flex items-center gap-1 transition"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
