import { React, useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { PacmanLoader } from "react-spinners";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext); //Asi obtenemos al usuario(datos recogidos del contexto)

  if (loading) {
    return (
      <div className="loading-container">
        <h2 className="loading-title">Cargando contenido privado...</h2>
        <PacmanLoader color="#FFD700" size={30} />
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />; // replace evita que pueda volver atras el usuario
};

export default PrivateRoute;

// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const PrivateRoute = ({ children }) => {
//   const { user } = useAuth(); //Asi obtenemos al usuario(datos recogidos del contexto)

//   if (!user) {
//     return <Navigate to="/login" replace />; // replace evita que pueda volver atras el usuario
//   }

//   return children;
// };

// export default PrivateRoute;
