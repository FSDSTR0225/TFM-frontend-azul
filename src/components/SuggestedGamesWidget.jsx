import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../style/SuggestedGamesWidget.css";

const API_URL = import.meta.env.VITE_API_URL;

function SuggestedGamesWidget() {
  const { token } = useContext(AuthContext);
  const [suggestedGames, setSuggestedGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestedGames = async () => {
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
    fetchSuggestedGames();

    // const interval = setInterval(() => {
    //   fecthSuggestedGames();
    // }, 1000 * 60 * 60 * 24 * 3); // Cada 3 días

    // return () => clearInterval(interval); // Limpieza
  }, [token]);

  if (loading) {
    return <div className="dots-loader" />;
  }

  const handleNavigation = (url) => {
    navigate(url);
  };
  const handleOnClick = (game) => {
    handleNavigation(`/games/${game.rawgId || game._id}`);
  };

  // const handleDeleteGame = async (id) => {
  //   setSuggestedGames((prev) => prev.filter((game) => game._id !== id));

  //   try {
  //     const res = await fetch(
  //       `${API_URL}/dashboard/widgets/suggestions/games`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     const data = await res.json();
  //     if (res.ok && data.gamesSuggested?.length > 0) {
  //       // Filtramos los juegos sugeridos que no están en la lista actual,usamos .some para comprobar si el juego ya está en la lista,
  //       // actualizamos el estado con los nuevos juegos sugeridos con .slice(0, 1) para limitar a uno nuevo
  //       const nuevos = data.gamesSuggested.filter(
  //         (g) => !g.some((game) => game._id === g._id)
  //       );
  //       setSuggestedGames((prev) => [...prev, ...nuevos.slice(0, 1)]);
  //     }
  //   } catch (error) {
  //     console.error("Error al cargar sugerencia extra", error);
  //   }
  // };

  return (
    <div className="game-suggestion-container">
      {suggestedGames.length > 0 ? (
        <ul className="suggestion-content-game">
          {suggestedGames.map((game) => (
            <li
              className="game-suggested"
              key={game._id}
              onClick={() => handleOnClick(game._id || game.rawgId)}
            >
              {/* <Link to={`/games/${game._id}`} className="game-suggested-link"> */}
              <img
                className="img-suggest-game"
                src={game.imageUrl}
                alt={game.name}
              />
              <span className="name-suggest-game">{game.name}</span>
              {/* </Link> */}
              {/* <span
                className="btn-suggestion"
                title="Eliminar sugerencia"
                // onClick={() => handleDeleteGame(game._id)}
              >
                X
              </span> */}
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
