import React from "react";
import "../style/showProfile.css";
import {
  FaCalendarAlt,
  FaDesktop,
  FaXbox,
  FaPlaystation,
  FaMobileAlt,
} from "react-icons/fa";

function ShowProfile() {
  return (
    <section className="profile-glass-section">
      <div className="profile-wrapper-glass">
        {/* COLUMNA IZQUIERDA */}
        <div className="profile-info">
          <h2>¡Crea tu perfil gamer !</h2>
          <p>
            Diseña tu ficha gamer con tus juegos, plataformas y estilo de juego
            favoritos.{" "}
            <strong>Link2Play te conectará con jugadores compatibles</strong>{" "}
            gracias a su algoritmo inteligente.
          </p>

          <ul className="intro-list">
            <li>🕹️ Personaliza tu avatar.</li>
            <li>🎮 Define tu estilo de juego.</li>
            <li>🎯 Añade tus juegos, categorías y plataformas favoritas.</li>
            <li>🗓️ Visualiza y gestiona tus eventos activos.</li>
            <li>
              ⏰ ¿Cuando sueles jugar? Indica tu disponibilidad y busca gente
              que juegue cuando tu.
            </li>
          </ul>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="profile-preview">
          <div className="profile-card-show float-card reveal">
            <div className="profile-avatar">
              <img src="/images/gamer2.png" alt="avatar" />
            </div>

            <h2 className="profile-username">Username</h2>
            <div className="profile-status">
              <FaCalendarAlt /> Eventos: Ranked Valorant
            </div>

            <div className="profile-section">
              <h3>Perfil Gamer</h3>
              <div className="tag-list">
                <span className="tag">Casual</span>
                <span className="tag">Social</span>
                <span className="tag">Competitivo</span>
              </div>
            </div>

            <div className="profile-section">
              <h3>Juegos Favoritos</h3>
              <div className="tag-list">
                <span className="tag">Valorant</span>
                <span className="tag">FIFA</span>
              </div>
            </div>

            <div className="profile-section">
              <h3>Plataformas</h3>
              <div className="platform-icons-show">
                <FaDesktop className="platform-icon-show" title="PC" />
                <FaPlaystation className="platform-icon-show" title="PS5" />
                <FaXbox className="platform-icon-show" title="Xbox" />
                <FaMobileAlt className="platform-icon-show" title="Mobile" />
              </div>
            </div>

            <div className="profile-section">
              <h3>Categorías</h3>
              <div className="tag-list">
                <span className="tag">RPG</span>
                <span className="tag">Shooter</span>
                <span className="tag">Cartas</span>
              </div>
            </div>

            <div className="profile-section">
              <h3>Disponibilidad</h3>
              <div className="availability-control">
                <span>Fin de semana</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShowProfile;
