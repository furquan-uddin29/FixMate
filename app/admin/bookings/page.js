'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Wrench,
  Search,
  Filter,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Compass,
  Printer,
  ChevronRight,
} from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!confirm('Are you sure you want to administratively cancel this booking?')) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg(`Booking ${bookingId} administratively cancelled.`);
        fetchBookings();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Error cancelling booking');
    }
  };

  const filtered = bookings.filter((b) => {
    if (statusFilter !== 'All' && b.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.booking_code.toLowerCase().includes(q) ||
        b.customer_name.toLowerCase().includes(q) ||
        b.service_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
            Comprehensive Bookings Management
          </h1>
          <p className="text-xs sm:text-sm text-navy-500 mt-1">
            Global view of all service appointments, telemetry tracking, and administrative controls.
          </p>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionMsg}</span>
          </div>
          <button onClick={() => setActionMsg('')} className="text-emerald-700 font-bold">✕</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-navy-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            'All',
            'booking_requested',
            'booking_confirmed',
            'technician_assigned',
            'on_the_way',
            'arrived',
            'in_progress',
            'completed',
            'cancelled',
          ].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-navy-50 text-navy-700 hover:bg-navy-100'
              }`}
            >
              {st === 'All' ? 'All' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search code or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-navy-200 text-xs text-navy-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-navy-500">Loading bookings registry...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-xs text-navy-500">No bookings match the filter criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-50/70 border-b border-navy-100 text-navy-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Booking Code</th>
                  <th className="py-3 px-4 font-bold">Customer</th>
                  <th className="py-3 px-4 font-bold">Service Category</th>
                  <th className="py-3 px-4 font-bold">Technician</th>
                  <th className="py-3 px-4 font-bold">Date & Time</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-navy-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy-900">
                      {b.booking_code}
                      {b.is_emergency && (
                        <span className="block text-[9px] font-bold text-amber-600">⚡ Emergency</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-navy-900 block">{b.customer_name}</span>
                      <span className="text-navy-400 text-[11px]">{b.customer_phone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-navy-900 block">{b.service_name}</span>
                      <span className="text-navy-400 text-[11px] truncate max-w-xs block">{b.problem_title}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {b.technician_name ? (
                        <span className="font-semibold text-navy-800">{b.technician_name}</span>
                      ) : (
                        <span className="text-amber-600 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-navy-600">
                      <span>{b.preferred_date}</span>
                      <span className="text-navy-400 block text-[11px]">{b.preferred_time_slot}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/customer/tracking?id=${b.id}`}
                        className="px-2.5 py-1 bg-navy-100 hover:bg-navy-200 text-navy-800 rounded-lg text-xs font-bold inline-block"
                      >
                        Audit
                      </Link>
                      {b.status === 'completed' && (
                        <Link
                          href={`/customer/bookings/${b.id}/receipt`}
                          className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold inline-block"
                        >
                          Receipt
                        </Link>
                      )}
                      {!['in_progress', 'completed', 'cancelled'].includes(b.status) && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold inline-block"
                        >
                          Cancel
                        </button>
                      )}
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
