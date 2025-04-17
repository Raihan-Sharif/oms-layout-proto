import React from 'react';

const MarketDepth = () => {
  const bids = [
    { price: 154.30, size: 1200, total: 1200 },
    { price: 154.25, size: 850, total: 2050 },
    { price: 154.20, size: 1500, total: 3550 },
    { price: 154.15, size: 900, total: 4450 },
    { price: 154.10, size: 1100, total: 5550 },
  ];

  const asks = [
    { price: 154.35, size: 800, total: 800 },
    { price: 154.40, size: 1200, total: 2000 },
    { price: 154.45, size: 950, total: 2950 },
    { price: 154.50, size: 1500, total: 4450 },
    { price: 154.55, size: 1100, total: 5550 },
  ];

  const maxTotal = Math.max(
    ...bids.map(b => b.total),
    ...asks.map(a => a.total)
  );

  return (
    <div className="h-full p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-3 text-blue-400">Market Depth</h3>
      <div className="text-sm">
        <div className="mb-1">
          {asks.reverse().map((ask, i) => (
            <div key={i} className="flex mb-1">
              <div className="w-1/3 text-right pr-2 text-red-500">{ask.price.toFixed(2)}</div>
              <div className="w-1/3 text-right pr-2">{ask.size}</div>
              <div className="w-1/3 relative">
                <div 
                  className="bg-red-900 h-5 absolute right-0"
                  style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                />
                <span className="absolute right-1 text-xs">{ask.total}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center my-2 text-gray-400">Spread: 0.05</div>
        
        <div className="mt-1">
          {bids.map((bid, i) => (
            <div key={i} className="flex mb-1">
              <div className="w-1/3 text-right pr-2 text-green-500">{bid.price.toFixed(2)}</div>
              <div className="w-1/3 text-right pr-2">{bid.size}</div>
              <div className="w-1/3 relative">
                <div 
                  className="bg-green-900 h-5 absolute right-0"
                  style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                />
                <span className="absolute right-1 text-xs">{bid.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketDepth;