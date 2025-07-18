import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../style/CreateThreadForm.css";

export default function CreateThreadForm({ onNewThread, defaultCategory }) {
  const { token } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [game, setGame] = useState("");
  const [platform, setPlatform] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGames, setFilteredGames] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [category, setCategory] = useState(defaultCategory || "General");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Buscar juegos al escribir
  useEffect(() => {
    const fetchGames = async () => {
      if (!searchTerm.trim()) {
        setFilteredGames([]);
        return;
      }

      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/search/games?query=${encodeURIComponent(searchTerm)}`
        );
        const data = await res.json();
        setFilteredGames(data.games);
      } catch (err) {
        console.error("Error al buscar juegos:", err.message);
      }
    };

    const delayDebounce = setTimeout(fetchGames, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Cargar plataformas del juego seleccionado
  const fetchPlatformsForGame = async (gameId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/games/${gameId}/platforms`
      );
      const data = await res.json();
      setPlatforms(data.platforms || []);
    } catch (err) {
      console.error("Error al cargar plataformas:", err.message);
      setPlatforms([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !game || !platform || !category) {
      setError("Completa todos los campos.");
      return;
    }

    if (!token) {
      setError("Debes estar logueado para crear un hilo.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          game,
          platform,
          // FALTA AQUÍ:
          category, // 👈 asegúrate de incluirlo
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al crear el hilo");
      }

      const data = await res.json();
      onNewThread(data.post);

      // Limpiar formulario
      setTitle("");
      setDescription("");
      setGame("");
      setPlatform("");
      setCategory(defaultCategory);
      setSearchTerm("");
      setFilteredGames([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-thread-form">
      <h3>Crear nuevo hilo</h3>
      {error && <p className="error">{error}</p>}

      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="text"
        placeholder="Buscar juego..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowSuggestions(true);
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        onFocus={() => {
          if (filteredGames.length > 0) setShowSuggestions(true);
        }}
      />

      {showSuggestions && filteredGames.length > 0 && (
        <ul className="suggestions-dropdown">
          {filteredGames.map((g) => (
            <li
              key={g._id}
              onClick={() => {
                setGame(g._id);
                setSearchTerm(g.name);
                setShowSuggestions(false);
                fetchPlatformsForGame(g._id);
              }}
            >
              {g.name}
            </li>
          ))}
        </ul>
      )}

      <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
        <option value="">Selecciona una plataforma</option>
        {platforms.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Selecciona una categoría</option>
        <option value="General">General</option>
        <option value="Bugs">Bugs</option>
        <option value="Juegos">Juegos</option>
        <option value="Eventos">Eventos</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Creando..." : "Crear hilo"}
      </button>
    </form>
  );
}
