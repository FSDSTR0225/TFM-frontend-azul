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
import { Button } from "@mui/material";
import SteamStats from "./SteamStats";

const ProfileCard = () => {
  const { setUser, token, user, isLoggedIn } = useContext(AuthContext);
  const [refreshKey, setRefreshKey] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const location = useLocation();
  const receivedPlayer = location?.state?.player || null;
  const username = receivedPlayer?.username || null;
  // const { username } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [lastEvents, setLastEvents] = useState([]);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchLastEvents = async (userIdToFetch) => {
      try {
        const url = userIdToFetch
          ? `${API_URL}/events/past?userId=${userIdToFetch}`
          : `${API_URL}/events/past`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener eventos pasados");
        const data = await response.json();
        setLastEvents(data.eventos.slice(0, 5));
      } catch (error) {
        console.error("Error al obtener eventos pasados:", error);
      }
    };
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
          await fetchLastEvents(data._id);
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
          await fetchLastEvents();
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

  // const connectToSteam = async () => {
  //   try {
  //     console.log("🔧 URL final del fetch:", `${API_URL}/auth/steam/link`);
  //     console.log("🛡️ Token enviado:", token);
  //     const res = await fetch(`${API_URL}/auth/steam/link`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     const data = await res.json();
  //     if (data.redirectUrl) {
  //       window.location.href = data.redirectUrl;
  //     }
  //   } catch (err) {
  //     console.error("Error al iniciar vinculación con Steam", err);
  //   }
  // };

  if (isLoading || !currentProfile) return <div>Loading profile...</div>;

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

      <h2 className="username">{currentProfile.username}</h2>
      {currentProfile !== user &&
        !player.friends?.some((friend) => friend.user._id === user._id) && (
          <div className="add-friend">
            <Button
              onClick={() => setModalOpen(true)}
              className="steamBtn"
              variant="outlined"
              size="small"
            >
              + Añadir a amigos
            </Button>
          </div>
        )}
      <div className="profile-steam">
        {!user.steamId ? (
          <Button
            variant="outlined"
            size="small"
            className="steamBtn"
            onClick={() => {
              const id = user._id || user.id;
              window.location.href = `${API_URL}/auth/steam/link/${id}`;
            }}
            style={{ marginTop: "8px" }}
          >
            Conectar con Steam
          </Button>
        ) : (
          <div
            className="steamConnected"
            style={{ color: "lightgreen", marginTop: "8px" }}
          >
            ✅ Cuenta de Steam conectada
          </div>
        )}
      </div>

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
        events={lastEvents}
        isOwner={currentProfile === user}
      />
      <div>
        <SteamStats />
      </div>

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
