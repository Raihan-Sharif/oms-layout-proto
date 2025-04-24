import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import LayoutSelector from './components/LayoutSelector';
import Workspace from './components/Workspace';
import { getCookie } from './utils/cookieUtils';
import { StockProvider } from './contexts/StockContext';
import WidgetTabPage from './components/WidgetTabPage'; // 👈 create this component

function App() {
  const [currentLayout, setCurrentLayout] = useState(null);

  useEffect(() => {
    const savedLayout = getCookie('savedLayout');
    if (savedLayout) {
      setCurrentLayout(savedLayout.layout);
    }
  }, []);

  return (
    <StockProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white p-0">
          <Routes>
            <Route
              path="/"
              element={
                !currentLayout ? (
                  <LayoutSelector setLayout={setCurrentLayout} />
                ) : (
                  <Workspace
                    layout={currentLayout}
                    onReset={() => setCurrentLayout(null)}
                  />
                )
              }
            />
            <Route path="/widget" element={<WidgetTabPage />} />
          </Routes>
        </div>
      </Router>
    </StockProvider>
  );
}

export default App;
