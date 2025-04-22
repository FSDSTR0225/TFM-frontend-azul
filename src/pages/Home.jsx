import React, { useRef } from "react";
import "../style/Home.css";
import EventList from "../components/EventList";
import UserList from "../components/UserList";
import "../style/EventList.css";
import "../style/UserList.css";
import BotSection from "../components/BotSection";
import IntroSection from "../components/IntroSection";

export default function Home() {
  const contentRef = useRef();

  return (
    <div className="home-container">
      <div className="welcome">
        <h1>Bienvenido a Link2Play</h1>
      </div>
      <IntroSection scrollRef={contentRef} />
      <div ref={contentRef}>
        <EventList />
        <UserList />
        <BotSection />
      </div>
    </div>
  );
}
