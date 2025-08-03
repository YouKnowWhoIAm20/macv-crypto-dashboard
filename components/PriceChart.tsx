'use client';
import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

interface PriceChartProps {
  coinId: string;
  days: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ coinId, days }) => {
  const [data, setData] = useState<{ time: string; price: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
        );

        if (!res.ok) {
          throw new Error(`Fetch failed with status ${res.status}`);
        }

        const json = await res.json();

        if (Array.isArray(json?.prices)) {
          const formatted = json.prices.map(([timestamp, price]: [number, number]) => ({
            time: new Date(timestamp).toLocaleDateString(),
            price: price,
          }));
          setData(formatted);
        }
      } catch (err) {
        console.error('Chart data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [coinId, days]);

  if (loading) {
    return <p className="text-gray-500">Loading chart...</p>;
  }

  return (
    <div className="w-full mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis domain={['auto', 'auto']} />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
