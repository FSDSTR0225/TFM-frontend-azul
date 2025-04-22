import { createContext, useState } from "react";

const AuthContext = createContext(); //Creamos contexto

export const AuthProvider = ({ children }) => {
  //Componente proveedor del contexto (provee acceso a la autentificacion)

  const [user, setUser] = useState(null); // Creamos estado para user,donde empieza en null cuando no hay sesión iniciada.

  const login = (userData) => {
    setUser(userData); // login recogerá los datos del usuario y se actualizará el user.
  };

  const logout = () => {
    setUser(null); // Limpiamos los datos del usuario al hacer logout
  };
  return (
    <>
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthContext;
