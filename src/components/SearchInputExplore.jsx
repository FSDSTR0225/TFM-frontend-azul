import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../style/SearchInputExplore.css";

const API_URL = import.meta.env.VITE_API_URL;

const SearchInputExplore = ({ search, setSearch, showSearch }) => {
  const [results, setResults] = useState({ users: [], games: [], events: [] });
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const fetchResults = async (query) => {
    try {
      const res = await fetch(`${API_URL}/search?query=${query}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Error al buscar:", error);
    }
  };

  useEffect(() => {
    if (search.trim() === "") {
      setResults({ users: [], games: [], events: [] });
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetchResults(search);
    }, 300);
  }, [search]);

  const handleClick = (type, item) => {
    if (type === "user") navigate(`/users/${item.username}`);
    if (type === "game") navigate(`/games/${item.rawgId || item.id}`);
    if (type === "event") navigate(`/events/${item._id}`);
    setSearch(""); // Limpiar input tras clic
    setResults({ users: [], games: [], events: [] }); // Ocultar resultados
  };

  return (
    <section className="search-section">
      <div id="search-container">
        {showSearch && (
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            type="text"
            placeholder="Busca jugadores afines, eventos, juegos..."
          />
        )}
      </div>

      {(results.users.length > 0 ||
        results.games.length > 0 ||
        results.events.length > 0) && (
        <div className="results-container">
          {results.users.length > 0 && (
            <div className="results-block">
              <h4>Jugadores</h4>
              {results.users.map((user) => (
                <div
                  key={user._id}
                  className="search-result"
                  onClick={() => handleClick("user", user)}
                >
                  <img src={user.avatar} alt={user.username} />
                  <span>{user.username}</span>
                </div>
              ))}
            </div>
          )}

          {results.games.length > 0 && (
            <div className="results-block">
              <h4>Juegos</h4>
              {results.games.map((game) => (
                <div
                  key={game._id}
                  className="search-result"
                  onClick={() => handleClick("game", game)}
                >
                  <img src={game.imageUrl} alt={game.name} />
                  <span>{game.name}</span>
                </div>
              ))}
            </div>
          )}

          {results.events.length > 0 && (
            <div className="results-block">
              <h4>Eventos</h4>
              {results.events.map((event) => (
                <div
                  key={event._id}
                  className="search-result"
                  onClick={() => handleClick("event", event)}
                >
                  <span>{event.title}</span> –{" "}
                  <small>{new Date(event.date).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default SearchInputExplore;
