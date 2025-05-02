import React from "react";
import Lobby from "./pages/Lobby";
import GamesByPlatform from "./pages/GamesByPlatform";
import Games from "./pages/Games";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import SearchInputExplore from "./components/searchInputExplore";
import { useState } from "react";
import "./styles/reset.css";
import "./App.css";
import Events from "./pages/Events";
<<<<<<< HEAD
import Profile from "./pages/Profile";
=======
import GameDetails from "./components/GameDetails";
>>>>>>> 8170e52618286c379424c10e6aadd512032271b9

export default function App() {
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

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
        {/* <Route path="/lobby" element={<Lobby />} /> */}
        <Route path="/games" element={<Games />} />
        <Route
          path="/platforms/:platformId/games"
          element={<GamesByPlatform />}
        />
        <Route path="/games/:id" element={<GameDetails />} />
        <Route path="/games/rawg/:rawgId" element={<GameDetails />} />
        <Route path="/events" element={<Events />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        {/* <PrivateRoute path="/lobby" element={<Lobby />} /> */}
      </Routes>
    </div>
  );
}
