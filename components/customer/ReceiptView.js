'use client';

import React from 'react';
import {
  Wrench,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User,
  MapPin,
  Download,
} from 'lucide-react';

export default function ReceiptView({ receipt, booking }) {
  if (!receipt && !booking) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border text-navy-500">
        Receipt data not found.
      </div>
    );
  }

  // Support both full receipt object or synthesising from completed booking
  const rcp = receipt || {
    receipt_number: booking.receipt_number || `RCP-${booking.booking_code}`,
    booking_code: booking.booking_code,
    customer_name: booking.customer_name,
    customer_email: booking.customer_email || 'sarah.jenkins@example.com',
    customer_phone: booking.customer_phone,
    technician_name: booking.technician_name || 'Assigned Specialist',
    service_name: booking.service_name,
    base_price: 49.00,
    labor_charge: booking.service_record?.labor_charges || 65.00,
    parts_cost: (booking.service_record?.parts_used || []).reduce((acc, p) => acc + (p.cost || 0), 0) || 31.00,
    additional_charges: booking.service_record?.additional_charges || 0.00,
    emergency_fee: booking.is_emergency ? 25.00 : 0.00,
    discount: 0.00,
    total_amount: booking.final_cost || booking.estimated_cost || 135.00,
    payment_status: 'PAID',
    payment_method: booking.payment_method || 'Credit Card / Visa',
    payment_date: booking.service_record?.completion_date || booking.updated_at || new Date().toISOString(),
    warranty_code: booking.warranty_code || 'WRN-PLM-9912',
    warranty_duration: `${booking.service_record?.warranty_months || 6} Months Protection`,
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Top action header (hidden during print) */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div>
          <h2 className="text-xl font-black text-navy-900">Official Service Receipt</h2>
          <p className="text-xs text-navy-500">Authorized proof of payment and warranty validation</p>
        </div>
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-md transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Receipt Card */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-navy-200 shadow-xl print:shadow-none print:border-none print:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start pb-8 border-b-2 border-navy-900 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-navy-900 tracking-tight">Fix<span className="text-primary-600">Mate</span></span>
              <p className="text-[11px] text-navy-400 font-medium">Your Home, Our Responsibility.</p>
              <p className="text-[10px] text-navy-400">FixMate Technologies Ltd. • Tax ID: FM-981-440-US</p>
            </div>
          </div>

          <div className="text-right sm:text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
              Payment Status: {rcp.payment_status}
            </span>
            <p className="text-xs font-mono font-bold text-navy-900">Receipt: {rcp.receipt_number}</p>
            <p className="text-xs text-navy-500">Date: {new Date(rcp.payment_date).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Customer & Job Details */}
        <div className="grid grid-cols-2 gap-6 py-6 border-b border-navy-100 text-xs">
          <div>
            <h5 className="font-bold uppercase tracking-wider text-navy-400 text-[10px] mb-2">Billed To (Customer)</h5>
            <p className="font-bold text-navy-900 text-sm">{rcp.customer_name}</p>
            <p className="text-navy-600">{rcp.customer_email}</p>
            <p className="text-navy-600">{rcp.customer_phone}</p>
          </div>

          <div className="text-right">
            <h5 className="font-bold uppercase tracking-wider text-navy-400 text-[10px] mb-2">Verified Technician</h5>
            <p className="font-bold text-navy-900 text-sm">{rcp.technician_name}</p>
            <p className="text-navy-600">Badge ID: {rcp.technician_license || 'Verified Pro'}</p>
            <p className="text-navy-600">Ref Code: {rcp.booking_code}</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-6 border-b border-navy-100">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-navy-200 text-navy-500 uppercase tracking-wider text-[10px]">
                <th className="py-2 font-bold">Item Description</th>
                <th className="py-2 font-bold text-center">Category</th>
                <th className="py-2 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              <tr>
                <td className="py-3 font-medium text-navy-900">
                  {rcp.service_name}
                  <span className="block text-[11px] text-navy-400">Diagnostic inspection & base service call</span>
                </td>
                <td className="py-3 text-center text-navy-500">Base Service</td>
                <td className="py-3 text-right font-bold text-navy-900">${Number(rcp.base_price).toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-navy-900">
                  Certified Trade Labor
                  <span className="block text-[11px] text-navy-400">Specialist time, tooling, and workmanship</span>
                </td>
                <td className="py-3 text-center text-navy-500">Labor</td>
                <td className="py-3 text-right font-bold text-navy-900">${Number(rcp.labor_charge).toFixed(2)}</td>
              </tr>
              {Number(rcp.parts_cost) > 0 && (
                <tr>
                  <td className="py-3 font-medium text-navy-900">
                    OEM Replacement Parts & Seals
                    <span className="block text-[11px] text-navy-400">Quarter-turn valve, P-trap coupling kit</span>
                  </td>
                  <td className="py-3 text-center text-navy-500">Parts</td>
                  <td className="py-3 text-right font-bold text-navy-900">${Number(rcp.parts_cost).toFixed(2)}</td>
                </tr>
              )}
              {Number(rcp.emergency_fee) > 0 && (
                <tr>
                  <td className="py-3 font-medium text-amber-800">
                    Emergency Priority Dispatch Surcharge
                  </td>
                  <td className="py-3 text-center text-amber-700">Express</td>
                  <td className="py-3 text-right font-bold text-amber-800">${Number(rcp.emergency_fee).toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Calculation */}
        <div className="py-6 border-b border-navy-100 flex justify-end">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-navy-600">
              <span>Subtotal:</span>
              <span className="font-semibold">${Number(rcp.total_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-navy-600">
              <span>Taxes (Included):</span>
              <span className="font-semibold">$0.00</span>
            </div>
            <div className="pt-2 border-t border-navy-200 flex justify-between text-base font-black text-navy-900">
              <span>Total Paid:</span>
              <span className="text-primary-600">${Number(rcp.total_amount).toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-navy-400 text-right">Paid via {rcp.payment_method}</p>
          </div>
        </div>

        {/* Warranty Guarantee Box */}
        <div className="mt-8 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-emerald-950 text-sm">FixMate Certified Service Warranty</h4>
              <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                Code: {rcp.warranty_code}
              </span>
            </div>
            <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
              This service is backed by our <strong>{rcp.warranty_duration}</strong>. If any recurrence or leak appears in the serviced component, FixMate provides complimentary technician re-dispatch without additional labor charges.
            </p>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="mt-8 pt-4 border-t border-navy-100 text-center text-[10px] text-navy-400">
          <p>Thank you for choosing FixMate – Your Home, Our Responsibility.</p>
          <p className="mt-0.5">Need customer support? Visit fixmate.app/contact or call 24/7 at +1 (800) 349-MATE.</p>
        </div>
      </div>
    </div>
  );
}
