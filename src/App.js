import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import "./App.css";

function App() {
  const [playerData, setPlayerData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "MSR",
    direction: "desc",
  });

  // Correct CSV filename
  const csvUrl = process.env.PUBLIC_URL + "/stt_msr.csv";

  /* ---------------------------------------------
     LOAD DATA + MAP CSV HEADERS CORRECTLY
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

  /* ---------------------------------------------
     FILTER — SEARCH BY NAME
  --------------------------------------------- */
  const filteredData = sortedData.filter((player) =>
    player.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------------------------------------------
     COLOR CODING BASED ON MSR AVERAGE TIERS
     Elite      >= 20
     Strong     >= 10
     Emerging   >= 1
     Developing < 1
  --------------------------------------------- */
  const getMSRClass = (avg) => {
    if (avg >= 20) return "msr-elite";
    if (avg >= 10) return "msr-strong";
    if (avg >= 1) return "msr-emerging";
    return "msr-developing";
  };

  /* ---------------------------------------------
     RENDER
  --------------------------------------------- */
  return (
    <div className="app-container">
      <header className="app-header">St. T’s MSR Leaderboard</header>

      <input
        type="text"
        className="search-bar"
        placeholder="Search players..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("Name")}>Name</th>
              <th onClick={() => handleSort("Games")}>Games</th>
              <th onClick={() => handleSort("MSR")}>MSR</th>
              <th onClick={() => handleSort("MSR_Avg")}>MSR Avg</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((player, idx) => (
              <tr key={idx}>
                <td>{player.Name}</td>
                <td>{player.Games}</td>

                {/* MSR Value */}
                <td>{player.MSR.toFixed(2)}</td>

                {/* MSR Avg with Color Tier */}
                <td className={getMSRClass(player.MSR_Avg)}>
                  {player.MSR_Avg.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;






















