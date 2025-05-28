import { createContext, useState, useEffect } from "react";

const AuthContext = createContext(); // Creamos el contexto

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Info del usuario
  const [token, setToken] = useState(null); // Token JWT
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de sesión

  // ✔ Cargar sesión automáticamente al arrancar si hay token en localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem("user");
    console.log(savedSession);

    // ✔ Fetch al perfil del usuario usando el token
    const fetchUserProfile = async (token) => {
      console.log(token);
      try {
        const res = await fetch("http://localhost:3000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.status);

        if (!res.ok) throw new Error("Token inválido o expirado");

        const data = await res.json();
        console.log(data.user);
        setUser(data.user);
        setToken(token);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Error al cargar perfil:", err.message);
        logout(); // limpia si falla
      }
    };

    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        console.log("Parsed session:", parsed);
        if (parsed?.token) fetchUserProfile(parsed.token);
      } catch (e) {
        console.error("JSON parse error:", e);
        logout();
      }
    }
  }, []);

  // ✔ Login manual (cuando te registras o haces login)
  const login = (token) => {
    setToken(token);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify({ token }));
  };

  // ✔ Logout total
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
