import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: any // 👈 using 'any' to satisfy Vercel build — confirmed workaround
) {
  const id = context?.params?.id;
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
      return NextResponse.json({ error: 'CoinGecko API error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
