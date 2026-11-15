'use client';

import React, { useState, useEffect } from 'react';
import { Star, Award, User, CheckCircle2 } from 'lucide-react';

export default function TechnicianReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        if (data.reviews) {
          setReviews(data.reviews);
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">Client Feedback & Ratings</h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Direct customer reviews on your technical expertise, cleanliness, and punctuality.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-navy-500">Loading reviews...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-navy-900 text-sm">{rev.customer_name}</h4>
                  <span className="text-xs text-navy-400">{rev.service_name}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-navy-600 leading-relaxed italic bg-navy-50/50 p-4 rounded-2xl border border-navy-100">
                "{rev.review_text}"
              </p>
              <div className="flex items-center justify-between text-[11px] text-navy-400 pt-1">
                <span>{new Date(rev.created_at).toLocaleDateString()}</span>
                <span className="text-emerald-600 font-bold">Verified Service</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
