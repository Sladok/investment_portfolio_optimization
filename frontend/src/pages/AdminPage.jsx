import React, { useEffect, useState } from "react";

function AdminPage() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState({ columns: [], data: [] });

  useEffect(() => {
    fetch("http://localhost:8000/tables")
      .then((res) => res.json())
      .then((data) => setTables(data.tables || []));
  }, []);

  const fetchTableData = (tableName) => {
    fetch(`http://localhost:8000/table/${tableName}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedTable(tableName);
        setTableData(data);
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Админ-панель ClickHouse</h1>
      <div className="flex gap-4 mt-4">
        <div className="w-1/4">
          <h2 className="text-lg font-semibold">Таблицы</h2>
          <ul>
            {tables.map((table) => (
              <li key={table}>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => fetchTableData(table)}
                >
                  {table}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-3/4">
          {selectedTable && (
            <div>
              <h2 className="text-lg font-semibold">Таблица: {selectedTable}</h2>
              <table className="w-full border mt-2">
                <thead>
                  <tr>
                    {tableData.columns.map((col) => (
                      <th key={col} className="border px-2 py-1">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.data.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className="border px-2 py-1">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
