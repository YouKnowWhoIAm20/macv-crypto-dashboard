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

const HomePage = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/market?page=${page}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setCoins(data);
        } else {
          console.error('Expected array, got:', data);
          setCoins([]);
        }
      } catch (err) {
        console.error('Failed to fetch:', err);
        setCoins([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, [page]);

  const addToWatchlist = (coinId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Stop link navigation
    event.preventDefault();
    const current = JSON.parse(localStorage.getItem('watchlist') || '[]');
    if (!current.includes(coinId)) {
      const updated = [...current, coinId];
      localStorage.setItem('watchlist', JSON.stringify(updated));
      alert('✅ Added to watchlist!');
    } else {
      alert('⚠️ Already in watchlist!');
    }
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100 text-gray-900">
      {/* Navbar */}
      <nav className="bg-white shadow mb-6">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">CryptoDash</Link>
          <div className="space-x-4">
            <Link href="/" className="hover:text-blue-500 font-semibold">Market</Link>
            <Link href="/watchlist" className="hover:text-blue-500">Watchlist</Link>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 container mx-auto px-4 pb-10 flex flex-col justify-start">
        <h1 className="text-3xl font-bold mb-4">Market Overview</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name or symbol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6 p-2 border border-gray-300 rounded w-full sm:w-1/2"
        />

        {/* Loading / Empty / List */}
        {loading ? (
          <p className="text-gray-600">Loading coins...</p>
        ) : filteredCoins.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">🚫 No coins found. Try adjusting your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCoins.map((coin) => (
              <Link
                key={coin.id}
                href={`/coin/${coin.id}`}
                className="border border-gray-300 bg-white p-4 rounded shadow hover:shadow-lg transition block"
              >
                <div className="flex items-center gap-4">
                  <img src={coin.image} alt={coin.name} className="w-10 h-10" />
                  <div>
                    <h2 className="text-xl font-semibold">{coin.name}</h2>
                    <p className="text-sm text-gray-500">Symbol: {coin.symbol.toUpperCase()}</p>
                    <p>Price: ${Number(coin.current_price).toLocaleString()}</p>
                    <p>Market Cap: ${Number(coin.market_cap).toLocaleString()}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => addToWatchlist(coin.id, e)}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Add to Watchlist
                </button>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
          >
            Prev
          </button>
          <span className="text-lg font-semibold">Page {page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
