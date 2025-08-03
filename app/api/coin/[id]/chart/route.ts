import { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest } from 'next';

// ✅ Use RouteContext type from Next.js
type RouteContext = {
  params: {
    id: string;
  };
};

export const revalidate = 10;

export async function GET(req: NextRequest, { params }: RouteContext) {
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
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
