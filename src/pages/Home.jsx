import React from "react";
import "../style/Home.css";
import EventList from "../components/EventList";
import UserList from "../components/UserList";
import "../style/EventList.css";
import "../style/UserList.css";

export default function Home() {
  return (
    <div className="home-container">
      <div className="welcome">
        <h1>Bienvenido a Link2Play</h1>
      </div>
      <div className="description">
        <p>
          "Encuentra jugadores,crea partidas,sube de nivel y haz que grindear no
          sea aburrido"
        </p>
      </div>
      <>
        <EventList />
        <UserList />
      </>
    </div>
  );
}
