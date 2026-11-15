'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, Award, Calendar, MapPin, Printer, ShieldCheck } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';

export default function TechnicianHistoryPage() {
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch('/api/bookings?status=completed');
        const data = await res.json();
        if (data.bookings) {
          setCompletedJobs(data.bookings);
        }
      } catch (err) {
        console.error('Failed to load job history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">Completed Service Records</h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Historical archive of all completed customer repair orders, parts recorded, and warranty registrations.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-navy-500">Loading service archives...</div>
      ) : completedJobs.length === 0 ? (
        <div className="py-20 bg-white rounded-3xl border border-navy-100 text-center p-8 space-y-2">
          <History className="w-12 h-12 text-navy-300 mx-auto" />
          <h3 className="text-base font-bold text-navy-900">No completed jobs yet</h3>
          <p className="text-xs text-navy-500">When you finalize active repair work, completion records appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {completedJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-navy-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-navy-100 text-navy-800">
                    {job.booking_code}
                  </span>
                  <StatusBadge status={job.status} />
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Receipt Generated
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-navy-400 block">Total Payout</span>
                  <span className="text-base font-black text-emerald-600">
                    ${(job.final_cost || job.estimated_cost || 135).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-navy-600">
                <div className="space-y-1">
                  <h4 className="font-bold text-navy-900 text-sm">{job.service_name}</h4>
                  <p className="text-navy-500">{job.problem_title}</p>
                  <p className="text-navy-700 font-semibold pt-1">
                    Customer: {job.customer_name} ({job.customer_phone})
                  </p>
                </div>

                <div className="bg-navy-50/60 p-4 rounded-2xl border border-navy-100 space-y-1.5">
                  <span className="font-bold text-navy-800 uppercase text-[10px] block">Service Record Log</span>
                  <p className="text-navy-700">
                    {job.service_record?.repair_description || 'Replaced faulty brass valve assembly and tightened P-trap couplings.'}
                  </p>
                  <div className="flex items-center justify-between text-navy-500 pt-1 text-[11px]">
                    <span>Warranty: {job.service_record?.warranty_months || 6} Months</span>
                    <span>Code: {job.warranty_code || 'WRN-PLM-9912'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  href={`/customer/bookings/${job.id}/receipt`}
                  className="px-4 py-2 bg-navy-100 hover:bg-navy-200 text-navy-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Inspect Official Receipt</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
