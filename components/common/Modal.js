'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl border border-navy-100 overflow-hidden transform transition-all animate-scaleUp`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-100 bg-navy-50/50">
          <h3 className="text-lg font-bold text-navy-900 tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-navy-400 hover:text-navy-700 hover:bg-navy-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[85vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
