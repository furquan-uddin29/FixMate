'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  ShieldCheck,
  Award,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Plus,
} from 'lucide-react';

export default function TechnicianProfilePage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.full_name || 'David Miller',
    email: user?.email || 'david.miller@fixmate.test',
    phone: user?.phone || '+1 (555) 234-5678',
    serviceCategories: 'Plumbing',
    experienceYears: 8,
    address: '428 Oak Avenue, Suite 3, Downtown Metro',
    skills: 'Leak Detection, Pipe Soldering, Drain Snaking, Water Heater Repair',
    idDocumentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    certificateUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80',
    verificationStatus: 'verified',
    verificationRemarks: 'Master Plumber License #PL-9482 verified with state trade board.',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          Technician Profile & Verification
        </h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Maintain your trade credentials, verified skills, and background screening documents.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved and synced with administrative audit log.</span>
        </div>
      )}

      {/* Verification Status Card */}
      <div className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-navy-900 text-base">Verification Status: Verified</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Active Tier 1
              </span>
            </div>
            <p className="text-xs text-navy-500 mt-0.5">{formData.verificationRemarks}</p>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-center">
          Eligible for Job Dispatch
        </span>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-navy-100 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-navy-100">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80'}
            alt="Technician"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
          />
          <div>
            <h4 className="font-bold text-navy-900 text-base">{formData.fullName}</h4>
            <p className="text-xs text-navy-500">{formData.email}</p>
            <p className="text-xs text-amber-600 font-bold mt-0.5">Rating: 4.95 / 5.0 (142 Jobs)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
              Full Legal Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
              Primary Trade Category
            </label>
            <input
              type="text"
              value={formData.serviceCategories}
              onChange={(e) => setFormData({ ...formData, serviceCategories: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
              Years of Field Experience
            </label>
            <input
              type="number"
              value={formData.experienceYears}
              onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
              Operating Address / Workshop
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
              Verified Technical Skills (Comma separated)
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
            />
          </div>
        </div>

        {/* Uploaded Documents */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-2">
            Verification Documents Submitted to Admin
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <a
              href={formData.idDocumentUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl border border-navy-200 hover:border-primary-500 hover:bg-primary-50/40 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-600" />
                <span className="font-bold text-navy-900">National Government ID</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-navy-400" />
            </a>

            <a
              href={formData.certificateUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl border border-navy-200 hover:border-primary-500 hover:bg-primary-50/40 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-navy-900">Master Trade License #PL-9482</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-navy-400" />
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-navy-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Update Profile Information
          </button>
        </div>
      </form>
    </div>
  );
}
