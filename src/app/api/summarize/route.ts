import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.AIFORTHAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบ AIFORTHAI_API_KEY ในไฟล์ .env.local หรือสภาพแวดล้อมระบบ' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { text, comp_rate = 30 } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุข้อความภาษาไทยที่ต้องการสรุป' },
        { status: 400 }
      );
    }

    const rate = Number(comp_rate);
    if (isNaN(rate) || rate < 20 || rate > 40) {
      return NextResponse.json(
        { success: false, error: 'ระดับการสรุปความ (comp_rate) ต้องอยู่ระหว่าง 20 ถึง 40%' },
        { status: 400 }
      );
    }

    // Call AIForThai Text Summarize API
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35000);

    const payload = JSON.stringify([
      {
        id: 100,
        comp_rate: rate,
        src: text.trim(),
      },
    ]);

    const res = await fetch('https://api.aiforthai.in.th/textsummarize', {
      method: 'POST',
      headers: {
        Apikey: apiKey,
        'Content-Type': 'application/json',
      },
      body: payload,
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

    // AIForThai textsummarize returns either JSON string or raw text
    const responseText = await res.text();
    let summaryResult = responseText;

    // Check if it's encoded as a JSON string e.g. "ผลสรุป..."
    try {
      const parsed = JSON.parse(responseText);
      if (typeof parsed === 'string') {
        summaryResult = parsed;
      } else if (Array.isArray(parsed) && parsed.length > 0) {
        summaryResult = typeof parsed[0] === 'string' ? parsed[0] : JSON.stringify(parsed[0]);
      }
    } catch {
      // Use raw text as is
    }

    // Trim surrounding quotes if any remain
    summaryResult = summaryResult.replace(/^"(.*)"$/, '$1').trim();

    return NextResponse.json({
      success: true,
      summary: summaryResult,
    });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, error: 'การเชื่อมต่อไปยัง AIForThai API หมดเวลา (Request Timeout - เกิน 35 วินาที)' },
        { status: 504 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'เกิดข้อผิดพลาดในการประมวลผลสรุปเนื้อหา',
      },
      { status: 500 }
    );
  }
}
