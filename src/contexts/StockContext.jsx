import { createContext, useContext, useState } from 'react';

const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [widgetStocks, setWidgetStocks] = useState({}); // Track selected stock for each widget
  const [widgetColors, setWidgetColors] = useState({}); // Track widget colors by widget ID

  const updateWidgetColor = (widgetId, colorId) => {
    setWidgetColors((prevColors) => ({
      ...prevColors,
      [widgetId]: colorId,
    }));
  };

  const updateSelectedStock = (stock, widgetId) => {
    const widgetColor = widgetColors[widgetId];
    console.log(`Widget ID: ${widgetId}, Color ID: ${widgetColor}`);
    console.log('Current Widget Colors:', widgetColors);

    // Find all widgets with the same color
    const matchingWidgets = Object.keys(widgetColors).filter(
      (id) => widgetColors[id] === widgetColor
    );

    if (matchingWidgets.length > 1) {
      console.log(`Matching Widgets Found: ${matchingWidgets}`);
      // Update the selected stock only for the matching widgets
      setWidgetStocks((prevStocks) => {
        const updatedStocks = { ...prevStocks };
        matchingWidgets.forEach((id) => {
          updatedStocks[id] = stock;
        });
        return updatedStocks;
      });
    } else {
      console.log('No matching widgets with the same color.');
    }
  };

  return (
    <StockContext.Provider
      value={{
        widgetStocks,
        widgetColors,
        updateWidgetColor,
        updateSelectedStock,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => useContext(StockContext);