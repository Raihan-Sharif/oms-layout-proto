import React, { useState, useRef, useEffect } from "react";
import {
  ChartWidget,
  StockPriceTable,
  StockDetails,
  MarketDepth,
} from "./widgets";

import { setCookie, getCookie } from "../utils/cookieUtils";
import { FaSave } from "react-icons/fa";
import ColorSelector from "./ColorSelector";
import { useStock } from "../contexts/StockContext";
import { MdOutlineOpenInNew } from "react-icons/md";
import WidgetBox from "./WidgetBox";

const widgetComponents = {
  chart: { component: ChartWidget, name: "Chart" },
  table: { component: StockPriceTable, name: "Stock Table" },
  details: { component: StockDetails, name: "Stock Details" },
  depth: { component: MarketDepth, name: "Market Depth" },
};

const Workspace = ({ layout, onReset }) => {

  const { removeWidgetColor } = useStock();

  const [widgets, setWidgets] = useState(
    Array(layout.spans ? layout.spans.length : layout.rows * layout.cols).fill(
      null
    )
  );
  const [draggedWidget, setDraggedWidget] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    cellIndex: null,
  });
  const contextMenuRef = useRef(null);


  //#region layout save
  const saveLayout = async () => {
    const layoutData = {
      layout,
      widgets, // Save the opened widgets in the layout
    };
  
    console.log("Saving layout data:", layoutData); // Log the data being sent
  
    // Save to cookies
    setCookie("savedLayout", layoutData);
  
    // Save to MongoDB
    try {
      const response = await fetch("http://localhost:5000/api/save-layout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(layoutData),
      });
  
      if (response.ok) {
        alert("Layout saved successfully!");
      } else {
        alert("Failed to save layout to the database.");
      }
    } catch (error) {
        alert("Layout saved successfully!");
    }
  };

  // Load layout from cookies on component mount
  useEffect(() => {
    const savedLayout = getCookie('savedLayout');
    if (savedLayout) {
      // Validate the saved layout matches our current layout structure
      if (savedLayout.layout.rows === layout.rows && 
          savedLayout.layout.cols === layout.cols &&
          savedLayout.widgets.length === widgets.length) {
        setWidgets(savedLayout.widgets);
      }
    }
  }, [layout, widgets.length]);



  //#region ctx menu logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        setContextMenu({ ...contextMenu, show: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu]);

  const showContextMenu = (event, index) => {
    event.preventDefault();

    if(widgets[index]) return;
    
    setContextMenu({
      show: true,
      x: event.clientX,
      y: event.clientY,
      cellIndex: index,
    });
  };

  //#region widget mangmnt
  const addWidget = (type) => {
    const newWidgets = [...widgets];
    newWidgets[contextMenu.cellIndex] = {
      id: `${type}-${contextMenu.cellIndex}`,
      type,
    };
    setWidgets(newWidgets);
    setContextMenu({ ...contextMenu, show: false });
  };

  const removeWidget = (index) => {
    const newWidgets = [...widgets];
    const widgetId = newWidgets[index]?.id; //get widgetId of the widget being removed
    newWidgets[index] = null;
    setWidgets(newWidgets);
  
    if (widgetId) {
      removeWidgetColor(widgetId); // remove particular widget's color from context
    }
  };

  //region DND logic
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
  
      // Swap widgets
      const sourceWidget = newWidgets[draggedWidget.sourceIndex];
      const targetWidget = newWidgets[index];
  
      newWidgets[draggedWidget.sourceIndex] = targetWidget;
      newWidgets[index] = sourceWidget;
  
      setWidgets(newWidgets);
  
      // Swap colors in StockContext
      // if (sourceWidget && targetWidget) {
      //   const sourceWidgetId = sourceWidget.id;
      //   const targetWidgetId = targetWidget.id;
  
      //   const sourceColor = widgetColors[sourceWidgetId];
      //   const targetColor = widgetColors[targetWidgetId];
  
      //   updateWidgetColor(sourceWidgetId, targetColor);
      //   updateWidgetColor(targetWidgetId, sourceColor);
      // }
    }
    setDraggedWidget(null);
    setDragOverIndex(null);
  };

  //#region wdgt renderer
  const renderWidget = (widget, index) => {
    const Component = widgetComponents[widget.type].component;
    return (
      <div
        draggable
        onDragStart={() => handleDragStart(index)}
        className="h-full"
      >
        <Component widgetId={widget.id} />
      </div>
    );
  };


  //#region new tab logic
  const openInNewTab = (widget) => {
    const url = `/widget?type=${widget.type}&id=${widget.id}`;
    const width = 500; // Set the width of the new window
    const height = 500; // Set the height of the new window
    const left = window.screenX + (window.outerWidth - width) / 2; // Center horizontally
    const top = window.screenY + (window.outerHeight - height) / 2; // Center vertically
  
    const newWindow = window.open(
      url,
      "_blank",
      `width=${width},height=${height},top=${top},left=${left},resizable,scrollbars`
    );
  
    if (!newWindow) {
      alert("Popup blocked! Please allow popups for this website.");
    }
  };
  

  //#region mtx grd renderer
  const renderGridCell = (index, span = null) => {
    return (
      <div
        key={index}
        className={`bg-gray-800 rounded-lg border ${
          dragOverIndex === index
            ? "border-yellow-500 bg-gray-700"
            : "border-gray-700"
        } relative overflow-hidden`}
        style={
          span
            ? {
                gridColumn: `${span.col + 1} / span ${span.colSpan}`,
                gridRow: `${span.row + 1} / span ${span.rowSpan}`,
              }
            : {}
        }
        onContextMenu={(e) => showContextMenu(e, index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDrop={() => handleDrop(index)}
      >
        {widgets[index] ? (
          <WidgetBox
            widget={widgets[index]}
            index={index}
            openInNewTab={openInNewTab}
            removeWidget={removeWidget}
            renderWidget={renderWidget}
          />
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

  //#region spn grd renderer
  const renderGrid = () => {
    if (layout.spans) {
      return (
        <div
          className="grid h-full gap-2"
          style={{
            gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
            gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
          }}
        >
          {layout.spans.map((span, index) => renderGridCell(index, span))}
        </div>
      );
    } else {
      return (
        <div
          className="grid h-full gap-2"
          style={{
            gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
            gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
          }}
        >
          {Array.from({ length: layout.rows * layout.cols }).map((_, index) =>
            renderGridCell(index)
          )}
        </div>
      );
    }
  };

  //#region workspace
  return (
    <div className="w-full h-screen flex flex-col bg-gray-900">
      {/* Fixed height header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
     
        <button
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
          onClick={onReset}
        >
          ← Back to Layouts
        </button>
        <div className="flex items-center space-x-10">
        <button
            className="bg-blue-500 px-1 py-1 rounded hover:bg-blue-600 transition-all duration-100"
            onClick={saveLayout}
          >
           <FaSave className="inline mr-1" size={20} color="lightBlue" />  Save Layout
          </button>
        <h2 className="text-xl font-semibold">
          {layout.id?.includes("span")
            ? layout.id.replace(/-/g, " ")
            : `${layout.rows}x${layout.cols} Workspace`}
        </h2>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden p-2">
        {renderGrid()}
      </div>

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