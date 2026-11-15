'use client';

import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Star, Award, CheckCircle2 } from 'lucide-react';

export default function ReviewModal({ isOpen, onClose, booking, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!booking) return;
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: booking.id,
          rating,
          review_text: reviewText,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');

      if (onReviewSubmitted) onReviewSubmitted(data.review);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rate Your Service Experience">
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
            {errorMsg}
          </div>
        )}

        <div className="text-center pb-2">
          <p className="text-sm font-semibold text-navy-900">
            How was the work by {booking?.technician_name || 'your technician'}?
          </p>
          <p className="text-xs text-navy-500 mt-0.5">{booking?.service_name}</p>

          {/* Star selector */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 text-amber-400 hover:scale-125 transition-transform"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating ? 'fill-amber-400 text-amber-400' : 'text-navy-200'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-navy-700 mt-2 block">
            {rating === 5 && 'Outstanding Work (5/5)'}
            {rating === 4 && 'Very Good (4/5)'}
            {rating === 3 && 'Average (3/5)'}
            {rating === 2 && 'Needs Improvement (2/5)'}
            {rating === 1 && 'Unsatisfactory (1/5)'}
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
            Detailed Feedback *
          </label>
          <textarea
            required
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Describe the punctuality, cleanliness, quality of repair, and communication..."
            className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-navy-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-navy-600 hover:bg-navy-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold shadow-md disabled:opacity-50 transition"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
