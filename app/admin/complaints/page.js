'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, MessageSquare, CheckCircle2, AlertCircle, Clock, Check } from 'lucide-react';
import ComplaintResolutionModal from '@/components/admin/ComplaintResolutionModal';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  const loadComplaints = async () => {
    try {
      const res = await fetch('/api/complaints');
      const data = await res.json();
      if (data.complaints) setComplaints(data.complaints);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          Customer Disputes & Quality Complaints
        </h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Investigate customer disputes, dispatch warranty re-inspections, and record official resolutions.
        </p>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
          {actionMsg}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-navy-500">Loading complaints registry...</div>
      ) : complaints.length === 0 ? (
        <div className="py-20 bg-white rounded-3xl border border-navy-100 text-center p-8 space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-navy-900">Zero open disputes</h3>
          <p className="text-xs text-navy-500">All customer inquiries have been addressed and closed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c.id} className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-navy-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-navy-100 text-navy-800">
                    {c.booking_code}
                  </span>
                  <span className="text-xs font-bold capitalize text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                    Category: {c.category}
                  </span>
                  <span className="text-xs text-navy-400">By {c.customer_name}</span>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                  c.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                  c.status === 'in_progress' ? 'bg-sky-100 text-sky-800' :
                  c.status === 'under_review' ? 'bg-amber-100 text-amber-800' : 'bg-navy-100 text-navy-800'
                }`}>
                  {c.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-navy-900 text-base">{c.title}</h4>
                <p className="text-xs text-navy-600 mt-1 leading-relaxed bg-navy-50/60 p-3.5 rounded-2xl border border-navy-100">
                  {c.description}
                </p>
              </div>

              {c.admin_response && (
                <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Admin Resolution Note:</span>
                  </div>
                  <p className="text-emerald-800 pl-5.5">{c.admin_response}</p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedComplaint(c)}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  {c.admin_response ? 'Update Resolution' : 'Investigate & Resolve'} &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedComplaint && (
        <ComplaintResolutionModal
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          complaint={selectedComplaint}
          onResolved={(updated) => {
            setActionMsg(`Complaint for ${updated.booking_code} updated to status "${updated.status}".`);
            loadComplaints();
          }}
        />
      )}
    </div>
  );
}
