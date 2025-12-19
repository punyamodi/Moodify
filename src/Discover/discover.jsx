import React, { useContext } from "react";
import useMediaQuery from "../useMedia";
import Topsongs from "../Home/topsong";
import Newrelease from "../Home/newrelease";
import Trending from "../Trendy/trending";
import Artist from "../Playlist/artist";
import Albums from "../Albumsongs/albums";
import { Context } from "../main";
import Trendingmobile from "../Home/trendingmobile";
import Newreleasemobile from "../Home/newreleasemobile";

function Discover() {
  const isAboveMedium = useMediaQuery("(min-width:1025px)");
  const { Viewall, setViewall, setPage, page } = useContext(Context);

  const sections = [
    { title: "New Releases", subtitle: "Fresh from the studio", component: isAboveMedium ? <Newrelease /> : <Newreleasemobile />, gradient: "from-aurora-teal to-aurora-cyan" },
    { title: "Trending Now", subtitle: "What's hot right now", component: isAboveMedium ? <Trending /> : <Trendingmobile names={"songs"} />, gradient: "from-aurora-cyan to-aurora-blue" },
    { title: "Weekly Top Hits", subtitle: "The week's best tracks", component: <Topsongs />, gradient: "from-aurora-blue to-aurora-cyan" },
    { title: "Top Albums", subtitle: "Complete experiences", component: <Albums />, gradient: "from-aurora-cyan to-aurora-green" },
    { title: "Popular Artists", subtitle: "Discover amazing talent", component: <Artist />, gradient: "from-aurora-green to-aurora-cyan" },
  ];

  return (
    <div className="min-h-screen bg-deep-space text-white pb-32">
      {/* Ambient Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-aurora-cyan/15 rounded-full blur-[180px] animate-float" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-aurora-teal/10 rounded-full blur-[150px]" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-aurora-cyan/8 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative px-6 lg:px-12 pt-24 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-4 animate-fade-in">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-aurora-cyan/10 border border-aurora-cyan/20">
                <svg className="w-4 h-4 text-aurora-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm font-medium text-aurora-cyan">Explore</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold">
                Discover <span className="text-gradient">Music</span>
              </h1>
              <p className="text-white/50 max-w-md">
                Explore curated collections, trending tracks, and discover your next favorite song.
              </p>
            </div>

            {/* Quick Stats */}

          </div>
        </div>
      </header>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
        {sections.map((section, index) => (
          <section 
            key={index} 
            className="animate-fade-in-up"
            style={{ animationDelay: `${0.1 + index * 0.1}s` }}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-1.5 h-12 rounded-full bg-gradient-to-b ${section.gradient}`} />
                <div>
                  <h2 className="text-2xl font-display font-bold text-white">
                    {section.title}
                  </h2>
                  <p className="text-sm text-white/40 mt-1">{section.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Section Content */}
            <div className={!isAboveMedium ? "overflow-x-auto scrollbar-hide -mx-6 px-6" : ""}>
              {section.component}
            </div>
          </section>
        ))}
      </div>

      {/* Bottom Spacing */}
      <div className="h-32" />
    </div>
  );
}

export default Discover;
