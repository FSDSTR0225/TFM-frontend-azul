import { React, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PacmanLoader } from "react-spinners";
import "../style/ExploreGames.css";
const API_URL = import.meta.env.VITE_API_URL;

function ExploreGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("query") || "";

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${API_URL}/search/games?query=${query}`);
        if (!response.ok) {
          throw new Error("Error fetching games");
        }
        const data = await response.json();
        setGames(data.games);
      } catch (err) {
        console.error("Error fetching games:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [query]);

  if (loading) {
    // Si está cargando, muestra...
    return (
      <div className="loading-container">
        <h1 className="loading-title">Cargando búsqueda...</h1>
        <PacmanLoader color="#FFD700" size={40} />{" "}
        {/* Los componentes de React spinner reciben css en el propio componente */}
      </div>
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {games[0]?.imageUrl && (
        <div
          className="explore-games-bg"
          style={{ backgroundImage: `url(${games[0].imageUrl})` }}
        />
      )}

      <section className="explore-games-page">
        <h2>
          Juegos encontrados para:{" "}
          <span className="query-explore">"{query}"</span>
        </h2>

        <div className="game-grid">
          {games.map((game) => (
            <div
              key={game._id}
              className="game-card"
              onClick={() => navigate(`/games/${game.rawgId || game.id}`)}
            >
              <img src={game.imageUrl} alt={game.name} />
              <h4>{game.name}</h4>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
export default ExploreGames;
