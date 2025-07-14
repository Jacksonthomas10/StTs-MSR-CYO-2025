// File: /src/MSRSummerLeagueData2025.js
import React, { useEffect, useState } from 'react';
import './App.css';

function MSRSummerLeagueData2025() {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/MSR Summer League Data 7-14-25 - w Archetypes.csv`)
      .then((response) => response.text())
      .then((csv) => {
        const [headerLine, ...lines] = csv.trim().split('\n');
        const headers = headerLine.split(',');
        const rows = lines.map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, i) => {
            obj[header.trim()] = values[i]?.trim();
            return obj;
          }, {});
        });
        setData(rows);
      });
  }, []);

  const sortTable = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setData((prevData) => {
      return [...prevData].sort((a, b) => {
        const aVal = isNaN(+a[key]) ? a[key] : +a[key];
        const bVal = isNaN(+b[key]) ? b[key] : +b[key];
        if (aVal < bVal) return direction === 'ascending' ? -1 : 1;
        if (aVal > bVal) return direction === 'ascending' ? 1 : -1;
        return 0;
      });
    });
  };

  return (
    <div className="App">
      <h1>Summer League 2025 MSR Leaderboard</h1>
      {data.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key} onClick={() => sortTable(key)} style={{ cursor: 'pointer' }}>
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((val, i) => (
                  <td key={i}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MSRSummerLeagueData2025;



