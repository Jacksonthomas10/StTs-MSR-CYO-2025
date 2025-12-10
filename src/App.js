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

  const csvUrl = process.env.PUBLIC_URL + "/stt_msr_clean_fixed.csv";

  /* ---------------------------------------------
     LOAD DATA
  --------------------------------------------- */
  useEffect(() => {
    d3.csv(csvUrl).then((data) => {
      const cleaned = data.map((row) => ({
        Name: row.Name,
        Games: Number(row.Games),
        MSR: Number(row.MSR),
        MSR_Avg: Number(row.MSR_Avg),
      }));

      setPlayerData(cleaned);
    });
  }, [csvUrl]);

  /* ---------------------------------------------
     SCROLL SHADOW EFFECT
  --------------------------------------------- */
  useEffect(() => {
    const container = document.querySelector(".table-container");

    const onScroll = () => {
      if (!container) return;

      // left shadow
      if (container.scrollLeft > 0) {
        container.classList.add("scrolled-left");
      } else {
        container.classList.remove("scrolled-left");
      }

      // right shadow
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 2
      ) {
        container.classList.add("scrolled-right");
      } else {
        container.classList.remove("scrolled-right");
      }
    };

    if (container) container.addEventListener("scroll", onScroll);
    return () => {
      if (container) container.removeEventListener("scroll", onScroll);
    };
  }, []);

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

  const getMSRClass = (value) => {
    if (value >= 35) return "msr-high";
    if (value >= 15) return "msr-mid";
    return "msr-low";
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
              <th onClick={() => handleSort("Name")}>
                Name{" "}
                {sortConfig.key === "Name" && (
                  <span className="sort-arrow">⬍</span>
                )}
              </th>

              <th onClick={() => handleSort("Games")}>
                Games{" "}
                {sortConfig.key === "Games" && (
                  <span className="sort-arrow">⬍</span>
                )}
              </th>

              <th onClick={() => handleSort("MSR")}>
                MSR{" "}
                {sortConfig.key === "MSR" && (
                  <span className="sort-arrow">⬍</span>
                )}
              </th>

              <th onClick={() => handleSort("MSR_Avg")}>
                MSR Avg{" "}
                {sortConfig.key === "MSR_Avg" && (
                  <span className="sort-arrow">⬍</span>
                )}
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((player, idx) => (
              <tr key={idx}>
                <td>{player.Name}</td>

                <td>{player.Games}</td>

                <td className={getMSRClass(player.MSR)}>
                  {player.MSR.toFixed(2)}
                </td>

                <td>{player.MSR_Avg.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;



















