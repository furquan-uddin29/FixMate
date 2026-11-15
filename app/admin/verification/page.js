'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Award,
  FileText,
  UserCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Clock,
} from 'lucide-react';
import TechnicianApprovalModal from '@/components/admin/TechnicianApprovalModal';

export default function AdminVerificationPage() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  const loadTechnicians = async () => {
    try {
      const res = await fetch('/api/technicians');
      const data = await res.json();
      if (data.technicians) {
        setTechnicians(data.technicians);
      }
    } catch (err) {
      console.error('Failed to load technicians for verification:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTechnicians();
  }, []);

  const pending = technicians.filter(t => t.verification_status === 'pending');
  const verified = technicians.filter(t => t.verification_status === 'verified');
  const rejected = technicians.filter(t => t.verification_status === 'rejected');

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          Technician Verification & Credential Management
        </h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Review state licenses, government photo IDs, and background records before granting job dispatch authorization.
        </p>
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

      {/* Pending Applications Section */}
      <div className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-navy-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-navy-900 text-base">Pending Applications Awaiting Review ({pending.length})</h3>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Priority Queue
          </span>
        </div>

        {pending.length === 0 ? (
          <div className="py-8 text-center text-xs text-navy-400">
            No pending technician applications currently awaiting review.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pending.map((tech) => (
              <div key={tech.id} className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/20 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={tech.avatar_url || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80'}
                    alt={tech.full_name}
                    className="w-12 h-12 rounded-xl object-cover border"
                  />
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">{tech.full_name}</h4>
                    <p className="text-xs text-navy-500">{tech.email} • {tech.phone}</p>
                    <span className="text-[11px] text-primary-700 font-bold mt-0.5 block">
                      {tech.service_categories.join(', ')} ({tech.experience_years} yrs exp)
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-amber-100 text-xs text-navy-600">
                  <strong>Verification Note:</strong> {tech.verification_remarks || 'Awaiting credential review.'}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedTech(tech)}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Review Application & Credentials &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Technicians Verification Table */}
      <div className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm overflow-hidden space-y-4">
        <h3 className="font-bold text-navy-900 text-base">All Registered Technicians ({technicians.length})</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-50/70 border-b border-navy-100 text-navy-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-bold">Technician</th>
                <th className="py-3 px-4 font-bold">Trade Category</th>
                <th className="py-3 px-4 font-bold">Experience</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold">Remarks</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {technicians.map((t) => (
                <tr key={t.id} className="hover:bg-navy-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img src={t.avatar_url} alt={t.full_name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <span className="font-bold text-navy-900 block">{t.full_name}</span>
                        <span className="text-navy-400 text-[11px]">{t.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-navy-800">{t.service_categories.join(', ')}</td>
                  <td className="py-3 px-4 text-navy-600">{t.experience_years} years</td>
                  <td className="py-3 px-4">
                    {t.verification_status === 'verified' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Verified
                      </span>
                    )}
                    {t.verification_status === 'pending' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Pending
                      </span>
                    )}
                    {t.verification_status === 'rejected' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-navy-500 max-w-xs truncate">{t.verification_remarks}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedTech(t)}
                      className="px-3 py-1.5 rounded-lg bg-navy-100 hover:bg-navy-200 text-navy-800 font-bold text-xs"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTech && (
        <TechnicianApprovalModal
          isOpen={!!selectedTech}
          onClose={() => setSelectedTech(null)}
          technician={selectedTech}
          onReviewed={(updated) => {
            setActionMsg(`Technician ${updated.full_name} marked as ${updated.verification_status}.`);
            loadTechnicians();
          }}
        />
      )}
    </div>
  );
}
