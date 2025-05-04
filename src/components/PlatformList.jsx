import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { PacmanLoader } from "react-spinners";
import "../style/PlatformList.css";

function PlatformList() {
  const [platforms, setPlatforms] = useState([]); // Almacenar las plataformas
  const [loading, setLoading] = useState(true); // Almacenar el estado de carga,esta cargando?asi poder mostrar un loading

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await fetch("http://localhost:3000/platforms");
        if (!response.ok) {
          throw new Error("Error fetching platforms");
        }
        const data = await response.json(); // Convertir la respuesta a JSON
        setPlatforms(data.platforms); // Actualizar el estado con los datos de las plataformas
      } catch (error) {
        console.error("Error fetching platforms:", error);
      }
      setLoading(false); // Cambiar el estado de carga a false,podemos ponerle tiempo usando setTimeout setTimeout(() => {setLoading(false);}, 5000);
    };
    fetchPlatforms(); // Llamar a la función para obtener las plataformas
  }, []); // El array vacío significa que el efecto se ejecuta solo una vez al montar el componente

  if (loading) {
    // Si está cargando, muestra...
    return (
      <div className="loading-container">
        <h1 className="loading-title">Cargando plataformas...</h1>
        <PacmanLoader color="#FFD700" size={40} />{" "}
        {/* Los componentes de React spinner reciben css en el propio componente */}
      </div>
    );
  }

  return (
    <>
      <h1 className="section-title1">Listado de plataformas</h1>
      <div className="platform-list">
        {platforms.map((platform) => (
          <Link
            key={platform._id}
            to={`/platforms/${platform._id}/games`}
            className="platform-card"
          >
            <img
              src={platform.icon}
              alt={platform.name}
              className="platform-icon-img"
            />
            {platform.name}
          </Link>
        ))}
      </div>
    </>
  );
}

export default PlatformList;
