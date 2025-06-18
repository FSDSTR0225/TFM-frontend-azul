import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../style/SuggestedGamesWidget.css";

const API_URL = import.meta.env.VITE_API_URL;

function SuggestedGamesWidget() {
  const { token } = useContext(AuthContext);
  const [suggestedGames, setSuggestedGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fecthSuggestedGames = async () => {
      try {
        const response = await fetch(
          `${API_URL}/dashboard/widgets/suggestions/games`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching suggestions");
        }
        const data = await response.json();
        setSuggestedGames(data.gamesSuggested);
        setLoading(false);
      } catch (error) {
        console.error("Error al ...", error);
      }
    };
    fecthSuggestedGames();
  }, [token]);

  if (loading) {
    return <div className="dots-loader" />;
  }

  return (
    <div className="game-suggestion-container">
      {suggestedGames.length > 0 ? (
        <ul className="suggestion-content-game">
          {suggestedGames.map((game) => (
            <li className="game-suggested" key={game._id}>
              <Link to={`/games/${game._id}`} className="game-suggested-link">
                <img
                  className="img-suggest-game"
                  src={game.imageUrl}
                  alt={game.name}
                />
                <span className="name-suggest-game">{game.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-suggestions-game">
          No hay juegos sugeridos,completa tu perfil
        </p>
      )}
    </div>
  );
}

export default SuggestedGamesWidget;
