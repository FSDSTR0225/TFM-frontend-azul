import { createContext, useState, useEffect, useContext } from "react";
import { socket } from "../socket";
import AuthContext from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { token, isLoggedIn, user } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;

  // Estado que guarda todas las notificaciones
  const [notifications, setNotifications] = useState([]);

  //cargar notificaciones al iniciar sesión
  useEffect(() => {
    if (!isLoggedIn) return;

    const loadNotifications = async () => {
      try {
        const res = await fetch(`${API_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error cargando notificaciones");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Load notifications failed:", err);
      }
    };

    loadNotifications();
  }, [isLoggedIn, token, API_URL]);

  // Conectar socket cuando el usuario esté logueado
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    if (!socket.connected) {
      socket.connect();
      console.log("🔌 Conectando socket manualmente...");
    }

    socket.emit("userConnect", user._id);
    console.log("📡 Emitiendo userConnect tras la conexión:", user._id);

    return () => {
      if (socket.connected) {
        socket.disconnect();
        console.log("🔌 Socket desconectado al salir de sesión");
      }
    };
  }, [isLoggedIn, user]);

  //  recibir notificaciones en tiempo real vía socket
  useEffect(() => {
    if (!socket || !user) return;

    const onNewNotification = (notif) => {
      console.log("📣 [client] nueva notificación recibida:", notif);
      setNotifications((prev) => [notif, ...prev]);
    };

    socket.on("new_notification", onNewNotification);
    return () => {
      socket.off("new_notification", onNewNotification);
    };
  }, [user]);

  //  marca todas las notificaciones como leídas
  const markAllRead = async () => {
    try {
      const res = await fetch(`${API_URL}/notifications/reads`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudieron marcar como leídas");
      // Actualizamos localmente
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("markAllRead failed:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
