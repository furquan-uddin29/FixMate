'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import ComplaintModal from '@/components/customer/ComplaintModal';

export default function CustomerComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const loadData = async () => {
    try {
      const [cmpRes, bkRes] = await Promise.all([
        fetch('/api/complaints'),
        fetch('/api/bookings'),
      ]);

      if (cmpRes.ok) {
        const cmpData = await cmpRes.json();
        setComplaints(cmpData.complaints || []);
      }
      if (bkRes.ok) {
        const bkData = await bkRes.json();
        setBookings(bkData.bookings || []);
        if (bkData.bookings && bkData.bookings.length > 0) {
          setSelectedBooking(bkData.bookings[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Resolved</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800">In Progress</span>;
      case 'under_review':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Under Review</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-navy-100 text-navy-800">Submitted</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
            Support Disputes & Complaints
          </h1>
          <p className="text-xs sm:text-sm text-navy-500 mt-1">
            FixMate guarantee: We resolve workmanship disputes and warranty claims within 24 hours.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>File New Complaint</span>
        </button>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-xs text-navy-500">Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="py-16 bg-white rounded-3xl border border-navy-100 text-center p-8 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-navy-900">No Active Complaints</h3>
            <p className="text-xs text-navy-500 max-w-sm mx-auto">
              You currently have no open disputes. If you experience any dissatisfaction with a service, submit a dispute here.
            </p>
          </div>
        ) : (
          complaints.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-navy-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-navy-700">{c.booking_code}</span>
                  <span className="text-xs font-bold capitalize text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                    Category: {c.category}
                  </span>
                </div>
                {getStatusBadge(c.status)}
              </div>

              <div>
                <h4 className="font-bold text-navy-900 text-base">{c.title}</h4>
                <p className="text-xs text-navy-600 mt-1 leading-relaxed">{c.description}</p>
              </div>

              {/* Admin response block */}
              {c.admin_response ? (
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Official FixMate Administration Response:</span>
                  </div>
                  <p className="text-emerald-800 leading-relaxed pl-5.5">{c.admin_response}</p>
                </div>
              ) : (
                <div className="p-3 bg-navy-50 rounded-xl text-xs text-navy-500 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-navy-400" />
                  <span>Awaiting supervisor investigation and dispatcher response...</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <ComplaintModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          booking={selectedBooking || { id: 'bk-1001', booking_code: 'FXM-2024-1001', customer_id: 'usr-customer-01', customer_name: 'Sarah Jenkins' }}
          onComplaintSubmitted={() => {
            loadData();
          }}
        />
      )}
    </div>
  );
}
