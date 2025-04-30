import React from "react";
import { Link } from "react-router-dom";
import PlatformList from "../components/PlatformList";
import "../style/Games.css";

function Games() {
  return (
    <div className="games-container">
      <PlatformList />
    </div>
  );
}

export default Games;
