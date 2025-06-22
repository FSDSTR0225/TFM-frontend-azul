import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../style/SuggestedGamesWidget.css";
import { FaGamepad } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

function SuggestedGamesWidget() {
  const { token } = useContext(AuthContext);
  const [suggestedGames, setSuggestedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUpdate, setNextUpdate] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestedGames = async () => {
      try {
        const response = await fetch(
          `${API_URL}/dashboard/widgets/suggestions/games`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Error fetching suggestions");
        const data = await response.json();
        setSuggestedGames(data.gamesSuggested);
        setNextUpdate(data.nextUpdate);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar juegos sugeridos:", error);
        setLoading(false);
      }
    };
    fetchSuggestedGames();
  }, [token]);

  const handleOnClick = (id) => {
    navigate(`/games/${id}`);
  };

  const formatTimeLeft = (ms) => {
    const totalHours = Math.floor(ms / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    return `${days} día${days !== 1 ? "s" : ""} y ${hours} hora${
      hours !== 1 ? "s" : ""
    }`;
  };

  return (
    <div className="modular-card suggested-games-card">
      <div className="modular-card-header">
        <FaGamepad className="modular-card-icon" />
        <h3>Juegos sugeridos</h3>
      </div>
      <div className="modular-card-content">
        {loading ? (
          <div className="dots-loader" />
        ) : (
          <>
            {nextUpdate && (
              <p className="suggestion-update-timer">
                Nuevas sugerencias en: <span>{formatTimeLeft(nextUpdate)}</span>
              </p>
            )}
            {suggestedGames.length > 0 ? (
              <ul className="suggestion-content-game">
                {suggestedGames.map((game) => (
                  <li
                    className="game-suggested"
                    key={game._id}
                    onClick={() => handleOnClick(game._id || game.rawgId)}
                  >
                    <img
                      className="img-suggest-game"
                      src={game.imageUrl}
                      alt={game.name}
                    />
                    <span className="name-suggest-game">{game.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-suggestions-game">
                No hay juegos sugeridos, completa tu perfil
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SuggestedGamesWidget;
