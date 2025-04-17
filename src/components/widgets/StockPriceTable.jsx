import React from 'react';

const StockPriceTable = () => {
  const stocks = [
    { symbol: 'AAPL', price: 154.32, change: +2.35, changePercent: +1.55 },
    { symbol: 'MSFT', price: 328.39, change: -1.24, changePercent: -0.38 },
    { symbol: 'GOOGL', price: 2752.11, change: +15.32, changePercent: +0.56 },
    { symbol: 'AMZN', price: 3345.21, change: -23.45, changePercent: -0.70 },
    { symbol: 'TSLA', price: 1024.86, change: +32.54, changePercent: +3.28 },
  ];

  return (
    <div className="h-full p-3 bg-gray-800 rounded-lg overflow-auto">
      <h3 className="text-lg font-semibold mb-3 text-blue-400">Stock Prices</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="text-left pb-2">Symbol</th>
            <th className="text-right pb-2">Price</th>
            <th className="text-right pb-2">Change</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.symbol} className="border-b border-gray-700">
              <td className="py-2">{stock.symbol}</td>
              <td className="text-right py-2">{stock.price.toFixed(2)}</td>
              <td className={`text-right py-2 ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockPriceTable;