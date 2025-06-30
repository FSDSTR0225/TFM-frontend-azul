import { createContext, useState, useEffect, useContext } from "react";
import { socket } from "../socket";
import AuthContext from "./AuthContext";

const NotificationContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const NotificationProvider = ({ children }) => {
  const { token, isLoggedIn, user } = useContext(AuthContext);

  const [receivedFriendRequests, setReceivedFriendRequests] = useState([]); // Solicitudes de amistad recibidas
  const [sentFriendRequests, setSentFriendRequests] = useState([]); // Solicitudes de amistad enviadas
  const [receivedEventRequests, setReceivedEventRequests] = useState([]); // Solicitudes de eventos recibidas
  const [sentEventRequests, setSentEventRequests] = useState([]); // Solicitudes de eventos enviadas

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchAllRequests = async () => {
      try {
        const friendReceivedResponse = await fetch(
          `${API_URL}/friends/requests/received`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const friendReceived = await friendReceivedResponse.json();

        const friendSentResponse = await fetch(
          `${API_URL}/friends/requests/sent`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const friendSent = await friendSentResponse.json();

        const eventReceivedResponse = await fetch(
          `${API_URL}/join-request/my-events/requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const eventReceived = await eventReceivedResponse.json();

        const eventSentResponse = await fetch(
          `${API_URL}/join-request/my-requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const eventSent = await eventSentResponse.json();

        setReceivedFriendRequests(friendReceived);
        setSentFriendRequests(friendSent);
        setReceivedEventRequests(eventReceived.requests);
        setSentEventRequests(eventSent.requests);
      } catch (err) {
        console.error("Error cargando solicitudes:", err);
      }
    };

    fetchAllRequests();
  }, [isLoggedIn, token]);

  useEffect(() => {
    if (!socket || !user) return;

    const handleFriendNotification = (newRequest) => {
      setReceivedFriendRequests((prev) => [newRequest, ...prev]);
    };

    const handleEventNotification = (notification) => {
      setReceivedEventRequests((prev) => [notification, ...prev]);
    };

    socket.on("friend-notification", handleFriendNotification);
    socket.on("event-notification", handleEventNotification);

    return () => {
      socket.off("friend-notification", handleFriendNotification);
      socket.off("event-notification", handleEventNotification);
    };
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{
        receivedFriendRequests,
        sentFriendRequests,
        receivedEventRequests,
        sentEventRequests,
        setReceivedFriendRequests,
        setSentFriendRequests,
        setReceivedEventRequests,
        setSentEventRequests,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
