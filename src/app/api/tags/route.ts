import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.AIFORTHAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบ AIFORTHAI_API_KEY ในระบบ' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { text, numtag = 5 } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุข้อความภาษาไทยที่ต้องการวิเคราะห์แท็ก' },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'ข้อความต้องมีความยาวไม่เกิน 5,000 ตัวอักษรตามข้อกำหนดของ Tag Suggestion API' },
        { status: 400 }
      );
    }

    const num = Math.min(Math.max(Number(numtag) || 5, 1), 20);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const formData = new URLSearchParams();
    formData.append('text', text.trim());
    formData.append('numtag', num.toString());

    const res = await fetch('https://api.aiforthai.in.th/tagsuggestion', {
      method: 'POST',
      headers: {
        Apikey: apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        {
          success: false,
          error: `AIForThai API ตอบกลับด้วยสถานะ ${res.status}: ${res.statusText}`,
          details: errText,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      tags: data.tags || [],
    });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, error: 'การเชื่อมต่อ Tag Suggestion API หมดเวลา (Timeout)' },
        { status: 504 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลแท็ก',
      },
      { status: 500 }
    );
  }
}
