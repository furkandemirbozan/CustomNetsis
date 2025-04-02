import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const API_URL = 'http://172.16.20.230:7171/api/v2/token';

    console.log('API proxy isteği alındı:', formData);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData as any).toString(),
    });

    if (!response.ok) {
      console.error('API hatası:', response.status, await response.text());
      return NextResponse.json(
        { error: 'API isteği başarısız' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('API yanıtı:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Server proxy hatası:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 