import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import Result from "../Search/result";
import Topsongs from "../Home/topsong";

function Searchfunc() {
  const { search, setSearch } = useContext(Context);
  const [rerender, setRerender] = useState(false);
  const isAboveMedium = useMediaQuery("(min-width:1025px)");

  useEffect(() => {
    setRerender(true);
  }, [search]);

  const searchquery = (e) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
  };

  const recentSearches = ["Arijit Singh", "Dua Lipa", "Bollywood Hits", "Lofi Beats", "Party Mix"];

  return (
    <div className="min-h-screen bg-deep-space text-white pb-32">
      {/* Ambient Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-aurora-cyan/10 rounded-full blur-[150px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-aurora-teal/8 rounded-full blur-[120px]" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header with Search */}
      <header className="relative px-6 lg:px-12 pt-24 pb-8">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-display font-bold">
              Search <span className="text-gradient">Music</span>
            </h1>
            <p className="text-white/50">Find your favorite songs, artists, and albums</p>
          </div>

          {/* Search Input */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-aurora rounded-2xl blur-xl opacity-20 group-focus-within:opacity-40 transition-opacity" />
            <div className="relative flex items-center">
              <svg 
                className="absolute left-5 w-6 h-6 text-white/30 group-focus-within:text-aurora-cyan transition-colors" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="What do you want to listen to?"
                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-14 text-lg
                         placeholder:text-white/30 focus:bg-white/10 focus:border-aurora-cyan/50
                         transition-all duration-300"
                onChange={searchquery}
                value={search}
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Recent Searches (when no search query) */}
          {!search && (
            <div className="flex flex-wrap gap-3 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {recentSearches.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setSearch(item)}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60
                           hover:bg-aurora-cyan/20 hover:border-aurora-cyan/30 hover:text-white transition-all"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {rerender && search ? (
          <div className="animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1.5 h-12 rounded-full bg-gradient-aurora" />
              <div>
                <p className="text-sm text-white/40">Results for</p>
                <h2 className="text-2xl font-display font-bold text-white">"{search}"</h2>
              </div>
            </div>
            <Result names={search} />
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {/* Browse Categories */}
            <section>
              <h2 className="text-xl font-display font-semibold mb-6">Browse Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { name: "Pop", gradient: "from-pink-500 to-rose-500", emoji: "🎤" },
                  { name: "Hip-Hop", gradient: "from-orange-500 to-amber-500", emoji: "🎧" },
                  { name: "Rock", gradient: "from-red-500 to-red-600", emoji: "🎸" },
                  { name: "Electronic", gradient: "from-purple-500 to-violet-500", emoji: "🎹" },
                  { name: "R&B", gradient: "from-blue-500 to-indigo-500", emoji: "🎷" },
                  { name: "Jazz", gradient: "from-yellow-500 to-orange-500", emoji: "🎺" },
                  { name: "Classical", gradient: "from-gray-500 to-gray-600", emoji: "🎻" },
                  { name: "Indie", gradient: "from-green-500 to-emerald-500", emoji: "🌿" },
                ].map((category, i) => (
                  <button
                    key={i}
                    onClick={() => setSearch(category.name + " songs")}
                    className={`relative h-24 lg:h-28 rounded-2xl bg-gradient-to-br ${category.gradient} p-4 overflow-hidden group transition-transform hover:scale-105`}
                  >
                    <span className="absolute text-6xl right-2 bottom-0 opacity-30 group-hover:opacity-50 transition-opacity">
                      {category.emoji}
                    </span>
                    <span className="relative text-lg font-bold text-white">{category.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Top Songs */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-aurora-cyan to-aurora-teal" />
                <h2 className="text-xl font-display font-semibold">Top Songs Right Now</h2>
              </div>
              <Topsongs names={"Top songs"} />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default Searchfunc;
