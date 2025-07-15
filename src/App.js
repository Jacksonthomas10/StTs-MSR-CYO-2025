import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import './App.css';

function App() {
  const [playerData, setPlayerData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'MSR', direction: 'descending' });
  const [loading, setLoading] = useState(true);

  const csvUrl = process.env.PUBLIC_URL + '/msr_summer_league_2025.csv';

  useEffect(() => {
    d3.csv(csvUrl, (row) => {
      return {
        Player: row['Player'],
        MSR: +row['MSR'],
        MIN: +row['MIN'],
        PTS: +row['PTS'],
        FGM: +row['FGM'],
        FGA: +row['FGA'],
        FGPercent: +row['FG%'],
        '3PTM': +row['3PTM'],
        '3PA': +row['3PA'],
        '3PPercent': +row['3P%'],
        FTM: +row['FTM'],
        FTA: +row['FTA'],
        FTPercent: +row['FT%'],
        OREB: +row['OREB'],
        DREB: +row['DREB'],
        REB: +row['REB'],
        AST: +row['AST'],
        TOV: +row['TOV'],
        STL: +row['STL'],
        BLK: +row['BLK'],
        PF: +row['PF'],
        PlusMinus: +row['Plus/Minus'],
        EuropeanArchetype: row['European Archetype']
      };
    }).then((data) => {
      setPlayerData(data);
      setLoading(false);
    });
  }, []);

  const sortTable = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sorted = [...playerData].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setPlayerData(sorted);
  };

  const getMSRClass = (val) => {
    if (val >= 7) return 'highlight-high';
    if (val >= 5) return 'highlight-mid';
    return 'highlight-low';
  };

  const filteredData = playerData.filter((player) =>
    player.Player.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <header className="app-header">
        🏀 <span className="msr-title">MSR Leaderboard</span> – 2025 NBA Summer League
      </header>

      <input
        type="text"
        className="search-bar"
        placeholder="Search by player name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Loading data…</p>
      ) : (
        <div className="table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                {Object.keys(playerData[0] || {}).map((key) => (
                  <th key={key} onClick={() => sortTable(key)}>
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((player, index) => (
                <tr key={index}>
                  {Object.entries(player).map(([key, val]) => (
                    <td
                      key={key}
                      className={key === 'MSR' ? getMSRClass(val) : ''}
                    >
                      {val}
                    </td>
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

export default App;





