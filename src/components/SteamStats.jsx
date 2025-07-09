import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../style/SteamStats.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function SteamStats() {
  const { user } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publicWarning, setPublicWarning] = useState(false);

  useEffect(() => {
    if (!user?.steamId) return;
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/steam/stats/${user.steamId}`);
        const data = await res.json();
        // Si vienen todos percent === null, asumimos perfil privado
        const allNull = data.games.every((g) => g.percent === null);
        setPublicWarning(allNull);
        setGames(data.games);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user?.steamId]);

  if (!user?.steamId) {
    return (
      <p className="steam-warning">No tienes tu cuenta Steam conectada.</p>
    );
  }
  if (loading) {
    return <p className="steam-loading">Cargando estadísticas de Steam...</p>;
  }

  return (
    <div className="steam-stats-container">
      <h3 className="steam-stats-title">🎮 Top Juegos en Steam</h3>

      {publicWarning && (
        <div className="steam-alert">
          ⚠️ Tu perfil de Steam está en modo privado. Para ver tus logros ve a
          tu configuración de Steam y activa “Perfil público”.
        </div>
      )}

      {games.length === 0 ? (
        <p className="steam-no-games">No se encontraron juegos.</p>
      ) : (
        <div className="steam-stats-grid">
          {games.map((game) => (
            <div
              key={game.appId}
              className="steam-game-card"
              title={
                game.percent !== null
                  ? `Has desbloqueado ${game.unlocked}/${game.total} (${game.percent}%)`
                  : "Logros no disponibles"
              }
            >
              <img
                src={game.logoUrl}
                alt={game.name}
                className="steam-game-image"
                onError={(e) => (e.target.src = "/img/default-game.jpg")}
              />
              <div className="steam-game-info">
                <h4>{game.name}</h4>
                <p>{game.playtimeHours} h jugadas</p>

                {game.percent !== null ? (
                  <>
                    <p className="steam-achievement-text">
                      🏆 {game.unlocked} / {game.total} logros ({game.percent}
                      %)
                    </p>
                    <div className="steam-progress-bar">
                      <div
                        className="steam-progress-fill"
                        style={{ width: `${game.percent}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <p className="steam-achievement-text">Logros no visibles</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
