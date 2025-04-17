import React from 'react';

const ChartWidget = () => {
  // Mock data for candlestick chart
  const chartData = [
    { time: '9:30', open: 150, high: 155, low: 148, close: 153 },
    { time: '10:00', open: 153, high: 156, low: 151, close: 154 },
    { time: '10:30', open: 154, high: 158, low: 153, close: 157 },
    { time: '11:00', open: 157, high: 159, low: 155, close: 156 },
    { time: '11:30', open: 156, high: 157, low: 152, close: 154 },
  ];

  return (
    <div className="h-full p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-3 text-blue-400">AAPL Chart</h3>
      <div className="h-40">
        {/* This would be replaced with a real chart library like Lightweight Charts */}
        <div className="relative h-full border border-gray-600 rounded">
          {chartData.map((data, i) => (
            <div key={i} className="absolute bottom-0 flex items-end" style={{ 
              left: `${i * 20 + 10}px`,
              height: '100%'
            }}>
              <div className="relative w-3">
                <div 
                  className={`absolute w-full ${data.close >= data.open ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{
                    height: `${Math.abs(data.close - data.open)}%`,
                    bottom: `${Math.min(data.open, data.close)}%`
                  }}
                />
                <div 
                  className="absolute w-px left-1/2 transform -translate-x-1/2 bg-white"
                  style={{
                    height: `${data.high - data.low}%`,
                    bottom: `${data.low}%`
                  }}
                />
              </div>
            </div>
          ))}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
            {chartData.map((data, i) => (
              <span key={i}>{data.time}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-between text-sm">
        <span className="text-green-500">+2.5%</span>
        <span>154.32 USD</span>
      </div>
    </div>
  );
};

export default ChartWidget;