import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../style/CalendarWidget.css";

const API_URL = import.meta.env.VITE_API_URL;

function CalendarWidget() {
  // const [events, setEvents] = useState([]);
  const [eventDates, setEventDates] = useState([]); // Array para almacenar las fechas marcadas en el calendario

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/events/my-events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        // setEvents(data);

        const dates = data.eventos.map((event) =>
          new Date(event.date).toDateString()
        ); // hacemos un map para obtener un array de fechas en formato string
        setEventDates(dates); // Actualizamos el estado con las fechas marcadas
      } catch (error) {
        console.error("Error al cargar eventos del usuario:", error);
      }
    };

    if (token) {
      fetchUserEvents();
    }
  }, [token]);

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateStr = date.toDateString().split("T")[0]; // Convertimos la fecha a string y nos quedamos solo con la parte de la fecha, le hacemos un split para quitar la hora
      if (eventDates.includes(dateStr)) {
        return "event-day";
      }
    }
    return null;
  };

  return (
    <div className="calendar-widget">
      <Calendar tileClassName={tileClassName} />
    </div>
  );
}

export default CalendarWidget;
