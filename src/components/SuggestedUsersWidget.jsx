import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../style/SuggestedUsersWidget.css";
import { FaUserPlus } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import { ConfirmFriendRequestModal } from "./ConfirmFriendRequestModal";
import "swiper/css";
import "swiper/css/effect-coverflow";

const API_URL = import.meta.env.VITE_API_URL;

function SuggestedUsersWidget() {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  useEffect(() => {
    const fetchUsersSuggestions = async () => {
      try {
        // console.log("📡 Fetch a /suggestions lanzado");
        const response = await fetch(
          `${API_URL}/dashboard/widgets/suggestions/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        // console.log("📦 Datos de sugerencias:", data);
        if (!response.ok) {
          setError(data.message || "Error al cargar sugerencias");
          setLoading(false);
          return;
        }
        setSuggestedUsers(data.suggestions);
        // console.trace("👉 setSuggestedUsers desde fetch:", data.suggestions);
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
  if (error)
    return (
      <div className="error-suggestions" onClick={() => navigate("/users/me")}>
        {error}
      </div>
    );

  // {!loading && !error && (
  //   <ul className="card-suggestion-container">
  //     {Array.isArray(suggestedUsers) && suggestedUsers.length === 0 && (
  //       <p>No hay sugerencias disponibles por ahora</p>
  //     )}
  console.log("👥 Usuarios sugeridos:", suggestedUsers);

  return (
    <>
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        spaceBetween={20}
        loop={suggestedUsers.length >= 3}
        // watchOverflow={true}
        autoplay={{
          delay: 1500,
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
              <button
                className="btn-connect"
                onClick={() => {
                  setSelectedUser(suggest);
                  setModalOpen(true);
                }}
              >
                Conectar
              </button>
              <button
                className="btn-profile"
                onClick={() =>
                  navigate(`/profile/${suggest.username}`, {
                    state: { player: suggest },
                  })
                }
              >
                Ver perfil
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {modalOpen && selectedUser && (
        <ConfirmFriendRequestModal
          player={selectedUser}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false);
            setSuggestedUsers((prev) =>
              prev.filter((user) => user._id !== selectedUser._id)
            );
          }}
        />
      )}
    </>
  );
}

export default SuggestedUsersWidget;
