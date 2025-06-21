import React from 'react';

const Table = ({ columns, data }) => {
  return (
    <table className="min-w-full bg-white border">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col} className="py-2 px-4 border-b text-left bg-gray-100">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="border-b hover:bg-gray-50">
            {Object.values(row).map((val, j) => (
              <td key={j} className="py-2 px-4">
                {val}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;