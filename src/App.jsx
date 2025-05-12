import React from "react";
import "./styles/reset.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import GamesByPlatform from "./pages/GamesByPlatform";
import Games from "./pages/Games";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Players from "./pages/Players";
// import NavBar from "./components/NavBar";
import SearchInputExplore from "./components/searchInputExplore";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import GameDetails from "./pages/GameDetails";
import Lobby from "./pages/Lobby";

import AuthContext from "./context/AuthenticationContext";
import Navbar from "./components/Navbar";

export default function App() {
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false); //state to show user is logged in or now
  const [token, setToken] = useState(false); //state to show user token
  const [userInfos, setUserInfos] = useState({}); //state to show current user data

  useEffect(() => {
    let userLocal = localStorage.getItem("user");
    if (userLocal) {
      let userToken = JSON.parse(userLocal).token;
      fetch("http://localhost:3000/users/me", {
        method: "GET",
        headers: { authorization: `Bearer ${userToken}` },
      })
        .then((res) => {
          if (res.ok === true) {
            return res.json();
          }
        })
        .then((data) => {
          console.log(data);
          login(data.user, userToken);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const login = (userInfos, token) => {
    //process of loging in a user
    setToken(token);
    setIsLoggedIn(true);
    setUserInfos(userInfos);
    localStorage.setItem("user", JSON.stringify({ token: token }));
    console.log("login result :", isLoggedIn, token, userInfos);
  };
  const logout = () => {
    //process of loging out a user
    setToken(null);
    setIsLoggedIn(false);
    setUserInfos({});
    localStorage.removeItem("user");
    console.log("logout result :", isLoggedIn, token, userInfos);
  };

  return (
    //all of the app part can use this context now
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        userInfos,
        login,
        logout,
      }}
    >
      <div className="App">
        {/* <NavBar showSearch={showSearch} setShowSearch={setShowSearch} /> */}
        <Navbar
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          setSearch={setSearch}
        />
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
          <Route path="/events" element={<Events />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/players" element={<Players />} />
          {/* <PrivateRoute path="/lobby" element={<Lobby />} /> */}
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}
