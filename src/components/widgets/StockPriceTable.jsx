import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useStock } from '../../contexts/StockContext';

const StockPriceTable = () => {
  const { setSelectedStock } = useStock();

  const data = useMemo(() => [
    { symbol: 'AAPL', price: 154.32, change: +2.35, changePercent: +1.55 },
    { symbol: 'MSFT', price: 328.39, change: -1.24, changePercent: -0.38 },
    { symbol: 'GOOGL', price: 2752.11, change: +15.32, changePercent: +0.56 },
    { symbol: 'AMZN', price: 3345.21, change: -23.45, changePercent: -0.70 },
    { symbol: 'TSLA', price: 1024.86, change: +32.54, changePercent: +3.28 },
    { symbol: 'NVDA', price: 678.90, change: +12.34, changePercent: +1.85 },
    { symbol: 'META', price: 345.67, change: -5.43, changePercent: -1.55 },
    { symbol: 'NFLX', price: 456.78, change: +8.76, changePercent: +1.95 },
    { symbol: 'AMD', price: 123.45, change: +3.21, changePercent: +2.67 },
    { symbol: 'INTC', price: 45.67, change: -0.89, changePercent: -1.91 },
  ], []);

  const columns = useMemo(() => [
    {
      accessorKey: 'symbol',
      header: 'Symbol',
      cell: info => (
        <button 
          onClick={() => {
            setSelectedStock(info.row.original);
            console.log('Selected stock:', info.row.original);
          }}
          className="hover:text-blue-400 hover:underline"
        >
          {info.getValue()}
        </button>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: info => `$${info.getValue().toFixed(2)}`,
    },
    {
      accessorKey: 'change',
      header: 'Change',
      cell: info => {
        const change = info.row.original.change;
        const changePercent = info.row.original.changePercent;
        const isPositive = change >= 0;
        return (
          <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
            {isPositive ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
          </span>
        );
      },
    },
  ], [setSelectedStock]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="h-full p-3 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-3 text-blue-400">Stock Prices</h3>
      
      <div className="mb-4">
        <input
          placeholder="Search stocks..."
          value={table.getState().globalFilter ?? ''}
          onChange={e => table.setGlobalFilter(e.target.value)}
          className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 w-full md:w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-gray-700">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th 
                      key={header.id} 
                      className="text-left pb-2 px-2"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center cursor-pointer hover:text-white">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' ↑',
                          desc: ' ↓',
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="py-2 px-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded border border-gray-600 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className="px-3 py-1 rounded border border-gray-600 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span>
            Page{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600"
          >
            {[5, 10, 25, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StockPriceTable;