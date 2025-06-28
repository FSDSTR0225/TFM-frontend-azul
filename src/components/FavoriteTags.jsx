import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../style/FavoriteTags.css";

const tagTranslations = {
  Action: "Acción",
  Adventure: "Aventura",
  RPG: "Rol",
  Shooter: "Disparos",
  Strategy: "Estrategia",
  Sports: "Deportes",
  Fighting: "Pelea",
  Simulation: "Simulación",
  Racing: "Carreras",
  Indie: "Indie",
  Puzzle: "Puzzle",
  Platformer: "Plataformas",
  Arcade: "Arcade",
  // Modos
  Singleplayer: "Un jugador",
  Multiplayer: "Multijugador",
  "Co-op": "Cooperativo",
  "Online Co-op": "Cooperativo en línea",
  "Split-screen": "Pantalla dividida",
  PvP: "PvP",
  PvE: "PvE",
  MMO: "Masivo en línea (MMO)",
  "Battle Royale": "Battle Royale",
  Campaign: "Campaña",
  Sandbox: "Mundo abierto",
  "Cross-Platform Multiplayer": "Juego cruzado (Cross-play)",
  "Local Multiplayer": "Juego local",
  // Temas
  Fantasy: "Fantasía",
  "Sci-fi": "Ciencia ficción",
  Horror: "Terror",
  Cyberpunk: "Cyberpunk",
  "Post-apocalyptic": "Post-apocalíptico",
  Steampunk: "Steampunk",
  Medieval: "Medieval",
  Zombie: "Zombis",
  Space: "Espacio",
  Mystery: "Misterio",
  War: "Guerra",
  Crime: "Crimen",
  Survival: "Supervivencia",
  Epic: "Épico",
  Apocalypse: "Apocalipsis",
  Noir: "Noir",
  Mythology: "Mitología",
  Roguelike: "Roguelike",
  "Card Game": "Juego de cartas",
  Western: "Western",
  Aliens: "Aliens",
  Dinosaurs: "Dinosaurios",
  Spy: "Espionaje",
  // Otros
  Crafting: "Crafteo",
  Exploration: "Exploración",
  Loot: "Saqueo",
  Stealth: "Sigilo",
  Tactical: "Combate táctico",
  Building: "Construcción",
  Permadeath: "Muerte permanente",
  "Turn-Based": "Por turnos",
  "Real-Time": "Tiempo real",
  "Resource Management": "Gestión de recursos",
};

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

