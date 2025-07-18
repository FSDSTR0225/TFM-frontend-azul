import { createContext, useState, useEffect, useCallback } from "react";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(); // Creamos el contexto

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Info del usuario
  const [token, setToken] = useState(null); // Token JWT
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de sesión
  const [islogout, setIsLogout] = useState(false); // Estado de logout
  const [loading, setLoading] = useState(true); // Estado de carga

  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  //  Logout total
  const logout = useCallback(() => {
    if (user?._id) {
      //si hay usuario logueado
      // Emitimos el evento de desconexión del usuario que se ha desconectado
      socket.emit("userDisconnected", user._id); // Avisamos que cierra sesión manualmente
    }
    socket.disconnect(); // Desconectamos el socket al hacer logout

    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    setLoading(false);
    setIsLogout(true);
    navigate("/");
  }, [user?._id, navigate]);

  const fetchUserProfile = useCallback(
    async (token) => {
      try {
        const res = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Token inválido o expirado");

        const data = await res.json();
        setUser(data.user);
        setToken(token);
        setIsLoggedIn(true);
        setIsLogout(false);
        socket.auth = { token }; // propiedad de socket para autenticar al usuario,se usa para enviar el token al servidor
        if (!socket.connected) {
          socket.connect();
          socket.once("connect", () => {
            //socket.once asegura que solo se emite una vez cuando se conecta,se usa para evitar múltiples emisiones
            socket.emit("userConnect", data.user._id); // Emitimos el evento de conexión del usuario que se ha conectado
            console.log("userConnect emitido tras la conexión");
          });
        }
      } catch (err) {
        console.error("Error al cargar perfil:", err.message);
        logout();
      } finally {
        setLoading(false);
      }
    },
    [logout, API_URL]
  );

  //  Cargar sesión automáticamente al arrancar si hay token en localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem("user");
    try {
      if (!savedSession) {
        setLoading(false);
        return;
      }

      const sessionData = JSON.parse(savedSession);

      if (sessionData?.token) {
        fetchUserProfile(sessionData.token);
      } else {
        logout();
        setLoading(false);
      }
    } catch (e) {
      console.error("JSON parse error:", e);
      logout();
      setLoading(false);
    }
  }, [fetchUserProfile, logout]);

  // Login manual (cuando te registras o haces login)
  const login = async (token) => {
    localStorage.setItem("user", JSON.stringify({ token }));
    await fetchUserProfile(token);
    setIsLogout(false);
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        isLoggedIn,
        login,
        logout,
        loading,
        islogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
