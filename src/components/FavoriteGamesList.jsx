import React from "react";
import "../style/Profile2.css";
import ModalWindow from "./ModalWindow";
import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
const FavoriteGamesList = ({ games, triggerRefresh, isOwner}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const url = import.meta.env.VITE_API_URL;
  const { token } = useContext(AuthContext);
  const handleDelete = (id) => {
    fetch(`${url}/profile/favoriteGames/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        triggerRefresh();
      })
      .catch((err) => console.error("Errore gioco:", err));
  };
  return (
    <div className="section">
      <div className="section-header">
        <h3>Juegos Favoritos</h3>
       {isOwner && <button
          className="add-button-p purple"
          onClick={() => setModalOpen(true)}
        >
          ➕ add
        </button>}
      </div>
      <div className="circle-list">
        {games.map((game, index) => (
          <div className="circle-wrapper" key={index}>
            <div className="circle purple" key={index}>
              <img
                src={game.imageUrl || game.image || game.background_image}
                alt={game.name}
                className="favorite-game-img"
              />
              {isOwner &&
              <button
                onClick={() => handleDelete(game._id)}
                className="delete-button"
                key={game._id}
                aria-label={`Eliminar ${game.name}`}
              >
                X
              </button>}
            </div>
            <p className="circle-text">{game.name}</p>
          </div>
        ))}
      </div>
      <ModalWindow
        existingItems={games}
        onSuccess={triggerRefresh}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="game"
      />
    </div>
  );
};

export default FavoriteGamesList;
