import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // hook que permite acceder a los parámetros de búsqueda de la URL.
import { PacmanLoader } from "react-spinners";
import "../style/AllGames.css";
import GameCover from "./GameCover";
import Pagination from "./Pagination";

const API_URL = import.meta.env.VITE_API_URL;

function AllGames() {
  const [searchParams, setSearchParams] = useSearchParams(); // hook que permite acceder a los parámetros de búsqueda de la URL y almacenarlos en el estado.
  const [currentPage, setCurrentPage] = useState(1); // Estado para almacenar la página actual, empezamos en la 1 o el valor que venga en la URL.
  const [cachedPages, setCachedPages] = useState({}); // Estado para almacenar las páginas que ya hemos cargado, para no volver a cargarlas,esto ayudara a mejorar el rendimiento de la app.Empieza como un objeto vacío porque no hemos cargado nada y es un objeto porque las páginas vienen en formato de objeto.
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const gamesPerPage = 25;

  // Actualiza la URL con la página actual cada vez que cambia currentPage.
  useEffect(() => {
    setSearchParams({ page: currentPage });
    // cambia el valor de la página en la URL a la que tenemos en currentPage.
  }, [currentPage, setSearchParams]); // useEffect se ejecuta cada vez que cambia currentPage, y actualiza la URL con el valor de currentPage,se incluye setSearchParams para evitar un warning de eslint ya que es una función que viene de un hook y no se puede cambiar y por tanto se incluye en el array de dependencias.

  // Lee la URL y establece la página actual en el estado, si no hay nada en la URL, por defecto es 1.
  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page")) || 1; // En pageFromUrl guardamos el valor de la página que viene en la URL, si no hay nada, por defecto es 1,parseInt convierte el valor de la URL a un número entero y lo guarda en pageFromUrl y luego actualiza el estado de currentPage con ese valor.
    setCurrentPage(pageFromUrl);
  }, [searchParams]); // useEffect se ejecuta cada vez que cambia searchParams, y establece la página actual en el estado.

  useEffect(() => {
    const fetchGames = async () => {
      if (cachedPages[currentPage]) {
        setGames(cachedPages[currentPage]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/games?page=${currentPage}&limit=${gamesPerPage}`
        );
        if (!response.ok) throw new Error("Error fetching games");

        const data = await response.json();
        setGames(data);

        setCachedPages((prev) => ({
          // actualiza el estado de cachedPages con los juegos que hemos cargado, ...prev es el estado anterior de cachedPages y [currentPage] es la clave del objeto que estamos creando, que será la página actual y data son los juegos que hemos cargado.
          ...prev,
          [currentPage]: data,
        }));
      } catch (error) {
        console.error("Error al obtener los juegos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [currentPage, cachedPages]);

  const handleOnClick = (direction) => {
    if (direction === "siguiente" && games.length === gamesPerPage) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "anterior" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h1 className="loading-title">Cargando juegos...</h1>
        <PacmanLoader color="#FFD700" size={40} />
      </div>
    );
  }

  return (
    <>
      <h1 className="section-title2">Listado de juegos</h1>
      <div className="all-games-list">
        {games.map((game) => (
          <GameCover key={game._id || game.rawgId} game={game} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        handleOnClick={handleOnClick}
        games={games}
        gamesPerPage={gamesPerPage}
      />
    </>
  );
}

export default AllGames;
