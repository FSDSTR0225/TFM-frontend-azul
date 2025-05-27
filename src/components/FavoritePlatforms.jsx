import React from "react";
import "../style/Profile2.css";
import "../style/PlatformList.css";
import ModalWindow from "./ModalWindow";
import { useState } from "react";
const FavoritePlatforms = ({ platforms, triggerRefresh }) => {
    const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="section">
      <div className="section-header">
        <h3>Plataformas</h3>
        <button onClick={() => {setModalOpen(true)}} className="add-button-p pink">
          ➕ add
        </button>
      </div>
      <div className="platform-list">
        {platforms.map((platform, index) => (
          <div className="platform-card" key={index}>
            <img
              src={platform.icon}
              alt={platform.name}
              className="platform-icon-img"
            />
            <p>{platform.name}</p>
          </div>
        ))}
      </div>
      <ModalWindow onSuccess={triggerRefresh} isOpen={modalOpen} onClose={() => setModalOpen(false)} type="platform"/>
    </div>
  );
};

export default FavoritePlatforms;
