import React from "react";
import "../style/PlayerCard.css"; 

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
        <button className="player-button">Conectar</button>
        <button className="player-button">Ver perfil</button>
      </div>
    </div>
  );
};

export default PlayerCard;
