'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Award, CheckCircle2, MessageSquare } from 'lucide-react';
import ReviewModal from '@/components/customer/ReviewModal';

export default function CustomerReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  const loadData = async () => {
    try {
      const [revRes, bkRes] = await Promise.all([
        fetch('/api/reviews'),
        fetch('/api/bookings?status=completed'),
      ]);

      if (revRes.ok) {
        const revData = await revRes.json();
        setReviews(revData.reviews || []);
      }
      if (bkRes.ok) {
        const bkData = await bkRes.json();
        setCompletedBookings(bkData.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          Service Reviews & Ratings
        </h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Review verified technician workmanship. Feedback helps uphold FixMate quality standards.
        </p>
      </div>

      {/* Completed Services Pending Review */}
      {completedBookings.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-navy-900 text-sm">Completed Services Ready for Rating</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedBookings.map((b) => (
              <div key={b.id} className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-navy-400 font-mono block">{b.booking_code}</span>
                  <h4 className="font-bold text-navy-900 text-xs">{b.service_name}</h4>
                  <p className="text-[11px] text-navy-500">Technician: {b.technician_name}</p>
                </div>
                <button
                  onClick={() => setSelectedBookingForReview(b)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm transition shrink-0"
                >
                  Rate Pro
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Reviews */}
      <div className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm space-y-6">
        <h3 className="font-bold text-navy-900 text-base">Verified Feedback History</h3>

        {loading ? (
          <div className="py-12 text-center text-xs text-navy-500">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center text-xs text-navy-500">No reviews submitted yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl border border-navy-100 bg-navy-50/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">{rev.technician_name}</h4>
                    <span className="text-[11px] text-navy-400">{rev.service_name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-navy-600 italic leading-relaxed">
                  "{rev.review_text}"
                </p>

                <div className="pt-2 border-t border-navy-100 text-[10px] text-navy-400">
                  Submitted on {new Date(rev.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBookingForReview && (
        <ReviewModal
          isOpen={!!selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
          booking={selectedBookingForReview}
          onReviewSubmitted={() => {
            loadData();
          }}
        />
      )}
    </div>
  );
}
