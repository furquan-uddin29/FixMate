'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Wrench,
  Search,
  Filter,
  Compass,
  Printer,
  Star,
  ShieldAlert,
  XCircle,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import ReviewModal from '@/components/customer/ReviewModal';
import ComplaintModal from '@/components/customer/ComplaintModal';

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [selectedBookingForComplaint, setSelectedBookingForComplaint] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  const loadBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Failed to load customer bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking request?')) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg('Booking has been successfully cancelled.');
        loadBookings();
      } else {
        alert(data.error || 'Failed to cancel booking');
      }
    } catch (err) {
      alert('Error communicating with server');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'Active' && ['completed', 'cancelled', 'rejected'].includes(b.status)) return false;
    if (statusFilter === 'Completed' && b.status !== 'completed') return false;
    if (statusFilter === 'Cancelled' && b.status !== 'cancelled') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.booking_code.toLowerCase().includes(q) ||
        b.service_name.toLowerCase().includes(q) ||
        b.problem_title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">My Service Bookings</h1>
          <p className="text-xs sm:text-sm text-navy-500 mt-1">
            Manage your service requests, inspect repair progress, and view warranties & receipts.
          </p>
        </div>

        <Link
          href="/customer/book-service"
          className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition text-center"
        >
          + Book New Service
        </Link>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionMsg}</span>
          </div>
          <button onClick={() => setActionMsg('')} className="text-emerald-600 font-bold">✕</button>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-3xl border border-navy-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Active', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-navy-50 text-navy-700 hover:bg-navy-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-navy-200 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Bookings Card List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-navy-500">Loading service bookings...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="py-16 bg-white rounded-3xl border border-navy-100 text-center p-8 space-y-3">
          <Calendar className="w-12 h-12 text-navy-300 mx-auto" />
          <h3 className="text-base font-bold text-navy-900">No bookings found</h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            You don't have any bookings matching this criteria. Create a new service request anytime.
          </p>
          <Link
            href="/customer/book-service"
            className="inline-block mt-2 px-5 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold"
          >
            Book a Service Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-navy-100">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-navy-100 text-navy-800">
                    {b.booking_code}
                  </span>
                  <StatusBadge status={b.status} />
                  {b.is_emergency && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      ⚡ Emergency
                    </span>
                  )}
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-navy-400 block">Total / Estimated Cost</span>
                  <span className="text-base font-black text-navy-900">
                    ${(b.final_cost || b.estimated_cost || 50).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-navy-600">
                <div className="space-y-1">
                  <h4 className="font-bold text-navy-900 text-sm">{b.service_name}</h4>
                  <p className="text-navy-500 line-clamp-2">{b.problem_title}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-navy-700 block">Assigned Technician:</span>
                  {b.technician_name ? (
                    <p className="text-navy-900 font-semibold">{b.technician_name} ({b.technician_phone})</p>
                  ) : (
                    <p className="text-navy-400 italic">Matching local verified specialist...</p>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-navy-700 block">Schedule & Location:</span>
                  <p className="text-navy-900">{b.preferred_date} ({b.preferred_time_slot})</p>
                  <p className="text-navy-500 truncate">{b.service_address}, {b.city}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-navy-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/customer/tracking?id=${b.id}`}
                    className="px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Track Status Live</span>
                  </Link>

                  {b.status === 'completed' && (
                    <>
                      <Link
                        href={`/customer/bookings/${b.id}/receipt`}
                        className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Digital Receipt</span>
                      </Link>

                      <button
                        onClick={() => setSelectedBookingForReview(b)}
                        className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>Rate & Review</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBookingForComplaint(b)}
                    className="px-3 py-1.5 text-navy-400 hover:text-navy-700 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>File Dispute</span>
                  </button>

                  {!['in_progress', 'completed', 'cancelled', 'rejected'].includes(b.status) && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedBookingForReview && (
        <ReviewModal
          isOpen={!!selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
          booking={selectedBookingForReview}
          onReviewSubmitted={() => {
            setActionMsg('Thank you! Your feedback has been registered.');
          }}
        />
      )}

      {/* Complaint Modal */}
      {selectedBookingForComplaint && (
        <ComplaintModal
          isOpen={!!selectedBookingForComplaint}
          onClose={() => setSelectedBookingForComplaint(null)}
          booking={selectedBookingForComplaint}
          onComplaintSubmitted={() => {
            setActionMsg('Your dispute has been escalated to FixMate administration.');
          }}
        />
      )}
    </div>
  );
}
