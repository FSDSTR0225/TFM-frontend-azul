import { React, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PacmanLoader } from "react-spinners";
import "../style/ExploreGames.css";
import { useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function ExploreEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("query") || "";

  const fetchEvents = useCallback(async (query) => {
    try {
      const response = await fetch(`${API_URL}/search/events?query=${query}`);
      if (!response.ok) {
        throw new Error("Error fetching games");
      }
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(query);
  }, [query, fetchEvents]);

  if (loading) {
    // Si está cargando, muestra...
    return (
      <div className="loading-container">
        <h1 className="loading-title">Cargando búsqueda...</h1>
        <PacmanLoader color="#FFD700" size={40} />{" "}
        {/* Los componentes de React spinner reciben css en el propio componente */}
      </div>
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {events.map((event) => (
        <div key={event._id} onClick={() => navigate(`/events/${event._id}`)}>
          <h3>{event.title}</h3>
          <p>{new Date(event.date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
    // <>
    //   <section className="explore-events-page">
    //     <h2>
    //       Juegos encontrados para:{" "}
    //       <span className="query-explore">"{query}"</span>
    //     </h2>

    //     <div className="events-grid">
    //       {events.map((events) => (
    //         <div
    //           key={events._id}
    //           className="events-card"
    //           onClick={() => navigate(`/events/${events._id || events.id}`)}
    //         >
    //           <h4>{events.title}</h4>
    //           <h5>{event.game.name}</h5>
    //           <h6>{event.creator}</h6>
    //         </div>
    //       ))}
    //     </div>
    //   </section>
  );
}
export default ExploreEvents;
