import React from "react";
import PlatformList from "../components/PlatformList";
import AllGames from "../components/AllGames";
import "../style/Games.css";

function Games() {
  return (
    <section className="games-page">
      <div className="unified-glass-block">
        <PlatformList />
        <AllGames />
      </div>
    </section>
  );
}

export default Games;
