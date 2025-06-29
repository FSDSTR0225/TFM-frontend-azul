import React, { useState, useEffect, useContext } from "react";
import PlayerSearch from "../components/PlayerSearch";
import PlayerCard from "../components/PlayerCard";
import AuthContext from "../context/AuthContext";
import Pagination from "../components/Pagination";
import "../style/PlayerCard.css";
const Players = () => {
  const [players, setPlayers] = useState([]);
  const url = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const { token } = useContext(AuthContext);
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`${url}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setPlayers(data.users);
        console.log("Players fetched successfully:", data.users);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div>
      <PlayerSearch />
      <h1 className="players-title">Players</h1>
      <div className="players-list">
        {players.map((player) => (
          <PlayerCard key={player._id} player={player} />
        ))}
      </div>
    </div>
  );
};
export default Players;
