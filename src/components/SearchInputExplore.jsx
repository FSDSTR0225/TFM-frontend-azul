import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../style/SearchInputExplore.css";
import { FaSearchengin } from "react-icons/fa6";

const API_URL = import.meta.env.VITE_API_URL;

const SearchInputExplore = ({ search, setSearch }) => {
  const [results, setResults] = useState({ users: [], games: [], events: [] });
  const timeoutRef = useRef(null); // Para manejar el debounce,es decir, esperar un tiempo antes de hacer la búsqueda y asi evitar hacer la busqueda si aun esta escribiendo el usuario
  const containerRef = useRef(null); // Para detectar clicks fuera del input y cerrar los resultados
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

  // Efecto para manejar el debounce de la búsqueda, se ejecuta cada vez que cambia el valor de `search` con un retardo de 300ms
  useEffect(() => {
    if (!search || search.trim() === "") {
      setResults({ users: [], games: [], events: [] });
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetchResults(search);
    }, 300);
  }, [search]);

  // Efecto para manejar el click fuera del input, si se hace click fuera del contenedor, se cierra el input y los resultados
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setSearch("");
        setResults({ users: [], games: [], events: [] });
      }
    };

    // Añade el evento de click al documento para detectar clicks fuera del input
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSearch]);

  const handleNavigation = (url) => {
    navigate(url);
    setSearch("");
    setResults({ users: [], games: [], events: [] });
  };

  const handleClick = (type, item) => {
    if (type === "user") {
      navigate(`/profile/${item.username}`, {
        state: {
          player: {
            username: item.username,
            avatar: item.avatar,
            _id: item._id,
          },
        },
      });
    }
    if (type === "game") handleNavigation(`/games/${item.rawgId || item.id}`);
    if (type === "event")
      handleNavigation(`/events?query=${encodeURIComponent(item.title)}`);
  };

  return (
    <section className="search-section" ref={containerRef}>
      <div id="search-container">
        <FaSearchengin className="navbar-icon" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          type="text"
          placeholder="Explorar"
        />
      </div>

      {(results.users.length > 0 ||
        results.games.length > 0 ||
        results.events.length > 0) && (
        <div className="results-container">
          {results.users.length > 0 && (
            <div className="results-block">
              <h4>Jugadores</h4>
              {results.users.slice(0, 3).map((user) => (
                <div
                  key={user._id}
                  className="search-result"
                  onClick={() => handleClick("user", user)}
                >
                  <img src={user.avatar} alt={user.username} />
                  <span>{user.username}</span>
                </div>
              ))}
              {results.users.length > 3 && (
                <div
                  className="see-more"
                  onClick={() =>
                    handleNavigation(
                      `/explore/users?query=${encodeURIComponent(search)}`
                    )
                  }
                >
                  Ver más jugadores
                </div>
              )}
            </div>
          )}

          {results.games.length > 0 && (
            <div className="results-block">
              <h4>Juegos</h4>
              {results.games.slice(0, 10).map((game) => (
                <div
                  key={game._id}
                  className="search-result"
                  onClick={() => handleClick("game", game)}
                >
                  <img src={game.imageUrl} alt={game.name} />
                  <span>{game.name}</span>
                </div>
              ))}
              {results.games.length > 10 && (
                <div
                  className="see-more"
                  onClick={() =>
                    handleNavigation(
                      `/explore/games?query=${encodeURIComponent(search)}`
                    )
                  }
                >
                  Ver más juegos
                </div>
              )}
            </div>
          )}

          {results.events.length > 0 && (
            <div className="results-block">
              <h4>Eventos</h4>
              {results.events.slice(0, 3).map((event) => (
                <div
                  key={event._id}
                  className="search-result"
                  onClick={() => handleClick("event", event)}
                >
                  <span>{event.title}</span> –{" "}
                  <small>{new Date(event.date).toLocaleDateString()}</small>
                </div>
              ))}
              {results.events.length > 2 && (
                <div
                  className="see-more"
                  onClick={() =>
                    handleNavigation(
                      `/events?query=${encodeURIComponent(search)}`
                    )
                  }
                >
                  Ver más eventos
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default SearchInputExplore;
