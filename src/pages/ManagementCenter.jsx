import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../style/ManagementCenter.css";
import { toast } from "sonner";
import { PacmanLoader } from "react-spinners";
import { socket } from "../socket";

const API_URL = import.meta.env.VITE_API_URL;

function ManagementCenter() {
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState("eventsRequests");
  const [eventRequestsTab, setEventRequestsTab] = useState("received");
  const [receivedEventRequests, setReceivedEventRequests] = useState([]);
  const [sentEventRequests, setSentEventRequests] = useState([]);
  const [historyEventRequests, setHistoryEventRequests] = useState([]);
  const [friendRequestsTab, setFriendRequestsTab] = useState("received");
  const [receivedFriendRequests, setReceivedFriendRequests] = useState([]);
  const [sentFriendRequests, setSentFriendRequests] = useState([]);
  //   const [historyFriendRequests, setHistoryFriendRequests] = useState([]);

  const authContext = useContext(AuthContext);
  const { token, isLoggedIn } = authContext;

  useEffect(() => {
    const fetchRequests = async () => {
      if (!isLoggedIn || section !== "eventsRequests") return;

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
  }, [isLoggedIn, section, eventRequestsTab, token]);

  useEffect(() => {
    if (
      !isLoggedIn ||
      section !== "friendsRequests" ||
      friendRequestsTab !== "sent"
    )
      return;

    fetch(`${API_URL}/friends/requests/sent`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setSentFriendRequests(data))
      .catch((err) =>
        console.error("Error cargando solicitudes enviadas:", err)
      );
  }, [isLoggedIn, section, friendRequestsTab, token]);

  useEffect(() => {
    if (
      !isLoggedIn ||
      section !== "friendsRequests" ||
      friendRequestsTab !== "received"
    )
      return;

    fetch(`${API_URL}/friends/requests/received`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setReceivedFriendRequests(data))
      .catch((err) =>
        console.error("Error cargando solicitudes recibidas:", err)
      );
  }, [isLoggedIn, section, friendRequestsTab, token]);

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

      if (response === "accept") {
        toast.success(
          `Solicitud aceptada: ${data.updatedRequest.userRequester.username} se ha unido al evento "${data.updatedEvent.title}"`,
          { className: "mi-toast", icon: "✅" }
        );
      } else {
        toast.success(
          `Solicitud rechazada: ${data.updatedRequest.userRequester.username} no puede unirse al evento`,
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoggedIn) return;

      fetch(`${API_URL}/friends/requests/received`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setReceivedFriendRequests(data))
        .catch((err) => console.error("Error actualizando solicitudes:", err));
    }, 15000); // cada 15s

    return () => clearInterval(interval);
  }, [isLoggedIn, token]);

  useEffect(() => {
    if (!socket) return;

    const handleNewFriendRequest = (newRequest) => {
      // Solo actualizamos si estamos en la pestaña correcta
      setReceivedFriendRequests((prev) => [newRequest, ...prev]);
    };

    socket.on("newFriendRequest", handleNewFriendRequest);

    return () => {
      socket.off("newFriendRequest", handleNewFriendRequest);
    };
  }, [section, friendRequestsTab]);

  const handleCancelFriendRequest = async (requestId) => {
    try {
      const response = await fetch(`${API_URL}/friends/requests/${requestId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al retirar la solicitud");

      toast.success("Solicitud de amistad retirada", { icon: "🚫" });

      setSentFriendRequests((prev) =>
        prev.filter((req) => req._id !== requestId)
      );
    } catch (error) {
      console.error("Error al cancelar solicitud de amistad:", error);
      toast.error("No se pudo retirar la solicitud");
    }
  };

  const handleFriendResponse = async (requestId, response) => {
    try {
      const res = await fetch(
        `${API_URL}/friends/requests/${requestId}/${response}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Error al procesar la solicitud de amistad");

      toast.success(
        response === "accept"
          ? "Has aceptado la solicitud de amistad"
          : "Has rechazado la solicitud de amistad",
        { icon: response === "accept" ? "✅" : "❌" }
      );

      setReceivedFriendRequests((prev) =>
        prev.filter((req) => req._id !== requestId)
      );
    } catch (error) {
      console.error("Error gestionando solicitud de amistad:", error);
      toast.error("No se pudo procesar la solicitud de amistad", {
        icon: "⚠️",
      });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h1 className="loading-title">Cargando el centro de gestión...</h1>
        <PacmanLoader color="#FFD700" size={40} />
      </div>
    );
  }

  return (
    <div className="management-container">
      <div className="header-management-content" />
      <h1>Centro de gestión</h1>
      <p>Gestiona tus solicitudes de amistad y eventos</p>

      <div className="sidebar-content">
        <div
          className={section === "eventsRequests" ? "active" : ""}
          onClick={() => setSection("eventsRequests")}
        >
          Solicitudes de eventos
          <span className="badge-request">{receivedEventRequests.length}</span>
        </div>

        <div
          className={section === "friendsRequests" ? "active" : ""}
          onClick={() => setSection("friendsRequests")}
        >
          Solicitudes de amistad
          <span className="badge-request">{receivedFriendRequests.length}</span>
        </div>
      </div>

      <div className="right-content">
        {section === "eventsRequests" && (
          <div className="section-request-content">
            <h2>Solicitudes de eventos</h2>
            <div className="tab-btns">
              <button onClick={() => setEventRequestsTab("received")}>
                Recibidas
              </button>
              <button onClick={() => setEventRequestsTab("sent")}>
                Enviadas
              </button>
              <button onClick={() => setEventRequestsTab("history")}>
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
                          {req.userRequester.username} quiere unirse al evento:
                          "{req.event.title}"
                        </span>
                        <div className="actions">
                          <button
                            className="accept-request-btn"
                            onClick={() =>
                              handleEventResponse(req._id, "accept")
                            }
                          >
                            Aceptar
                          </button>
                          <button
                            className="reject-request-btn"
                            onClick={() =>
                              handleEventResponse(req._id, "reject")
                            }
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
                        Solicitaste unirte al evento: "{req.event.title}" -{" "}
                        Estado actual: {req.status}
                      </li>
                    ))
                  ) : (
                    <li>No hay historial aun para mostrar</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {section === "friendsRequests" && (
          <div className="section-request-content">
            <h2>Solicitudes de amistad</h2>
            <div className="tab-btns">
              <button onClick={() => setFriendRequestsTab("received")}>
                Recibidas
              </button>
              <button onClick={() => setFriendRequestsTab("sent")}>
                Enviadas
              </button>
              <button onClick={() => setFriendRequestsTab("history")}>
                Historial
              </button>
            </div>
            <p>Para gestionar quién es tu amigo en la app.</p>

            {friendRequestsTab === "received" && (
              <div className="tab-received-content">
                <p>Solicitudes de amistad recibidas</p>
                <ul>
                  {receivedFriendRequests.length > 0 ? (
                    receivedFriendRequests.map((req) => (
                      <li key={req._id} className="request-item">
                        <span>
                          Tienes una petición de amistad de{" "}
                          {req.userSender.username}
                        </span>
                        <div className="actions">
                          <button
                            className="accept-request-btn"
                            onClick={() =>
                              handleFriendResponse(req._id, "accept")
                            }
                          >
                            Aceptar
                          </button>
                          <button
                            className="reject-request-btn"
                            onClick={() =>
                              handleFriendResponse(req._id, "reject")
                            }
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

            {friendRequestsTab === "sent" && (
              <div className="tab-sent-content">
                <p>Solicitudes de amistad enviadas</p>
                <ul>
                  {sentFriendRequests.length > 0 ? (
                    sentFriendRequests.map((req) => (
                      <li key={req._id} className="request-item">
                        <img
                          src={req.userReceiver.avatar}
                          alt="avatar"
                          className="avatar-small"
                        />
                        Has solicitado una petición de amistad a: "
                        {req.userReceiver.username}"
                        <button
                          className="cancel-request-btn"
                          onClick={() => handleCancelFriendRequest(req._id)}
                        >
                          Cancelar
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>No tienes ninguna petición de amistad enviada</li>
                  )}
                </ul>
              </div>
            )}

            {friendRequestsTab === "history" && (
              <div className="tab-history-content">
                <p>Historial de amistad (a implementar)</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagementCenter;

// import { useState, useEffect, useContext } from "react";
// import AuthContext from "../context/AuthContext";
// import "../style/ManagementCenter.css";
// import { toast } from "sonner";
// import { PacmanLoader } from "react-spinners";

// const API_URL = import.meta.env.VITE_API_URL;

// function ManagementCenter() {
//   const [loading, setLoading] = useState(true);
//   const [section, setSection] = useState("eventsRequests"); // para gestionar las secciones de solicitudes de eventos y amistad,indica en que sección estamos
//   const [eventRequestsTab, setEventRequestsTab] = useState("received"); // para gestionar las pestañas de solicitudes de eventos,indica en que pestaña estamos
//   const [receivedEventRequests, setReceivedEventRequests] = useState([]);
//   const [sentEventRequests, setSentEventRequests] = useState([]);
//   const [historyEventRequests, setHistoryEventRequests] = useState([]);
//   const [friendRequestsTab, setFriendRequestsTab] = useState("received"); // para gestionar las pestañas de solicitudes de amistad,indica en que pestaña estamos
//   const [receivedFriendRequests, setReceivedFriendRequests] = useState([]); // estado para almacenar las solicitudes de amistad recibidas
//   const [sentFriendRequests, setSentFriendRequests] = useState([]); // estado para almacenar las solicitudes de amistad enviadas
//   const [historyFriendRequests, setHistoryFriendRequests] = useState([]); // estado para almacenar el historial de solicitudes de amistad

//   const authContext = useContext(AuthContext);
//   const { token, isLoggedIn } = authContext;

//   useEffect(() => {
//     const fetchRequests = async () => {
//       if (!isLoggedIn || section !== "eventsRequests") return;

//       // URL para obtener solicitudes de eventos según la pestaña seleccionada
//       const url =
//         eventRequestsTab === "received"
//           ? `${API_URL}/join-request/my-events/requests`
//           : eventRequestsTab === "sent"
//           ? `${API_URL}/join-request/my-requests`
//           : eventRequestsTab === "history"
//           ? `${API_URL}/join-request/my-requests?archived=true` // si el evento ya ha sido gestionado, el archived será true y se mostrará en el historial
//           : null;

//       if (!url) {
//         setLoading(false);
//         return;
//       }
//       try {
//         const response = await fetch(url, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!response.ok) throw new Error("Error al obtener solicitudes");

//         const data = await response.json();
//         // Dependiendo de la pestaña, actualizamos el estado correspondiente
//         if (eventRequestsTab === "received") {
//           setReceivedEventRequests(data.requests);
//         } else if (eventRequestsTab === "sent") {
//           setSentEventRequests(data.requests);
//         } else if (eventRequestsTab === "history") {
//           setHistoryEventRequests(data.requests);
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error("Error al obtener solicitudess:", error);
//         setLoading(false);
//       }
//     };
//     fetchRequests();
//   }, [isLoggedIn, section, eventRequestsTab, token]);

//   const handleResponse = async (requestId, response) => {
//     // Función para aceptar o rechazar una solicitud de evento
//     try {
//       const resp = await fetch(`${API_URL}/join-request/requests`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ requestId, response }),
//       });
//       if (!resp.ok) {
//         throw new Error("Error al gestionar la solicitud");
//       }
//       const data = await resp.json();

//       if (response === "accept") {
//         toast.success(
//           `Solicitud aceptada: ${data.updatedRequest.userRequester.username} se ha unido al evento "${data.updatedEvent.title}"`,
//           {
//             className: "mi-toast",
//             icon: "✅",
//           }
//         );
//       }
//       if (response === "reject") {
//         toast.success(
//           `Solicitud rechazada: ${data.updatedRequest.userRequester.username} no puede unirse al evento`,
//           {
//             className: "mi-toast",
//             icon: "❌",
//           }
//         );
//       }
//       // Actualizar las solicitudes recibidas después de aceptar o rechazar
//       setReceivedEventRequests((prevRequests) =>
//         prevRequests.filter((req) => req._id !== requestId)
//       );
//     } catch (error) {
//       console.error("Error al gestionar la solicitud:", error);
//       toast.error(
//         "Hubo un error al gestionar la solicitud. Por favor, inténtalo de nuevo más tarde.",
//         {
//           className: "mi-toast",
//           icon: "⚠️",
//         }
//       );
//     }
//   };

//   if (loading) {
//     // Si está cargando, muestra...
//     return (
//       <div className="loading-container">
//         <h1 className="loading-title">Cargando solicitudes...</h1>
//         <PacmanLoader color="#FFD700" size={40} />{" "}
//         {/* Los componentes de React spinner reciben css en el propio componente */}
//       </div>
//     );
//   }

//   return (
//     <div className="management-container">
//       <div className="header-management-content" />
//       <h1>Centro de gestión</h1>
//       <p>Gestiona tus solicitudes de amistad y eventos</p>

//       {/* Sidebar izquierdo */}
//       <div className="sidebar-content">
//         <div
//           className={section === "eventsRequests" ? "active" : ""}
//           onClick={() => setSection("eventsRequests")}
//         >
//           Solicitudes de eventos
//           <span className="badge-request" title="Tienes solicitudes pendientes">
//             {receivedEventRequests.length}
//           </span>
//         </div>

//         <div
//           className={section === "friendsRequests" ? "active" : ""}
//           onClick={() => setSection("friendsRequests")}
//         >
//           Solicitudes de amistad
//           <span className="badge-request" title="Tienes solicitudes pendientes">
//             2
//           </span>
//         </div>
//       </div>

//       {/* Contenido a la derecha */}
//       <div className="right-content">
//         {/* seccion eventos */}
//         {section === "eventsRequests" && ( //si estamos en la sección de solicitudes de eventos
//           <div className="section-request-content">
//             <h2>Solicitudes de eventos</h2>
//             <div className="tab-btns">
//               {/* botones para cambiar entre pestañas de solicitudes de eventos
//                */}
//               <button onClick={() => setEventRequestsTab("received")}>
//                 Recibidas
//               </button>
//               <button onClick={() => setEventRequestsTab("sent")}>
//                 Enviadas
//               </button>
//               <button onClick={() => setEventRequestsTab("history")}>
//                 Historial
//               </button>
//             </div>

//             {eventRequestsTab === "received" && ( // si estamos en la pestaña de solicitudes recibidas a mis eventos
//               <div className="tab-received-content">
//                 <p>Solicitudes a mis eventos</p>
//                 <ul>
//                   {/* lista de solicitudes recibidas a mis eventos, se hace un mapeo de cada una para mostrar el username y le titulo */}
//                   {receivedEventRequests.length > 0 ? (
//                     receivedEventRequests.map((req) => (
//                       <li key={req._id} className="request-item">
//                         <span>
//                           {req.userRequester.username} quiere unirse al evento:
//                           "{req.event.title}"
//                         </span>
//                         <div className="actions">
//                           <button
//                             className="accept-request-btn"
//                             onClick={() => handleResponse(req._id, "accept")}
//                           >
//                             Aceptar
//                           </button>
//                           <button
//                             className="reject-request-btn"
//                             onClick={() => handleResponse(req._id, "reject")}
//                           >
//                             Rechazar
//                           </button>
//                         </div>
//                       </li>
//                     ))
//                   ) : (
//                     <li>No tienes solicitudes pendientes</li> // si no hay solicitudes pendientes, se muestra este mensaje
//                   )}
//                 </ul>
//               </div>
//             )}

//             {eventRequestsTab === "sent" && ( // si estamos en la pestaña de solicitudes enviadas a eventos
//               <div className="tab-sent-content">
//                 <p>Mis solicitudes a eventos</p>
//                 <ul>
//                   {sentEventRequests.length > 0 ? ( //si hay solicitudes enviadas, se mapea cada una para mostrar el titulo del evento al que se ha solicitado unirse
//                     sentEventRequests.map((req) => (
//                       <li key={req._id}>
//                         He solicitado unirme al evento: "{req.event.title}"
//                       </li>
//                     ))
//                   ) : (
//                     <li>No has solicitado unirte a ningún evento</li> // si no hay solicitudes enviadas, se muestra este mensaje
//                   )}
//                 </ul>
//               </div>
//             )}

//             {eventRequestsTab === "history" && ( // si estamos en la pestaña de historial de solicitudes de eventos
//               <div className="tab-history-content">
//                 <p>Historial de solicitudes de eventos</p>
//                 <p>
//                   Aquí se mostrarán las solicitudes pasadas cuando haya logica.
//                 </p>
//                 <ul>
//                   {historyEventRequests.length > 0 ? ( //si hay solicitudes enviadas, se mapea cada una para mostrar el titulo del evento al que se ha solicitado unirse
//                     historyEventRequests.map((req) => (
//                       <li key={req._id}>
//                         Solicitaste unirte al evento: "{req.event.title}" -
//                         Estado actual: {req.status}
//                       </li>
//                     ))
//                   ) : (
//                     <li>No hay historial aun para mostrar</li> // si no hay solicitudes enviadas, se muestra este mensaje
//                   )}
//                 </ul>
//               </div>
//             )}
//           </div>
//         )}

//         {/* seccion amistades */}
//         {section === "friendsRequests" && ( // si estamos en la sección de solicitudes de amistad
//           <div className="section-request-content">
//             <h2>Solicitudes de amistad</h2>
//             <div className="tab-btns">
//               {/* botones para cambiar entre pestañas de solicitudes de amistad */}
//               <button onClick={() => setFriendRequestsTab("received")}>
//                 Recibidas
//               </button>
//               <button onClick={() => setFriendRequestsTab("sent")}>
//                 Enviadas
//               </button>
//               <button onClick={() => setFriendRequestsTab("history")}>
//                 Historial
//               </button>
//             </div>
//             <p>Para gestionar quién es tu amigo en la app.</p>
//           </div>
//         )}
//         {friendRequestsTab === "received" && ( // si estamos en la pestaña de solicitudes recibidas de amistad
//           <div className="tab-received-content">
//             <p>Solicitudes de amistad recibidas</p>
//             <ul>
//               {/* lista de solicitudes recibidas a mis eventos, se hace un mapeo de cada una para mostrar el username y le titulo */}
//               {receivedFriendRequests.length > 0 ? (
//                 receivedFriendRequests.map((req) => (
//                   <li key={req._id} className="request-item">
//                     <span>
//                       Tienes una petición de amistad de{" "}
//                       {req.userSender.username}
//                     </span>
//                     <div className="actions">
//                       <button
//                         className="accept-request-btn"
//                         onClick={() => handleResponse(req._id, "accept")}
//                       >
//                         Aceptar
//                       </button>
//                       <button
//                         className="reject-request-btn"
//                         onClick={() => handleResponse(req._id, "reject")}
//                       >
//                         Rechazar
//                       </button>
//                     </div>
//                   </li>
//                 ))
//               ) : (
//                 <li>No tienes solicitudes pendientes</li> // si no hay solicitudes pendientes, se muestra este mensaje
//               )}
//             </ul>
//           </div>
//         )}
//         {friendRequestsTab === "sent" && ( // si estamos en la pestaña de solicitudes enviadas de amistad
//           <div className="tab-sent-content">
//             <p>Solicitudes de amistad enviadas</p>
//             <ul>
//               {sentFriendRequests.length > 0 ? ( //si hay solicitudes enviadas, se mapea cada una para mostrar el nombre del usuario al que se ha enviado la solicitud
//                 sentFriendRequests.map((req) => (
//                   <li key={req._id}>
//                     Has solicitado una petición de amistad a: "
//                     {req.user.username}"
//                   </li>
//                 ))
//               ) : (
//                 <li>
//                   No tienes ninguna petición de amistad enviada en este momento
//                 </li> // si no hay solicitudes enviadas, se muestra este mensaje
//               )}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ManagementCenter;
