'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { ContentEditor } from '@/components/ContentEditor';
import { SummaryCard } from '@/components/SummaryCard';
import { TagCard } from '@/components/TagCard';
import { VoiceCard } from '@/components/VoiceCard';
import { TranslationCard } from '@/components/TranslationCard';
import { ExportPanel } from '@/components/ExportPanel';
import { ToastContainer } from '@/components/ToastContainer';
import { TagItem, ToastMessage } from '@/types';
import { countThaiWords } from '@/lib/thai-utils';

const STORAGE_KEY = 'thaivoice_content_draft';

export default function Home() {
  // --- Content State ---
  const [content, setContent] = useState<string>('');
  const [hasDraftSaved, setHasDraftSaved] = useState<boolean>(false);
  const [lastAnalyzedContent, setLastAnalyzedContent] = useState<string>('');

  // --- Summary State ---
  const [summary, setSummary] = useState<string>('');
  const [compRate, setCompRate] = useState<number>(30);
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);

  // --- Tag Suggestion State ---
  const [tags, setTags] = useState<TagItem[]>([]);
  const [numTag, setNumTag] = useState<number>(5);
  const [isLoadingTags, setIsLoadingTags] = useState<boolean>(false);

  // --- Voice Generator State ---
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('nana');
  const [voiceTextMode, setVoiceTextMode] = useState<'original' | 'summary'>('original');
  const [isLoadingVoice, setIsLoadingVoice] = useState<boolean>(false);

  // --- Toast Notifications ---
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // --- API Health ---
  const [apiStatus, setApiStatus] = useState<{
    configured: boolean;
    status: 'online' | 'offline' | 'degraded' | 'missing_key' | 'checking';
    message: string;
  }>({
    configured: true,
    status: 'checking',
    message: 'กำลังตรวจสอบการเชื่อมต่อกับ AIForThai API...',
  });

  // --- Helper: Toast Notification ---
  const showToast = useCallback(
    (type: ToastMessage['type'], title: string, message: string) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      setToasts((prev) => [...prev, { id, type, title, message }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Check API Health ---
  const checkHealth = useCallback(async () => {
    try {
      setApiStatus((prev) => ({ ...prev, status: 'checking' }));
      const res = await fetch('/api/health');
      const data = await res.json();
      setApiStatus({
        configured: data.configured,
        status: data.status,
        message: data.message,
      });
    } catch {
      setApiStatus({
        configured: false,
        status: 'offline',
        message: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ระบบได้',
      });
    }
  }, []);

  // --- Load Draft from LocalStorage on mount ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setContent(saved);
        setHasDraftSaved(true);
      }
    } catch {
      // LocalStorage error fallback
    }
    checkHealth();
  }, [checkHealth]);

  // --- Handle Draft Save ---
  const handleSaveDraft = () => {
    try {
      localStorage.setItem(STORAGE_KEY, content);
      setHasDraftSaved(true);
      showToast('success', 'บันทึกสำเร็จ', 'เนื้อหาถูกบันทึกลงในเบราว์เซอร์ (LocalStorage) เรียบร้อยแล้ว');
    } catch (e: any) {
      showToast('error', 'บันทึกล้มเหลว', 'ไม่สามารถบันทึกลงใน LocalStorage ได้: ' + e.message);
    }
  };

  // --- Handle Content Change ---
  const handleContentChange = (val: string) => {
    setContent(val);
    setHasDraftSaved(false);
  };

  // --- Clear Content ---
  const handleClearContent = () => {
    setContent('');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setHasDraftSaved(false);
    showToast('info', 'ล้างข้อความแล้ว', 'เนื้อหาใน Editor ถูกล้างเรียบร้อย');
  };

  // --- Copy Text Utility ---
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('success', 'คัดลอกสำเร็จ', `คัดลอก${label}ไปยังคลิปบอร์ดแล้ว`);
    } catch {
      showToast('error', 'คัดลอกไม่สำเร็จ', 'เบราว์เซอร์ไม่อนุญาตให้เข้าถึงคลิปบอร์ด');
    }
  };

  // --- File Download Utility ---
  const downloadTextFile = (filename: string, text: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('success', 'ดาวน์โหลดสำเร็จ', `ดาวน์โหลดไฟล์ ${filename} เรียบร้อยแล้ว`);
  };

  // --- Trigger: AI Summarization ---
  const handleSummarize = async () => {
    const { count: wordCount } = countThaiWords(content);
    if (!content.trim()) {
      showToast('warning', 'ไม่มีข้อความ', 'กรุณาระบุข้อความภาษาไทยก่อนทำการสรุป');
      return;
    }
    if (wordCount < 400 || wordCount > 1000) {
      showToast(
        'warning',
        'เงื่อนไขจำนวนคำ',
        `AIForThai Text Summarize แนะนำความยาวระหว่าง 400 - 1,000 คำ (ปัจจุบันมี ${wordCount} คำ) แต่ระบบกำลังพยายามส่งให้ API ประมวลผล...`
      );
    }

    setIsLoadingSummary(true);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, comp_rate: compRate }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการประมวลผลสรุป');
      }

      setSummary(data.summary);
      setLastAnalyzedContent(content);
      showToast('success', 'สรุปเนื้อหาสำเร็จ', 'AIForThai สรุปความเรียบร้อยแล้ว');
    } catch (err: any) {
      showToast('error', 'สรุปเนื้อหาล้มเหลว', err.message || 'ไม่สามารถติดต่อ API ได้');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  // --- Trigger: AI Tag Suggestion ---
  const handleSuggestTags = async () => {
    if (!content.trim()) {
      showToast('warning', 'ไม่มีข้อความ', 'กรุณาระบุข้อความภาษาไทยก่อนเริ่มวิเคราะห์แท็ก');
      return;
    }
    if (content.length > 5000) {
      showToast('error', 'ข้อความยาวเกิน', 'Tag Suggestion API จำกัดความยาวไม่เกิน 5,000 ตัวอักษร');
      return;
    }

    setIsLoadingTags(true);
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, numtag: numTag }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการดึงแท็ก');
      }

      setTags(data.tags || []);
      setLastAnalyzedContent(content);
      showToast('success', 'แนะนำแท็กสำเร็จ', `พบ ${data.tags?.length || 0} แท็กที่เหมาะสมกับเนื้อหา`);
    } catch (err: any) {
      showToast('error', 'วิเคราะห์แท็กล้มเหลว', err.message || 'ไม่สามารถติดต่อ API ได้');
    } finally {
      setIsLoadingTags(false);
    }
  };

  // --- Trigger: AI Voice Generator ---
  const handleGenerateVoice = async (textToSpeak: string) => {
    const trimmed = textToSpeak.trim();
    if (!trimmed) {
      showToast('warning', 'ไม่มีข้อความ', 'กรุณาระบุข้อความภาษาไทยเพื่อสร้างเสียงพูด');
      return;
    }
    if (trimmed.length > 400) {
      showToast(
        'error',
        'ข้อความยาวเกินกำหนด',
        `VAJA TTS API จำกัดข้อความไม่เกิน 400 ตัวอักษร (ปัจจุบันมี ${trimmed.length} ตัวอักษร)`
      );
      return;
    }

    setIsLoadingVoice(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed, speaker: selectedSpeaker }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการสร้างเสียงพูด');
      }

      // Add timestamp to prevent browser audio caching
      const audioProxyWithTimestamp = `${data.audioUrl}&t=${Date.now()}`;
      setAudioUrl(audioProxyWithTimestamp);
      showToast('success', 'สังเคราะห์เสียงสำเร็จ', 'ได้รับไฟล์เสียงจริงจาก VAJA API เรียบร้อยแล้ว');
    } catch (err: any) {
      showToast('error', 'สร้างเสียงพูดล้มเหลว', err.message || 'ไม่สามารถติดต่อ API ได้');
    } finally {
      setIsLoadingVoice(false);
    }
  };

  // --- Action: Download Audio File ---
  const handleDownloadAudio = () => {
    if (!audioUrl) return;
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `thaivoice_${selectedSpeaker}_${Date.now()}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'ดาวน์โหลดเสียง', 'เริ่มดาวน์โหลดไฟล์เสียง WAV แล้ว');
  };

  // Check if content was modified after the last analysis
  const isDirtySinceAnalysis =
    Boolean(lastAnalyzedContent) &&
    Boolean(content) &&
    content.trim() !== lastAnalyzedContent.trim() &&
    (Boolean(summary) || tags.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar apiStatus={apiStatus} onRefreshHealth={checkHealth} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Hero Description */}
        <section className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ThaiVoice Studio
            </h1>
            <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed">
              แพลตฟอร์มจัดการบทความภาษาไทยแบบครบวงจร ขับเคลื่อนด้วยปัญญาประดิษฐ์จาก{' '}
              <span className="font-semibold text-white underline decoration-indigo-300">AIForThai</span>{' '}
              เชื่อมต่อ API สรุปความอัตโนมัติ (Text Summarization), แนะนำแท็ก (Tag Suggestion), และสังเคราะห์เสียงพูดภาษาไทย (VAJA TTS)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="block text-[11px] text-indigo-200">Text Summarize</span>
              <span className="text-xs font-bold text-white">400 - 1,000 คำ</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="block text-[11px] text-indigo-200">Tag Suggestion</span>
              <span className="text-xs font-bold text-white">สูงสุด 5,000 ตัวอักษร</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="block text-[11px] text-indigo-200">VAJA TTS</span>
              <span className="text-xs font-bold text-white">สูงสุด 400 ตัวอักษร</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="block text-[11px] text-indigo-200">Xiaofan Translation</span>
              <span className="text-xs font-bold text-white">แปล EN ➔ TH</span>
            </div>
          </div>
        </section>

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Big Content Editor (5 cols) */}
          <div className="lg:col-span-5 h-[620px] lg:sticky lg:top-20">
            <ContentEditor
              content={content}
              onChange={handleContentChange}
              onSaveDraft={handleSaveDraft}
              onClear={handleClearContent}
              onCopy={() => copyToClipboard(content, 'ข้อความต้นฉบับ')}
              onDownloadTxt={() => downloadTextFile('article_original.txt', content)}
              onAnalyzeSummary={handleSummarize}
              onAnalyzeTags={handleSuggestTags}
              onGenerateVoice={() => {
                setVoiceTextMode('original');
                handleGenerateVoice(content);
              }}
              isLoadingSummary={isLoadingSummary}
              isLoadingTags={isLoadingTags}
              isLoadingVoice={isLoadingVoice}
              isDirtySinceAnalysis={isDirtySinceAnalysis}
              hasDraftSaved={hasDraftSaved}
            />
          </div>

          {/* Right Column: AI Services (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Summary Card */}
            <SummaryCard
              summary={summary}
              sourceText={content}
              isLoading={isLoadingSummary}
              compRate={compRate}
              onCompRateChange={setCompRate}
              onSummarize={handleSummarize}
              onCopy={() => copyToClipboard(summary, 'ข้อความสรุป')}
              onDownloadTxt={() => downloadTextFile('article_summary.txt', summary)}
              onSendToVoice={() => {
                setVoiceTextMode('summary');
                handleGenerateVoice(summary);
              }}
            />

            {/* 2. Tag Suggestion Card */}
            <TagCard
              tags={tags}
              sourceText={content}
              isLoading={isLoadingTags}
              numTag={numTag}
              onNumTagChange={setNumTag}
              onGenerateTags={handleSuggestTags}
              onCopyAll={() => {
                const tagList = tags.map((t) => t.tag).join(', ');
                copyToClipboard(tagList, 'แท็กทั้งหมด');
              }}
              onDownloadTxt={() => {
                const content = tags.map((t) => `${t.tag} (คะแนน: ${t.score})`).join('\n');
                downloadTextFile('suggested_tags.txt', content);
              }}
            />

            {/* 3. AI Voice Generator (VAJA) */}
            <VoiceCard
              sourceText={content}
              summaryText={summary}
              audioUrl={audioUrl}
              isLoading={isLoadingVoice}
              selectedSpeaker={selectedSpeaker}
              onSpeakerChange={setSelectedSpeaker}
              textMode={voiceTextMode}
              onTextModeChange={setVoiceTextMode}
              onGenerateVoice={handleGenerateVoice}
              onDownloadWav={handleDownloadAudio}
            />

            {/* 4. English to Thai Machine Translation (Xiaofan) */}
            <TranslationCard
              onInsertToEditor={(translated) => {
                setContent((prev) => (prev ? `${prev}\n\n${translated}` : translated));
              }}
              showToast={showToast}
            />
          </div>
        </div>

        {/* Export Content Hub Section */}
        <section className="pt-2">
          <ExportPanel
            hasOriginal={Boolean(content.trim())}
            hasSummary={Boolean(summary.trim())}
            hasTags={tags.length > 0}
            hasAudio={Boolean(audioUrl)}
            tagsCount={tags.length}
            onDownloadOriginal={() => downloadTextFile('article_original.txt', content)}
            onDownloadSummary={() => downloadTextFile('article_summary.txt', summary)}
            onDownloadTags={() => {
              const textContent = tags.map((t) => `${t.tag} (score: ${t.score})`).join('\n');
              downloadTextFile('suggested_tags.txt', textContent);
            }}
            onDownloadAudio={handleDownloadAudio}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p className="max-w-7xl mx-auto px-4">
          ThaiVoice Studio &bull; Mini Project AI สำหรับนักศึกษามหาวิทยาลัย &bull; เชื่อมต่อระบบปัญญาประดิษฐ์ AIForThai (NECTEC/NSTDA)
        </p>
      </footer>

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
