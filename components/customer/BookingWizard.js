'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  Wrench,
  CheckCircle2,
  Calendar,
  MapPin,
  FileText,
  Clock,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Shield,
  Zap,
} from 'lucide-react';

export default function BookingWizard({ initialServiceId = null }) {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    service_id: initialServiceId || '',
    problem_title: '',
    problem_description: '',
    problem_images: [],
    preferred_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    preferred_time_slot: '09:00 AM - 11:00 AM',
    is_emergency: false,
    customer_name: user?.full_name || '',
    customer_email: user?.email || '',
    customer_phone: user?.phone || '+1 (555) 000-1122',
    service_address: user?.address || '',
    area: 'Downtown Metro',
    city: 'Downtown Metro',
    postal_code: '90210',
    special_instructions: '',
  });

  // Photo URL input
  const [tempPhotoUrl, setTempPhotoUrl] = useState('');

  // Fetch available services
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.services) {
          setServices(data.services);
          if (initialServiceId) {
            setFormData(prev => ({ ...prev, service_id: initialServiceId }));
          } else if (data.services.length > 0) {
            setFormData(prev => ({ ...prev, service_id: data.services[0].id }));
          }
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoadingServices(false);
      }
    }
    loadServices();
  }, [initialServiceId]);

  // Sync user info if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customer_name: prev.customer_name || user.full_name || '',
        customer_email: prev.customer_email || user.email || '',
        customer_phone: prev.customer_phone || user.phone || '+1 (555) 000-1122',
        service_address: prev.service_address || user.address || '',
      }));
    }
  }, [user]);

  const selectedService = services.find(s => s.id === formData.service_id) || services[0];

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 02:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
    '06:00 PM - 08:00 PM',
  ];

  // Pricing calculations
  const basePrice = selectedService ? Number(selectedService.base_price) : 50;
  const laborCharge = selectedService ? Number(selectedService.labor_charge || 30) : 30;
  const emergencyFee = formData.is_emergency ? (Number(selectedService?.emergency_fee) || 25) : 0;
  const totalEstimatedCost = basePrice + laborCharge + emergencyFee;

  const handleAddPhoto = () => {
    if (!tempPhotoUrl) return;
    setFormData(prev => ({
      ...prev,
      problem_images: [...prev.problem_images, tempPhotoUrl],
    }));
    setTempPhotoUrl('');
  };

  const handleRemovePhoto = (idx) => {
    setFormData(prev => ({
      ...prev,
      problem_images: prev.problem_images.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmitBooking = async () => {
    setErrorMsg('');
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        customer_id: user?.id || 'usr-customer-01',
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit booking');
      }

      // Redirect to booking tracking
      router.push(`/customer/tracking?id=${data.booking.id}`);
    } catch (err) {
      setErrorMsg(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-navy-100 shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Wizard Progress Stepper Header */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-950 text-white p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-400">
              5-Step Booking Wizard
            </span>
            <h2 className="text-2xl font-black text-white">Book a Professional Repair</h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-navy-800 text-navy-200 border border-navy-700">
            Step {step} of 5
          </span>
        </div>

        {/* Steps indicator */}
        <div className="grid grid-cols-5 gap-2">
          {[
            { num: 1, name: 'Service' },
            { num: 2, name: 'Problem' },
            { num: 3, name: 'Schedule' },
            { num: 4, name: 'Location' },
            { num: 5, name: 'Summary' },
          ].map((s) => (
            <div key={s.num} className="text-center">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  step >= s.num ? 'bg-primary-500' : 'bg-navy-800'
                }`}
              />
              <span
                className={`text-[11px] font-medium block mt-2 hidden sm:block ${
                  step === s.num ? 'text-primary-300 font-bold' : 'text-navy-400'
                }`}
              >
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 sm:p-10">
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Select Service */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-navy-900">Step 1: Choose Your Service Category</h3>
              <p className="text-sm text-navy-500">
                Select the home maintenance or trade repair category you need assistance with.
              </p>
            </div>

            {loadingServices ? (
              <div className="py-12 text-center text-navy-500">Loading service catalog...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((svc) => (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, service_id: svc.id })}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-4 ${
                      formData.service_id === svc.id
                        ? 'border-primary-600 bg-primary-50/50 shadow-md ring-2 ring-primary-500/20'
                        : 'border-navy-100 bg-white hover:border-navy-300 hover:bg-navy-50/50'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        formData.service_id === svc.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-navy-100 text-navy-700'
                      }`}
                    >
                      <Wrench className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                          {svc.category}
                        </span>
                        <span className="text-sm font-bold text-navy-900">${svc.base_price}</span>
                      </div>
                      <h4 className="font-bold text-navy-900 text-sm mt-0.5">{svc.name}</h4>
                      <p className="text-xs text-navy-500 line-clamp-2 mt-1">{svc.short_description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Describe Problem */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-navy-900">Step 2: Describe the Issue</h3>
              <p className="text-sm text-navy-500">
                Detailed problem descriptions help our technician arrive prepared with the right spare parts and diagnostic equipment.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  Issue Summary / Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kitchen sink drain leaking under cabinet"
                  value={formData.problem_title}
                  onChange={(e) => setFormData({ ...formData, problem_title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  Detailed Problem Description *
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain when it started, any visible water damage, weird sounds, error codes on display, or attempted fixes..."
                  value={formData.problem_description}
                  onChange={(e) => setFormData({ ...formData, problem_description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-navy-900"
                />
              </div>

              {/* Problem Photos */}
              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  Problem Photos (Optional image URLs)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste image URL (e.g. https://...)"
                    value={tempPhotoUrl}
                    onChange={(e) => setTempPhotoUrl(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-4 py-2.5 bg-navy-800 text-white rounded-xl text-xs font-bold hover:bg-navy-900"
                  >
                    Add Photo
                  </button>
                </div>

                {formData.problem_images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.problem_images.map((img, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden border border-navy-200 w-20 h-20">
                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(i)}
                          className="absolute top-1 right-1 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Select Schedule */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-navy-900">Step 3: Preferred Schedule & Emergency Options</h3>
              <p className="text-sm text-navy-500">
                Choose when you want the technician to arrive at your premises.
              </p>
            </div>

            <div className="space-y-5">
              {/* Emergency Service Switch */}
              <div
                onClick={() => setFormData({ ...formData, is_emergency: !formData.is_emergency })}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  formData.is_emergency
                    ? 'border-amber-500 bg-amber-50/70 shadow-sm ring-2 ring-amber-400/30'
                    : 'border-navy-200 bg-white hover:bg-navy-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">Emergency Immediate Dispatch (+${selectedService?.emergency_fee || 25})</h4>
                    <p className="text-xs text-navy-500">
                      Request on-duty emergency technician dispatch within 45–60 minutes.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_emergency}
                  onChange={() => {}}
                  className="w-5 h-5 text-amber-500 rounded border-navy-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                    Service Date *
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.preferred_date}
                    onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                    Time Window *
                  </label>
                  <select
                    value={formData.preferred_time_slot}
                    onChange={(e) => setFormData({ ...formData, preferred_time_slot: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-navy-900"
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Location & Contact */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-navy-900">Step 4: Location & Contact Details</h3>
              <p className="text-sm text-navy-500">
                Where should the verified technician report for this service?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  Contact Full Name *
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  Contact Phone Number *
                </label>
                <input
                  type="text"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  Street Address & Apartment/Unit *
                </label>
                <input
                  type="text"
                  value={formData.service_address}
                  onChange={(e) => setFormData({ ...formData, service_address: e.target.value })}
                  placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  Area / Neighborhood *
                </label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="e.g. Springfield Greens"
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Downtown Metro"
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                  Special Entry / Parking Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={formData.special_instructions}
                  onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                  placeholder="e.g. Buzzer code 402, visitor parking bay available"
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Booking Summary & Rate Card */}
        {step === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-navy-900">Step 5: Review & Confirm Booking</h3>
              <p className="text-sm text-navy-500">
                Transparent pricing guarantee: You will not be billed until the repair is fully completed and inspected.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service & Problem Review */}
              <div className="bg-navy-50/70 p-5 rounded-2xl border border-navy-100 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-navy-200">
                  <span className="text-xs font-bold uppercase text-primary-600">Selected Service</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary-100 text-primary-800">
                    {selectedService?.category}
                  </span>
                </div>
                <h4 className="font-bold text-navy-900 text-base">{selectedService?.name}</h4>
                <div className="text-xs space-y-1.5 text-navy-600">
                  <p><strong>Issue:</strong> {formData.problem_title || 'N/A'}</p>
                  <p><strong>Description:</strong> {formData.problem_description || 'N/A'}</p>
                  <p><strong>Schedule:</strong> {formData.preferred_date} ({formData.preferred_time_slot})</p>
                  <p><strong>Location:</strong> {formData.service_address}, {formData.area}, {formData.city}</p>
                </div>
              </div>

              {/* Transparent Rate Card */}
              <div className="bg-white p-5 rounded-2xl border-2 border-primary-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-navy-100">
                  <h4 className="font-bold text-navy-900 text-sm">Transparent Rate Card</h4>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    No Hidden Fees
                  </span>
                </div>

                <div className="space-y-2 text-xs text-navy-600">
                  <div className="flex justify-between">
                    <span>Base Inspection & Diagnosis Fee</span>
                    <span className="font-bold text-navy-900">${basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standard Labor Charge ({selectedService?.estimated_duration || '1-2 hrs'})</span>
                    <span className="font-bold text-navy-900">${laborCharge.toFixed(2)}</span>
                  </div>
                  {formData.is_emergency && (
                    <div className="flex justify-between text-amber-700">
                      <span>Emergency Immediate Dispatch Surcharge</span>
                      <span className="font-bold">+${emergencyFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-navy-100 flex justify-between text-sm font-black text-navy-900">
                    <span>Estimated Total</span>
                    <span className="text-primary-600 text-base">${totalEstimatedCost.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-3 bg-primary-50 rounded-xl text-primary-900 text-[11px] leading-relaxed flex items-start gap-2 border border-primary-100">
                  <Shield className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                  <span>
                    Backed by FixMate 90-Day Satisfaction Warranty. Pay on site via cash or credit card only after the work is verified.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="mt-8 pt-6 border-t border-navy-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl border border-navy-200 text-navy-700 font-semibold text-sm hover:bg-navy-50 flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 2 && (!formData.problem_title || !formData.problem_description)) {
                  setErrorMsg('Please enter both problem title and description to proceed.');
                  return;
                }
                if (step === 4 && (!formData.customer_name || !formData.service_address || !formData.city)) {
                  setErrorMsg('Please provide your name, address, and city.');
                  return;
                }
                setErrorMsg('');
                setStep(step + 1);
              }}
              className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 flex items-center gap-2 transition shadow-md shadow-primary-600/20"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmitBooking}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-sm flex items-center gap-2 transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {submitting ? (
                <span>Registering Booking...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm & Dispatch Booking</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
