import React from "react";

/**
 * columns = [
 *   { label: "No", key: "number", render: (_, index) => index + 1 },
 *   { label: "User", key: "user" },
 *   { label: "Company", key: "company" },
 *   {
 *     label: "Status",
 *     key: "status",
 *     render: (row) => <StatusBadge status={row.status}/>
 *   },
 * ]
 */

export default function ResponsiveTable({ data = [], columns = [], rowKey = "id", actions }) {
  return (
    <div className="w-full bg-white shadow rounded-xl overflow-hidden">

      {/* =========================================================
          DESKTOP TABLE (md+)
      ========================================================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full table-fixed text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3">
                  {col.label}
                </th>
              ))}

              {actions && <th className="px-4 py-3">Actions</th>}
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
            {columns.map((col) => (
              <p key={col.key} className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">{col.label}: </span>
                {col.render ? col.render(row, index) : row[col.key]}
              </p>
            ))}

            {actions && (
              <div className="mt-2">
                {actions(row, index)}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
