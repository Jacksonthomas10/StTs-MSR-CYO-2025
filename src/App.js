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

  // CSV file in /public
  const csvUrl = process.env.PUBLIC_URL + "/stt_msr.csv";

  /* ---------------------------------------------
     LOAD DATA FROM CSV
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
     SORTING
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
     FILTER BY SEARCH
  --------------------------------------------- */
  const filteredData = sortedData.filter((player) =>
    player.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------------------------------------------
     COLOR CODING BASED ON MSR AVERAGE
     elite > 20, strong 10–20, emerging < 10
  --------------------------------------------- */
  const getMSRClass = (value) => {
    if (value >= 20) return "msr-elite";
    if (value >= 10) return "msr-strong";
    return "msr-emerging";
  };

  /* ---------------------------------------------
     SEARCH TERM HIGHLIGHTER
  --------------------------------------------- */
  const highlightMatch = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "i");
    return text.replace(regex, "<mark>$1</mark>");
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

      {/* Desktop Table View */}
      <div className="table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("Name")}>
                Name {sortConfig.key === "Name" && <span className="sort-arrow">⬍</span>}
              </th>
              <th onClick={() => handleSort("Games")}>
                Games {sortConfig.key === "Games" && <span className="sort-arrow">⬍</span>}
              </th>
              <th onClick={() => handleSort("MSR")}>
                MSR {sortConfig.key === "MSR" && <span className="sort-arrow">⬍</span>}
              </th>
              <th onClick={() => handleSort("MSR_Avg")}>
                MSR Avg {sortConfig.key === "MSR_Avg" && <span className="sort-arrow">⬍</span>}
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((player, idx) => (
              <tr key={idx} className="fade-in">
                <td
                  dangerouslySetInnerHTML={{ __html: highlightMatch(player.Name) }}
                />
                <td>{player.Games}</td>
                <td className={getMSRClass(player.MSR)}>{player.MSR.toFixed(2)}</td>
                <td className={getMSRClass(player.MSR_Avg)}>{player.MSR_Avg.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-only">
        {filteredData.map((player, idx) => (
          <div className="mobile-card fade-in" key={idx}>
            <div
              className="mobile-name"
              dangerouslySetInnerHTML={{ __html: highlightMatch(player.Name) }}
            />

            <div className="stat">Games: {player.Games}</div>

            <div className={`stat ${getMSRClass(player.MSR)}`}>
              MSR: {player.MSR.toFixed(2)}
            </div>

            <div className={`stat ${getMSRClass(player.MSR_Avg)}`}>
              Avg: {player.MSR_Avg.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;























