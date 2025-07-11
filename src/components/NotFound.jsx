import React from "react";
import { Link } from "react-router-dom";
import "../style/NotFound.css";

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-glass">
        <h1 className="not-found-title">404</h1>
        <div className="typewriter">
          <p className="not-found-message">
            ¡Vaya! Parece que te has perdido en el multiverso gamer.
            <br />
          </p>
          <p className="not-found-message">
            ¿Ibas rumbo a <strong>Azeroth</strong>, a la{" "}
            <strong>Gruta del Invocador</strong>, o Tal vez buscabas acción en{" "}
            <strong>Los Santos</strong>…?
            <br />
            Sea cual sea tu destino, te has desviado del camino jugador.
          </p>
          <p className="not-found-message">
            ⚠️ Has atravesado un portal vacío que no lleva a ningún mundo
            conocido…pero tranquilo: puedes regresar sano y salvo usando este
            portal.
          </p>
        </div>
        <div>
          <Link to="/" className="not-found-button">
            🌀 Portal al Lobby
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
