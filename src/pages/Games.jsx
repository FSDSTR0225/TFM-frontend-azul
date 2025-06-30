import React, { useEffect, useState } from "react";
import PlatformList from "../components/PlatformList";
import AllGames from "../components/AllGames";
import { PacmanLoader } from "react-spinners";
import "../style/Games.css";

function Games() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout); // Limpia el temporizador al desmontar el componente
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <h1 className="loading-title">Cargando juegos...</h1>
        <PacmanLoader color="#FFD700" size={40} />
      </div>
    );
  }

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
