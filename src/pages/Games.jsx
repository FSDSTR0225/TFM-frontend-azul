import React from "react";
import PlatformList from "../components/PlatformList";
import AllGames from "../components/AllGames";
import "../style/Games.css";

function Games() {
  return (
    <section className="games-page">
      <div className="unified-glass-block">
        <PlatformList />
        <div className="section-divider"></div>
        <AllGames />
      </div>
    </section>
  );
}

export default Games;
