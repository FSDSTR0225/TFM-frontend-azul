import React, { useState, useEffect } from "react";
import "../style/PlayerSearch.css";

const API_URL = "http://localhost:3000";

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
  const [showDropdown, setShowDropdown] = useState(false); // Estado para manejar el desplegable de juegos

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
    if (!selectedGame || selectedGame === "default") return; // Evita la llamada si no hay juego válido

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

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("Debes iniciar sesión para buscar jugadores.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    fetch(
      `${API_URL}/users?game=${selectedGame}&platform=${selectedPlatform}&time=${timeSlot}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Envía el token de autenticación
        },
      }
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
    <div className="player-search-container">
      <h2>Buscar Jugadores</h2>

      {/* Input para buscar juegos */}
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
      {/* Dropdown para seleccionar juego */}
      <select
        value={selectedPlatform}
        onChange={(e) => {
          console.log("Plataforma seleccionada:", e.target.value);
          setSelectedPlatform(e.target.value);
          setErrorMessage(""); // Limpia el mensaje de error
        }}
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
      {/* Dropdown para seleccionar horario*/}
      <select
        value={timeSlot}
        onChange={(e) => {
          console.log("Horario seleccionado:", e.target.value);
          setTimeSlot(e.target.value);
          setErrorMessage(""); // Limpia el mensaje de error
        }}
      >
        <option value="default" disabled>
          Selecciona un horario
        </option>
        <option value="morning">Mañana</option>
        <option value="afternoon">Tarde</option>
        <option value="evening">Noche</option>
      </select>
      <button className="player-search-button" onClick={handleSearch}>
        Buscar
      </button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {loading && <p>Cargando jugadores...</p>}
      {players.length === 0 &&
        !loading &&
        errorMessage === "" &&
        selectedGame !== "default" &&
        selectedPlatform !== "default" &&
        timeSlot !== "default" &&
        localStorage.getItem("token") && (
          <p>No se encontraron jugadores. Prueba ajustando los filtros.</p>
        )}
      {players.length > 0 && (
        <ul>
          {players.map((player) => (
            <li key={player.id}>
              {player.name} - {player.platform}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlayerSearch;
