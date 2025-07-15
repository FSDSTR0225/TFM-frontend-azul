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
import { AnimatePresence, motion as Motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

function SuggestedGamesWidget() {
  const { token } = useContext(AuthContext);
  const [suggestedGames, setSuggestedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUpdate, setNextUpdate] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

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

  const formatTimeLeft = (ms) => {
    const totalHours = Math.floor(ms / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    return `${days} día${days !== 1 ? "s" : ""} y ${hours} hora${
      hours !== 1 ? "s" : ""
    }`;
  };

  const isMobile = window.innerWidth < 700;

  return (
    <div className="modular-card suggested-games-card">
      <div className="modular-card-content">
        {loading ? (
          <div className="dots-loader" />
        ) : (
          <>
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
                      <div className="header-swiper">
                        {nextUpdate && (
                          <p className="suggestion-update-timer">
                            Nuevas sugerencias en:{" "}
                            <span>{formatTimeLeft(nextUpdate)}</span>
                          </p>
                        )}
                      </div>
                      <div className="hero-content">
                        <div className="hero-left">
                          <img
                            src={game.imageUrl}
                            alt={game.name}
                            onClick={() => setSelectedGame(game)}
                          />
                        </div>
                        <div className="hero-right">
                          <h2 className="steam-game-title">{game.name}</h2>
                          <div className="game-steam-details">
                            {game.screenshots?.length > 0 && (
                              <div className="screenshots">
                                {game.screenshots
                                  .slice(1, isMobile ? 3 : 5)
                                  .map((s, i) => (
                                    <img
                                      key={i}
                                      src={s}
                                      alt={`Screenshot ${i}`}
                                    />
                                  ))}
                              </div>
                            )}
                            <div className="game-tags">
                              {(game.tags || [])
                                .slice(3, isMobile ? 5 : 7)
                                .map((tag) => (
                                  <span className="tag-chip-suggest" key={tag}>
                                    {tag}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p
                className="no-suggestions-game"
                onClick={() => navigate("/settings")}
              >
                No hay juegos sugeridos, completa tu perfil
              </p>
            )}
          </>
        )}

        {/* === MODAL ANIMADO === */}
        <AnimatePresence>
          {selectedGame && (
            <Motion.div
              className="suggested-game-modal"
              layoutId={selectedGame._id}
              onClick={() => setSelectedGame(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="modal-inner-game"
                onClick={(e) => e.stopPropagation()}
              >
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  pagination={{ clickable: true }} // puntitos de paginación
                  // navigation
                  loop
                  className="modal-swiper"
                >
                  {[...(selectedGame.screenshots || [])].map((img, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={img}
                        alt={`Imagen ${i}`}
                        className="modal-game-image"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <h2>{selectedGame.name}</h2>
                <div className="game-steam-platform">
                  <span className="label-platforms">Disponible en:</span>
                  <div className="platforms-wrapper">
                    {selectedGame.platforms.map((p) => (
                      <span key={p._id} className="platform-chip">
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="modal-tags">
                  {(selectedGame.tags || []).slice(0, 8).map((tag, i) => (
                    <span key={i} className="tag-chip-suggest">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  className="btn-ver-juego"
                  onClick={() => {
                    navigate(`/games/${selectedGame._id}`);
                    setSelectedGame(null);
                  }}
                >
                  Ver más del juego
                </button>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SuggestedGamesWidget;
