'use client';

import React, { useState } from 'react';
import Modal from '../common/Modal';
import { ShieldCheck, MessageSquare, AlertCircle } from 'lucide-react';

export default function ComplaintResolutionModal({ isOpen, onClose, complaint, onResolved }) {
  const [status, setStatus] = useState(complaint?.status || 'resolved');
  const [responseMsg, setResponseMsg] = useState(complaint?.admin_response || '');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/complaints/${complaint.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          admin_response: responseMsg,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update complaint');

      if (onResolved) onResolved(data.complaint);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Resolve Customer Complaint / Dispute" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
            {errorMsg}
          </div>
        )}

        <div className="p-4 bg-navy-50 rounded-2xl border border-navy-100 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="font-bold text-navy-900">{complaint?.customer_name}</span>
            <span className="font-mono text-navy-500">{complaint?.booking_code}</span>
          </div>
          <p className="font-semibold text-rose-700 capitalize">Category: {complaint?.category}</p>
          <p className="text-navy-800 font-bold">{complaint?.title}</p>
          <p className="text-navy-600 leading-relaxed">{complaint?.description}</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
            Resolution Status *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
          >
            <option value="under_review">Under Review</option>
            <option value="in_progress">In Progress / Re-dispatching Technician</option>
            <option value="resolved">Resolved (Customer Compensated / Fixed)</option>
            <option value="rejected">Rejected (Unsubstantiated Dispute)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
            Administrative Response & Redressal Plan *
          </label>
          <textarea
            required
            rows={4}
            value={responseMsg}
            onChange={(e) => setResponseMsg(e.target.value)}
            placeholder="Explain corrective measures taken, warranty dispatch details, or customer refund/credit instructions..."
            className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-navy-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-navy-600 hover:bg-navy-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold shadow-md disabled:opacity-50 transition"
          >
            {submitting ? 'Updating...' : 'Save Resolution'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
