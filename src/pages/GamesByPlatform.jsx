import React from "react";
import { useParams } from "react-router-dom"; // hook para obtener los parámetros de la URL
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // hook para navegar entre rutas
import "../style/GamesByPlatform.css";
import GameCover from "../components/GameCover";
import { PacmanLoader } from "react-spinners";
import Pagination from "../components/Pagination"; // Importamos el componente de paginación

const API_URL = import.meta.env.VITE_API_URL;

function GamesByPlatform() {
  const { platformId } = useParams(); // Obtener el id de la plataforma de la URL
  const [games, setGames] = useState([]); // Estado para almacenar los juegos
  const [loading, setLoading] = useState(true); // Estado para estado de carga,loading...
  const [currentPage, setCurrentPage] = useState(1); // Estado para almacenar la página actual, empezamos en la 1
  const [platform, setPlatform] = useState(null); // Estado para almacenar la plataforma actual

  const navigate = useNavigate(); // Hook para navegar entre rutas

  const gamesOnPage = 25; // Número de juegos por página

  // const indexLastGame = currentPage * gamesOnPage; // Índice del último juego a mostrar en la página actual, ej: pagina 1 * 25 juegos por pagina = 25
  // const indexFirstGame = indexLastGame - gamesOnPage; // Índice del primer juego a mostrar en la página actual, ej: indice del último juego(25) - 25 juegos por pagina = 0
  // const gamesToShow = games.slice(indexFirstGame, indexLastGame); // Juegos a mostrar en la página actual, slice devuelve una copia del array desde el punto a hasta el b,sin incluir b(0 a 24-no incluye )

  const handleOnClick = (direction) => {
    if (direction === "siguiente") {
      setCurrentPage((prevCurrentPage) => prevCurrentPage + 1); // Si el usuario hace click en siguiente, se suma 1 a la pagina actual
    } else if (direction === "anterior") {
      setCurrentPage((prevCurrentPage) => Math.max(prevCurrentPage - 1, 1)); // Si el usuario hace click en anterior, se resta 1 a la pagina actual, pero no puede ser menor que 1 por eso usamos Math.max que devuelve el mayor de los dos valores que siempre es 1 o mayor.
    }
  };

  useEffect(() => {
    setLoading(true);

    const fetchGames = async () => {
      try {
        const response = await fetch(
          `${API_URL}/platforms/${platformId}/games?page=${currentPage}&limit=${gamesOnPage}`
        );
        if (!response.ok) {
          throw new Error("Error fetching games");
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        setGames(data.games);
        setPlatform(data.platform);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [platformId, currentPage]); // UsseEffect se ejecuta cuando cambia el platformId, si el usuario cambia el platformId cambiando de platadorma,se ejecuta el fetch de nuevo.

  if (loading || !platform) {
    // Si está cargando o no hay plataforma, muestra loading...
    // Si está cargando, muestra loading...(luego libreria Ruben)
    return (
      <div className="loading-container">
        <h1 className="loading-title">Cargando juegos...</h1>
        <PacmanLoader color="#FFD700" size={40} />{" "}
        {/* Los componentes de React spinner reciben css en el propio componente */}
      </div>
    );
  }

  return (
    <div className="games-by-platform-page">
      <div className="background-blur-overlay" />

      <div className="content-container">
        <div className="back-btn">
          {/* Botón para volver a la página anterior usando navigate -1*/}
          <span onClick={() => navigate(-1)}>← Volver</span>
        </div>
        <div className="section-title3-with-icon">
          <h1 className={`section-title3 neon-${platform?.slug}`}>
            Listado de juegos de {platform?.name}
          </h1>
          <img
            src={platform.icon}
            alt={`${platform.name} icon`}
            className="platform-icon-title"
          />
        </div>

        <div className={`title-under-${platform.slug}`}></div>
        <div className="platform-game-list">
          {games.map((game) => (
            <GameCover game={game} key={game._id} />
          ))}
        </div>
        <Pagination
          games={games}
          gamesOnPage={gamesOnPage}
          currentPage={currentPage}
          handleOnClick={handleOnClick}
        />
      </div>
    </div>
  );
}

export default GamesByPlatform;
