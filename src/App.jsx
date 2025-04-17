import React, { useState } from 'react';
import LayoutSelector from './components/LayoutSelector';
import Workspace from './components/Workspace';

const App = () => {
  const [layout, setLayout] = useState(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {!layout ? (
        <LayoutSelector setLayout={setLayout} />
      ) : (
        <Workspace layout={layout} onReset={() => setLayout(null)} />
      )}
    </div>
  );
};

export default App;