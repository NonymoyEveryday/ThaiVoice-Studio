import { VajaSpeaker } from '@/types';

export const VAJA_SPEAKERS: VajaSpeaker[] = [
  { id: 'nana', name: 'Nana (นานา)', category: 'พากย์การ์ตูน / Animation', gender: 'female' },
  { id: 'noina', name: 'Noina (น้อยหน่า)', category: 'สปอตโฆษณา / ระบบตอบรับอัตโนมัติ', gender: 'female' },
  { id: 'farah', name: 'Farah (ฟาร่า)', category: 'สารคดี / Presentation', gender: 'female' },
  { id: 'mewzy', name: 'Mewzy (มิวซี่)', category: 'สปอตโฆษณา', gender: 'female' },
  { id: 'farsai', name: 'Farsai (ฟ้าใส)', category: 'พากย์การ์ตูน / Animation', gender: 'female' },
  { id: 'prim', name: 'Prim (พริ้ม)', category: 'ผู้ประกาศข่าว (Announcer)', gender: 'female' },
  { id: 'ped', name: 'Ped (เป็ด)', category: 'ผู้ประกาศข่าว (Announcer)', gender: 'female' },
  { id: 'poom', name: 'Poom (ภูมิ)', category: 'สปอตโฆษณา / ระบบตอบรับอัตโนมัติ', gender: 'male' },
  { id: 'doikham', name: 'Doikham (ดอยคำ)', category: 'เสียงผู้ชายสำเนียงภาษาเหนือ', gender: 'male' },
  { id: 'praw', name: 'Praw (พราว)', category: 'เสียงเด็กผู้หญิง', gender: 'female' },
  { id: 'wayu', name: 'Wayu (วายุ)', category: 'เสียงเด็กผู้ชาย', gender: 'male' },
  { id: 'namphueng', name: 'Namphueng (น้ำผึ้ง)', category: 'Anchor-style', gender: 'female' },
  { id: 'toon', name: 'Toon (ตูน)', category: 'Broadcast-style', gender: 'female' },
  { id: 'sanooch', name: 'Sanooch (สะนุช)', category: 'Teacher-style (อาจารย์/ผู้สอน)', gender: 'female' },
  { id: 'thanwa', name: 'Thanwa (ธันวา)', category: 'Broadcast-style', gender: 'male' },
];

/**
 * Counts characters excluding newline variations if needed or standard length.
 */
export function countCharacters(text: string): number {
  return text.length;
}

/**
 * Counts words using Intl.Segmenter with Thai locale
 * Also falls back to whitespace/word boundary if Intl.Segmenter is not supported.
 */
export function countThaiWords(text: string): { count: number; method: string } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { count: 0, method: 'Intl.Segmenter (th)' };
  }

  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new (Intl as any).Segmenter('th', { granularity: 'word' });
      const segments = Array.from(segmenter.segment(trimmed));
      const wordCount = segments.filter((s: any) => s.isWordLike).length;
      return {
        count: wordCount,
        method: 'Intl.Segmenter (Thai Word Boundary - มาตรฐานเบราว์เซอร์)',
      };
    } catch {
      // fallback
    }
  }

  // Fallback counting regex
  const tokens = trimmed.split(/[\s,.;:!?\n\r\t]+/).filter(Boolean);
  return {
    count: tokens.length,
    method: 'Whitespace Tokenizer (ช่องว่างและเครื่องหมายวรรคตอน)',
  };
}
