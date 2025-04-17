import React from 'react';

const layouts = [
  { id: '1x1', rows: 1, cols: 1 },
  { id: '2x1', rows: 2, cols: 1 },
  { id: '1x2', rows: 1, cols: 2 },
  { id: '2x2', rows: 2, cols: 2 },
  { id: '3x2', rows: 3, cols: 2 },
  { id: '3x3', rows: 3, cols: 3 },
];

const LayoutSelector = ({ setLayout }) => {
  return (
    <div className="max-w-4xl mx-auto">
       <header className="mb-8">
              <h1 className="text-3xl font-bold text-center">Dashboard Builder</h1>
              <p className="text-center text-gray-400">Select a layout to get started</p>
            </header>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105"
            onClick={() => setLayout(layout)}
          >
            <div className="flex flex-col items-center">
              <div 
                className="grid gap-1 mb-2 w-full"
                style={{
                  gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                  gridTemplateRows: `repeat(${layout.rows}, 20px)`,
                }}
              >
                {Array.from({ length: layout.rows * layout.cols }).map((_, i) => (
                  <div key={i} className="bg-blue-500 rounded-sm"></div>
                ))}
              </div>
              <span className="font-medium">{layout.rows}x{layout.cols} Grid</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;