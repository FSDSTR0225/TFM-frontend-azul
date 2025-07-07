import React from "react";
import { IoLogoGameControllerB } from "react-icons/io";
import { FcCalendar } from "react-icons/fc";
import { FaUsers } from "react-icons/fa";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { GrChatOption } from "react-icons/gr";
import "../style/ExplainCards.css";
import { useNavigate } from "react-router-dom";

function ExplainCards() {
  const navigate = useNavigate();

  return (
    <section className="explain-section">
      <h2 className="explain-title">¿Qué puedes hacer en Link2Play?</h2>
      <div className="explain-cards">
        <div className="card1">
          <h3 className="card-title">
            {" "}
            <FaUsers className="card-icon" />
            Encuentra jugadores como tú
          </h3>
          <p className="card-description">
            Conecta con gamers afines según tus juegos, estilo de juego y
            horario. Forma tu squad ideal sin perder tiempo buscando en foros o
            grupos vacíos.
          </p>

          <div className="card-btn">
            <button onClick={() => navigate("/players")}>Explorar</button>
          </div>
        </div>
        <div className="card2">
          <h3 className="card-title">
            {" "}
            <MdOutlineEmojiEvents className="card-icon" />
            <FcCalendar className="card-icon" />
            Crea y únete a eventos
          </h3>
          <p className="card-description">
            Organiza tus propias partidas, raids o torneos de tu juego favorito
            o únete a eventos creados por otros jugadores.
          </p>

          <div className="card-btn">
            <button onClick={() => navigate("/events")}>Explorar</button>
          </div>
        </div>
        <div className="card3">
          <h3 className="card-title">
            {" "}
            <GrChatOption className="card-icon" />
            Comunicación activa
          </h3>
          <p className="card-description">
            Chatea con otros jugadores y recibe notificaciones en tiempo real.
            Mantente siempre conectado con tu equipo y no te pierdas ningun
            evento.
          </p>

          <div className="card-btn">
            <button onClick={() => navigate("/post")}>Explorar</button>
          </div>
        </div>
        <div className="card4">
          <h3 className="card-title">
            {" "}
            <img src="/images/123.png" alt="Bot Icon" className="explain-bot" />
            IA gamer personalizada
          </h3>
          <p className="card-description">
            Nuestro asistente con IA te recomienda compañeros perfectos y
            partidas a medida. Juega con quien quieras, cuando quieras, sin
            complicaciones.
          </p>

          <div className="card-btn">
            <button>Explorar</button>
          </div>
        </div>
      </div>
      <div className="explain-games">
        <IoLogoGameControllerB className="explain-icon" />
        <h2 className="explain-games-title">
          Explora más de 10.000 juegos con ficha detallada
        </h2>
        <p className="explain-games-description">
          Busca y filtra por plataformas, explora nuevos títulos y descubre a
          qué juegan tus amigos. Conoce las últimas novedades y tendencias
          dentro de la comunidad gamer.
        </p>
      </div>
    </section>
  );
}

export default ExplainCards;
