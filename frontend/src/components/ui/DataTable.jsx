export default function DataTable({ columns, data, onRowClick, loading, emptyMessage = 'No data found' }) {
  return (
    <div className="bg-white rounded-xl shadow-table overflow-hidden border border-light-gray/60">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-off-white border-b-2 border-light-gray">
              {columns.map((col, i) => (
                <th key={i} className={`px-6 py-4 text-left text-sm font-bold text-justice-blue ${col.width || ''}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-light-gray/60">
            {data.map((row, rowIdx) => (
              <tr
                key={row._id || rowIdx}
                onClick={() => onRowClick?.(row)}
                className={`hover:bg-off-white transition-all duration-150 ${onRowClick ? 'cursor-pointer' : ''} ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 text-sm">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <p className="text-dark-gray">{emptyMessage}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
