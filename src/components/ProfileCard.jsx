import FriendsList from "./FriendsList";
import FavoriteGamesList from "./FavoriteGamesList";
import EventsList from "./LastEventsList";
import FavoritePlatforms from "./FavoritePlatforms";
import "../style/Profile2.css";
import AuthContext from "../context/AuthContext";
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import blankImg from "../assets/blankImg.jpg";
import { ConfirmFriendRequestModal } from "./ConfirmFriendRequestModal";
import "../style/ModalWindow.css";
import { useNavigate, useLocation } from "react-router-dom";
import FavoriteTags from "./FavoriteTags";

const ProfileCard = () => {
  const { setUser, token, user, isLoggedIn } = useContext(AuthContext);
  const [refreshKey, setRefreshKey] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const location = useLocation();
  const receivedPlayer = location?.state?.player || null;
  const username = receivedPlayer?.username || null;
  const [modalOpen, setModalOpen] = useState(false);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (username) {
        try {
          const response = await fetch(`${API_URL}/users/${username}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error("Error al obtener detalles");
          const data = await response.json();
          setPlayer(data);
        } catch (error) {
          console.error("Error al obtener el perfil:", error);
        }
      } else {
        try {
          const response = await fetch(`${API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error("Error al obtener detalles");
          const data = await response.json();
          setUser(data.user);
        } catch (error) {
          console.error("Error al obtener el perfil:", error);
        }
      }
    };

    fetchProfile();
  }, [username, token, API_URL, setUser]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener detalles");
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };
    if (isLoggedIn && token) {
      fetchProfile();
    }
  }, [refreshKey, isLoggedIn, token, API_URL, setUser]);

  if (!isLoggedIn) {
    navigate("/login");
  }

  const isOwnProfile = !username;
  const isLoading = isOwnProfile ? !user : !player;
  const currentProfile = isOwnProfile ? user : player;

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <div className="profile-card">
      <div className="avatar-container">
        <img
          className="avatar"
          src={currentProfile.avatar || blankImg}
          alt="Avatar"
        />
        {currentProfile === user && (
          <Link to="/edit/profile" className="edit-button">
            ✏️
          </Link>
        )}
      </div>
      {currentProfile !== user &&
        !player.friends?.some((friend) => friend.user._id === user._id) && (
          <div className="loading-spinner">
            <button
              onClick={() => setModalOpen(true)}
              className="view-profile-button"
            >
              Añadir a amigos
            </button>
          </div>
        )}

      <h2 className="username">{currentProfile.username}</h2>

      <FavoritePlatforms
        triggerRefresh={triggerRefresh}
        platforms={currentProfile.platforms || []}
        isOwner={currentProfile === user}
      />
      <FriendsList
        triggerRefresh={triggerRefresh}
        friends={currentProfile.friends || []}
        isOwner={currentProfile === user}
      />
      <FavoriteGamesList
        triggerRefresh={triggerRefresh}
        games={currentProfile.favoriteGames || []}
        isOwner={currentProfile === user}
      />
      <EventsList
        triggerRefresh={triggerRefresh}
        events={currentProfile.events || []}
        isOwner={currentProfile === user}
      />

      {modalOpen && (
        <ConfirmFriendRequestModal
          player={currentProfile}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false);
            navigate("/players");
          }}
        />
      )}
     
    </div>
  );
};

export default ProfileCard;
