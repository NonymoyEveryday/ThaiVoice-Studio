'use client';

import React from 'react';
import { Download, FileText, Sparkles, Hash, Music, CheckCircle2 } from 'lucide-react';
import { TagItem } from '@/types';

interface ExportPanelProps {
  hasOriginal: boolean;
  hasSummary: boolean;
  hasTags: boolean;
  hasAudio: boolean;
  tagsCount: number;
  onDownloadOriginal: () => void;
  onDownloadSummary: () => void;
  onDownloadTags: () => void;
  onDownloadAudio: () => void;
}

export function ExportPanel({
  hasOriginal,
  hasSummary,
  hasTags,
  hasAudio,
  tagsCount,
  onDownloadOriginal,
  onDownloadSummary,
  onDownloadTags,
  onDownloadAudio,
}: ExportPanelProps) {
  const anyAvailable = hasOriginal || hasSummary || hasTags || hasAudio;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Export Content Hub</h3>
            <p className="text-xs text-slate-500">ดาวน์โหลดผลลัพธ์แยกตามประเภทไฟล์ (.txt, .wav)</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Original Text Download */}
        <button
          onClick={onDownloadOriginal}
          disabled={!hasOriginal}
          className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
            hasOriginal
              ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 cursor-pointer shadow-xs'
              : 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold">ข้อความต้นฉบับ</p>
              <p className="text-[10px] text-slate-500">original_content.txt</p>
            </div>
          </div>
          {hasOriginal && <Download className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Summary Text Download */}
        <button
          onClick={onDownloadSummary}
          disabled={!hasSummary}
          className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
            hasSummary
              ? 'bg-indigo-50/50 hover:bg-indigo-50 border-indigo-200 text-indigo-900 cursor-pointer shadow-xs'
              : 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white border border-indigo-200 text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold">ข้อความสรุป</p>
              <p className="text-[10px] text-indigo-600/70">summary_result.txt</p>
            </div>
          </div>
          {hasSummary && <Download className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Tags Download */}
        <button
          onClick={onDownloadTags}
          disabled={!hasTags}
          className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
            hasTags
              ? 'bg-blue-50/50 hover:bg-blue-50 border-blue-200 text-blue-900 cursor-pointer shadow-xs'
              : 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white border border-blue-200 text-blue-600">
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold">รายการแท็ก ({tagsCount})</p>
              <p className="text-[10px] text-blue-600/70">suggested_tags.txt</p>
            </div>
          </div>
          {hasTags && <Download className="w-4 h-4 text-blue-600" />}
        </button>

        {/* Audio Download */}
        <button
          onClick={onDownloadAudio}
          disabled={!hasAudio}
          className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
            hasAudio
              ? 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200 text-emerald-900 cursor-pointer shadow-xs'
              : 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white border border-emerald-200 text-emerald-600">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold">ไฟล์เสียงพูด (WAV)</p>
              <p className="text-[10px] text-emerald-600/70">thaivoice_audio.wav</p>
            </div>
          </div>
          {hasAudio && <Download className="w-4 h-4 text-emerald-600" />}
        </button>
      </div>

      {!anyAvailable && (
        <p className="text-center text-xs text-slate-400 mt-3">
          * ปุ่มดาวน์โหลดจะปลดล็อกอัตโนมัติเมื่อมีผลลัพธ์ที่สร้างจริงจากระบบ
        </p>
      )}
    </div>
  );
}
