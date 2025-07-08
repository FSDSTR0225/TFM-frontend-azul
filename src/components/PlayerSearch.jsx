import React, { useState, useEffect} from "react";
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
  width: "100%",           // Usa 100% per responsività o "300px" per fisso
  minHeight: "40px",       // altezza minima coerente
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

const PlayerSearch = ( {setQuery}) => {
  const [gameQuery, setGameQuery] = useState("");
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [platforms, setPlatforms] = useState([]);
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
        })
    } else
{    fetch(`${API_URL}/platforms?game=${selectedGame.value}`)
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

      <button className="player-search-button" onClick={ () => {handleSearch(),setGameQuery(""),setSelectedGame(""),setSelectedPlatform(""),setTimeSlot("")}}>
        Buscar
      </button>

     
  
    
    </div>
    </div>
  );
};

export default PlayerSearch;
