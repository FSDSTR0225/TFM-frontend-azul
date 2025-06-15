import { React, useEffect, useState } from "react";
import "../style/FavoriteTags.css";

const genreOptions = [
  { label: "Acción", value: "Action" },
  { label: "Aventura", value: "Adventure" },
  { label: "Rol", value: "RPG" },
  { label: "Disparos", value: "Shooter" },
  { label: "Estrategia", value: "Strategy" },
  { label: "Deportes", value: "Sports" },
  { label: "Pelea", value: "Fighting" },
  { label: "Simulación", value: "Simulation" },
  { label: "Carreras", value: "Racing" },
  { label: "Indie", value: "Indie" },
  { label: "Puzzle", value: "Puzzle" },
  { label: "Plataformas", value: "Platformer" },
  { label: "Arcade", value: "Arcade" },
];

const modeOptions = [
  { label: "Un jugador", value: "Singleplayer" },
  { label: "Multijugador", value: "Multiplayer" },
  { label: "Cooperativo", value: "Co-op" },
  { label: "Cooperativo en línea", value: "Online Co-op" },
  { label: "Pantalla dividida", value: "Split-screen" },
  { label: "PvP", value: "PvP" },
  { label: "PvE", value: "PvE" },
  { label: "Masivo en línea (MMO)", value: "MMO" },
  { label: "Battle Royale", value: "Battle Royale" },
  { label: "Campaña", value: "Campaign" },
  { label: "Mundo abierto", value: "Sandbox" },
  { label: "Juego cruzado (Cross-play)", value: "Cross-Platform Multiplayer" },
  { label: "Juego local", value: "Local Multiplayer" },
];

const themeOptions = [
  { label: "Fantasía", value: "Fantasy" },
  { label: "Ciencia ficción", value: "Sci-fi" },
  { label: "Terror", value: "Horror" },
  { label: "Cyberpunk", value: "Cyberpunk" },
  { label: "Post-apocalíptico", value: "Post-apocalyptic" },
  { label: "Steampunk", value: "Steampunk" },
  { label: "Medieval", value: "Medieval" },
  { label: "Zombis", value: "Zombie" },
  { label: "Espacio", value: "Space" },
  { label: "Misterio", value: "Mystery" },
  { label: "Guerra", value: "War" },
  { label: "Crimen", value: "Crime" },
  { label: "Supervivencia", value: "Survival" },
  { label: "Épico", value: "Epic" },
  { label: "Apocalipsis", value: "Apocalypse" },
  { label: "Noir", value: "Noir" },
  { label: "Mitología", value: "Mythology" },
  { label: "Roguelike", value: "Roguelike" },
  { label: "Juego de cartas", value: "Card Game" },
  { label: "Western", value: "Western" },
  { label: "Aliens", value: "Aliens" },
  { label: "Dinosaurios", value: "Dinosaurs" },
  { label: "Espionaje", value: "Spy" },
];

const othersOptions = [
  { label: "Crafteo", value: "Crafting" },
  { label: "Exploración", value: "Exploration" },
  { label: "Saqueo", value: "Loot" },
  { label: "Sigilo", value: "Stealth" },
  { label: "Combate táctico", value: "Tactical" },
  { label: "Construcción", value: "Building" },
  { label: "Muerte permanente", value: "Permadeath" },
  { label: "Por turnos", value: "Turn-Based" },
  { label: "Tiempo real", value: "Real-Time" },
  { label: "Gestión de recursos", value: "Resource Management" },
];

function FavoriteTags({ user }) {
  const [favoriteTags, setFavoriteTags] = useState({
    genres: [],
    themes: [],
    modes: [],
    others: [],
  });
  const [showGenres, setShowGenres] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showModes, setShowModes] = useState(false);
  const [showOthers, setShowOthers] = useState(false);

  useEffect(() => {
    if (user?.favoriteTags) {
      setFavoriteTags(user.favoriteTags);
    }
  }, [user]);

  const handleOnToggle = (type) => {
    const setters = {
      genres: setShowGenres,
      themes: setShowThemes,
      modes: setShowModes,
      others: setShowOthers,
    };
    setters[type]?.((prev) => !prev);
  };

  const handleRemoveTag = (type, value) => {
    setFavoriteTags((prev) => {
      const updated = prev[type].filter((item) => item !== value);
      return { ...prev, [type]: updated };
    });
  };

  const handleOnClick = (type, value) => {
    setFavoriteTags((prev) => {
      const current = prev[type] || [];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  if (!user || !user.favoriteTags) {
    return <p className="loading-text">Cargando perfil gamer...</p>;
  }

  return (
    <div className="favorite-tags-container">
      <h1 className="favorite-tags-title">Perfil Gamer</h1>

      <div className="tag-section">
        <h2 className="tag-title">Géneros favoritos</h2>
        <div className="tag-chip-container">
          {favoriteTags.genres.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
              <button onClick={() => handleRemoveTag("genres", tag)}>x</button>
            </span>
          ))}
        </div>
        <button
          className="tag-toggle-btn"
          onClick={() => handleOnToggle("genres")}
        >
          {showGenres ? "Cerrar" : "Añadir"}
        </button>
        {showGenres && (
          <ul className="tag-options-list">
            {genreOptions.map((genre) => (
              <li
                key={genre.value}
                className="tag-option"
                onClick={() => handleOnClick("genres", genre.value)}
              >
                {genre.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="tag-section">
        <h2 className="tag-title">Temáticas favoritas</h2>
        <button
          className="tag-toggle-btn"
          onClick={() => handleOnToggle("themes")}
        >
          {showThemes ? "Cerrar" : "Añadir"}
        </button>
        {showThemes && (
          <ul className="tag-options-list">
            {themeOptions.map((theme) => (
              <li
                key={theme.value}
                className="tag-option"
                onClick={() => handleOnClick("themes", theme.value)}
              >
                {theme.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="tag-section">
        <h2 className="tag-title">Modos de juego</h2>
        <button
          className="tag-toggle-btn"
          onClick={() => handleOnToggle("modes")}
        >
          {showModes ? "Cerrar" : "Añadir"}
        </button>
        {showModes && (
          <ul className="tag-options-list">
            {modeOptions.map((mode) => (
              <li
                key={mode.value}
                className="tag-option"
                onClick={() => handleOnClick("modes", mode.value)}
              >
                {mode.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="tag-section">
        <h2 className="tag-title">Otras mecánicas</h2>
        <button
          className="tag-toggle-btn"
          onClick={() => handleOnToggle("others")}
        >
          {showOthers ? "Cerrar" : "Añadir"}
        </button>
        {showOthers && (
          <ul className="tag-options-list">
            {othersOptions.map((other) => (
              <li
                key={other.value}
                className="tag-option"
                onClick={() => handleOnClick("others", other.value)}
              >
                {other.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FavoriteTags;
