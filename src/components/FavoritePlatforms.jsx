import React from "react";
import "../style/Profile2.css";
import "../style/PlatformList.css";
import { Modal } from "@mui/material";
const FavoritePlatforms = ({ platforms }) => {

  return (
    <div className="section">
      <div className="section-header">
        <h3>Plataformas</h3>
        <button onClick={() => {}} className="add-button pink">➕ add</button>
      </div>
      <div className="platform-list" >
        {platforms.map((platform, index) => (
          <div className="platform-card"  key={index}>
              <img
              src={platform.icon}
              alt={platform.name}
              className="platform-icon-img"
            />
          </div>
          
        ))}
 <p>{platforms?platforms.map((platform) => platform.name):""}</p>
      </div>
    </div>
  );
};

export default  FavoritePlatforms