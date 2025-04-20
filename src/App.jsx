import React, { useState, useEffect } from 'react';
import LayoutSelector from './components/LayoutSelector';
import Workspace from './components/Workspace';
import { getCookie } from './utils/cookieUtils';
import { StockProvider } from './contexts/StockContext';

function App() {
  const [currentLayout, setCurrentLayout] = useState(null);

  // Check for saved layout on initial load
  useEffect(() => {
    const savedLayout = getCookie('savedLayout');
    if (savedLayout) {
    setCurrentLayout(savedLayout.layout);
    }
  }, []);

  return (
    <StockProvider>
    <div className="min-h-screen bg-gray-900 text-white p-0">
      {!currentLayout ? (
        <LayoutSelector setLayout={setCurrentLayout} />
      ) : (
        <Workspace 
          layout={currentLayout} 
          onReset={() => setCurrentLayout(null)} 
        />
      )}
    </div>
    </StockProvider>
  );
}

export default App;