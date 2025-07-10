import { React, useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { PacmanLoader } from "react-spinners";
import EventCard from "../components/EventCard";
import EventDetails from "../components/EventDetails";
import { toast } from "sonner";
import "../style/MyEvents.css";

const API_URL = import.meta.env.VITE_API_URL;

function MyEvents() {
  const [loading, setLoading] = useState(true);
  const [eventsfiltered, setEventsFiltered] = useState("creados");
  const [myEventsCreated, setMyEventsCreated] = useState([]);
  const [myEventsJoined, setMyEventsJoined] = useState([]);
  const [createdTotal, setCreatedTotal] = useState(0);
  const [joinedTotal, setJoinedTotal] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [eventRequestsTab, setEventRequestsTab] = useState("received");
  const [receivedEventRequests, setReceivedEventRequests] = useState([]);
  const [sentEventRequests, setSentEventRequests] = useState([]);
  const [historyEventRequests, setHistoryEventRequests] = useState([]);

  const { token, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!isLoggedIn) return;

      const url =
        eventRequestsTab === "received"
          ? `${API_URL}/join-request/my-events/requests`
          : eventRequestsTab === "sent"
          ? `${API_URL}/join-request/my-requests`
          : eventRequestsTab === "history"
          ? `${API_URL}/join-request/my-requests?archived=true`
          : null;

      if (!url) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Error al obtener solicitudes");

        const data = await response.json();
        if (eventRequestsTab === "received") {
          setReceivedEventRequests(data.requests);
        } else if (eventRequestsTab === "sent") {
          setSentEventRequests(data.requests);
        } else if (eventRequestsTab === "history") {
          setHistoryEventRequests(data.requests);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener solicitudes:", error);
        setLoading(false);
      }
    };
    fetchRequests();
  }, [isLoggedIn, eventRequestsTab, token]);

  const handleEventResponse = async (requestId, response) => {
    try {
      const resp = await fetch(`${API_URL}/join-request/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, response }),
      });
      if (!resp.ok) throw new Error("Error al gestionar la solicitud");

      const data = await resp.json();
      // Recupero el objeto original de la petición:
      const originalReq = receivedEventRequests.find(
        (r) => r._id === requestId
      );
      // segun la respuesta, obtengo el nombre de usuario del solicitante:
      // Si se acepta, se usa el nombre de usuario del solicitante actualizado,
      // si se rechaza, se usa el nombre de usuario del solicitante original.
      const username =
        response === "accept"
          ? data.updatedRequest.userRequester.username
          : originalReq.userRequester.username;

      if (response === "accept") {
        toast.success(
          `Solicitud aceptada: ${username} se ha unido al evento "${data.updatedEvent.title}"`,
          { className: "mi-toast", icon: "✅" }
        );
      } else {
        toast.success(
          `Solicitud rechazada: ${username} no puede unirse al evento`,
          { className: "mi-toast", icon: "❌" }
        );
      }

      setReceivedEventRequests((prev) =>
        prev.filter((req) => req._id !== requestId)
      );
    } catch (error) {
      console.error("Error al gestionar la solicitud:", error);
      toast.error("Hubo un error al gestionar la solicitud.", {
        className: "mi-toast",
        icon: "⚠️",
      });
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!isLoggedIn) return;

      try {
        const creados = await fetch(`${API_URL}/events/my-events/created`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const creadosData = await creados.json();
        setMyEventsCreated(
          Array.isArray(creadosData.eventos) ? creadosData.eventos : []
        );
        setCreatedTotal(creadosData.total || 0);

        const unidos = await fetch(`${API_URL}/events/my-events/joined`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const unidosData = await unidos.json();
        setMyEventsJoined(
          Array.isArray(unidosData.eventos) ? unidosData.eventos : []
        );
        setJoinedTotal(unidosData.total || 0);

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [isLoggedIn, token]);

  const handleEventDeleted = (id) => {
    setMyEventsCreated((prev) => prev.filter((e) => e._id !== id));
    setMyEventsJoined((prev) => prev.filter((e) => e._id !== id));

    if (eventsfiltered === "creados") setCreatedTotal((prev) => prev - 1);
    else if (eventsfiltered === "unido") setJoinedTotal((prev) => prev - 1);

    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h1 className="loading-title">Cargando eventos...</h1>
        <PacmanLoader color="#FFD700" size={40} />
      </div>
    );
  }

  return (
    <div className="management-container">
      {/* --- Gestión de solicitudes arriba --- */}
      <div className="section-request-content">
        <h1>Solicitudes de eventos</h1>
        <p>Gestiona tus solicitudes de participación en eventos</p>
        <div className="tab-btns">
          <button
            className={eventRequestsTab === "received" ? "active" : ""}
            onClick={() => setEventRequestsTab("received")}
          >
            Recibidas
          </button>
          <button
            className={eventRequestsTab === "sent" ? "active" : ""}
            onClick={() => setEventRequestsTab("sent")}
          >
            Enviadas
          </button>
          <button
            className={eventRequestsTab === "history" ? "active" : ""}
            onClick={() => setEventRequestsTab("history")}
          >
            Historial
          </button>
        </div>

        {eventRequestsTab === "received" && (
          <div className="tab-received-content">
            <p>Solicitudes a mis eventos</p>
            <ul>
              {receivedEventRequests.length > 0 ? (
                receivedEventRequests.map((req) => (
                  <li key={req._id} className="request-item">
                    <span>
                      {req.userRequester.username} quiere unirse al evento: "
                      {req.event.title}"
                    </span>
                    <div className="actions">
                      <button
                        className="accept-request-btn"
                        onClick={() => handleEventResponse(req._id, "accept")}
                      >
                        Aceptar
                      </button>
                      <button
                        className="reject-request-btn"
                        onClick={() => handleEventResponse(req._id, "reject")}
                      >
                        Rechazar
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li>No tienes solicitudes pendientes</li>
              )}
            </ul>
          </div>
        )}

        {eventRequestsTab === "sent" && (
          <div className="tab-sent-content">
            <p>Mis solicitudes a eventos</p>
            <ul>
              {sentEventRequests.length > 0 ? (
                sentEventRequests.map((req) => (
                  <li key={req._id}>
                    He solicitado unirme al evento: "{req.event.title}"
                  </li>
                ))
              ) : (
                <li>No has solicitado unirte a ningún evento</li>
              )}
            </ul>
          </div>
        )}

        {eventRequestsTab === "history" && (
          <div className="tab-history-content">
            <p>Historial de solicitudes de eventos</p>
            <ul>
              {historyEventRequests.length > 0 ? (
                historyEventRequests.map((req) => (
                  <li key={req._id}>
                    Solicitaste unirte al evento: "{req.event.title}" - Estado
                    actual: {req.status}
                  </li>
                ))
              ) : (
                <li>No hay historial aun para mostrar</li>
              )}
            </ul>
          </div>
        )}
      </div>
      {/* <div className="header-management-content" /> */}
      {/* --- Tus eventos debajo, en fila horizontal con scroll --- */}
      <div className="myEvents-row">
        <div className="myEvents-btns">
          <button
            className={eventsfiltered === "creados" ? "active-btn" : ""}
            onClick={() => setEventsFiltered("creados")}
          >
            Eventos creados por mí
            <span className="badge-total">{createdTotal}</span>
          </button>
          <button
            className={eventsfiltered === "unido" ? "active-btn" : ""}
            onClick={() => setEventsFiltered("unido")}
          >
            Eventos que me he unido
            <span className="badge-total">{joinedTotal}</span>
          </button>
        </div>
        <div className="myEvents-tab-row">
          {showModal && selectedEvent && (
            <EventDetails
              event={selectedEvent}
              onClose={() => setShowModal(false)}
              setSelectedEvent={setSelectedEvent}
              onEventDeleted={handleEventDeleted}
            />
          )}

          <div className="myEvents-cards-row">
            {eventsfiltered === "creados" &&
              (myEventsCreated.length > 0 ? (
                myEventsCreated.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onClick={() => handleEventClick(event)}
                  />
                ))
              ) : (
                <p className="no-events-msg">
                  Aún no has creado ningún evento.
                </p>
              ))}

            {eventsfiltered === "unido" &&
              (myEventsJoined.length > 0 ? (
                myEventsJoined.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onClick={() => handleEventClick(event)}
                  />
                ))
              ) : (
                <p className="no-events-msg">
                  No te has unido a ningún evento aún.
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyEvents;
