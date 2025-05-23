import React from "react";
import "./styles/reset.css";
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
import ProfilePage from "./pages/Profile2";
import GameDetails from "./pages/GameDetails";
import Lobby from "./pages/Lobby";
import PrivateRoute from "./components/PrivateRoute";

// import AuthContext from "./context/AuthenticationContext";
// import TopNavbar from "./components/TopNavbar/TopNavbar";

export default function App() {
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="App">
      <NavBar showSearch={showSearch} setShowSearch={setShowSearch} />
      {/* <TopNavbar
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        setSearch={setSearch}
      /> */}
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
        <Route
          path="/users/me"
          element={
            <PrivateRoute> 
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}