const API_URL = import.meta.env.VITE_API_URL;

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
  const [maxOption, setMaxOption] = useState("");

  const { token } = useContext(AuthContext);

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

  const handleRemoveTag = async (tagsType, value) => {
    try {
      const response = await fetch(
        `${API_URL}/profile/tags/${tagsType}/${encodeURIComponent(value)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al eliminar tag");
      }
      const data = await response.json();
      setFavoriteTags((prev) => ({
        ...prev,
        [tagsType]: data.favoriteTags[tagsType],
      }));
    } catch (error) {
      console.error("Error al eliminar tag:", error);
    }
  };

  const handleOnClick = async (tagsType, value) => {
    if (favoriteTags[tagsType].includes(value)) return;

    if (favoriteTags[tagsType].length >= 5) {
      setMaxOption("Máximo 5 tags seleccionados");
      setTimeout(() => setMaxOption(""), 2500);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/profile/tags/${tagsType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tag: value }),
      });

      if (!response.ok) {
        throw new Error("Error al añadir tags");
      }

      const data = await response.json();
      setFavoriteTags((prev) => ({
        ...prev,
        [tagsType]: data.favoriteTags[tagsType],
      }));
    } catch (error) {
      console.error("Error al añadir tag:", error);
    }
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
              {tagTranslations[tag] || tag}
              <button
                className="btn-chip"
                onClick={() => handleRemoveTag("genres", tag)}
              >
                x
              </button>
            </span>
          ))}
        </div>
        <button
          className="tag-toggle-btn"
          onClick={() => handleOnToggle("genres")}
        >
          {showGenres ? "Cerrar" : "Añadir"}
        </button>
        {maxOption && <div className="max-tags-option">{maxOption}</div>}
        {showGenres && (
          <ul className="tag-options-list">
            {genreOptions.map((genre) => {
              const isSelected = favoriteTags.genres.includes(genre.value);
              const isMax = favoriteTags.genres.length >= 5;
              const isDisabled = isSelected;
              return (
                <li
                  key={genre.value}
                  className={`tag-option${isDisabled ? " disabled" : ""}`}
                  onClick={() => {
                    if (isSelected) return;
                    if (isMax) {
                      setMaxOption("Máximo 5 tags seleccionados");
                      setTimeout(() => setMaxOption(""), 1200);
                      return;
                    }
                    handleOnClick("genres", genre.value);
                  }}
                  style={{
                    pointerEvents: isSelected ? "none" : "auto",
                    cursor: isSelected ? "not-allowed" : "pointer",
                  }}
                >
                  {genre.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Temáticas favoritas */}
      <div className="tag-section">
        <h2 className="tag-title">Temáticas favoritas</h2>
        <div className="tag-chip-container">
          {favoriteTags.themes.map((tag) => (
            <span key={tag} className="tag-chip">
              {tagTranslations[tag] || tag}
              <button
                className="btn-chip"
                onClick={() => handleRemoveTag("themes", tag)}
              >
                x
              </button>
            </span>
          ))}
        </div>
        <button
          className="tag-toggle-btn"
          onClick={() => handleOnToggle("themes")}
        >
          {showThemes ? "Cerrar" : "Añadir"}
        </button>
        {maxOption && <div className="max-tags-option">{maxOption}</div>}
        {showThemes && (
          <ul className="tag-options-list">
            {themeOptions.map((theme) => {
              const isSelected = favoriteTags.themes.includes(theme.value);
              const isMax = favoriteTags.themes.length >= 5;
              const isDisabled = isSelected;
              return (
                <li
                  key={theme.value}
                  className={`tag-option${isDisabled ? " disabled" : ""}`}
                  onClick={() => {
                    if (isSelected) return;
                    if (isMax) {
                      setMaxOption("Máximo 5 tags seleccionados");
                      setTimeout(() => setMaxOption(""), 1200);
                      return;
                    }
                    handleOnClick("themes", theme.value);
                  }}
                  style={{
                    pointerEvents: isSelected ? "none" : "auto",
                    cursor: isSelected ? "not-allowed" : "pointer",
                  }}
                >
                  {theme.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="tag-section">
        <h2 className="tag-title">Modos de juego</h2>
        <div className="tag-chip-container">
          {favoriteTags.modes.map((tag) => (
            <span key={tag} className="tag-chip">
              {tagTranslations[tag] || tag}
              <button
                className="btn-chip"
                onClick={() => handleRemoveTag("modes", tag)}
              >
                x
              </button>
            </span>
          ))}
        </div>
        <button
          className="tag-toggle-btn"
          onClick={() => handleOnToggle("modes")}
        >
          {showModes ? "Cerrar" : "Añadir"}
        </button>
        {maxOption && <div className="max-tags-option">{maxOption}</div>}
        {showModes && (
          <ul className="tag-options-list">
            {modeOptions.map((mode) => {
              const isSelected = favoriteTags.modes.includes(mode.value);
              const isMax = favoriteTags.modes.length >= 5;
              const isDisabled = isSelected;
              return (
                <li
                  key={mode.value}
                  className={`tag-option${isDisabled ? " disabled" : ""}`}
                  onClick={() => {
                    if (isSelected) return;
                    if (isMax) {
                      setMaxOption("Máximo 5 tags seleccionados");
                      setTimeout(() => setMaxOption(""), 1200);
                      return;
                    }
                    handleOnClick("modes", mode.value);
                  }}
                  style={{
                    pointerEvents: isSelected ? "none" : "auto",
                    cursor: isSelected ? "not-allowed" : "pointer",
                  }}
                >
                  {mode.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="tag-section">
        <h2 className="tag-title">Otras mecánicas</h2>
        <div className="tag-chip-container">
          {favoriteTags.others.map((tag) => (
            <span key={tag} className="tag-chip">
              {tagTranslations[tag] || tag}
              <button
                className="btn-chip"
                onClick={() => handleRemoveTag("others", tag)}
              >
                x
              </button>
            </span>
          ))}
        </div>
        <button
          className="tag-toggle-btn"
          onClick={() => handleOnToggle("others")}
        >
          {showOthers ? "Cerrar" : "Añadir"}
        </button>
        {maxOption && <div className="max-tags-option">{maxOption}</div>}
        {showOthers && (
          <ul className="tag-options-list">
            {othersOptions.map((other) => {
              const isSelected = favoriteTags.others.includes(other.value);
              const isMax = favoriteTags.others.length >= 5;
              const isDisabled = isSelected;
              return (
                <li
                  key={other.value}
                  className={`tag-option${isDisabled ? " disabled" : ""}`}
                  onClick={() => {
                    if (isSelected) return;
                    if (isMax) {
                      setMaxOption("Máximo 5 tags seleccionados");
                      setTimeout(() => setMaxOption(""), 1200);
                      return;
                    }
                    handleOnClick("others", other.value);
                  }}
                  style={{
                    pointerEvents: isSelected ? "none" : "auto",
                    cursor: isSelected ? "not-allowed" : "pointer",
                  }}
                >
                  {other.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FavoriteTags;
