import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PacmanLoader } from "react-spinners";
import { useNavigate } from "react-router-dom"; // hook para navegar entre rutas
import "../style/GameDetails.css";

const API_URL = import.meta.env.VITE_API_URL;

const possibleModes = [
  "Singleplayer",
  "Multiplayer",
  "Co-op",
  "Online Co-Op",
  "Split Screen",
  "PvP",
  "MMO",
];

function GameDetails() {
  const { id } = useParams(); //id del juego que viene de la url

  const [game, setGame] = useState(null); // Almacenar el juego
  const [loading, setLoading] = useState(true); // Almacenar el estado de carga,esta cargando?asi poder mostrar un loading

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`${API_URL}/games/${id}`); // Petición al servidor para obtener el juego por id
        if (!response.ok) {
          throw new Error("Error fetching game");
        }
        const data = await response.json();
        setGame(data); // Actualizo el estado con los datos del juego
        console.log(
          "🔍 Imagen de fondo adicional:",
          data.background_image_additional,
          data
        );
      } catch (error) {
        console.error("Error al cargar el juego:", error);
      }
      setLoading(false);
    };

    fetchGame(); // Llamar a la función para obtener el juego
  }, [id]); // El array con el id como dependencia, para que se ejecute cada vez que cambie el id del juego en la URL.

  if (loading) {
    return (
      <div className="loading-container">
        <PacmanLoader color="#FFD700" size={40} />
        <h2>Cargando ficha del juego...</h2>
      </div>
    );
  }

  if (!game) {
    return <p>No se encontró el juego.</p>;
  }

  const gameModes =
    game.tags?.filter((tag) => possibleModes.includes(tag)) || []; // Filtrar los tags que son modos de juego,incluidos en el array possibleModes
  const moreTags =
    game.tags?.filter((tag) => !possibleModes.includes(tag)) || []; // Filtrar los tags que no son modos de juego,los que no estan incluidos en el array possibleModes

  const gameModesString = gameModes.length > 0 ? gameModes.join(", ") : "N/A"; // Si hay modos de juego, y tags los unimos en un string, si no hay, ponemos N/A
  const moreTagsString = moreTags.length > 0 ? moreTags.join(", ") : "N/A";
  const genresString = game.genres?.length > 0 ? game.genres.join(", ") : "N/A"; // = generos
  const storesString = game.stores?.length > 0 ? game.stores.join(", ") : "N/A"; // = tiendas
  const developersString =
    game.developers?.length > 0 ? game.developers.join(", ") : "N/A"; // = desarrolladores
  const platformsString =
    game.platforms?.length > 0
      ? game.platforms
          .map((p) => (typeof p === "string" ? p : p.name))
          .join(", ")
      : "N/A"; // = plataformas

  return (
    <>
      <div
        className="game-background"
        // style={{
        //   backgroundImage: game?.background_image_additional
        //     ? `url(${game.background_image_additional})`
        //     : `url(${game.background_image})`,
        // }}
        style={{
          backgroundImage: game?.background_image_additional
            ? `url(${game.background_image_additional})`
            : `url(${game.imageUrl})`,
        }}
      ></div>
      <div className="game-details-container">
        <button className="back-btn-details" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <div className="game-details-content">
          <h1 className="api-title">{game.name}</h1>

          <img
            src={
              game.imageUrl ||
              game.background_image ||
              game.background_image_additional
            }
            alt={game.name}
            className="game-main-image"
          />

          <p>
            <strong>Fecha de lanzamiento:</strong> {game.released}
          </p>
          {game.metacritic && (
            <p>
              <strong>Metacritic:</strong> {game.metacritic}
            </p>
          )}
          <p>
            <strong>Géneros:</strong> {genresString}
          </p>
          <p>
            <strong>Plataformas:</strong> {platformsString}
          </p>
          <p>
            <strong>Tiendas:</strong> {storesString}
          </p>
          <p>
            <strong>Modos de juego:</strong> {gameModesString}
          </p>
          <p>
            <strong>Etiquetas:</strong> {moreTagsString}
          </p>
          <p>
            <strong>Desarrollador:</strong> {developersString}
          </p>
          <p>
            <strong>Clasificación:</strong> {game.esrbRating || "N/A"}
          </p>

          <div className="game-description">
            <h3>Descripción</h3>
            <p>{game.description}</p>
          </div>

          {game.background_image_additional && (
            <div className="additional-image">
              <img
                src={game.background_image_additional}
                alt={`Imagen adicional de ${game.name}`}
              />
            </div>
          )}

          {game.screenshots?.length > 0 && (
            <div className="screenshots">
              <div className="screenshot-gallery">
                {game.screenshots.map((img, index) => (
                  <img key={index} src={img} alt={`screenshot-${index}`} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default GameDetails;
