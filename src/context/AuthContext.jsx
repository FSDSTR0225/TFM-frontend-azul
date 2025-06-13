import { createContext, useState, useEffect, useCallback } from "react";
import { socket } from "../sockect";
import { useRef } from "react";

const AuthContext = createContext(); // Creamos el contexto

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Info del usuario
  const [token, setToken] = useState(null); // Token JWT
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de sesión
  const [loading, setLoading] = useState(true); // Estado de carga

  const hasEmittedConnection = useRef(false);

  // ✔ Logout total
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
  }, [user?._id]);

  const fetchUserProfile = useCallback(
    async (token) => {
      try {
        const res = await fetch("http://localhost:3000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Token inválido o expirado");

        const data = await res.json();
        setUser(data.user);
        setToken(token);
        setIsLoggedIn(true);
        if (!socket.connected) {
          socket.connect(); // Conectamos el socket manualmente al iniciar sesión

          console.log("Socket conectado manualmente");
        }

        if (!hasEmittedConnection.current) {
          socket.emit("userConnected", data.user._id); // Emitimos el evento de conexión del usuario que se ha conectado
          hasEmittedConnection.current = true; // Marcar como emitido
        }
      } catch (err) {
        console.error("Error al cargar perfil:", err.message);
        logout();
      } finally {
        setLoading(false);
      }
    },
    [logout]
  );

  // ✔ Cargar sesión automáticamente al arrancar si hay token en localStorage
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

  // ✔ Login manual (cuando te registras o haces login)
  const login = async (token) => {
    localStorage.setItem("user", JSON.stringify({ token }));
    await fetchUserProfile(token);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// import { createContext, useState, useEffect } from "react";

// const AuthContext = createContext(); // Creamos el contexto

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // Info del usuario
//   const [token, setToken] = useState(null); // Token JWT
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de sesión
//   const [loading, setLoading] = useState(true); // Estado de carga

//   // ✔ Cargar sesión automáticamente al arrancar si hay token en localStorage
//   useEffect(() => {
//     const savedSession = localStorage.getItem("user");
//     if (!savedSession) {
//       setLoading(false);
//       return; // Si no hay sesión guardada, salimos
//     }

//     try {
//       const sessionData = JSON.parse(savedSession);

//       if (sessionData?.token && sessionData?.user) {
//         setUser(sessionData.user);
//         setToken(sessionData.token);
//         setIsLoggedIn(true);
//       } else if (sessionData?.token) {
//         fetchUserProfile(sessionData.token);
//       }
//     } catch (e) {
//       console.error("JSON parse error:", e);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // ✔ Fetch al perfil del usuario usando el token
//   const fetchUserProfile = async (token) => {
//     try {
//       const res = await fetch("http://localhost:3000/users/me", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) throw new Error("Token inválido o expirado");

//       const data = await res.json();
//       setUser(data.user);
//       setToken(token);
//       setIsLoggedIn(true);
//     } catch (err) {
//       console.error("Error al cargar perfil:", err.message);
//       logout();
//     }
//   };

//   // ✔ Login manual (cuando te registras o haces login)
//   const login = (user, token) => {
//     setUser(user);
//     setToken(token);
//     setIsLoggedIn(true);
//     localStorage.setItem("user", JSON.stringify({ token, user }));
//   };

//   // ✔ Logout total
//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     setIsLoggedIn(false);
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         setUser,
//         token,
//         isLoggedIn,
//         login,
//         logout,
//         loading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;

// // import { createContext, useState, useEffect } from "react";

// // const AuthContext = createContext(); // Creamos el contexto

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null); // Info del usuario
// //   const [token, setToken] = useState(null); // Token JWT
// //   const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de sesión

// //   // ✔ Cargar sesión automáticamente al arrancar si hay token en localStorage
// //   useEffect(() => {
// //     const savedSession = localStorage.getItem("user");
// //     console.log(savedSession);

// //     // ✔ Fetch al perfil del usuario usando el token
// //     const fetchUserProfile = async (token) => {
// //       console.log(token);
// //       try {
// //         const res = await fetch("http://localhost:3000/users/me", {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //         console.log(res.status);

// //         if (!res.ok) throw new Error("Token inválido o expirado");

// //         const data = await res.json();
// //         console.log(data.user);
// //         setUser(data.user);
// //         setToken(token);
// //         setIsLoggedIn(true);
// //       } catch (err) {
// //         console.error("Error al cargar perfil:", err.message);
// //         logout(); // limpia si falla
// //       }
// //     };

// //     if (savedSession) {
// //       try {
// //         const parsed = JSON.parse(savedSession);
// //         console.log("Parsed session:", parsed);
// //         if (parsed?.token) fetchUserProfile(parsed.token);
// //       } catch (e) {
// //         console.error("JSON parse error:", e);
// //         logout();
// //       }
// //     }
// //   }, []);

// //   // ✔ Login manual (cuando te registras o haces login)
// //   const login = (user, token) => {
// //     setUser(user);
// //     setToken(token);
// //     setIsLoggedIn(true);
// //     localStorage.setItem("user", JSON.stringify({ token, user }));
// //   };

// //   // ✔ Logout total
// //   const logout = () => {
// //     setUser(null);
// //     setToken(null);
// //     setIsLoggedIn(false);
// //     localStorage.removeItem("user");
// //   };

// //   return (
// //     <AuthContext.Provider
// //       value={{
// //         user,
// //         setUser,
// //         token,
// //         isLoggedIn,
// //         login,
// //         logout,
// //       }}
// //     >
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// // export default AuthContext;
