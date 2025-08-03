import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ✅ Fix: use valid context type directly instead of destructuring
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  const apiKey = process.env.COINGECKO_API_KEY;

  if (!id || !apiKey) {
    return NextResponse.json({ error: 'Missing ID or API Key' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`, {
      headers: {
        Accept: 'application/json',
        'x-cg-demo-api-key': apiKey,
      },
    });

    if (!res.ok) {
      console.error('CoinGecko error:', res.status);
      return NextResponse.json({ error: 'Failed to fetch from CoinGecko' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
