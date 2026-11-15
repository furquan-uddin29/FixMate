'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StatsCard from '@/components/admin/StatsCard';
import {
  Users,
  Wrench,
  ShieldCheck,
  Clock,
  Calendar,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Send,
  ArrowRight,
  ShieldAlert,
  Award,
} from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsRes, bkRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/bookings'),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.stats);
        }
        if (bkRes.ok) {
          const bkData = await bkRes.json();
          setBookings(bkData.bookings || []);
        }
      } catch (err) {
        console.error('Failed to load admin overview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const st = stats || {
    totalCustomers: 48,
    totalTechnicians: 8,
    verifiedTechnicians: 7,
    pendingVerifications: 1,
    totalBookings: 6,
    activeJobs: 3,
    completedJobs: 1,
    pendingComplaints: 1,
    totalRevenue: 13540.00,
  };

  const unassignedCount = bookings.filter(b => ['booking_requested', 'booking_confirmed'].includes(b.status) && !b.assigned_technician_id).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-primary-950 to-navy-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
              FixMate Operations Command
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              Live System Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Administrator Overview
          </h1>
          <p className="text-xs sm:text-sm text-navy-300 mt-1 max-w-xl">
            Monitor real-time dispatch operations, technician verification queues, revenue collections, and warranty claims.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/dispatch"
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Open Dispatcher Hub ({unassignedCount})</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${st.totalRevenue.toLocaleString()}`}
          subtitle="All completed repair services"
          icon={DollarSign}
          color="emerald"
        />
        <StatsCard
          title="Active Repairs"
          value={st.activeJobs}
          subtitle="En route / In progress"
          icon={Wrench}
          color="blue"
        />
        <StatsCard
          title="Verified Technicians"
          value={`${st.verifiedTechnicians} / ${st.totalTechnicians}`}
          subtitle="Licensed trade specialists"
          icon={ShieldCheck}
          color="purple"
        />
        <StatsCard
          title="Pending Verifications"
          value={st.pendingVerifications}
          subtitle="Technician license review queue"
          icon={Clock}
          color="amber"
        />
        <StatsCard
          title="Total Bookings"
          value={st.totalBookings}
          subtitle="System lifetime requests"
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="Completed Jobs"
          value={st.completedJobs}
          subtitle="Warrantied & paid in full"
          icon={Award}
          color="emerald"
        />
        <StatsCard
          title="Registered Customers"
          value={st.totalCustomers}
          subtitle="Homeowners on platform"
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Open Complaints"
          value={st.pendingComplaints}
          subtitle="Disputes requiring response"
          icon={ShieldAlert}
          color="rose"
        />
      </div>

      {/* Visual Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Bookings Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-100">
            <div>
              <h3 className="font-bold text-navy-900 text-base">Service Category Volume</h3>
              <p className="text-xs text-navy-400">Share of customer maintenance requests</p>
            </div>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg">
              Updated Live
            </span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {[
              { category: 'Plumbing & Leaks', percentage: 38, count: 54, color: 'bg-blue-600' },
              { category: 'Electrical & Panels', percentage: 26, count: 37, color: 'bg-amber-500' },
              { category: 'AC Master Service', percentage: 18, count: 25, color: 'bg-sky-500' },
              { category: 'Appliance Repair', percentage: 12, count: 17, color: 'bg-purple-500' },
              { category: 'Painting & Cleaning', percentage: 6, count: 9, color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between font-bold text-navy-800">
                  <span>{item.category}</span>
                  <span>{item.percentage}% ({item.count} orders)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-navy-100 overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Revenue & Growth Projection */}
        <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-100">
            <div>
              <h3 className="font-bold text-navy-900 text-base">Monthly Platform Revenue</h3>
              <p className="text-xs text-navy-400">Net revenue breakdown (USD)</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              +18.4% YoY
            </span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {[
              { month: 'November 2024 (Current)', amount: 4890, height: '85%' },
              { month: 'October 2024', amount: 4120, height: '72%' },
              { month: 'September 2024', amount: 3780, height: '65%' },
              { month: 'August 2024', amount: 3200, height: '55%' },
            ].map((m) => (
              <div key={m.month} className="space-y-1">
                <div className="flex justify-between font-bold text-navy-800">
                  <span>{m.month}</span>
                  <span className="text-emerald-600 font-black">${m.amount.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-navy-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: m.height }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings Queue */}
      <div className="bg-white rounded-3xl border border-navy-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-navy-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-navy-900 text-base">Recent Platform Bookings</h3>
            <p className="text-xs text-navy-500">Live operational audit trail across all categories</p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-bold text-primary-600 hover:text-primary-700"
          >
            View All ({bookings.length}) &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-50/70 border-b border-navy-100 text-navy-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-6 font-bold">Booking Code</th>
                <th className="py-3 px-6 font-bold">Customer</th>
                <th className="py-3 px-6 font-bold">Service Category</th>
                <th className="py-3 px-6 font-bold">Technician</th>
                <th className="py-3 px-6 font-bold">Status</th>
                <th className="py-3 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id} className="hover:bg-navy-50/50">
                  <td className="py-4 px-6 font-mono font-bold text-navy-900">{b.booking_code}</td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-navy-900 block">{b.customer_name}</span>
                    <span className="text-navy-400 text-[11px]">{b.city}</span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-navy-800">{b.service_name}</td>
                  <td className="py-4 px-6">
                    {b.technician_name ? (
                      <span className="font-bold text-navy-800">{b.technician_name}</span>
                    ) : (
                      <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/customer/tracking?id=${b.id}`}
                      className="px-3 py-1.5 rounded-lg bg-navy-100 hover:bg-navy-200 text-navy-800 font-bold text-xs"
                    >
                      Audit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
