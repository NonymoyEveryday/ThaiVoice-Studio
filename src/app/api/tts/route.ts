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
    const { text, speaker = 'nana' } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุข้อความภาษาไทยที่ต้องการแปลงเป็นเสียง' },
        { status: 400 }
      );
    }

    if (text.length > 400) {
      return NextResponse.json(
        { success: false, error: `ข้อความมีความยาว ${text.length} ตัวอักษร ซึ่งเกินกำหนดสูงสุด 400 ตัวอักษรของ VAJA API` },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const res = await fetch('https://api.aiforthai.in.th/vaja', {
      method: 'POST',
      headers: {
        Apikey: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text.trim(),
        speaker: speaker.trim(),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        {
          success: false,
          error: `VAJA API ตอบกลับด้วยรหัสข้อผิดพลาด ${res.status}: ${res.statusText}`,
          details: errText,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    if (data.msg !== 'success' || !data.audio_url) {
      return NextResponse.json(
        {
          success: false,
          error: data.msg || 'ไม่สามารถสร้างไฟล์เสียงได้จากข้อความนี้',
          details: JSON.stringify(data),
        },
        { status: 500 }
      );
    }

    // Proxy download endpoint URL
    const audioProxyUrl = `/api/audio-proxy?url=${encodeURIComponent(data.audio_url)}`;

    return NextResponse.json({
      success: true,
      audioUrl: audioProxyUrl,
      rawAudioUrl: data.audio_url,
    });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, error: 'การเชื่อมต่อ VAJA TTS API หมดเวลา (Timeout)' },
        { status: 504 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'เกิดข้อผิดพลาดในการสร้างเสียงพูด',
      },
      { status: 500 }
    );
  }
}
