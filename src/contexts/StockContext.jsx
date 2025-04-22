import { createContext, useContext, useState } from 'react';

const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [widgetStocks, setWidgetStocks] = useState({}); // Track selected stock for each widget
  const [widgetColors, setWidgetColors] = useState({}); // Track widget colors by widget ID

  // function to update widget color
  const updateWidgetColor = (widgetId, colorId) => {
    setWidgetColors((prevColors) => ({
      ...prevColors,
      [widgetId]: colorId,
    }));
  };


  // function to remove widget color of the removed widget
  const removeWidgetColor = (widgetId) => {
    setWidgetColors((prevColors) => {
      const updatedColors = { ...prevColors };
      delete updatedColors[widgetId]; 
      return updatedColors;
    });
  };

  console.log('Widget Colors:', widgetColors);

  //#region state updt logic 
  const updateSelectedStock = (stock, widgetId) => {
    const widgetColor = widgetColors[widgetId];
    console.log(`Widget ID: ${widgetId}, Color ID: ${widgetColor}`);
    console.log('Current Widget Colors:', widgetColors);

    // Find all widgets with the same color
    const matchingWidgets = Object.keys(widgetColors).filter(
      (id) => widgetColors[id] === widgetColor
    );

    //update the states for all the matching color widgets
    if (matchingWidgets.length > 1) {
      console.log(`Matching Widgets Found: ${matchingWidgets}`);
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
        removeWidgetColor,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => useContext(StockContext);