import React, { useState, useEffect, useCallback } from "react";
import "../style/PlayerSearch.css";

const API_URL = "http://localhost:3000";

const translateAvailability = {
  morning: "Mañana",
  afternoon: "Tarde",
  evening: "Noche",
  allDay: "Todo el día",
};

const PlayerSearch = () => {
  const [gameQuery, setGameQuery] = useState("");
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("default");
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState("default");
  const [timeSlot, setTimeSlot] = useState("default");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 3;
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Fetch de juegos
  useEffect(() => {
    const delayFetch = setTimeout(() => {
      if (gameQuery.length > 2) {
        fetch(`${API_URL}/search/games?query=${gameQuery}`)
          .then((response) => response.json())
          .then((data) => setGames(Array.isArray(data.games) ? data.games : []))
          .catch((error) => console.error("Error fetching games:", error));
      }
    }, 500);

    return () => clearTimeout(delayFetch);
  }, [gameQuery]);

  // Fetch de plataformas basado en juego seleccionado
  useEffect(() => {
    if (!selectedGame || selectedGame === "default") return;
    fetch(`${API_URL}/platforms?game=${selectedGame}`)
      .then((response) => response.json())
      .then((data) =>
        setPlatforms(Array.isArray(data.platforms) ? data.platforms : [])
      )
      .catch((error) => console.error("Error fetching platforms:", error));
  }, [selectedGame]);

  // Manejo de búsqueda de jugadores
  const handleSearch = useCallback(() => {
    if (
      !selectedGame ||
      selectedGame === "default" ||
      !selectedPlatform ||
      selectedPlatform === "default" ||
      !timeSlot ||
      timeSlot === "default"
    ) {
      setErrorMessage(
        "Por favor, selecciona todos los filtros antes de buscar."
      );
      return;
    }

    const translatedTimeSlot = translateAvailability[timeSlot] || timeSlot; // 🔥 Traducimos el horario al español

    console.log("Valores enviados:", {
      selectedGame,
      selectedPlatform,
      timeSlot,
    });
    console.log(
      `🔎 URL enviada: ${API_URL}/users?game=${selectedGame}&platform=${selectedPlatform}&time=${timeSlot}&page=${currentPage}&limit=${limit}`
    );

    const savedSession = localStorage.getItem("user");
    const token = savedSession ? JSON.parse(savedSession).token : null;

    if (!token) {
      setErrorMessage("Debes iniciar sesión para buscar jugadores.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSearchTriggered(true);

    fetch(
      `${API_URL}/users?game=${selectedGame}&platform=${selectedPlatform}&time=${translatedTimeSlot}&page=${currentPage}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data || !data.users || !Array.isArray(data.users)) {
          setErrorMessage("Error al obtener jugadores. Intenta nuevamente.");
          setPlayers([]);
          setLoading(false);
          return;
        }

        if (data.users.length === 0) {
          setErrorMessage(
            "No se encontraron jugadores que coincidan con tus preferencias. Prueba ajustando los filtros."
          );
          setPlayers([]);
        } else {
          setPlayers(data.users);
          setTotalUsers(data.totalUsers || 0);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching players:", error);
        setLoading(false);
      });
  }, [currentPage, selectedGame, selectedPlatform, timeSlot]);

  // Paginación: Moverse a la página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Paginación: Moverse a la página siguiente
  const nextPage = () => {
    if (currentPage * limit < totalUsers) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Ejecutar búsqueda cuando cambia la página **solo si ya se activó manualmente**
  useEffect(() => {
    if (searchTriggered) {
      handleSearch();
    }
  }, [currentPage, handleSearch, searchTriggered]);

  //Reseteo de los filtros
  const clearFilters = () => {
    setSelectedGame("default");
    setSelectedPlatform("default");
    setTimeSlot("default");
    setGameQuery("");
    setPlayers([]);
    setErrorMessage("");
    setSearchTriggered(false);
  };

  return (
    <div className="player-search-container">
      <h2>Buscar Jugadores</h2>

      {/* Input para buscar juegos */}
      <input
        type="text"
        value={gameQuery}
        onChange={(e) => {
          setGameQuery(e.target.value);
          setShowDropdown(true);
        }}
        placeholder="Escribe el nombre del juego..."
      />

      {showDropdown && (
        <ul className="game-dropdown">
          {games.length > 0 ? (
            games.map((game) => (
              <li
                key={game._id}
                onClick={() => {
                  setSelectedGame(game._id);
                  setGameQuery(game.name);
                  setShowDropdown(false);
                  setErrorMessage("");
                }}
              >
                {game.name}
              </li>
            ))
          ) : (
            <p>No se encontraron juegos.</p>
          )}
        </ul>
      )}

      {/* Dropdown de plataforma */}
      <select
        value={selectedPlatform}
        onChange={(e) => setSelectedPlatform(e.target.value)}
      >
        <option value="default" disabled>
          Selecciona una plataforma
        </option>
        {platforms.length > 0 ? (
          platforms.map((platform) => (
            <option key={platform._id} value={platform._id}>
              {platform.name}
            </option>
          ))
        ) : (
          <option disabled>No hay plataformas disponibles</option>
        )}
      </select>

      {/* Dropdown de horario */}
      <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
        <option value="default" disabled>
          Selecciona un horario
        </option>
        <option value="morning">Mañana</option>
        <option value="afternoon">Tarde</option>
        <option value="evening">Noche</option>
        <option value="allDay">Todo el día</option>
      </select>

      <div className="search-clear-buttons">
        <button className="player-search-button" onClick={handleSearch}>
          Buscar
        </button>
        <button className="clear-filters-button" onClick={clearFilters}>
          Restablecer
        </button>
      </div>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {loading && <p>Cargando jugadores...</p>}

      {players.length > 0 && (
        <div>
          <ul className="player-search-list">
            {players.map((player) => (
              <li key={player._id} className="player-search-card">
                <img
                  src={player.avatar}
                  alt={player.username}
                  className="player-search-avatar"
                />
                <div className="player-search-info">
                  <span className="player-search-name">{player.username}</span>
                  <div className="player-search-buttons">
                    <button className="view-profile-button">Ver perfil</button>
                  </div>
                </div>{" "}
              </li>
            ))}
          </ul>
          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>Página {currentPage}</span>
            <button
              onClick={nextPage}
              disabled={
                currentPage * limit >= totalUsers || players.length < limit
              }
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerSearch;
