import React, { useContext } from "react";
import useMediaQuery from "../useMedia";
import Topsongs from "./topsong";
import Newrelease from "./newrelease";
import Trending from "../Trendy/trending";
import Artist from "../Playlist/artist";
import Albums from "../Albumsongs/albums";
import { Context } from "../main";
import Trendingmobile from "./trendingmobile";
import { Link } from "react-router-dom";

function Home() {
  const isAboveMedium = useMediaQuery("(min-width:1025px)");
  const { Viewall, setViewall, setPage, page } = useContext(Context);

  return (
    <div className="min-h-screen bg-deep-space text-white overflow-x-hidden pb-32">
      {/* Hero Section Removed */}


      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
        {/* Weekly Highlights */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <SectionHeader 
            title="Weekly Highlights" 
            subtitle="Handpicked hits for your ears"
            gradient="purple"
          />
          <div className={isAboveMedium ? "" : "overflow-x-auto scrollbar-hide pb-4"}>
            <Topsongs />
          </div>
        </section>

        {/* Fresh Releases */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <SectionHeader 
            title="Fresh Drops" 
            subtitle="Just released today"
            gradient="pink"
          />
          <Newrelease />
        </section>

        {/* Trending */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <SectionHeader 
            title="Trending Now" 
            subtitle="What everyone's listening to"
            gradient="cyan"
          />
          <div className={isAboveMedium ? "" : "overflow-x-auto scrollbar-hide pb-4"}>
            {isAboveMedium ? <Trending /> : <Trendingmobile names={"songs"} />}
          </div>
        </section>

        {/* Artists */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <SectionHeader 
            title="Featured Artists" 
            subtitle="Discover amazing talents"
            gradient="purple"
          />
          <Artist />
        </section>

        {/* Albums */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <SectionHeader 
            title="Top Albums" 
            subtitle="Complete musical journeys"
            gradient="pink"
          />
          <Albums />
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-aurora flex items-center justify-center shadow-glow-cyan">
                <span className="text-2xl font-display font-bold text-white">M</span>
              </div>
              <span className="text-2xl font-display font-bold">
                Mood<span className="text-gradient">ify</span>
              </span>
            </div>
            
            {/* Links */}
            <div className="flex gap-8 text-sm text-white/50">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            
            {/* Copyright */}
            <p className="text-sm text-white/30">
              © 2024 Moodify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Section Header Component
function SectionHeader({ title, subtitle, gradient = "purple" }) {
  const gradientClass = {
    purple: 'from-aurora-cyan to-aurora-teal',
    pink: 'from-aurora-teal to-aurora-cyan',
    cyan: 'from-aurora-cyan to-aurora-blue',
  }[gradient];

  return (
    <div className="flex items-end justify-between mb-8">
      <div className="space-y-2">
        <h2 className="text-2xl lg:text-3xl font-display font-bold text-white">
          {title}
        </h2>
        <p className="text-white/40 text-sm">{subtitle}</p>
      </div>
      <div className={`w-24 h-1 rounded-full bg-gradient-to-r ${gradientClass} opacity-60`} />
    </div>
  );
}

export default Home;
