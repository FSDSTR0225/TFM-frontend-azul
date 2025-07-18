import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
// import { PacmanLoader } from "react-spinners";
import "../style/PlatformList.css";

const API_URL = import.meta.env.VITE_API_URL;

function PlatformList() {
  const [platforms, setPlatforms] = useState([]); // Almacenar las plataformas
  // const [loading, setLoading] = useState(true); // Almacenar el estado de carga,esta cargando?asi poder mostrar un loading

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await fetch(`${API_URL}/platforms`);
        if (!response.ok) {
          throw new Error("Error fetching platforms");
        }
        const data = await response.json(); // Convertir la respuesta a JSON
        setPlatforms(data.platforms); // Actualizar el estado con los datos de las plataformas
      } catch (error) {
        console.error("Error fetching platforms:", error);
      }
    };
    fetchPlatforms(); // Llamar a la función para obtener las plataformas
  }, []); // El array vacío significa que el efecto se ejecuta solo una vez al montar el componente

  // if (loading) {
  //   // Si está cargando, muestra...
  //   return (
  //     <div className="loading-container">
  //       <h1 className="loading-title">Cargando plataformas...</h1>
  //       <PacmanLoader color="#FFD700" size={40} />{" "}
  //       {/* Los componentes de React spinner reciben css en el propio componente */}
  //     </div>
  //   );
  // }

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
            <span className="platform-name-card">{platform.name}</span>
          </Link>
        ))}
      </div>
    </>
  );
}

export default PlatformList;
