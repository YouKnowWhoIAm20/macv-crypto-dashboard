'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  image: string;
}

const WatchlistPage = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [watchlist, setWatchlist] = useState<Coin[]>([]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch('/api/market');
        const data = await res.json();
        if (Array.isArray(data)) {
          setCoins(data);
        } else {
          console.error('Expected array, got:', data);
          setCoins([]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setCoins([]);
      }
    };
    fetchCoins();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('watchlist');
    if (stored) {
      try {
        const ids: string[] = JSON.parse(stored);
        const filtered = coins.filter((coin) => ids.includes(coin.id));
        setWatchlist(filtered);
      } catch (e) {
        console.error('Error parsing watchlist:', e);
        setWatchlist([]);
      }
    }
  }, [coins]);

  const removeFromWatchlist = (id: string) => {
    const updated = watchlist.filter((coin) => coin.id !== id);
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated.map((coin) => coin.id)));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Navbar */}
      <nav className="bg-white shadow mb-6">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">CryptoDash</Link>
          <div className="space-x-4">
            <Link href="/" className="hover:text-blue-500">Market</Link>
            <Link href="/watchlist" className="hover:text-blue-500 font-semibold">Watchlist</Link>
          </div>
        </div>
      </nav>

      {/* Watchlist */}
      <main className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Your Watchlist</h1>
        {watchlist.length === 0 ? (
          <p className="text-gray-600">No coins in watchlist.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.map((coin) => (
              <div key={coin.id} className="border border-gray-300 bg-white p-4 rounded shadow hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <img src={coin.image} alt={coin.name} className="w-10 h-10" />
                  <div>
                    <h2 className="text-xl font-semibold">{coin.name}</h2>
                    <p className="text-sm text-gray-500">Symbol: {coin.symbol?.toUpperCase() || 'N/A'}</p>
                    <p>Price: ${Number(coin.current_price).toLocaleString()}</p>
                    <p>Market Cap: ${Number(coin.market_cap).toLocaleString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromWatchlist(coin.id)}
                  className="mt-4 text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default WatchlistPage;
