// app/coin/[id]/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { use } from 'react';
import PriceChart from '@/components/PriceChart';

type CoinData = {
  id: string;
  name: string;
  symbol: string;
  image: { large: string };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    price_change_percentage_24h: number;
  };
  description: { en: string };
};

export default function CoinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // ✅ unwrap the params Promise
  const [coin, setCoin] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [chartDays, setChartDays] = useState(7); // ✅ added state for chart range

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const res = await fetch(`/api/coin/${id}`);
        if (!res.ok) throw new Error('Failed to fetch coin');
        const data = await res.json();
        setCoin(data);
      } catch (err) {
        console.error('Error fetching coin:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCoin();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p className="animate-pulse">Loading coin details...</p>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>❌ Could not load coin data.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex items-center gap-4 mb-6">
        <img src={coin.image.large} alt={coin.name} className="w-16 h-16" />
        <div>
          <h1 className="text-3xl font-bold">
            {coin.name}{' '}
            <span className="text-gray-500">({coin.symbol.toUpperCase()})</span>
          </h1>
        </div>
      </div>

      <div className="space-y-2 text-lg text-gray-800">
        <p>
          <strong>Price:</strong> ${coin.market_data.current_price.usd.toLocaleString()}
        </p>
        <p>
          <strong>Market Cap:</strong> ${coin.market_data.market_cap.usd.toLocaleString()}
        </p>
        <p>
          <strong>24h Change:</strong>{' '}
          <span
            className={
              coin.market_data.price_change_percentage_24h >= 0
                ? 'text-green-600'
                : 'text-red-600'
            }
          >
            {coin.market_data.price_change_percentage_24h.toFixed(2)}%
          </span>
        </p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">About {coin.name}</h2>
        <div
          className="prose prose-sm text-gray-700 max-w-none"
          dangerouslySetInnerHTML={{
            __html:
              coin.description.en?.split('. ')[0] || 'No description available.',
          }}
        />
      </div>

      {/* ✅ Price Chart Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Price Chart</h2>
          <select
            value={chartDays}
            onChange={(e) => setChartDays(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={1}>24h</option>
            <option value={7}>7d</option>
            <option value={30}>30d</option>
            <option value={90}>90d</option>
          </select>
        </div>
        <PriceChart coinId={id} days={chartDays} />
      </div>
    </div>
  );
}
