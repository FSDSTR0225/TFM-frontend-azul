import React from "react";
import { useParams } from "react-router-dom"; // hook para obtener los parámetros de la URL
import { useState, useEffect } from "react";
import "../style/GamesByPlatform.css";
import GameCover from "../components/GameCover";
import { PacmanLoader } from "react-spinners";

function GamesByPlatform() {
  const { platformId } = useParams(); // Obtener el id de la plataforma de la URL
  const [games, setGames] = useState([]); // Estado para almacenar los juegos
  const [loading, setLoading] = useState(true); // Estado para estado de carga,loading...
  const [currentPage, setCurrentPage] = useState(1); // Estado para almacenar la página actual, empezamos en la 1

  const gamesOnPage = 25; // Número de juegos por página

  const indexLastGame = currentPage * gamesOnPage; // Índice del último juego a mostrar en la página actual, ej: pagina 1 * 25 juegos por pagina = 25
  const indexFirstGame = indexLastGame - gamesOnPage; // Índice del primer juego a mostrar en la página actual, ej: indice del último juego(25) - 25 juegos por pagina = 0
  const gamesToShow = games.slice(indexFirstGame, indexLastGame); // Juegos a mostrar en la página actual, slice devuelve una copia del array desde el punto a hasta el b,sin incluir b(0 a 24-no incluye )

  const handleOnClick = (direction) => {
    if (direction === "siguiente") {
      setCurrentPage((prevCurrentPage) => prevCurrentPage + 1); // Si el usuario hace click en siguiente, se suma 1 a la pagina actual
    } else if (direction === "anterior") {
      setCurrentPage((prevCurrentPage) => Math.max(prevCurrentPage - 1, 1)); // Si el usuario hace click en anterior, se resta 1 a la pagina actual, pero no puede ser menor que 1 por eso usamos Math.max que devuelve el mayor de los dos valores que siempre es 1 o mayor.
    }
  };

  useEffect(() => {
    setLoading(true); // Cambiar el estado de carga a true antes de hacer la petición,cada vez que se renderice
    const fetchGames = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/platforms/${platformId}/games`
        );
        if (!response.ok) {
          throw new Error("Error fetching games");
        }
        const data = await response.json();
        setGames(data.games);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
      setLoading(false);
    };
    fetchGames();
  }, [platformId]); // UsseEffect se ejecuta cuando cambia el platformId, si el usuario cambia el platformId cambiando de platadorma,se ejecuta el fetch de nuevo.

  if (loading) {
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
    <div className="games-by-platform-container">
      <h1>Listado de juegos</h1>
      <div className="platform-game-list">
        {gamesToShow.map(
          (
            game // Recorremos los juegos a mostrar de esta pagina
          ) => (
            <GameCover game={game} key={game._id} /> // Recorremos juegos con map y los mostramos con el componente GameCover
          )
        )}
      </div>
      <div className="pagination">
        <button
          onClick={() => handleOnClick("anterior")}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>Página {currentPage}</span>
        <button
          onClick={() => handleOnClick("siguiente")}
          disabled={indexLastGame >= games.length} // Deshabilitar el botón si no hay más juegos para mostrar
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default GamesByPlatform;
