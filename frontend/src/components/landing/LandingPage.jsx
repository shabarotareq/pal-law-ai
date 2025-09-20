import React from "react";
import Layout from "../common/Layout";
import HeroSection from "./HeroSection";
import Features from "./Features";
import "../../styles/Landing.css";

function LandingPage() {
  return (
    <Layout showHeader={true} showFooter={true}>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <Features />
      </div>
    </Layout>
  );
}

export default LandingPage;
