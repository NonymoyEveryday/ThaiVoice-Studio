'use client';

import React, { useRef, useState } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Download,
  RefreshCw,
  AlertCircle,
  User,
  Radio,
  FileText,
  FileCheck,
} from 'lucide-react';
import { VAJA_SPEAKERS } from '@/lib/thai-utils';

interface VoiceCardProps {
  sourceText: string;
  summaryText: string;
  audioUrl: string | null;
  isLoading: boolean;
  selectedSpeaker: string;
  onSpeakerChange: (speaker: string) => void;
  textMode: 'original' | 'summary';
  onTextModeChange: (mode: 'original' | 'summary') => void;
  onGenerateVoice: (textToSpeak: string) => void;
  onDownloadWav: () => void;
}

export function VoiceCard({
  sourceText,
  summaryText,
  audioUrl,
  isLoading,
  selectedSpeaker,
  onSpeakerChange,
  textMode,
  onTextModeChange,
  onGenerateVoice,
  onDownloadWav,
}: VoiceCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeText = textMode === 'original' ? sourceText : summaryText;
  const charLength = activeText.length;
  const isTooLong = charLength > 400;

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTrigger = () => {
    onGenerateVoice(activeText);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">AI Voice Generator (VAJA)</h3>
            <p className="text-xs text-slate-500">แปลงข้อความเป็นเสียงพูดภาษาไทยธรรมชาติ</p>
          </div>
        </div>

        {/* Text Source Toggle */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => onTextModeChange('original')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              textMode === 'original'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>ข้อความต้นฉบับ</span>
          </button>
          <button
            onClick={() => onTextModeChange('summary')}
            disabled={!summaryText.trim()}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              textMode === 'summary'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>ข้อความสรุป</span>
          </button>
        </div>
      </div>

      {/* Speaker and Length Controls */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>เลือกเสียงผู้พูด (Speaker):</span>
          </label>
          <select
            value={selectedSpeaker}
            onChange={(e) => onSpeakerChange(e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-indigo-500"
          >
            {VAJA_SPEAKERS.map((spk) => (
              <option key={spk.id} value={spk.id}>
                {spk.name} - {spk.category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-slate-400" />
            <span>ความยาวข้อความที่เลือกอ่าน:</span>
          </label>
          <div className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              โหมด: {textMode === 'original' ? 'ต้นฉบับ' : 'ผลสรุป'}
            </span>
            <span
              className={`font-semibold ${
                isTooLong ? 'text-rose-600' : 'text-slate-800'
              }`}
            >
              {charLength} / 400 ตัวอักษร
            </span>
          </div>
        </div>
      </div>

      {/* Constraints Warning */}
      {isTooLong && (
        <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            ข้อความยาว {charLength} ตัวอักษร เกินขีดจำกัด 400 ตัวอักษรของ VAJA API กรุณาย่อข้อความหรือเลือกใช้ข้อความสรุป
          </span>
        </div>
      )}

      {/* Audio Player Area */}
      <div className="mt-4 flex-1">
        {isLoading ? (
          <div className="min-h-[120px] flex flex-col items-center justify-center p-6 bg-slate-50/70 border border-dashed border-slate-200 rounded-xl text-center">
            <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mb-2" />
            <p className="text-xs font-medium text-slate-700">กำลังสังเคราะห์เสียงด้วย VAJA Text-to-Speech...</p>
            <p className="text-[11px] text-slate-400 mt-1">รับสตรีมไฟล์เสียง .wav คุณภาพสูงจาก AIForThai</p>
          </div>
        ) : audioUrl ? (
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayPause}
                  className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 transition-transform active:scale-95"
                  aria-label={isPlaying ? 'หยุดเล่น' : 'เล่นเสียง'}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">เสียงพูดถูกสังเคราะห์แล้ว</h4>
                  <p className="text-[11px] text-slate-500">รูปแบบ WAV Audio Stream (VAJA STU)</p>
                </div>
              </div>

              <button
                onClick={onDownloadWav}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลด WAV</span>
              </button>
            </div>

            {/* Native browser audio element controller */}
            <audio
              ref={audioRef}
              src={audioUrl}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              controls
              className="w-full h-8 mt-1"
            />
          </div>
        ) : (
          <div className="min-h-[100px] flex flex-col items-center justify-center p-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl text-center text-slate-400">
            <p className="text-xs">ยังไม่มีไฟล์เสียงที่สร้าง</p>
            <p className="text-[11px] mt-1 text-slate-400">
              กดปุ่ม &quot;สังเคราะห์เสียงพูด&quot; เพื่อสร้างไฟล์เสียงจากข้อความ (ไม่เกิน 400 ตัวอักษร)
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={handleTrigger}
          disabled={isLoading || !activeText.trim() || isTooLong}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span>{isLoading ? 'กำลังประมวลผลเสียง...' : 'สังเคราะห์เสียงพูด (TTS)'}</span>
        </button>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          * ระบบสตรีมเสียงจริงจาก API ไม่ใช่ Speech Synthesis ของบราวเซอร์
        </span>
      </div>
    </div>
  );
}
