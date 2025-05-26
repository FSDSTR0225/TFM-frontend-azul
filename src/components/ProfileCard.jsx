import FriendsList from "./FriendsList";
import FavoriteGamesList from "./FavoriteGamesList";
import EventsList from "./EventsList";
import FavoritePlatforms from "./FavoritePlatforms";
import "../style/Profile2.css";
import AuthContext from "../context/AuthContext";
import { useState, useContext, useEffect } from "react";

import blankImg from "/images/profile/blankImg.jpg";
import { PacmanLoader } from "react-spinners";

const ProfileCard = () => {
  const { token, isLoggedIn } = useContext(AuthContext);
const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(null);

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
        console.log("Obtenido del backend:", data.user);
        setUser(data.user);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };
    if (isLoggedIn && token) {
      fetchProfile();
    }
  }, [isLoggedIn, token]);

  if (!user) {
    return <PacmanLoader color="#FFD700" size={40} />; // spinner/placeholder temporaneo
  }
  return (
    <div className="profile-card">
      <div className="avatar-container">
        <img className="avatar" src={user.avatar || blankImg} alt="Avatar" />
        <button className="edit-button">✏️ edit</button>
      </div>
      <h2 className="username">{user.username}</h2>

      <FavoritePlatforms
        platforms={user.platforms || ["khKH", "hgygsdy", "ygyas"]}
      />
      <FriendsList friends={user.friends || ["khKH", "hgygsdy", "ygyas"]} />
      <FavoriteGamesList
        games={user.favoriteGames || ["khKH", "hgygsdy", "ygyas"]}
      />
      <EventsList events={user.events || ["khKH", "hgygsdy", "ygyas"]} />
    </div>
  );
};

export default ProfileCard;
