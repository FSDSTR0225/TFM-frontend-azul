import React from "react";
import { Link } from "react-router-dom";
import PlatformList from "../components/PlatformList";
import "../style/Games.css";
import AllGames from "../components/AllGames";
function Games() {
  return (
    <div className="games-page">
      <section className="platforms-section">
        <PlatformList />
      </section>
      <section className="games-section">
        <AllGames />
      </section>
    </div>
  );
}

export default Games;
