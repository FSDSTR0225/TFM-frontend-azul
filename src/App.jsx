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
import SearchInputExplore from "./components/SearchInputExplore";
import Events from "./pages/Events";
import ProfilePage from "./pages/Profile2";
import EditProfile from "./pages/EditProfile";
import GameDetails from "./pages/GameDetails";
import Lobby from "./pages/Lobby";
import PrivateRoute from "./components/PrivateRoute";
import FriendsProfile from "./pages/FriendsProfile";
import Players from "./pages/Players";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import { PacmanLoader } from "react-spinners";
import { Toaster } from "sonner";
import ManagementCenter from "./pages/ManagementCenter";
import MyEvents from "./pages/MyEvents";
import { Mensajes } from "./pages/Mensajes";
import MyScrollBar from "./components/MyScrollBar";
import ExploreGames from "./components/ExploreGames";

export default function App() {
  const [showSearch, setShowSearch] = useState(false);

  const { loading } = useContext(AuthContext);

  if (loading) {
    // Si está cargando, muestra...
    return (
      <div className="loading-container">
        <h1 className="loading-title">Cargando lobby...</h1>
        <PacmanLoader color="#FFD700" size={40} />{" "}
        {/* Los componentes de React spinner reciben css en el propio componente */}
      </div>
    );
  }

  return (
    <div className="App">
      <NavBar showSearch={showSearch} setShowSearch={setShowSearch} />
      <MyScrollBar>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/lobby"
              element={
                <PrivateRoute>
                  <Lobby />
                </PrivateRoute>
              }
            />
            <Route path="/explore/games" element={<ExploreGames />} />
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
              path="/players"
              element={
                <PrivateRoute>
                  <Players />
                </PrivateRoute>
              }
            />
            <Route
              path="/users/me"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit/profile"
              element={
                <PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/management"
              element={
                <PrivateRoute>
                  <ManagementCenter />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-events"
              element={
                <PrivateRoute>
                  <MyEvents />
                </PrivateRoute>
              }
            />
            <Route
              path="/friends"
              element={
                <PrivateRoute>
                  <FriendsProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <Mensajes />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </MyScrollBar>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
