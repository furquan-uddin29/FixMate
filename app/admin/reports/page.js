'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Users,
  Wrench,
  ShieldAlert,
} from 'lucide-react';

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState('revenue');
  const [startDate, setStartDate] = useState('2024-11-01');
  const [endDate, setEndDate] = useState('2024-11-30');

  const reportData = {
    revenue: [
      { metric: 'Gross Service Invoiced', value: '$13,540.00' },
      { metric: 'Platform Commission (15%)', value: '$2,031.00' },
      { metric: 'Technician Labor Payouts', value: '$9,840.00' },
      { metric: 'OEM Replacement Parts Reimbursed', value: '$1,669.00' },
      { metric: 'Emergency Surcharge Revenue', value: '$425.00' },
    ],
    bookings: [
      { metric: 'Total Service Bookings', value: '48 Orders' },
      { metric: 'Average Booking Completion Time', value: '1.8 Hours' },
      { metric: 'Emergency vs Standard Ratio', value: '18% Emergency' },
      { metric: 'Cancellation Rate', value: '2.1%' },
      { metric: 'Customer Repeat Booking Rate', value: '42%' },
    ],
    performance: [
      { metric: 'David Miller (Plumbing)', value: '142 Jobs • 4.95 Rating' },
      { metric: 'Marcus Vance (Electrical)', value: '198 Jobs • 4.88 Rating' },
      { metric: 'Elena Rostova (AC Repair)', value: '95 Jobs • 4.92 Rating' },
      { metric: 'Carlos Mendez (Carpentry)', value: '165 Jobs • 4.98 Rating' },
      { metric: 'Average Technician Response Time', value: '14 Minutes' },
    ],
    complaints: [
      { metric: 'Total Lodged Disputes', value: '2 Complaints' },
      { metric: 'Resolved Satisfactorily', value: '1 Resolved (50%)' },
      { metric: 'Under Investigation', value: '1 In Review (50%)' },
      { metric: 'Average Resolution Time', value: '4.2 Hours' },
    ],
  };

  const handleExport = () => {
    alert(`Exporting FixMate ${reportType.toUpperCase()} Report (${startDate} to ${endDate}) as CSV/PDF.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">Business Reports & Analytics</h1>
          <p className="text-xs sm:text-sm text-navy-500 mt-1">
            Generate audited accounting reports, technician performance scores, and quality dispute summaries.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-5 py-2.5 bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Date Range & Report Filter */}
      <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'revenue', label: 'Revenue & Finance', icon: DollarSign },
            { id: 'bookings', label: 'Booking Volume', icon: Calendar },
            { id: 'performance', label: 'Technician Scores', icon: Wrench },
            { id: 'complaints', label: 'Dispute Redressal', icon: ShieldAlert },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                reportType === tab.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-navy-50 text-navy-700 hover:bg-navy-100'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-navy-600">
          <span>Range:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-navy-200 text-xs text-navy-900"
          />
          <span>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-navy-200 text-xs text-navy-900"
          />
        </div>
      </div>

      {/* Report Table Display */}
      <div className="bg-white rounded-3xl border border-navy-100 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-navy-100">
          <div>
            <h3 className="font-bold text-navy-900 text-base capitalize">
              {reportType} Analytics Summary
            </h3>
            <p className="text-xs text-navy-400">Date Range: {startDate} to {endDate}</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Audit Ready
          </span>
        </div>

        <div className="divide-y divide-navy-50">
          {reportData[reportType].map((row, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between text-sm">
              <span className="font-medium text-navy-700">{row.metric}</span>
              <span className="font-black text-navy-900 text-base">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
