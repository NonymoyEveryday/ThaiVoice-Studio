'use client';

import React, { useState } from 'react';
import { Languages, ArrowRight, Copy, ArrowDownToLine, RefreshCw, Sparkles, Check } from 'lucide-react';

interface TranslationCardProps {
  onInsertToEditor: (translatedText: string) => void;
  showToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

export function TranslationCard({ onInsertToEditor, showToast }: TranslationCardProps) {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const sampleEnglish = "Artificial intelligence is transforming modern technology and digital communication worldwide.";

  const handleTranslate = async () => {
    const textToTranslate = inputText.trim();
    if (!textToTranslate) {
      showToast('warning', 'ไม่มีข้อความ', 'กรุณาระบุข้อความภาษาอังกฤษที่ต้องการแปล');
      return;
    }

    if (textToTranslate.length > 1000) {
      showToast('error', 'ข้อความยาวเกิน', 'ความยาวข้อความต้องไม่เกิน 1,000 ตัวอักษร');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToTranslate }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการแปลภาษา');
      }

      setTranslatedText(data.translated_text);
      showToast('success', 'แปลภาษาสำเร็จ', 'แปลภาษาอังกฤษเป็นไทยด้วย Xiaofan AI เรียบร้อยแล้ว');
    } catch (err: any) {
      showToast('error', 'แปลภาษาไม่สำเร็จ', err.message || 'ไม่สามารถติดต่อ API แปลภาษาได้');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      showToast('success', 'คัดลอกสำเร็จ', 'คัดลอกคำแปลภาษาไทยแล้ว');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('error', 'คัดลอกไม่สำเร็จ', 'ไม่สามารถเข้าถึงคลิปบอร์ดได้');
    }
  };

  const handleInsert = () => {
    if (!translatedText) return;
    onInsertToEditor(translatedText);
    showToast('success', 'ส่งเข้า Editor แล้ว', 'นำข้อความภาษาไทยเข้าสู่ Content Editor เพื่อวิเคราะห์ต่อเรียบร้อย');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">English to Thai Translation (Xiaofan)</h3>
            <p className="text-xs text-slate-500">แปลภาษาอังกฤษเป็นไทยด้วย Neural Machine Translation</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <button
            onClick={() => setInputText(sampleEnglish)}
            className="text-xs px-2.5 py-1 rounded-md bg-slate-50 hover:bg-violet-50 hover:text-violet-600 text-slate-600 border border-slate-200/80 transition-colors"
          >
            ใส่ตัวอย่างอังกฤษ
          </button>
        </div>
      </div>

      {/* Input / Output Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* English Input */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
            <span>ภาษาอังกฤษ (English Input):</span>
            <span className={inputText.length > 1000 ? 'text-rose-600 font-semibold' : ''}>
              {inputText.length} / 1,000 ตัวอักษร
            </span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter English text to translate..."
            className="w-full h-28 p-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none text-slate-800 text-xs sm:text-sm resize-none"
          />
        </div>

        {/* Thai Output */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
            <span>ผลการแปล (ภาษาไทย):</span>
            {translatedText && (
              <span className="text-emerald-600 font-semibold text-[11px]">แปลเรียบร้อย</span>
            )}
          </div>
          <div className="w-full h-28 p-3 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-800 text-xs sm:text-sm overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {isLoading ? (
              <div className="h-full flex items-center justify-center gap-2 text-violet-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-xs font-medium">กำลังแปลภาษาด้วย Xiaofan...</span>
              </div>
            ) : translatedText ? (
              translatedText
            ) : (
              <span className="text-slate-400 italic">ผลการแปลภาษาไทยจะแสดงที่นี่...</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={handleTranslate}
          disabled={isLoading || !inputText.trim() || inputText.length > 1000}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>{isLoading ? 'กำลังแปล...' : 'แปลเป็นภาษาไทย'}</span>
        </button>

        {translatedText && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleInsert}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
              title="ส่งคำแปลนี้ไปใส่ใน Content Editor ฝั่งซ้ายทันที"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>ส่งเข้า Editor เพื่อวิเคราะห์ต่อ</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="คัดลอกคำแปล"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
