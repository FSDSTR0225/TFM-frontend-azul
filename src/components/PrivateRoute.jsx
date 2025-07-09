import { React, useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { PacmanLoader } from "react-spinners";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading, islogout } = useContext(AuthContext); //Asi obtenemos al usuario(datos recogidos del contexto)

  if (loading) {
    return null; // Si está cargando, no renderiza nada
  }
  if (!isLoggedIn && !islogout) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

// return isLoggedIn ? children : <Navigate to="/login" replace />; // replace evita que pueda volver atras el usuario
