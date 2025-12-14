import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import "./App.css";

function App() {
  const [playerData, setPlayerData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "MSR_Avg",
    direction: "desc",
  });

  const csvUrl = process.env.PUBLIC_URL + "/stt_msr.csv";

  /* ---------------------------------------------
     LOAD DATA
  --------------------------------------------- */
  useEffect(() => {
    d3.csv(csvUrl).then((data) => {
      const cleaned = data.map((row) => ({
        Name: row["Name"],
        Games: Number(row["Games Played"]),
        MSR: Number(row["MSR"]),
        MSR_Avg: Number(row["MSR Avg"]),
      }));
      setPlayerData(cleaned);
    });
  }, [csvUrl]);

  /* ---------------------------------------------
     SORTING LOGIC
  --------------------------------------------- */
  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const sortedData = [...playerData].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter((player) =>
    player.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------------------------------------------
     COLOR CODING FOR MSR AVG
  --------------------------------------------- */
  const getMSRClass = (value) => {
    if (value > 20) return "msr-high";
    if (value >= 10) return "msr-mid";
    return "msr-low";
  };

  return (
    <div className="app-container">
      <header className="app-header">St. T’s MSR Leaderboard</header>

      {/* Search */}
      <input
        type="text"
        className="search-bar"
        placeholder="Search players..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* ---------- DESKTOP TABLE ---------- */}
      <div className="table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("Name")}>
                Name {sortConfig.key === "Name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleSort("Games")}>
                Games {sortConfig.key === "Games" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleSort("MSR")}>
                MSR {sortConfig.key === "MSR" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleSort("MSR_Avg")}>
                MSR Avg {sortConfig.key === "MSR_Avg" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((player, idx) => (
              <tr key={idx}>
                <td>{player.Name}</td>
                <td>{player.Games}</td>
                <td>{player.MSR.toFixed(2)}</td>
                <td className={getMSRClass(player.MSR_Avg)}>
                  {player.MSR_Avg.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- MOBILE CARD VIEW ---------- */}
      <div className="mobile-only">
        <div className="mobile-sort-bar">
          <button onClick={() => handleSort("Name")}>
            Name {sortConfig.key === "Name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
          </button>
          <button onClick={() => handleSort("MSR_Avg")}>
            MSR Avg {sortConfig.key === "MSR_Avg" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
          </button>
        </div>

        {filteredData.map((player, idx) => (
          <div className="mobile-card" key={idx}>
            <div className="mobile-name">{player.Name}</div>
            <div className="mobile-stat">Games: {player.Games}</div>
            <div className="mobile-stat">MSR: {player.MSR.toFixed(2)}</div>
            <div className={`mobile-stat ${getMSRClass(player.MSR_Avg)}`}>
              MSR Avg: {player.MSR_Avg.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
























