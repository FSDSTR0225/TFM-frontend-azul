import React from "react";
import { Link } from "react-router-dom";
import "../style/GameCover.css";

function GameCover({ game }) {
  return (
    <div className="game-cover">
      <Link to={`/games/${game.rawgId}`} className="game-link">
        <img
          src={game.image || game.imageUrl || game.background_iamge}
          alt={game.name}
          className="game-img"
        />
        <h2 className="game-name">{game.name}</h2>
      </Link>
    </div>
  );
}

export default GameCover;
