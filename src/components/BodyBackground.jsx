import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BodyBackground = () => {
  const location = useLocation();

  useEffect(() => {
    const body = document.body;

    // Rutas donde quieres que el fondo global SÍ esté activo
    const showBgOn = ["/lobby"];

    if (showBgOn.includes(location.pathname)) {
      body.classList.add("has-body-bg");
    } else {
      body.classList.remove("has-body-bg");
    }

    // Limpieza opcional por si cambia de forma abrupta
    return () => body.classList.remove("has-body-bg");
  }, [location.pathname]);

  return null;
};

export default BodyBackground;
