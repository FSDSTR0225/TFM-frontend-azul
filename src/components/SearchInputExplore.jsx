import React from "react";
import "../style/SearchInputExplore.css";

const SearchInputExplore = ({ search, setSearch, showSearch }) => {
  return (
    <section className="search-section">
      <div id="search-container">
        {showSearch && (
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            type="text"
            placeholder="Busca jugadores afines,eventos,juegos.."
          />
        )}
      </div>
    </section>
  );
};

export default SearchInputExplore;
