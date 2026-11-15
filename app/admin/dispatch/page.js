'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  UserCheck,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  Filter,
  Search,
  Wrench,
  ShieldCheck,
} from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import DispatchModal from '@/components/admin/DispatchModal';

export default function AdminDispatchPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForDispatch, setSelectedBookingForDispatch] = useState(null);
  const [actionMsg, setActionMsg] = useState('');
  const [filterMode, setFilterMode] = useState('unassigned');

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Failed to load bookings for dispatch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const unassigned = bookings.filter(b => ['booking_requested', 'booking_confirmed'].includes(b.status) && !b.assigned_technician_id);
  const assigned = bookings.filter(b => b.assigned_technician_id);

  const displayed = filterMode === 'unassigned' ? unassigned : (filterMode === 'assigned' ? assigned : bookings);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
              Job Dispatch Management Console
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {unassigned.length} Needs Dispatch
            </span>
          </div>
          <p className="text-xs sm:text-sm text-navy-500 mt-1">
            Match unassigned repair orders with certified, on-duty local technicians.
          </p>
        </div>

        {/* Filter Switcher */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-navy-100 shadow-sm">
          <button
            onClick={() => setFilterMode('unassigned')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterMode === 'unassigned' ? 'bg-amber-500 text-navy-950 font-black' : 'text-navy-600'
            }`}
          >
            Needs Dispatch ({unassigned.length})
          </button>
          <button
            onClick={() => setFilterMode('assigned')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterMode === 'assigned' ? 'bg-navy-900 text-white' : 'text-navy-600'
            }`}
          >
            Assigned ({assigned.length})
          </button>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterMode === 'all' ? 'bg-navy-900 text-white' : 'text-navy-600'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
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

      {/* Bookings Dispatch Cards */}
      {loading ? (
        <div className="py-20 text-center text-xs text-navy-500">Loading dispatch queue...</div>
      ) : displayed.length === 0 ? (
        <div className="py-20 bg-white rounded-3xl border border-navy-100 text-center p-8 space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-navy-900">No bookings currently waiting for dispatch</h3>
          <p className="text-xs text-navy-500">All customer appointments have been assigned to verified trade specialists.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayed.map((bk) => (
            <div
              key={bk.id}
              className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm hover:shadow-md transition-shadow space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-navy-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-navy-100 text-navy-800">
                      {bk.booking_code}
                    </span>
                    <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                      {bk.service_category}
                    </span>
                    {bk.is_emergency && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        ⚡ Emergency
                      </span>
                    )}
                  </div>
                  <StatusBadge status={bk.status} />
                </div>

                <div>
                  <h3 className="font-bold text-navy-900 text-base">{bk.service_name}</h3>
                  <h4 className="font-semibold text-xs text-navy-800 mt-1">{bk.problem_title}</h4>
                  <p className="text-xs text-navy-600 mt-1 leading-relaxed bg-navy-50/60 p-3 rounded-xl border border-navy-100">
                    {bk.problem_description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-navy-600">
                  <div className="space-y-1">
                    <span className="font-bold text-navy-400 uppercase text-[10px] block">Customer Info</span>
                    <p className="font-bold text-navy-900">{bk.customer_name}</p>
                    <p className="text-navy-500">{bk.customer_phone}</p>
                    <p className="text-navy-500">{bk.service_address}, {bk.city}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-navy-400 uppercase text-[10px] block">Schedule & Cost</span>
                    <p className="font-bold text-navy-900">{bk.preferred_date}</p>
                    <p className="text-navy-500">{bk.preferred_time_slot}</p>
                    <p className="text-emerald-600 font-bold">${Number(bk.estimated_cost || 50).toFixed(2)}</p>
                  </div>
                </div>

                {/* Assigned status */}
                <div className="p-3 rounded-xl bg-navy-50 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-navy-500 font-medium">Assigned Pro:</span>
                    <span className="font-bold text-navy-900">
                      {bk.technician_name || 'None (Unassigned)'}
                    </span>
                  </div>
                  {bk.technician_name && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Dispatch Action */}
              <div className="pt-4 border-t border-navy-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForDispatch(bk)}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{bk.assigned_technician_id ? 'Reassign Technician' : 'Dispatch Technician Now'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBookingForDispatch && (
        <DispatchModal
          isOpen={!!selectedBookingForDispatch}
          onClose={() => setSelectedBookingForDispatch(null)}
          booking={selectedBookingForDispatch}
          onDispatched={(updated) => {
            setActionMsg(`Technician successfully assigned to ${updated.booking_code}. Status changed to technician_assigned.`);
            fetchBookings();
          }}
        />
      )}
    </div>
  );
}
