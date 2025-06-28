import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../style/SuggestedUsersWidget.css";
import { FaUserPlus } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

const API_URL = import.meta.env.VITE_API_URL;

function SuggestedUsersWidget() {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersSuggestions = async () => {
      try {
        const response = await fetch(
          `${API_URL}/dashboard/widgets/suggestions/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "Error al cargar sugerencias");
          setLoading(false);
          return;
        }
        setSuggestedUsers(data.suggestions);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchUsersSuggestions();
  }, [token]);

  const handleOnClick = (id) => {
    setSuggestedUsers((prevUsers) =>
      prevUsers.filter((user) => user._id !== id)
    );
  };

  if (loading) return <div className="dots-loader"></div>;
  if (error) return <div className="error-suggestions">{error}</div>;

  // {!loading && !error && (
  //   <ul className="card-suggestion-container">
  //     {Array.isArray(suggestedUsers) && suggestedUsers.length === 0 && (
  //       <p>No hay sugerencias disponibles por ahora</p>
  //     )}

  return (
    <Swiper
      effect="coverflow"
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={"auto"}
      spaceBetween={30}
      loop={suggestedUsers.length >= 3}
      watchOverflow={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      coverflowEffect={{
        rotate: 20,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
        slideShadows: false,
      }}
      modules={[EffectCoverflow, Autoplay]}
      className="suggested-users-swiper"
    >
      {suggestedUsers.map((suggest) => (
        <SwiperSlide key={suggest._id} className="suggested-user-slide">
          <span
            className="btn-suggestion"
            title="Eliminar sugerencia"
            onClick={() => handleOnClick(suggest._id)}
          >
            ✕
          </span>
          <div className="user-content">
            <div className="avatar-suggestion-container">
              <img
                className="img-suggestion-user"
                src={suggest.avatar}
                alt={`Avatar de ${suggest.username}`}
              />
            </div>
            <span className="username-suggestion" title={suggest.username}>
              {suggest.username}
            </span>
            <div className="genre-list">
              {suggest.favoriteTags?.genres?.slice(0, 3).map((genre, i) => (
                <span className="genre-chip" key={`${genre}-${i}`}>
                  {genre}
                </span>
              ))}
            </div>
          </div>
          <div className="users-suggest-btn">
            <button className="btn-connect">Conectar</button>
            <button
              className="btn-profile"
              onClick={() => navigate(`/users/${suggest._id}`)}
            >
              Ver perfil
            </button>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default SuggestedUsersWidget;
