'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, ShieldCheck, Calendar, CheckCircle2, Clock, Printer } from 'lucide-react';

export default function AdminWarrantiesPage() {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWarranties() {
      try {
        const res = await fetch('/api/warranties');
        const data = await res.json();
        if (data.warranties) setWarranties(data.warranties);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadWarranties();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          Service Warranty Tracking Registry
        </h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Active warranties generated upon completed jobs with start/expiry coverage dates and re-service terms.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-navy-500">Loading warranty registry...</div>
        ) : warranties.length === 0 ? (
          <div className="py-20 text-center text-xs text-navy-500">No active warranties registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-50/70 border-b border-navy-100 text-navy-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Warranty Code</th>
                  <th className="py-3 px-4 font-bold">Booking Ref</th>
                  <th className="py-3 px-4 font-bold">Customer</th>
                  <th className="py-3 px-4 font-bold">Service Performed</th>
                  <th className="py-3 px-4 font-bold">Technician</th>
                  <th className="py-3 px-4 font-bold">Coverage Period</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {warranties.map((w) => (
                  <tr key={w.id} className="hover:bg-navy-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary-700">{w.warranty_code}</td>
                    <td className="py-3.5 px-4 font-mono text-navy-900 font-bold">{w.booking_code}</td>
                    <td className="py-3.5 px-4 font-bold text-navy-900">{w.customer_name}</td>
                    <td className="py-3.5 px-4 font-semibold text-navy-800">{w.service_name}</td>
                    <td className="py-3.5 px-4 text-navy-600">{w.technician_name}</td>
                    <td className="py-3.5 px-4 text-navy-600">
                      <span>{w.start_date} &rarr; {w.expiry_date}</span>
                      <span className="text-navy-400 text-[10px] block font-semibold">{w.warranty_months} Months Full Protection</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 capitalize">
                        {w.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/customer/bookings/${w.booking_id}/receipt`}
                        className="px-2.5 py-1 bg-navy-100 hover:bg-navy-200 text-navy-800 rounded-lg text-xs font-bold inline-flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </Link>
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
