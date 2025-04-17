import React, { useState, useRef, useEffect } from 'react';
import { ChartWidget, StockPriceTable, StockDetails, MarketDepth } from './widgets';

const widgetComponents = {
  chart: { component: ChartWidget, name: 'Chart' },
  table: { component: StockPriceTable, name: 'Stock Table' },
  details: { component: StockDetails, name: 'Stock Details' },
  depth: { component: MarketDepth, name: 'Market Depth' },
};

const Workspace = ({ layout, onReset }) => {
  const [widgets, setWidgets] = useState(Array(layout.spans ? layout.spans.length : layout.rows * layout.cols).fill(null));
  const [draggedWidget, setDraggedWidget] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    cellIndex: null,
  });
  const contextMenuRef = useRef(null);

  // Context menu logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setContextMenu({ ...contextMenu, show: false });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu]);

  const showContextMenu = (event, index) => {
    event.preventDefault();
    setContextMenu({
      show: true,
      x: event.clientX,
      y: event.clientY,
      cellIndex: index,
    });
  };

  // Widget management
  const addWidget = (type) => {
    const newWidgets = [...widgets];
    newWidgets[contextMenu.cellIndex] = { 
      id: Date.now(), 
      type 
    };
    setWidgets(newWidgets);
    setContextMenu({ ...contextMenu, show: false });
  };

  const removeWidget = (index) => {
    const newWidgets = [...widgets];
    newWidgets[index] = null;
    setWidgets(newWidgets);
  };

  // Drag and drop logic
  const handleDragStart = (index) => {
    if (widgets[index]) {
      setDraggedWidget({ ...widgets[index], sourceIndex: index });
    }
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index) => {
    if (draggedWidget && draggedWidget.sourceIndex !== index) {
      const newWidgets = [...widgets];
      
      // Remove from original position
      newWidgets[draggedWidget.sourceIndex] = null;
      
      // If target cell has a widget, swap them
      if (newWidgets[index]) {
        newWidgets[draggedWidget.sourceIndex] = newWidgets[index];
      }
      
      // Place dragged widget in new position
      newWidgets[index] = {
        id: draggedWidget.id,
        type: draggedWidget.type
      };
      
      setWidgets(newWidgets);
    }
    
    setDraggedWidget(null);
    setDragOverIndex(null);
  };

  const renderWidget = (widget, index) => {
    const Component = widgetComponents[widget.type].component;
    return (
      <div
        draggable
        onDragStart={() => handleDragStart(index)}
        className="h-full"
      >
        <Component />
      </div>
    );
  };

  const renderGridCell = (index, span = null) => {
    return (
      <div 
        key={index}
        className={`bg-gray-800 rounded-lg p-4 border ${
          dragOverIndex === index ? 
            'border-yellow-500 bg-gray-700' : 
            'border-gray-700'
        } relative`}
        style={span ? {
          gridColumn: `${span.col + 1} / span ${span.colSpan}`,
          gridRow: `${span.row + 1} / span ${span.rowSpan}`,
        } : {}}
        onContextMenu={(e) => showContextMenu(e, index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDrop={() => handleDrop(index)}
      >
        {widgets[index] ? (
          <div className="h-full flex flex-col">
            <div className="flex justify-between border-b border-gray-700 mb-2 pb-2">
              <span className="text-xs text-gray-400">
                {widgetComponents[widgets[index].type].name}
              </span>
              <button 
                onClick={() => removeWidget(index)}
                className="text-xs bg-red-900 hover:bg-red-800 px-2 py-1 rounded"
              >
                X
              </button>
            </div>
            {renderWidget(widgets[index], index)}
          </div>
        ) : (
          <button
            onClick={(e) => showContextMenu(e, index)}
            className="w-full h-full flex items-center justify-center text-yellow-400 hover:text-yellow-300 border-2 border-dashed border-yellow-600 hover:border-yellow-500 rounded transition-all"
          >
            + Add Widget
          </button>
        )}
      </div>
    );
  };

  const renderGrid = () => {
    if (layout.spans) {
      // Render spanned layout
      return (
        <div className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
            gridTemplateRows: `repeat(${layout.rows}, minmax(200px, 1fr))`,
          }}>
          {layout.spans.map((span, index) => renderGridCell(index, span))}
        </div>
      );
    } else {
      // Render regular grid layout
      return (
        <div className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
            gridTemplateRows: `repeat(${layout.rows}, minmax(200px, 1fr))`,
          }}>
          {Array.from({ length: layout.rows * layout.cols }).map((_, index) => 
            renderGridCell(index)
          )}
        </div>
      );
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button 
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
          onClick={onReset}
        >
          ← Back to Layouts
        </button>
        <h2 className="text-xl font-semibold">
          {layout.id?.includes('span') ? 
            layout.id.replace(/-/g, ' ') : 
            `${layout.rows}x${layout.cols} Workspace`}
        </h2>
      </div>

      {renderGrid()}

      {/* Context Menu */}
      {contextMenu.show && (
        <div
          ref={contextMenuRef}
          className="fixed bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 py-1"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
        >
          <div className="text-gray-400 px-4 py-2 text-sm border-b border-gray-700">
            Add Widget
          </div>
          {Object.entries(widgetComponents).map(([key, { name }]) => (
            <button
              key={key}
              className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white"
              onClick={() => addWidget(key)}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workspace;