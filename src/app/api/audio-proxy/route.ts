import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const audioUrl = searchParams.get('url');

    if (!audioUrl) {
      return NextResponse.json({ error: 'Missing audio URL' }, { status: 400 });
    }

    // Security check: only allow fetching from api.aiforthai.in.th
    const parsed = new URL(audioUrl);
    if (parsed.hostname !== 'api.aiforthai.in.th') {
      return NextResponse.json({ error: 'Invalid audio host' }, { status: 403 });
    }

    const apiKey = process.env.AIFORTHAI_API_KEY || '';

    const res = await fetch(audioUrl, {
      headers: {
        Apikey: apiKey,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch audio file: ${res.statusText}` },
        { status: res.status }
      );
    }

    const audioBuffer = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') || 'audio/wav';

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline; filename="thaivoice-audio.wav"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error streaming audio' },
      { status: 500 }
    );
  }
}
