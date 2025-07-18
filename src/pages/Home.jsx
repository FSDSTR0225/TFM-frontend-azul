import { React, useEffect, useContext } from "react";
import HeroSection from "../components/HeroSection";
import ExplainCards from "../components/ExplainCards";
import UserList from "../components/UserList";
import EventList from "../components/EventList";
import ShowProfile from "../components/ShowProfile";
import { useRef } from "react";
import ShowEvent from "../components/ShowEvent";
import BotSection from "../components/BotSection";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../style/Home.css";

export default function Home() {
  const contentRef = useRef();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      navigate("/lobby");
    }
  }, [token, navigate]);

  if (token) return null;

  return (
    <div className="home-background">
      <HeroSection scrollRef={contentRef} />
      <div ref={contentRef}>
        <ExplainCards />
      </div>
      <ShowProfile />
      <ShowEvent />
      <BotSection />
      <UserList />
      <EventList />
    </div>
  );
}
