import React from "react";
import HeroSection from "../components/HeroSection";
import ExplainCards from "../components/ExplainCards";
import UserList from "../components/UserList";
import EventList from "../components/EventList";
import ShowProfile from "../components/ShowProfile";
import { useRef } from "react";
import ShowEvent from "../components/ShowEvent";
import BotSection from "../components/BotSection";
import Footer from "../components/Footer";

export default function Home() {
  const contentRef = useRef();

  return (
    <div>
      <HeroSection scrollRef={contentRef} />
      <div ref={contentRef}>
        <ExplainCards />
      </div>
      <ShowProfile />
      <ShowEvent />
      <BotSection />
      <UserList />
      <EventList />
      <Footer />
    </div>
  );
}
