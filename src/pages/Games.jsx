import React from "react";
import { Link } from "react-router-dom";
import PlatformList from "../components/PlatformList";
import "../style/Games.css";
import AllGames from "../components/AllGames";

function Games() {
  return (
    <section className="games-page">
      <PlatformList />
      <div className="games-section">
        <AllGames />
      </div>
    </section>
  );
}

export default Games;
