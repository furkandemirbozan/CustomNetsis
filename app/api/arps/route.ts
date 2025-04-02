import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token bulunamadı' },
        { status: 401 }
      );
    }
    
    const API_URL = 'http://172.16.20.230:7171/api/v2/arps';
    
    console.log('Arps API proxy isteği alındı, token:', token.substring(0, 20) + '...');

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    });

    if (!response.ok) {
      console.error('Arps API hatası:', response.status, await response.text());
      return NextResponse.json(
        { error: 'API isteği başarısız' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Arps API yanıtı özeti:', {
      TotalCount: data?.TotalCount,
      Limit: data?.Limit,
      DataLength: data?.Data?.length || 0
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Arps API proxy hatası:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 