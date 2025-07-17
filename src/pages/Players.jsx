import { useState, useEffect, useContext } from "react";
import PlayerSearch from "../components/PlayerSearch";
import PlayerCard from "../components/PlayerCard";
import AuthContext from "../context/AuthContext";
import "../style/PlayerCard.css";
const Players = () => {
  const [players, setPlayers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Estado para la paginación
  const url = import.meta.env.VITE_API_URL;
  const { token } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState({});
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const params = new URLSearchParams(searchQuery);
        const response = await fetch(`${url}/users?${params}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setPlayers(data.users);
        console.log("Players fetched successfully:", data.users);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, [searchQuery, token, url]);

  const userPerPage = 10; // Numero di utenti per pagina
  const indexOfLastEvent = currentPage * userPerPage; // Índice del último evento en la página actual = pagina actual * eventos por página,ej: si estamos en la página 1 y hay 10 eventos por página, indexOfLastEvent será 10
  const indexOfFirstEvent = indexOfLastEvent - userPerPage; // Índice del primer evento en la página actual = índice del último evento - eventos por página, ej: si estamos en la página 1(10*1) y hay 10 eventos por página, indexOfFirstEvent será 0(10-10)
  const currentUser = players.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(players.length / userPerPage); // Total de páginas = número total de eventos / eventos por página, ej: si hay 25 eventos y hay 10 eventos por página, totalPages será 3 (25/10=2.5, redondeado a 3)math.ceil redondea hacia arriba el número de páginas totales.

  // Funciones para manejar la paginación
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      <PlayerSearch setQuery={setSearchQuery} />

      <div className="players-list">
        {currentUser.map((player) => (
          <PlayerCard key={player._id} player={player} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="pagination-btn-events"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            ← Anterior
          </button>
          <span className="pagination-info-events">
            {currentPage} / {totalPages}
          </span>
          <button
            className="pagination-btn-events"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};
export default Players;
