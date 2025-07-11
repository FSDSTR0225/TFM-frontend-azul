import { useState,useEffect, useContext } from "react";
import "../style/PlayerCard.css"; 
import AuthContext from "../context/AuthContext";
import {Link} from "react-router-dom";
import { ConfirmFriendRequestModal } from "./ConfirmFriendRequestModal";
import "../style/ModalWindow.css";
import blankImg from '../assets/blankImg.jpg'
const PlayerCard = ({ player }) => {
  const {user} = useContext(AuthContext);
const [modalOpen, setModalOpen] = useState(false); // setModalOpen
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  return (
    <div className="player-card" key={player._id}>
      <div className="player-avatar-container">
        <img
          src={player.avatar|| blankImg}
          alt={player.username}
          className="player-avatar"
        />
      </div>
      <h3 className="username-mock-list">{player.username}</h3>
      <div className="player-games">
        {player.favoriteGames?.map((game, index) => (
          <span key={index} className="game-tag">
            {game.name}
          </span>
        ))}
      </div>
      <div className="player-actions">
        { player.friends?.some((friend) => friend.user._id=== user._id) ? (
          <span className="friend-status">Ya son amigos</span>
        ) : (
        <button  onClick={() =>setModalOpen(true)} className="player-button">Añadir a amigos</button>)}
        <Link to={`/profile/${player.username}`} state={{player}} className="player-button">Ver perfil</Link>
      </div>
{modalOpen &&
       <ConfirmFriendRequestModal
      player={player}
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
            onSuccess={() => setModalOpen(false)}   
            /> }
    </div>
  );
};

export default PlayerCard;
