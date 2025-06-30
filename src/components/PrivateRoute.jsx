import { React, useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { PacmanLoader } from "react-spinners";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading, islogout } = useContext(AuthContext); //Asi obtenemos al usuario(datos recogidos del contexto)

  if (loading) {
    return (
      <div className="loading-container">
        <h2 className="loading-title">Cargando contenido privado...</h2>
        <PacmanLoader color="#FFD700" size={30} />
      </div>
    );
  }
  if (!isLoggedIn && !islogout) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

// return isLoggedIn ? children : <Navigate to="/login" replace />; // replace evita que pueda volver atras el usuario
