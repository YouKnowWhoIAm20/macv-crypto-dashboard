import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 10;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const days = req.nextUrl.searchParams.get('days') || '7';
  const apiKey = process.env.COINGECKO_API_KEY;

  if (!id || !apiKey) {
    return NextResponse.json({ error: 'Missing ID or API Key' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: {
          Accept: 'application/json',
          'x-cg-demo-api-key': apiKey,
        },
        // ❌ remove: next: { revalidate: 10 }
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
