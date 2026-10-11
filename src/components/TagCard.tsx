'use client';

import React from 'react';
import { Tag as TagIcon, Copy, Download, RefreshCw, AlertCircle, Hash } from 'lucide-react';
import { TagItem } from '@/types';

interface TagCardProps {
  tags: TagItem[];
  sourceText: string;
  isLoading: boolean;
  numTag: number;
  onNumTagChange: (num: number) => void;
  onGenerateTags: () => void;
  onCopyAll: () => void;
  onDownloadTxt: () => void;
}

export function TagCard({
  tags,
  sourceText,
  isLoading,
  numTag,
  onNumTagChange,
  onGenerateTags,
  onCopyAll,
  onDownloadTxt,
}: TagCardProps) {
  const isCharTooLong = sourceText.length > 5000;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <TagIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">AI Tag Suggestion</h3>
            <p className="text-xs text-slate-500">วิเคราะห์คำสำคัญและจัดอันดับป้ายกำกับบทความ</p>
          </div>
        </div>

        {/* Tag count selector */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
          <span className="text-xs font-medium text-slate-600">จำนวนแท็ก:</span>
          <select
            value={numTag}
            onChange={(e) => onNumTagChange(Number(e.target.value))}
            className="text-xs font-semibold text-blue-700 bg-transparent outline-none cursor-pointer"
          >
            <option value={3}>3 แท็ก</option>
            <option value={5}>5 แท็ก (แนะนำ)</option>
            <option value={8}>8 แท็ก</option>
            <option value={10}>10 แท็ก</option>
          </select>
        </div>
      </div>

      {/* Constraints alert if needed */}
      {isCharTooLong && (
        <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            ข้อความมีความยาว {sourceText.length.toLocaleString()} ตัวอักษร (จำกัดไม่เกิน 5,000 ตัวอักษรสำหรับ Tag Suggestion)
          </span>
        </div>
      )}

      {/* Tags Display Area */}
      <div className="mt-4 flex-1">
        {isLoading ? (
          <div className="min-h-[120px] flex flex-col items-center justify-center p-6 bg-slate-50/70 border border-dashed border-slate-200 rounded-xl text-center">
            <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mb-2" />
            <p className="text-xs font-medium text-slate-700">กำลังวิเคราะห์และสกัดแท็กสำคัญ...</p>
            <p className="text-[11px] text-slate-400 mt-1">ส่งคำขอไปยัง AIForThai Tag Suggestion API</p>
          </div>
        ) : tags && tags.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {tags.map((item, index) => {
              const scorePercent = Math.round(item.score * 100);
              return (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 shadow-xs hover:border-blue-300 transition-all"
                >
                  <Hash className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-semibold text-slate-800">{item.tag}</span>
                  <span
                    className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-white text-blue-700 border border-blue-200/60 shadow-xs"
                    title={`ค่าน้ำหนักความสำคัญ (Score): ${item.score.toFixed(4)}`}
                  >
                    {scorePercent}%
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="min-h-[100px] flex flex-col items-center justify-center p-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl text-center text-slate-400">
            <p className="text-xs">ยังไม่มีแท็กที่แนะนำ</p>
            <p className="text-[11px] mt-1 text-slate-400">
              กดปุ่ม &quot;ดึงแท็กแนะนำ&quot; เพื่อเชื่อมต่อ AIForThai Tag Suggestion API
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onGenerateTags}
          disabled={isLoading || !sourceText.trim() || isCharTooLong}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <TagIcon className="w-3.5 h-3.5" />}
          <span>{isLoading ? 'กำลังวิเคราะห์...' : 'ดึงแท็กแนะนำ'}</span>
        </button>

        {tags && tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={onCopyAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="คัดลอกแท็กทั้งหมด"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>คัดลอกแท็ก</span>
            </button>

            <button
              onClick={onDownloadTxt}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="ดาวน์โหลดแท็กเป็น .txt"
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
