'use client';

import React, { useState } from 'react';
import Modal from '../common/Modal';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export default function ComplaintModal({ isOpen, onClose, booking, onComplaintSubmitted }) {
  const [category, setCategory] = useState('quality');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!booking) return;
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: booking.id,
          booking_code: booking.booking_code,
          customer_id: booking.customer_id,
          customer_name: booking.customer_name,
          category,
          title,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit complaint');

      if (onComplaintSubmitted) onComplaintSubmitted(data.complaint);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lodge a Support Complaint / Dispute">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
            {errorMsg}
          </div>
        )}

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Complaints are prioritized directly to the Admin Dispatch Manager. A resolution representative will respond within 24 hours.
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
            Complaint Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
          >
            <option value="quality">Quality of Workmanship / Recurring Fault</option>
            <option value="delay">Technician Delay / Unpunctual</option>
            <option value="overcharging">Pricing Dispute / Overcharging</option>
            <option value="behavior">Unprofessional Behavior</option>
            <option value="damage">Property Damage</option>
            <option value="other">Other Inquiry</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
            Issue Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief subject of the complaint"
            className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
            Full Description of the Problem *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide clear specifics of what occurred and what resolution you require..."
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
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-md disabled:opacity-50 transition"
          >
            {submitting ? 'Submitting...' : 'File Complaint'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
