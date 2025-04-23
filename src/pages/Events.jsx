import React from "react";

export const Events = () => {
  return (
    <div className="event-container">
      <h1 className="title-events">Eventos</h1>
      <div>
        <button>Crear evento</button>

        <input type="date" />
        <select>
          <option value="">Hoy</option>
          <option value="">Mañana</option>
          <option value="">Fin de semana</option>
          <option value="">Esta semana</option>
          <option value="">Este mes</option>
        </select>

        <input type="text" name="Juego" />
      </div>
    </div>
  );
};

export default Events;
