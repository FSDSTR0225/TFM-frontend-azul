import React from "react";
import "../style/PlayerCard.css"; 
import {Link} from "react-router-dom";

const PlayerCard = ({ user }) => {

  return (
    <div className="player-card">
      <div className="player-avatar-container">
        <img
          src={user.avatar}
          alt={user.username}
          className="player-avatar"
        />
      </div>
      <h3 className="username-mock-list">{user.username}</h3>
      <div className="player-games">
        {user.favoriteGames?.map((game, index) => (
          <span key={index} className="game-tag">
            {game.name}
          </span>
        ))}
      </div>
      <div className="player-actions">
        <button className="player-button">Añadir a amigos</button>
        <Link to={`/profile/${user.username}`} state={{user}} className="player-button">Ver perfil</Link>
      </div>
    </div>
  );
};

export default PlayerCard;
