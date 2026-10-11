'use client';

import React from 'react';
import { Sparkles, Activity, ShieldCheck, ExternalLink } from 'lucide-react';

interface NavbarProps {
  apiStatus: {
    configured: boolean;
    status: 'online' | 'offline' | 'degraded' | 'missing_key' | 'checking';
    message: string;
  };
  onRefreshHealth: () => void;
}

export function Navbar({ apiStatus, onRefreshHealth }: NavbarProps) {
  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (apiStatus.status === 'online') {
    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500 animate-pulse';
  } else if (apiStatus.status === 'degraded' || apiStatus.status === 'missing_key') {
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (apiStatus.status === 'offline') {
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
    dotColor = 'bg-rose-500';
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">ThaiVoice Studio</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              ระบบจัดการบทความภาษาไทย สรุปเนื้อหา แนะนำแท็ก และแปลงข้อความเป็นเสียงพูด
            </p>
          </div>
        </div>

        {/* Status & Links */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRefreshHealth}
            title={apiStatus.message}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${badgeColor}`}
          >
            <span className={`w-2 h-2 rounded-full ${dotColor}`} />
            <span className="hidden md:inline">AIForThai API:</span>
            <span>
              {apiStatus.status === 'checking'
                ? 'ตรวจสอบ...'
                : apiStatus.status === 'online'
                ? 'พร้อมใช้งาน'
                : apiStatus.status === 'missing_key'
                ? 'ยังไม่ตั้งค่า Key'
                : 'ไม่สามารถติดต่อได้'}
            </span>
          </button>

          <a
            href="https://aiforthai.in.th"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span>AIForThai</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
