'use client';

import React from 'react';
import { DollarSign, TrendingUp, Calendar, CreditCard, Award, ArrowUpRight } from 'lucide-react';

export default function TechnicianEarningsPage() {
  const earningsStats = {
    totalLifetime: 12140.00,
    currentMonth: 2840.00,
    pendingPayout: 345.00,
    completedJobsThisMonth: 28,
  };

  const payoutHistory = [
    { id: 'tx-901', date: '2024-11-01', amount: 980.00, status: 'Completed', method: 'Direct Bank Transfer' },
    { id: 'tx-902', date: '2024-10-15', amount: 1120.00, status: 'Completed', method: 'Direct Bank Transfer' },
    { id: 'tx-903', date: '2024-10-01', amount: 890.00, status: 'Completed', method: 'Direct Bank Transfer' },
    { id: 'tx-904', date: '2024-09-15', amount: 1250.00, status: 'Completed', method: 'Direct Bank Transfer' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">Earnings & Payouts</h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Monitor your labor earnings, parts reimbursements, and automated bi-weekly bank deposits.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-navy-400 uppercase">This Month Earnings</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-navy-900">${earningsStats.currentMonth.toFixed(2)}</p>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" />
            <span>+14.8% vs last month</span>
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-navy-400 uppercase">Pending Clearance</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-600">${earningsStats.pendingPayout.toFixed(2)}</p>
          <span className="text-xs text-navy-400">Scheduled for Friday deposit</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-navy-400 uppercase">All-Time Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-navy-900">${earningsStats.totalLifetime.toFixed(2)}</p>
          <span className="text-xs text-navy-400">142 repairs verified</span>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm overflow-hidden space-y-4">
        <h3 className="font-bold text-navy-900 text-base">Direct Deposit Payout History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-50/70 border-b border-navy-100 text-navy-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-bold">Transfer Ref</th>
                <th className="py-3 px-4 font-bold">Deposit Date</th>
                <th className="py-3 px-4 font-bold">Payout Method</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {payoutHistory.map((tx) => (
                <tr key={tx.id} className="hover:bg-navy-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-navy-900">{tx.id}</td>
                  <td className="py-3 px-4 text-navy-600">{tx.date}</td>
                  <td className="py-3 px-4 text-navy-600">{tx.method}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-black text-navy-900">
                    ${tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Clock(props) {
  return <DollarSign {...props} />;
}
