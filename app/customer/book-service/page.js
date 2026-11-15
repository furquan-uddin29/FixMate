'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BookingWizard from '@/components/customer/BookingWizard';

function BookingWizardContent() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');

  return (
    <div className="py-4">
      <BookingWizard initialServiceId={serviceId} />
    </div>
  );
}

export default function BookServicePage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-navy-500">Loading booking wizard...</div>}>
      <BookingWizardContent />
    </Suspense>
  );
}
