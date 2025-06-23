import FriendsList from "../components/FriendsList";
import FavoriteGamesList from "../components/FavoriteGamesList";
import EventsList from "../components/LastEventsList";
import FavoritePlatforms from "../components/FavoritePlatforms";
import "../style/Profile2.css";
import AuthContext from "../context/AuthContext";
import { useState, useContext, useEffect } from "react";

import blankImg from "/images/profile/blankImg.jpg";
import { PacmanLoader } from "react-spinners";
import { useNavigate, useLocation} from "react-router-dom";

const PlayerProfile = () => {
  const { token, isLoggedIn } = useContext(AuthContext);
 const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
 const [user, setUser] = useState(null);
  const location = useLocation();
    const username = location.state.user.username 
     console.log("USERNAME:", username);
  console.log("LOCATION STATE:", location.state);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/users/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener detalles");
        const data = await response.json();
      setUser(data);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };
    fetchProfile();
  }, []);


  



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
      
       
      </div>
      <h2 className="username">{user.username}</h2>

      <FavoritePlatforms
        
        platforms={user.platforms || ["khKH", "hgygsdy", "ygyas"]}
      />
      <FriendsList  friends={user.friends || ["khKH", "hgygsdy", "ygyas"]}/>
      <FavoriteGamesList
        
        games={user.favoriteGames || ["khKH", "hgygsdy", "ygyas"]}
      />
      <EventsList
    
        events={user.events || ["khKH", "hgygsdy", "ygyas"]}
      />
    </div>
  );
};

export default  PlayerProfile;
