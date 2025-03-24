import React, { useEffect, useState } from "react";
import Header from "../components/Header"; // Подключаем Header
import { Helmet } from "react-helmet-async";

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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">

      <Helmet>
        <title>InvestNavigator - Страница админа</title>
        <meta name="description" content="Админ" />
      </Helmet>

      <Header />

      <div className="flex-grow p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Админ-панель ClickHouse
        </h1>

        <div className="flex gap-6">
          {/* Боковая панель с таблицами */}
          <div className="w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Таблицы</h2>
            <ul className="space-y-2">
              {tables.map((table) => (
                <li key={table}>
                  <button
                    className="text-blue-400 hover:text-blue-500 transition"
                    onClick={() => fetchTableData(table)}
                  >
                    {table}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Основной контент */}
          <div className="w-3/4 bg-gray-800 p-4 rounded-lg shadow-lg">
            {selectedTable ? (
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  Таблица: {selectedTable}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-700">
                    <thead>
                      <tr className="bg-gray-700">
                        {tableData.columns.map((col) => (
                          <th key={col} className="border px-3 py-2">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.data.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-600 transition">
                          {row.map((cell, j) => (
                            <td key={j} className="border px-3 py-2">
                              {Array.isArray(cell) ? cell.join(", ") : String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-400">Выберите таблицу</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
