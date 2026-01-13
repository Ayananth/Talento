import React from "react";

/**
 * PROPS:
 * data: array of table rows
 * columns: [
 *   {
 *     label: "Company",
 *     key: "company",
 *     sortable: true,
 *     render: (row, index) => JSX
 *   }
 * ]
 *
 * rowKey: string identifying unique key (default: "id")
 * actions: (row, index) => JSX button(s)
 * ordering: current ordering string ("company", "-company", "")
 * onSort: function(key)
 */

export default function ResponsiveTable({
  data = [],
  columns = [],
  rowKey = "id",
  actions,
  ordering = "",
  onSort,
}) {
  return (
    <div className="w-full bg-white shadow rounded-xl overflow-hidden">

      {/* =========================================================
          DESKTOP TABLE (md+)
      ========================================================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full table-fixed text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {columns.map((col) => {
                const isAsc = ordering === col.key;
                const isDesc = ordering === `-${col.key}`;

                return (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-sm font-semibold ${
                      col.sortable ? "cursor-pointer hover:bg-gray-200 select-none" : ""
                    }`}
                    onClick={() => col.sortable && onSort && onSort(col.orderingKey || col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}

                      {/* Sort icons */}
                      {col.sortable && isAsc && <span>↑</span>}
                      {col.sortable && isDesc && <span>↓</span>}
                    </div>
                  </th>
                );
              })}

              {actions && <th className="px-4 py-3 text-sm font-semibold">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr key={row[rowKey]} className="border-t hover:bg-gray-50">

                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 break-words">
                    {col.render ? col.render(row, index) : row[col.key]}
                  </td>
                ))}

                {actions && (
                  <td className="px-4 py-3">
                    {actions(row, index)}
                  </td>
                )}

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================================================
          MOBILE CARD VIEW (below md)
      ========================================================= */}
    <div className="md:hidden p-3 space-y-3">
      {data.map((row, index) => (
        <div
          key={row[rowKey]}
          className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md"
        >
          {columns.map((col) => {
            const isAsc = ordering === col.key;
            const isDesc = ordering === `-${col.key}`;

            return (
              <div key={col.key} className="mb-2 text-sm text-gray-700">
                <span className="font-semibold">{col.label}: </span>

                {col.sortable ? (
                  <span
                    onClick={() => onSort(col.orderingKey || col.key)}
                    className="cursor-pointer underline"
                  >
                    {col.render ? col.render(row, index) : row[col.key]}
                    {isAsc && <span> ↑</span>}
                    {isDesc && <span> ↓</span>}
                  </span>
                ) : (
                  <span>
                    {col.render ? col.render(row, index) : row[col.key]}
                  </span>
                )}
              </div>
            );
          })}

          {actions && (
            <div className="mt-3">
              {actions(row, index)}
            </div>
          )}
        </div>
      ))}
    </div>


    </div>
  );
}
