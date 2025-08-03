import { NextResponse } from 'next/server';

export const runtime = 'edge'; // ✅ Edge runtime (no change)
export const revalidate = 10;  // ✅ ISR: Revalidate every 10 seconds

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";

    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}&sparkline=false`,
      {
        headers: {
          'Accept': 'application/json',
          'x-cg-demo-api-key': process.env.COINGECKO_API_KEY || '', // ✅ use your env key
        },
        next: { revalidate: 10 }, // ✅ ISR cache
      }
    );

    const data = await res.json();

    if (Array.isArray(data)) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: 'Invalid response from CoinGecko' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
