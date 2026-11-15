'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ReceiptView from '@/components/customer/ReceiptView';

export default function BookingReceiptPage({ params }) {
  const { id } = params;
  const [booking, setBooking] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReceiptData() {
      try {
        const [bkRes, rcpRes] = await Promise.all([
          fetch(`/api/bookings/${id}`),
          fetch(`/api/receipts/${id}`),
        ]);

        if (bkRes.ok) {
          const bkData = await bkRes.json();
          setBooking(bkData.booking);
        }
        if (rcpRes.ok) {
          const rcpData = await rcpRes.json();
          setReceipt(rcpData.receipt);
        }
      } catch (err) {
        console.error('Failed to load receipt:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReceiptData();
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-xs text-navy-500">Generating digital receipt...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <Link
          href="/customer/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-500 hover:text-navy-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Bookings</span>
        </Link>
      </div>

      <ReceiptView receipt={receipt} booking={booking} />
    </div>
  );
}
