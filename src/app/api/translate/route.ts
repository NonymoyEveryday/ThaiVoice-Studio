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
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุข้อความภาษาอังกฤษที่ต้องการแปล' },
        { status: 400 }
      );
    }

    if (text.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          error: `ข้อความยาว ${text.length} ตัวอักษร เกินข้อกำหนด 1,000 ตัวอักษรของ Xiaofan Translation API`,
        },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const res = await fetch('https://api.aiforthai.in.th/xiaofan-en-th/en2th', {
      method: 'POST',
      headers: {
        apikey: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text.trim(),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        {
          success: false,
          error: `API ตอบกลับด้วยรหัส ${res.status}: ${res.statusText}`,
          details: errText,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    const translatedText = data.translated_text || '';

    return NextResponse.json({
      success: true,
      translated_text: translatedText,
    });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, error: 'การเชื่อมต่อระบบแปลภาษา Xiaofan หมดเวลา (Timeout)' },
        { status: 504 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'เกิดข้อผิดพลาดในการแปลภาษา',
      },
      { status: 500 }
    );
  }
}
