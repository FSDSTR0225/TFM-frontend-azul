import React from "react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Lobby from "./pages/Lobby";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import SearchInputExplore from "./components/searchInputExplore";
import { useState } from "react";
import "./styles/reset.css";
import "./App.css";
import Events from "./pages/Events";

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
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/events" element={<Events />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <PrivateRoute path="/lobby" element={<Lobby />} /> */}
      </Routes>
    </div>
  );
}
