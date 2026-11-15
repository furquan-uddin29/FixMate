'use client';

import React, { useState } from 'react';
import Modal from '../common/Modal';
import {
  ShieldCheck,
  FileText,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Award,
  AlertTriangle,
} from 'lucide-react';

export default function TechnicianApprovalModal({ isOpen, onClose, technician, onReviewed }) {
  const [remarks, setRemarks] = useState(technician?.verification_remarks || '');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpdate = async (newStatus) => {
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/technicians/${technician.id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          remarks,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update verification');

      if (onReviewed) onReviewed(data.technician);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review Technician Credentials" maxWidth="max-w-xl">
      <div className="space-y-5">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
            {errorMsg}
          </div>
        )}

        {/* Technician info */}
        <div className="flex items-center gap-4 p-4 bg-navy-50 rounded-2xl border border-navy-100">
          <img
            src={technician?.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80'}
            alt={technician?.full_name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
          />
          <div>
            <h4 className="font-bold text-navy-900 text-base">{technician?.full_name}</h4>
            <p className="text-xs text-navy-500">{technician?.email} • {technician?.phone}</p>
            <p className="text-xs font-semibold text-primary-600 mt-0.5">
              Categories: {technician?.service_categories?.join(', ')} ({technician?.experience_years} years experience)
            </p>
          </div>
        </div>

        {/* Uploaded Verification Documents */}
        <div>
          <h5 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-2">
            Uploaded Proof Documents
          </h5>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <a
              href={technician?.id_document_url || '#'}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl border border-navy-200 hover:border-primary-500 hover:bg-primary-50/50 transition flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-600" />
                <span className="font-semibold text-navy-800">Government ID</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-navy-400" />
            </a>

            <a
              href={technician?.certificate_url || '#'}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl border border-navy-200 hover:border-primary-500 hover:bg-primary-50/50 transition flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-navy-800">Trade License</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-navy-400" />
            </a>
          </div>
        </div>

        {/* Verification Remarks */}
        <div>
          <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
            Admin Verification Remarks / Notes *
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Record license registration number, background check verification reference, or reason if rejected..."
            className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-navy-100">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleUpdate('rejected')}
            className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject Application</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-navy-600 hover:bg-navy-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleUpdate('verified')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Verify Technician</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
