import React, { useState, useEffect } from "react";
import "../style/PlayerSearch.css";

const API_URL = "http://localhost:3000";

const PlayerSearch = () => {
  const [gameQuery, setGameQuery] = useState("");
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); //estado para manejar el desplegable de los juegos

  // Fetch de juegos
  useEffect(() => {
    const delayFetch = setTimeout(() => {
      if (gameQuery.length > 2) {
        console.log("Buscando juegos con query:", gameQuery);
        fetch(`${API_URL}/search/games?query=${gameQuery}`)
          .then((response) => response.json())
          .then((data) => {
            console.log("Juegos recibidos:", data.games);
            setGames(Array.isArray(data.games) ? data.games : []);
          })
          .catch((error) => console.error("Error fetching games:", error));
      }
    }, 500);

    return () => clearTimeout(delayFetch);
  }, [gameQuery]);

  // Fetch de plataformas basado en juego seleccionado
  useEffect(() => {
    if (!selectedGame) return; // Evita la llamada si no hay juego seleccionado

    console.log("Juego seleccionado:", selectedGame);
    fetch(`${API_URL}/platforms?game=${selectedGame}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Plataformas recibidas:", data);
        setPlatforms(Array.isArray(data.platforms) ? data.platforms : []);
      })
      .catch((error) => console.error("Error fetching platforms:", error));
  }, [selectedGame]); // Se ejecuta cuando cambia el juego seleccionado

  // Manejo de búsqueda de jugadores
  const handleSearch = () => {
    console.log("Valores antes de la validación:", {
      selectedGame,
      selectedPlatform,
      timeSlot,
    });
    if (!selectedGame || !selectedPlatform || !timeSlot) {
      setErrorMessage(
        "Por favor, selecciona todos los filtros antes de buscar."
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    fetch(
      `${API_URL}/users?game=${selectedGame}&platform=${selectedPlatform}&time=${timeSlot}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Jugadores encontrados:", data);
        setPlayers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching players:", error);
        setLoading(false);
      });
  };

  return (
    <div>
      <h2>Buscar Jugadores</h2>

      <label>Juego:</label>
      <input
        type="text"
        value={gameQuery}
        onChange={(e) => {
          setGameQuery(e.target.value);
          setShowDropdown(true); // Muestra el desplegable al escribir
        }}
        placeholder="Escribe el nombre del juego..."
      />
      {showDropdown && (
        <ul>
          {games.length > 0 ? (
            games.map((game) => (
              <li
                key={game._id}
                onClick={() => {
                  console.log("Juego seleccionado:", game._id);
                  setSelectedGame(game._id);
                  setGameQuery(game.name); // Actualiza el input
                  setShowDropdown(false); // Oculta el desplegable al seleccionar
                  setErrorMessage(""); // Limpia el mensaje de error
                }}
                style={{
                  cursor: "pointer",
                  padding: "5px",
                  borderBottom: "1px solid #ccc",
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
      <label>Plataforma:</label>
      <select
        value={selectedPlatform}
        onChange={(e) => {
          setSelectedPlatform(e.target.value);
          setErrorMessage(""); // Limpia el mensaje de error al seleccionar
        }}
      >
        {platforms.length > 0 ? (
          platforms.map((platform) => (
            <option key={platform._id} value={platform._id}>
              {platform.name}
            </option>
          ))
        ) : (
          <option disabled>
            No hay plataformas disponibles para este juego
          </option>
        )}
      </select>

      <label>Horario:</label>
      <select
        value={timeSlot}
        onChange={(e) => {
          setTimeSlot(e.target.value);
          setErrorMessage(""); // Limpia el mensaje de error al seleccionar
        }}
      >
        <option value="morning">Mañana</option>
        <option value="afternoon">Tarde</option>
        <option value="evening">Noche</option>
      </select>

      <button onClick={handleSearch}>Buscar</button>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {loading && <p>Cargando jugadores...</p>}

      {players.length > 0 ? (
        <ul>
          {players.map((player) => (
            <li key={player.id}>
              {player.name} - {player.platform}
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron jugadores. Prueba ajustando los filtros.</p>
      )}
    </div>
  );
};

export default PlayerSearch;
