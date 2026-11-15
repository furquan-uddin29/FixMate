'use client';

import React, { useState } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-50/40">
      <Navbar />

      <section className="bg-navy-950 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs font-bold text-primary-400 uppercase tracking-widest block">
            We Are Here To Help
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Contact FixMate Support
          </h1>
          <p className="text-sm text-navy-300 max-w-xl mx-auto">
            Have questions about booking, warranty claims, or technician partnerships? Reach out to our 24/7 support desk.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h3 className="text-2xl font-black text-navy-900 tracking-tight">Get in Touch</h3>
              <p className="text-xs text-navy-500 mt-2 leading-relaxed">
                Our support team and dispatcher coordinators are available around the clock to assist you.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-navy-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy-400">Emergency Helpline</h4>
                  <p className="text-sm font-bold text-navy-900 mt-0.5">+1 (800) 349-MATE (6283)</p>
                  <p className="text-[11px] text-navy-500">Toll-free 24/7 priority line</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-navy-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy-400">Email Inquiries</h4>
                  <p className="text-sm font-bold text-navy-900 mt-0.5">support@fixmate.app</p>
                  <p className="text-[11px] text-navy-500">Response within 2 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-navy-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy-400">Headquarters</h4>
                  <p className="text-sm font-bold text-navy-900 mt-0.5">FixMate Technologies Ltd.</p>
                  <p className="text-[11px] text-navy-500">Metro City Central Station Hub, Level 14</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-navy-100 shadow-md">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-navy-900">Message Received!</h3>
                <p className="text-xs text-navy-600 max-w-md mx-auto">
                  Thank you for reaching out to FixMate. A representative from our service desk has been notified and will respond via email shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-navy-900">Send an Inquiry</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                      Your Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Warranty claim for booking BK-1001"
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
                    Message Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your question or request..."
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
