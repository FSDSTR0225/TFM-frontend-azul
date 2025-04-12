import React from "react";
import "./styles/reset.css";
import "./App.css";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { Routes, Route } from "react-router";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}
