import React, { useState, useEffect } from "react";
import "../style/IntroSection.css";

const frases = [
  {
    title: "Encuentra jugadores",
    description:
      "Conecta con gamers afines, encuentra compañeros para tus juegos favoritos y forma tu squad.",
  },
  {
    title: "Crea partidas",
    description: "Organiza eventos, raids o torneos en tu juego favorito.",
  },
  {
    title: "Únete a nuestra comunidad gamer",
    description: "Nunca más jugarás solo. ¡Farmear nunca fue tan divertido!",
  },
];

function IntroSection({ scrollRef }) {
  const [index, setIndex] = useState(0);

  const handleScroll = () => {
    if (scrollRef?.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % frases.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="intro-section">
      <div className="overlay">
        <h1 className="intro-title">{frases[index].title}</h1>
        <p className="intro-description">{frases[index].description}</p>
        <button className="cta-btn" onClick={handleScroll}>
          Explorar comunidad
        </button>
      </div>
    </section>
  );
}

export default IntroSection;
