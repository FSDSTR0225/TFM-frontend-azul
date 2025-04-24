import React from "react";
import { GiRetroController } from "react-icons/gi";
import { Link } from "react-router-dom";
import "../style/HeroSection.css";

function HeroSection() {
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
            ¿Jugamos?
          </Link>
        </div>
        <div className="hero-btn">
          <button>Explorar comunidad</button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

// import React from "react";
// import { GiRetroController } from "react-icons/gi";
// import "../style/HeroSection.css";

// function HeroSection() {
//   return (
//     <section className="hero-section">
//       <div className="hero-container">
//         <div className="hero-logo">
//           <GiRetroController className="hero-icon" />
//           <p className="hero-tagline">Tu portal gamer</p>
//           <h2 className="hero-welcome">Bienvenid@ a Link2Play</h2>
//         </div>
//         <div className="hero-title">
//           <h1>Encuentra tu squad, organiza y únete a partidas.</h1>
//         </div>

//         <p className="hero-subtext">
//           Este es tu espacio gamer donde tú decides cómo y con quién
//           compartirlo. <strong>¿Jugamos?</strong>
//         </p>

//         <div className="hero-btn">
//           <button>Explorar comunidad</button>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default HeroSection;
