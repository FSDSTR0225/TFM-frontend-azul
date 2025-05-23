
import FriendsList from "./FriendsList";
import FavoriteGamesList from "./FavoriteGamesList";
import EventsList from "./EventsList";
import FavoritePlatforms from "./FavoritePlatforms";
import "../style/Profile2.css";
import AuthContext from "../context/AuthContext"; 
import { useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import blankImg from "/images/profile/blankImg.jpg";
import { PacmanLoader } from "react-spinners";


const ProfileCard = () => {
  const { user } = useContext(AuthContext);
   const {isLoggedIn} = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!user) {
    return <PacmanLoader color="#36d7b7" />; // spinner/placeholder temporaneo
  }
  return (
    <div className="profile-card">
      <div className="avatar-container">
        <img
          className="avatar"
          src={user.avatar || blankImg}
          alt="Avatar"
        />
        <button className="edit-button">✏️ edit</button>
      </div>
      <h2 className="username">{user.username}</h2>

      <FavoritePlatforms platforms={user.favoritePlatforms||["khKH","hgygsdy","ygyas"]} />
      <FriendsList friends={user.friends||["khKH","hgygsdy","ygyas"]} />
      <FavoriteGamesList games={user.favoriteGames||["khKH","hgygsdy","ygyas"]} />
      <EventsList events={user.events||["khKH","hgygsdy","ygyas"]} />
    </div>
  );
};

export default ProfileCard;
