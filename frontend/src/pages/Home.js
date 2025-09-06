import React from "react";
import ChatBot from "../components/ChatBot";
import LegalSections from "../components/LegalSections";
import AItoolsPanel from "../components/AItoolsPanel";
import Statistics from "../components/Statistics";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ChatBot />
      <LegalSections />
      <AItoolsPanel />
      <Statistics />
      <Footer />
    </div>
  );
}
