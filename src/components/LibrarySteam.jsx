import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../style/LibrarySteam.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function LibrarySummaryCard() {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.steamId) return;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(
          `${API_URL}/steam/stats/${user.steamId}/summary`
        );
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Error al cargar LibrarySummary:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.steamId]);

  if (loading || !summary) {
    return <p className="steam-loading"></p>;
  }

  // Ordenamos top 3 juegos por horas
  const top3 = [...summary.hoursPerGame]
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 3);

  return (
    <div className="steam-summary-card">
      <h3>Mi Librería de Steam</h3>
      <div className="steam-summary-stats">
        <div>
          <strong>{summary.totalGames}</strong>
          <span>Juegos</span>
        </div>
        <div>
          <strong>{summary.totalHours}</strong>
          <span>Horas jugadas</span>
        </div>
      </div>
      <ul className="steam-summary-list">
        {top3.map((g) => (
          <li key={g.appId}>
            {g.name} — {g.hours} h
          </li>
        ))}
      </ul>
    </div>
  );
}
