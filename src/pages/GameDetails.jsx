import React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { PacmanLoader } from "react-spinners";
import { useNavigate, Link } from "react-router-dom"; // hook para navegar entre rutas
import AuthContext from "../context/AuthContext";

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
  const [friendsWhoLike, setFriendsWhoLike] = useState([]);
  const [eventCount, setEventCount] = useState(0); // Almacenar el numero de eventos activos del juego
  const [similarGames, setSimilarGames] = useState([]);

  const authContext = useContext(AuthContext);
  const { token } = authContext;

  const navigate = useNavigate();

  const handleViewEvents = () => {
    navigate(`/events?gameId=${game._id}`);
  };

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

  useEffect(() => {
    const fetchEventCount = async () => {
      try {
        const res = await fetch(
          `${API_URL}/events/by-game?gameId=${game._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log("🎯 Conteo eventos:", data.count);
        setEventCount(data.count);
      } catch (err) {
        console.error("Error al contar eventos activos del juego:", err);
      }
    };

    if (game?._id) {
      fetchEventCount();
    }
  }, [game, token]);

  useEffect(() => {
    const fetchFriendsWhoLike = async () => {
      try {
        const res = await fetch(`${API_URL}/games/${id}/friends-like`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener amigos");
        const result = await res.json();
        setFriendsWhoLike(result);
      } catch (err) {
        console.error("No se pudieron cargar los amigos:", err);
      }
    };

    fetchFriendsWhoLike();
  }, [id, token]);

  useEffect(() => {
    const fetchSimilarGames = async () => {
      try {
        const res = await fetch(`${API_URL}/games/${id}/similar`);
        if (!res.ok) throw new Error("Error al obtener juegos similares");
        const result = await res.json();
        setSimilarGames(result);
      } catch (err) {
        console.error("Error al cargar juegos similares:", err);
      }
    };

    if (id) {
      fetchSimilarGames();
    }
  }, [id]);

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
  console.log("🎮 Amigos que tienen este juego:", friendsWhoLike);

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
            <div className="screenshots-details">
              <div className="screenshot-gallery">
                {game.screenshots.map((img, index) => (
                  <img key={index} src={img} alt={`screenshot-${index}`} />
                ))}
              </div>
            </div>
          )}
          <div></div>
          {friendsWhoLike.length > 0 && (
            // <div className="game-sidebar-combined">
            <div className="friends-events-row">
              <div className="friends-who-like">
                <h3>Amigos con juego en favoritos:</h3>
                <div className="friends-list-game-details">
                  {friendsWhoLike.map((friend) => (
                    <div className="friend-card" key={friend._id}>
                      <img src={friend.avatar} alt={friend.username} />
                      <Link
                        className="link-friend-like"
                        to={`/profile/${friend.username}`}
                        state={{ player: { username: friend.username } }}
                      >
                        {friend.username}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {eventCount > 0 && (
                <div className="event-count-block">
                  {eventCount === 1 ? (
                    <p>Hay {eventCount} evento activo de este juego</p>
                  ) : (
                    <p>Hay {eventCount} eventos activos de este juego</p>
                  )}
                  <button
                    className="view-events-button"
                    onClick={handleViewEvents}
                  >
                    Ver eventos
                  </button>
                </div>
              )}
            </div>
            // </div>
          )}
          <div className="similar-container">
            {similarGames.length > 0 && (
              <div className="similar-games-section">
                <h3>Juegos similares</h3>
                <div className="similar-games-grid">
                  {similarGames.map((sim) => (
                    <div
                      key={sim.rawgId}
                      className="similar-game-card"
                      onClick={() => navigate(`/games/${sim.rawgId}`)}
                    >
                      <img src={sim.imageUrl} alt={sim.name} loading="lazy" />
                      <p>{sim.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default GameDetails;
