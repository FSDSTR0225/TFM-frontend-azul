import React from "react";
import { GiRetroController } from "react-icons/gi";
import { Link } from "react-router-dom";
import "../style/HeroSection.css";

function HeroSection({ scrollRef }) {
  const handleScroll = () => {
    if (scrollRef?.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-logo">
          <GiRetroController className="hero-icon" />
          <h2>Tu portal gamer</h2>
        </div>

        <div className="hero-title">
          <h1>Bienvenid@ a Link2Play</h1>
        </div>
        <div className="hero-description">
          <h2>
            Conecta jugadores afines y forma tu squad. Organiza o únete a
            partidas. Juega sin limites.
          </h2>
          <p>
            Tu espacio gamer, donde tú decides cómo y con quién compartirlo.
          </p>
          <Link to="/register" className="hero-link">
            ¿Jugamos? Regístrate.
          </Link>
        </div>
        <div className="hero-btn">
          <button onClick={handleScroll}>Explorar comunidad</button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
