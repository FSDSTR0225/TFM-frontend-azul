import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import "../style/PlayerSearch.css";
import AuthContext from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#141C3A",
    borderColor: state.isFocused ? "#00ffff" : "#3a4a7f",
    boxShadow: state.isFocused ? "0 0 5px #00ffff" : "none",
    borderRadius: "12px",
    color: "#fff",
    padding: "2px 4px",
    width: "100%", // Usa 100% per responsività o "300px" per fisso
    minHeight: "40px", // altezza minima coerente
    "&:hover": {
      borderColor: "#00ffff",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1B2455",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,255,255,0.15)",
    zIndex: 100,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#00ffff22" : "transparent",
    color: "#fff",
    cursor: "pointer",
    padding: "10px 15px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#00ffff",
    fontWeight: "500",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#888",
    fontStyle: "italic",
  }),
  input: (base) => ({
    ...base,
    color: "#fff",
  }),
};

const PlayerSearch = ({ setQuery }) => {
  const [gameQuery, setGameQuery] = useState("");
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  // const [selectedPlatform, setSelectedPlatform] = useState("default");
  // const [timeSlot, setTimeSlot] = useState("default");
  // const [players, setPlayers] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); // Estado para manejar el desplegable de juegos
  const { isLoggedIn } = useContext(AuthContext);
  // Fetch de juegos
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [timeSlot, setTimeSlot] = useState(null);

  // Busqueda juegos

  useEffect(() => {
    const delay = setTimeout(() => {
      if (gameQuery.length > 2) {
        fetch(`${API_URL}/search/games/?query=${gameQuery}`)
          .then((res) => res.json())
          .then((data) => {
            setGames(data.games || []);
          })
          .catch((err) => console.error("Error fetching games:", err));
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [gameQuery]);

  // Busqueda plataformas
  useEffect(() => {
    if (!selectedGame) {
      fetch(`${API_URL}/platforms`)
        .then((res) => res.json())
        .then((data) => {
          setPlatforms(data.platforms || []);
        });
    } else {
      fetch(`${API_URL}/platforms?game=${selectedGame.value}`)
        .then((res) => res.json())
        .then((data) => {
          setPlatforms(data.platforms || []);
        })
        .catch((err) => console.error("Error fetching platforms:", err));
    }
  }, [selectedGame]);

  // Cerca giocatori
  const handleSearch = () => {
    const filters = {};

    if (selectedGame && selectedGame.value !== "default") {
      filters.game = selectedGame.value;
    }

    if (!isLoggedIn) {
      setErrorMessage("Debes iniciar sesión para buscar jugadores.");
      return;
    }

    if (selectedPlatform && selectedPlatform.value !== "default") {
      filters.platform = selectedPlatform.value;
    }

    if (timeSlot && timeSlot.value !== "default") {
      filters.time = timeSlot.value;
    }

    // Passa i filtri selezionati al padre
    setQuery(filters);
  };

  return (
    <div className="player-search-wrapper">
      <div className="player-search-container">
        <h2>Buscar Jugadores</h2>

        <div className="preferences">
          {/* Input para buscar juegos */}
          <p>Juego:</p>
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
        </div>
        <div className="preferences">
          {/* Dropdown para seleccionar juego */}
          <p>Plataforma:</p>
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
        </div>
        {/* Dropdown para seleccionar horario*/}
        <div className="preferences">
          <p>Horario:</p>
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
        </div>
        <div className="preferences">
          <button className="player-search-button" onClick={handleSearch}>
            Buscar
          </button>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {/* {loading && <p>Cargando jugadores...</p>}
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
          )} */}
        </div>

        <Select
          styles={customStyles}
          placeholder="Escribe el nombre del juego..."
          onInputChange={(value) => setGameQuery(value)}
          onChange={(selected) => {
            setSelectedGame(selected);
            setSelectedPlatform(null); // reset piattaforma
          }}
          options={games.map((game) => ({
            value: game._id,
            label: game.name,
          }))}
          value={selectedGame}
        />

        <Select
          styles={customStyles}
          placeholder="Selecciona una plataforma"
          isDisabled={!platforms.length}
          onChange={(selected) => setSelectedPlatform(selected)}
          options={platforms.map((platform) => ({
            value: platform._id,
            label: platform.name,
          }))}
          value={selectedPlatform}
        />

        <Select
          styles={customStyles}
          placeholder="Selecciona un horario"
          onChange={(selected) => setTimeSlot(selected)}
          options={[
            { value: "morning", label: "Mañana" },
            { value: "afternoon", label: "Tarde" },
            { value: "evening", label: "Noche" },
            { value: "all day", label: "Todo el dia" },
          ]}
          value={timeSlot}
        />

        <button
          className="player-search-button"
          onClick={() => {
            handleSearch(),
              setGameQuery(""),
              setSelectedGame(""),
              setSelectedPlatform(""),
              setTimeSlot("");
          }}
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

export default PlayerSearch;
