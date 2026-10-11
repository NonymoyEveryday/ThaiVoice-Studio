'use client';

import React from 'react';
import { Sparkles, Copy, Download, Volume2, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { countThaiWords } from '@/lib/thai-utils';

interface SummaryCardProps {
  summary: string;
  sourceText: string;
  isLoading: boolean;
  compRate: number;
  onCompRateChange: (rate: number) => void;
  onSummarize: () => void;
  onCopy: () => void;
  onDownloadTxt: () => void;
  onSendToVoice: () => void;
}

export function SummaryCard({
  summary,
  sourceText,
  isLoading,
  compRate,
  onCompRateChange,
  onSummarize,
  onCopy,
  onDownloadTxt,
  onSendToVoice,
}: SummaryCardProps) {
  const { count: wordCount } = countThaiWords(sourceText);
  const isWordCountValid = wordCount >= 400 && wordCount <= 1000;
  const isTooShort = wordCount < 400;
  const isTooLong = wordCount > 1000;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">AI Text Summarizer</h3>
            <p className="text-xs text-slate-500">
              สรุปความเนื้อหาภาษาไทยด้วย Deep Learning (GRU)
            </p>
          </div>
        </div>

        {/* Compression rate selector */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
          <span className="text-xs font-medium text-slate-600">ระดับการสรุป:</span>
          <select
            value={compRate}
            onChange={(e) => onCompRateChange(Number(e.target.value))}
            className="text-xs font-semibold text-indigo-700 bg-transparent outline-none cursor-pointer"
          >
            <option value={20}>20% (กระชับมาก)</option>
            <option value={30}>30% (มาตรฐาน)</option>
            <option value={40}>40% (ละเอียดขึ้น)</option>
          </select>
        </div>
      </div>

      {/* Guidelines and conditions notice */}
      <div className="mt-3 space-y-2">
        <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
          <Layers className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>
              <strong className="text-slate-800">เงื่อนไข API:</strong> รองรับข้อความขนาด{' '}
              <span className="font-semibold text-indigo-600">400 – 1,000 คำ</span>{' '}
              (ปัจจุบัน: <span className="font-semibold">{wordCount} คำ</span>)
            </p>
            <p className="text-[11px] text-slate-500">
              * โมเดลได้รับการฝึกฝนเฉพาะทางด้านข่าวเศรษฐกิจ การสรุปเนื้อหาทั่วไปหรือนิยายอาจมีความคลาดเคลื่อน
            </p>
          </div>
        </div>

        {sourceText.trim() && !isWordCountValid && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {isTooShort
                ? `ข้อความสั้นเกินไป (${wordCount} คำ) ต้องการอย่างน้อย 400 คำ เพื่อผลลัพธ์ที่ถูกต้องจากโมเดล`
                : `ข้อความยาวเกินไป (${wordCount} คำ) สูงสุดไม่เกิน 1,000 คำ`}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="mt-4 flex-1">
        {isLoading ? (
          <div className="min-h-[140px] flex flex-col items-center justify-center p-6 bg-slate-50/70 border border-dashed border-slate-200 rounded-xl text-center">
            <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mb-2" />
            <p className="text-xs font-medium text-slate-700">กำลังประมวลผลสรุปเนื้อหาด้วย AIForThai...</p>
            <p className="text-[11px] text-slate-400 mt-1">อาจใช้เวลาประมาณ 3–8 วินาที</p>
          </div>
        ) : summary ? (
          <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-100 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap selection:bg-indigo-200">
            {summary}
          </div>
        ) : (
          <div className="min-h-[120px] flex flex-col items-center justify-center p-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl text-center text-slate-400">
            <p className="text-xs">ยังไม่มีผลลัพธ์การสรุปเนื้อหา</p>
            <p className="text-[11px] mt-1 text-slate-400">
              กดปุ่ม &quot;เริ่มสรุปเนื้อหา&quot; เพื่อเชื่อมต่อ AIForThai Text Summarize API
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onSummarize}
          disabled={isLoading || !sourceText.trim()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>{isLoading ? 'กำลังประมวลผล...' : 'เริ่มสรุปเนื้อหา'}</span>
        </button>

        {summary && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={onSendToVoice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              title="ส่งผลสรุปนี้ไปให้ระบบสร้างเสียงพูด VAJA"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>ส่งไปอ่านเสียง</span>
            </button>

            <button
              onClick={onCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="คัดลอกข้อความสรุป"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>คัดลอก</span>
            </button>

            <button
              onClick={onDownloadTxt}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="ดาวน์โหลดสรุปเป็น .txt"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>ดาวน์โหลด</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
