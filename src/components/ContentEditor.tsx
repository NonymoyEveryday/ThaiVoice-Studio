'use client';

import React from 'react';
import {
  FileText,
  Copy,
  Trash2,
  Save,
  Download,
  Info,
  Sparkles,
  Tag,
  Volume2,
  RotateCcw,
} from 'lucide-react';
import { countCharacters, countThaiWords } from '@/lib/thai-utils';

interface ContentEditorProps {
  content: string;
  onChange: (value: string) => void;
  onSaveDraft: () => void;
  onClear: () => void;
  onCopy: () => void;
  onDownloadTxt: () => void;
  onAnalyzeSummary: () => void;
  onAnalyzeTags: () => void;
  onGenerateVoice: () => void;
  isLoadingSummary: boolean;
  isLoadingTags: boolean;
  isLoadingVoice: boolean;
  isDirtySinceAnalysis: boolean;
  hasDraftSaved: boolean;
}

export function ContentEditor({
  content,
  onChange,
  onSaveDraft,
  onClear,
  onCopy,
  onDownloadTxt,
  onAnalyzeSummary,
  onAnalyzeTags,
  onGenerateVoice,
  isLoadingSummary,
  isLoadingTags,
  isLoadingVoice,
  isDirtySinceAnalysis,
  hasDraftSaved,
}: ContentEditorProps) {
  const charCount = countCharacters(content);
  const { count: wordCount, method: wordMethod } = countThaiWords(content);

  const sampleArticles = [
    {
      title: 'เศรษฐกิจและการเกษตร (สำหรับทดสอบ Summarize)',
      text: `ข้าวเป็นเมล็ดของพืชหญ้า Oryza sativa ที่พบมากในทวีปเอเชีย ข้าวเป็นธัญพืชซึ่งประชากรโลกบริโภคเป็นอาหารสำคัญ โดยเฉพาะอย่างยิ่งในทวีปเอเชีย จากข้อมูลเมื่อปี 2553 ข้าวเป็นธัญพืชซึ่งมีการปลูกมากที่สุดเป็นอันดับสามทั่วโลก รองจากข้าวสาลีและข้าวโพด ข้าวเป็นธัญพืชสำคัญที่สุดในด้านโภชนาการและการได้รับแคลอรีของมนุษย์ เพราะข้าวโพดส่วนใหญ่ปลูกเพื่อจุดประสงค์อื่น มิใช่ให้มนุษย์บริโภค ทั้งนี้ ข้าวคิดเป็นพลังงานกว่าหนึ่งในห้าที่มนุษย์ทั่วโลกบริโภค หลักฐานพันธุศาสตร์แสดงว่าข้าวมาจากการนำมาปลูกเมื่อราว 8,200–13,500 ปีก่อน ในภูมิภาคหุบแม่น้ำจูเจียงของจีน ก่อนหน้านี้ หลักฐานโบราณคดีเสนอว่า ข้าวมีการนำมาปลูกในเขตหุบแม่น้ำแยงซีในจีน ข้าวแพร่กระจายจากเอเชียตะวันออกไปยังเอเชียตะวันออกเฉียงใต้และเอเชียใต้ ข้าวถูกนำมายังทวีปยุโรปผ่านเอเชียตะวันตก และทวีปอเมริกาผ่านการยึดอาณานิคมของยุโรป ปกติการปลูกข้าวเป็นแบบปีต่อปี ทว่าในเขตร้อน ข้าวสามารถมีชีวิตอยู่ได้หลายปีและสามารถไว้ตอได้นานถึง 30 ปี ต้นข้าวสามารถโตได้ถึง 1–1.8 เมตร ขึ้นอยู่กับพันธุ์และความอุดมสมบูรณ์ของดินเป็นหลัก มีใบเรียว ยาว 50-100 เซนติเมตร และกว้าง 2-2.5 เซนติเมตร ช่อดอกห้อยยาว 30-50 เซนติเมตร เมล็ดกินได้เป็นผลธัญพืชยาว 5-12 มิลลิเมตร และหนา 2-3 มิลลิเมตร การเตรียมดินสำหรับเพาะปลูกข้าวเหมาะกับประเทศและภูมิภาคที่ค่าแรงต่ำและฝนตกมาก เนื่องจากมันใช้แรงงานมากที่จะเตรียมดินและต้องการน้ำเพียงพอ อย่างไรก็ตาม ข้าวสามารถโตได้เกือบทุกที่ แม้บนเนินชันหรือเขตภูเขาที่ใช้ระบบควบคุมน้ำแบบขั้นบันได แม้ว่าสปีชีส์บุพการีของมันเป็นสิ่งพื้นเมืองของเอเชียและส่วนที่แน่นอนของแอฟริกา ร้อยปีของการค้าขายและการส่งออกทำให้มันสามัญในหลายวัฒนธรรมทั่วโลก วิธีแบบดั้งเดิมสำหรับเตรียมดินสำหรับข้าวคือทำให้น้ำท่วมแปลงชั่วขณะหนึ่งหรือหลังจากการตั้งของต้นกล้าอายุน้อย วิธีเรียบง่ายนี้ต้องการการวางแผนที่แข็งแรงและการให้บริการของเขื่อนและร่องน้ำ แต่ลดพัฒนาการของเมล็ดที่ไม่ค่อยแข็งแรงและวัชพืชที่ไม่มีภาวะเติบโตขณะจมน้ำ และยับยั้งศัตรูพืช ขณะที่การทำให้น้ำท่วมไม่จำเป็นสำหรับการเตรียมดินสำหรับเพาะปลูกข้าว`,
    },
    {
      title: 'ข้อความสั้น (สำหรับทดสอบ VAJA TTS)',
      text: `ยินดีต้อนรับสู่ ThaiVoice Studio ระบบสังเคราะห์เสียงพูดภาษาไทยคุณภาพสูงด้วยปัญญาประดิษฐ์จาก AIForThai รองรับหลากหลายน้ำเสียงและสำเนียง`,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col h-full">
      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Content Editor</h2>
            <p className="text-xs text-slate-500">เขียนหรือวางเนื้อหาภาษาไทยเพื่อวิเคราะห์</p>
          </div>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={onSaveDraft}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="บันทึกข้อความลงใน LocalStorage อัตโนมัติ"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>{hasDraftSaved ? 'บันทึกแล้ว' : 'บันทึกฉบับร่าง'}</span>
          </button>

          <button
            onClick={onCopy}
            disabled={!content.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            title="คัดลอกเนื้อหาทั้งหมด"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">คัดลอก</span>
          </button>

          <button
            onClick={onDownloadTxt}
            disabled={!content.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            title="ดาวน์โหลดเป็นไฟล์ .txt"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">ดาวน์โหลด</span>
          </button>

          <button
            onClick={onClear}
            disabled={!content.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            title="ล้างข้อความทั้งหมด"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ล้างข้อความ</span>
          </button>
        </div>
      </div>

      {/* Outdated analysis badge alert */}
      {isDirtySinceAnalysis && (
        <div className="mt-3 flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
          <RotateCcw className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            ข้อความต้นฉบับมีการเปลี่ยนแปลง ผลวิเคราะห์เดิมที่แสดงทางขวาอาจไม่ตรงกับเนื้อหาล่าสุด กรุณากดประมวลผลใหม่
          </span>
        </div>
      )}

      {/* Preset sample texts for quick testing */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">ใส่บทความตัวอย่าง:</span>
        {sampleArticles.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onChange(sample.text)}
            className="text-xs px-2.5 py-1 rounded-md bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200/80 transition-colors"
          >
            {sample.title}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <div className="mt-3 relative flex-1 min-h-[300px] flex flex-col">
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="พิมพ์หรือวางบทความภาษาไทยที่นี่ เพื่อเริ่มสรุปความ แนะนำแท็ก และสร้างเสียงพูด..."
          className="w-full flex-1 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm sm:text-base leading-relaxed resize-none transition-all"
        />
      </div>

      {/* Metrics Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">จำนวนตัวอักษร:</span>
            <span className="font-semibold text-slate-800">{charCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5" title={`นับคำด้วย: ${wordMethod}`}>
            <span className="text-slate-400">จำนวนคำ:</span>
            <span className="font-semibold text-slate-800">{wordCount.toLocaleString()}</span>
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
          </div>
          <span className="text-[11px] text-slate-400 hidden xl:inline">
            (วิธีการนับ: {wordMethod})
          </span>
        </div>

        {/* Quick Trigger Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onAnalyzeSummary}
            disabled={isLoadingSummary || !content.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLoadingSummary ? 'กำลังสรุป...' : 'สรุปเนื้อหา'}</span>
          </button>

          <button
            onClick={onAnalyzeTags}
            disabled={isLoadingTags || !content.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{isLoadingTags ? 'กำลังดึงแท็ก...' : 'แนะนำแท็ก'}</span>
          </button>

          <button
            onClick={onGenerateVoice}
            disabled={isLoadingVoice || !content.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isLoadingVoice ? 'กำลังสร้างเสียง...' : 'สร้างเสียงพูด'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
