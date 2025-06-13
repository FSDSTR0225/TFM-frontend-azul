import React from "react";
import { useEffect, useState, useContext } from "react";
import { PacmanLoader } from "react-spinners";
import AuthContext from "../context/AuthContext";
import DailySummary from "./DailySummary";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null); // Estado para almacenar el error, si lo hay.

  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Error fetching data");
        }

        const data = await response.json();
        console.log("Respuesta backend:", data);
        setSummary(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    };
    fetchData();
  }, [token]);

  if (!token) return null;

  if (error) {
    // Si hay un error, muestra el mensaje de error
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard-content">
      <DailySummary summary={summary} />
    </div>
  );
}

export default Dashboard;
