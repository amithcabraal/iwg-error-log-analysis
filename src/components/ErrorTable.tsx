import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { ErrorLog } from '../types';

interface Props {
  data: ErrorLog[];
  onViewDetails: (error: ErrorLog) => void;
}

const ErrorTable: React.FC<Props> = ({ data, onViewDetails }) => {
  const columnHelper = createColumnHelper<ErrorLog>();

  const columns = [
    columnHelper.accessor('@timestamp', {
      header: 'Timestamp',
      cell: info => format(new Date(info.getValue()), 'yyyy-MM-dd HH:mm:ss'),
    }),
    columnHelper.accessor('bluescreen.gameName', {
      header: 'Game',
    }),
    columnHelper.accessor('bluescreen.error', {
      header: 'Error',
    }),
    columnHelper.accessor(row => row.bluescreen.ua?.platform, {
      header: 'Platform',
    }),
    columnHelper.accessor(row => row.bluescreen.ua?.brands[0].brand, {
      header: 'Browser',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <button
          onClick={() => onViewDetails(row.original)}
          className="p-2 text-blue-600 hover:text-blue-800"
          title="View Details"
        >
          <Eye className="w-5 h-5" />
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Error Details</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ErrorTable;