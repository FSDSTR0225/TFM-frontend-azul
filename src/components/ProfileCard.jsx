import FriendsList from "./FriendsList";
import FavoriteGamesList from "./FavoriteGamesList";
import EventsList from "./LastEventsList";
import FavoritePlatforms from "./FavoritePlatforms";
import "../style/Profile2.css";
import AuthContext from "../context/AuthContext";
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import blankImg from "/images/profile/blankImg.jpg";
import { PacmanLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const ProfileCard = () => {
  const { setUser, token, user, isLoggedIn } = useContext(AuthContext);
  const [refreshKey, setRefreshKey] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  // const [user, setUser] = useState(null);
  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };
  
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
    fetchProfile();
  }, []);


  
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

  if (!user) {
    return <PacmanLoader color="#FFD700" size={40} />; // spinner/placeholder temporaneo
  }
  return (
    <div className="profile-card">
      <div className="avatar-container">
        <img className="avatar" src={user.avatar || blankImg} alt="Avatar" />
        <Link to="/edit/profile"  className="edit-button">
          ✏️{" "}
        </Link>
      </div>
      <h2 className="username">{user.username}</h2>

      <FavoritePlatforms
        triggerRefresh={triggerRefresh}
        platforms={user.platforms || ["khKH", "hgygsdy", "ygyas"]}
      />
      <FriendsList triggerRefresh={triggerRefresh} friends={user.friends || ["khKH", "hgygsdy", "ygyas"]}/>
      <FavoriteGamesList
        triggerRefresh={triggerRefresh}
        games={user.favoriteGames || ["khKH", "hgygsdy", "ygyas"]}
      />
      <EventsList
        triggerRefresh={triggerRefresh}
        events={user.events || ["khKH", "hgygsdy", "ygyas"]}
      />
    </div>
  );
};

export default ProfileCard;
