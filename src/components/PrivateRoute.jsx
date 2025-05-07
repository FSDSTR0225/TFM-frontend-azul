import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext); //Asi obtenemos al usuario(datos recogidos del contexto)

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
