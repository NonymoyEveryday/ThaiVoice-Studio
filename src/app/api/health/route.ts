import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.AIFORTHAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      configured: false,
      status: 'missing_key',
      message: 'ยังไม่ได้ตั้งค่า AIFORTHAI_API_KEY ในระบบ',
    });
  }

  try {
    // Quick probe to AIForThai Tag Suggestion
    const res = await fetch('https://api.aiforthai.in.th/tagsuggestion', {
      method: 'POST',
      headers: {
        Apikey: apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ text: 'ทดสอบ', numtag: '1' }),
    });

    if (res.ok) {
      return NextResponse.json({
        configured: true,
        status: 'online',
        message: 'เชื่อมต่อ AIForThai API สำเร็จ (Online)',
      });
    } else {
      return NextResponse.json({
        configured: true,
        status: 'degraded',
        message: `API เชื่อมต่อได้แต่ตอบกลับรหัส ${res.status}`,
      });
    }
  } catch (err: any) {
    return NextResponse.json({
      configured: true,
      status: 'offline',
      message: 'ไม่สามารถติดต่อ AIForThai เซิร์ฟเวอร์ได้ในขณะนี้',
      error: err.message,
    });
  }
}
