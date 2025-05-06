import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { PacmanLoader } from "react-spinners";
import "../style/AllGames.css";
import GameCover from "./GameCover";

const API_URL = import.meta.env.VITE_API_URL;

function AllGames() {
  const [games, setGames] = useState([]); // Almacenar todos los juegos
  const [loading, setLoading] = useState(true); // Almacenar el estado de carga,esta cargando?asi poder mostrar un loading

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${API_URL}/games`);

        if (!response.ok) {
          throw new Error("Error fetching games");
        }
        const data = await response.json();
        setGames(data); // Aqui como viene directo el array de juegos, no hace falta hacer data.games
      } catch (error) {
        console.error("Error fetching games:", error);
      }
      setLoading(false); // Cambiar el estado de carga a false,podemos ponerle tiempo usando setTimeout setTimeout(() => {setLoading(false);}, 5000);
    };

    fetchGames(); // Llamar a la función para obtener los juegos
  }, []); // El array vacío significa que el efecto se ejecuta solo una vez al montar el componente

  if (loading) {
    return (
      <div className="loading-container">
        <h1 className="loading-title">Cargando juegos...</h1>
        <PacmanLoader color="#FFD700" size={40} />{" "}
        {/* Los componentes de React spinner reciben css en el propio componente */}
      </div>
    );
  } // Si está cargando, muestra...

  return (
    <>
      <h1 className="section-title2">Listado de juegos</h1>
      <div className="all-games-list">
        {games.map((game) => (
          <GameCover key={game._id || game.rawgId} game={game} />
        ))}
      </div>
    </>
  );
}

export default AllGames;
