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

        // Move MSR column right before MIN for emphasis
        const modifiedRows = rows.map(row => {
          if ('MSR' in row && 'MIN' in row) {
            const newRow = {};
            for (const key of Object.keys(row)) {
              if (key === 'MIN') {
                newRow[''] = ''; // spacer column
                newRow['MSR'] = row['MSR'];
              }
              if (key !== 'MSR') {
                newRow[key] = row[key];
              }
            }
            return newRow;
          }
          return row;
        });

        setData(modifiedRows);
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

  const getMSRClass = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return '';
    if (num >= 7) return 'highlight-high';
    if (num >= 5) return 'highlight-mid';
    return 'highlight-low';
  };

  const renderCell = (key, val) => {
    if (key === 'MSR') {
      const className = getMSRClass(val);
      const width = Math.min(Math.max((parseFloat(val) || 0) * 10, 10), 100);
      return (
        <td className={className}>
          <div className="msr-bar" style={{ width: `${width}%` }}>{val}</div>
        </td>
      );
    }
    return <td>{val}</td>;
  };

  return (
    <div className="app-container">
      <h1 className="title">🏀 MSR Leaderboard – 2025 NBA Summer League</h1>
      {data.length === 0 ? (
        <p className="loading">Loading data...</p>
      ) : (
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key} onClick={() => sortTable(key)}>
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  {Object.entries(row).map(([key, val], i) => (
                    <React.Fragment key={i}>{renderCell(key, val)}</React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MSRSummerLeagueData2025;
