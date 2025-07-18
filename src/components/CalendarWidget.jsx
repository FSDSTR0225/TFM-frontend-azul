import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../style/CalendarWidget.css";
import { TbCalendarBolt } from "react-icons/tb";

const API_URL = import.meta.env.VITE_API_URL;

function CalendarWidget({ onEventClick }) {
  const [eventDates, setEventDates] = useState([]); // Guardamos las fechas de los eventos del usuario
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/events/my-events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const dates = data.eventos.map((event) =>
          new Date(event.date).toDateString()
        );
        setEventDates(dates);
      } catch (error) {
        console.error("Error al cargar eventos del usuario:", error);
      }
    };

    if (token) fetchUserEvents();
  }, [token]);

  // tileClassName es una función que se usa para añadir clases a las fechas del calendario
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateStr = date.toDateString();
      if (eventDates.includes(dateStr)) {
        return "event-day";
      }
    }
    return null;
  };

  return (
    <div className="modular-card-calendar-card">
      {/* <div className="modular-card-header">
        <TbCalendarBolt className="modular-card-icon" />
        <h3>Calendario de eventos</h3>
      </div> */}
      <div className="modular-card-content">
        <Calendar tileClassName={tileClassName} onClickDay={onEventClick} />{" "}
        {/* Añadimos onClickDay para manejar el clic en un día,llamando a la función onEventClick que recibe el componente padre */}
      </div>
    </div>
  );
}

export default CalendarWidget;
