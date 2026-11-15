'use client';

import React from 'react';
import { Users, Mail, Phone, MapPin, Calendar } from 'lucide-react';

export default function AdminCustomersPage() {
  const sampleCustomers = [
    { id: 'usr-customer-01', name: 'Sarah Jenkins', email: 'sarah.jenkins@example.com', phone: '+1 (555) 111-2233', city: 'Downtown Metro', totalBookings: 2, spent: '$229.00', joined: 'Nov 2024' },
    { id: 'usr-customer-02', name: 'Arthur Pendelton', email: 'arthur.p@example.com', phone: '+1 (555) 222-3344', city: 'Westwood Valley', totalBookings: 1, spent: '$109.00', joined: 'Nov 2024' },
    { id: 'usr-customer-03', name: 'Emily Watson', email: 'emily.w@example.com', phone: '+1 (555) 333-4455', city: 'North Hills', totalBookings: 1, spent: '$80.00', joined: 'Nov 2024' },
    { id: 'usr-customer-04', name: 'Michael Chang', email: 'michael.c@example.com', phone: '+1 (555) 444-5566', city: 'Downtown Metro', totalBookings: 1, spent: '$115.00', joined: 'Nov 2024' },
    { id: 'usr-customer-05', name: 'Jonathan Rivera', email: 'j.rivera@example.com', phone: '+1 (555) 555-6677', city: 'East End', totalBookings: 4, spent: '$420.00', joined: 'Oct 2024' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">Customer Accounts Registry</h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Registered homeowners, booking frequency, lifetime value, and dispute activity.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-50/70 border-b border-navy-100 text-navy-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-bold">Customer Name</th>
                <th className="py-3 px-4 font-bold">Email</th>
                <th className="py-3 px-4 font-bold">Phone</th>
                <th className="py-3 px-4 font-bold">City</th>
                <th className="py-3 px-4 font-bold">Bookings</th>
                <th className="py-3 px-4 font-bold">Total Spent</th>
                <th className="py-3 px-4 font-bold">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {sampleCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-navy-50/50">
                  <td className="py-3.5 px-4 font-bold text-navy-900">{c.name}</td>
                  <td className="py-3.5 px-4 text-navy-600">{c.email}</td>
                  <td className="py-3.5 px-4 text-navy-600">{c.phone}</td>
                  <td className="py-3.5 px-4 text-navy-600">{c.city}</td>
                  <td className="py-3.5 px-4 font-bold text-primary-600">{c.totalBookings} orders</td>
                  <td className="py-3.5 px-4 font-black text-emerald-600">{c.spent}</td>
                  <td className="py-3.5 px-4 text-navy-400">{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
