import React from 'react';

const StockDetails = () => {
  const stock = {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 154.32,
    change: +2.35,
    changePercent: +1.55,
    marketCap: '2.53T',
    peRatio: 28.76,
    dividend: '0.88 (0.57%)',
    volume: '78.4M',
  };

  return (
    <div className="h-full p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
          <span className="font-bold">{stock.symbol[0]}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{stock.symbol}</h3>
          <p className="text-sm text-gray-400">{stock.name}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-2xl font-bold mb-1">${stock.price.toFixed(2)}</div>
        <div className={`text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-400">Market Cap</p>
          <p>{stock.marketCap}</p>
        </div>
        <div>
          <p className="text-gray-400">P/E Ratio</p>
          <p>{stock.peRatio}</p>
        </div>
        <div>
          <p className="text-gray-400">Dividend</p>
          <p>{stock.dividend}</p>
        </div>
        <div>
          <p className="text-gray-400">Volume</p>
          <p>{stock.volume}</p>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;