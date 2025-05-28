import React from "react";
import "./style/reset.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import GamesByPlatform from "./pages/GamesByPlatform";
import Games from "./pages/Games";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import SearchInputExplore from "./components/searchInputExplore";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import GameDetails from "./pages/GameDetails";
import Lobby from "./pages/Lobby";
import PrivateRoute from "./components/PrivateRoute";
import Players from "./pages/Players";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import { PacmanLoader } from "react-spinners";

export default function App() {
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  const { loading } = useContext(AuthContext);

  if (loading) {
    // Si está cargando, muestra...
    return (
      <div className="loading-container">
        <h1 className="loading-title">Cargando plataformas...</h1>
        <PacmanLoader color="#FFD700" size={40} />{" "}
        {/* Los componentes de React spinner reciben css en el propio componente */}
      </div>
    );
  }

  return (
    <div className="App">
      <NavBar showSearch={showSearch} setShowSearch={setShowSearch} />

      {showSearch && (
        <SearchInputExplore
          search={search}
          setSearch={setSearch}
          showSearch={showSearch}
        />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/lobby"
          element={
            <PrivateRoute>
              {" "}
              <Lobby />
            </PrivateRoute>
          }
        />
        <Route path="/games" element={<Games />} />
        <Route
          path="/platforms/:platformId/games"
          element={<GamesByPlatform />}
        />
        <Route path="/games/:id" element={<GameDetails />} />
        <Route path="/events" element={<Events />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/players" element={<Players />} />
        <Route
          path="/users/me"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}
