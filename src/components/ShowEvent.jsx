import React from "react";
import "../style/ShowEvent.css";
import { FaDesktop, FaUsers } from "react-icons/fa";
import { IoLogoGameControllerB } from "react-icons/io";
import { FcOvertime } from "react-icons/fc";
import { GiBoxTrap, GiArmoredBoomerang } from "react-icons/gi";

function ShowEvent() {
  return (
    <section className="event-glass-section">
      <div className="event-wrapper-glass">
        <div className="event-preview">
          <div className="event-card-show float-card reveal">
            <div className="event-image">
              <img src="/src/assets/valorant2.jpg" alt="Imagen del evento" />
            </div>
            <h2 className="event-title-show">Partida Ranked Valorant</h2>

            <div className="event-game">
              <span>Valorant</span>
            </div>

            <div className="event-datetime">
              <FcOvertime className="event-icon-show" />{" "}
              <span>26/05/2025 - 21:00h</span>
            </div>

            <div className="event-platform">
              <FaDesktop className="event-icon-show" />
              <span> PC </span>
            </div>

            <div className="event-players2">
              <FaUsers className="event-icon-show" />{" "}
              <span> 1/5 jugadores</span>
            </div>

            <div className="event-status">
              <GiBoxTrap className="event-icon-show" /> <span>Abierto</span>
            </div>

            <p className="event-description">
              ¡Únete a esta partida competitiva para subir de rango!
            </p>

            <div className="event-footer">
              <button className="create-event-btn">Crear evento</button>
            </div>
          </div>
        </div>
        {/* COLUMNA IZQUIERDA */}
        <div className="event-info">
          <h2>¿Quieres organizar una partida o torneo? </h2>
          <p>
            Con Link2Play crea tu propio evento en segundos: partidas casuales,
            torneos épicos o misiones imposibles de completar en solitario.
            Elige el juego, la plataforma, la fecha y conecta con jugadores que
            buscan lo mismo que tú.
            <strong>¡Tú decides cuándo, cómo y con quién jugar!</strong>
          </p>

          <ul>
            <li>
              <IoLogoGameControllerB /> Elige el juego y la plataforma.
            </li>
            <li>
              <FaUsers />
              Define el número de jugadores.
            </li>
            <li>
              <FcOvertime /> Establece la fecha y hora.
            </li>
            <li>
              <GiArmoredBoomerang /> Crea partidas casuales, torneos o misiones
              épicas.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ShowEvent;
