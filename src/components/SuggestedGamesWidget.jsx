import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../style/SuggestedGamesWidget.css";
import { FaGamepad } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                slidesPerView={1}
                spaceBetween={40}
                loop={true}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation
                className="suggested-games-swiper"
              >
                {suggestedGames.map((game) => (
                  <SwiperSlide key={game._id}>
                    <div className="game-hero-slide">
                      <div className="hero-left">
                        <img
                          src={game.imageUrl}
                          alt={game.name}
                          onClick={() => handleOnClick(game._id || game.rawgId)}
                        />
                      </div>
                      <div className="hero-right">
                        <h2 className="steam-game-title">{game.name}</h2>
                        {game.screenshots?.length > 0 && (
                          <div className="screenshots">
                            {game.screenshots.slice(1, 5).map((s, i) => (
                              <img key={i} src={s} alt={`Screenshot ${i}`} />
                            ))}
                          </div>
                        )}
                        <div className="game-tags">
                          {(game.tags || []).slice(0, 5).map((tag) => (
                            <span className="tag-chip" key={tag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="game-steam-platform">
                          <p className="game-platforms">
                            Disponible en:{" "}
                            {game.platforms.map((p) => (
                              <span key={p._id} className="platform-chip">
                                {p.name}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
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
