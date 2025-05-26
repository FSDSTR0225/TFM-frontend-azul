import React from "react";
import "../style/Profile2.css";
import ModalWindow from "./ModalWindow";
import { useState } from "react";
const FavoriteGamesList = ({ games }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="section">
      <div className="section-header">
        <h3>Juegos Favoritos</h3>
        <button className="add-button purple" on onClick={() => setModalOpen(true)}>➕ add</button>
      </div>
      <div className="circle-list">
        {games.map((game, index) => (
          <div className="game" key={index}>
          <div className="circle purple" key={index}>
            <img
              src={game.imageUrl || game.image || game.background_image}
              alt={game.name}
              className="game-img"
            />
            <p>{game.name}</p>
          </div>
          </div>
        ))}
        <ModalWindow isOpen={modalOpen} onClose={() => setModalOpen(false)} type="game"/>
      </div>
    </div>
  );
};

export default FavoriteGamesList;
