import React from "react";
import "../style/Pagination.css";

function Pagination({ currentPage, handleOnClick, games, gamesPerPage }) {
  return (
    <div className="pagination">
      <button
        onClick={() => handleOnClick("anterior")}
        disabled={currentPage === 1}
      >
        Anterior
      </button>
      <span>Página {currentPage}</span>
      <button
        onClick={() => handleOnClick("siguiente")}
        disabled={games.length < gamesPerPage}
      >
        Siguiente
      </button>
    </div>
  );
}

export default Pagination;
