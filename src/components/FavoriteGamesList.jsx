import React from "react";
import "../style/Profile2.css";

const FavoriteGamesList = ({ games }) => {
  return (
    <div className="section">
      <div className="section-header">
        <h3>Juegos Favoritos</h3>
        <button className="add-button purple">➕ add</button>
      </div>
      <div className="circle-list">
        {games.map((game, index) => (
          <div className="circle purple" key={index}>
            <img
              src={game.imageUrl || game.image || game.background_image}
              alt={game.name}
              className=""
            />
          </div>
        ))}
        <p>{games?games.map((game) => game.name):""}</p>
      </div>
    </div>
  );
};

export default FavoriteGamesList;
