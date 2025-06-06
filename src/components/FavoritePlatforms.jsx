import React from "react";
import "../style/Profile2.css";
import "../style/PlatformList.css";
import ModalWindow from "./ModalWindow";
import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
const FavoritePlatforms = ({ platforms, triggerRefresh }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const url = import.meta.env.VITE_API_URL;
  const { token } = useContext(AuthContext);
  const handleDelete = (id) => {
    fetch(`${url}/profile/platforms/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Plataforma eliminada:", data);
        triggerRefresh();
      })
      .catch((err) => console.error("Errore gioco:", err));
  };
  return (
    <div className="section">
      <div className="section-header">
        <h3>Plataformas</h3>
        <button
          onClick={() => {
            setModalOpen(true);
          }}
          className="add-button-p pink"
        >
          ➕ add
        </button>
      </div>
      <div className="platform-list  ">
        {platforms.map((platform, index) => (
          <div className="platform-card profile" key={index}>
            <img
              src={platform.icon}
              alt={platform.name}
              className="platform-icon-img"
            />{" "}
            <button
              onClick={() => handleDelete(platform._id)}
              className="delete-button"
            >
              X
            </button>
            <p className="platform-name">{platform.name}</p>
          </div>
        ))}
      </div>
      <ModalWindow
        existingItems={platforms}
        onSuccess={triggerRefresh}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="platform"
      />
    </div>
  );
};

export default FavoritePlatforms;
