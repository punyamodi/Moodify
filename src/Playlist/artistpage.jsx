import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { artist } from "../saavnapi";
import Home from "../Home/home";
import { Link } from "react-router-dom";

function ArtistPage({ names }) {
  const { setSinger, setSelected } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await artist();

        setMusicInfo(
          res.data.data.results.map((song) => ({
            id: song.id,
            name: song.name,
            image: song.image[1],
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [names]);

  const play = (id) => {
    localStorage.setItem("singer", id);
    setSinger(id);
    localStorage.setItem("selected", "/artist");
    setSelected("/artist");
  };

  if (!isAboveMedium) {
    return <Home />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-space pt-24 pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-20 w-64 skeleton rounded-xl mb-8" />
            <div className="flex flex-wrap gap-8 justify-center">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-40 h-40 rounded-full skeleton mb-4" />
                  <div className="skeleton h-4 w-32 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-space text-white pt-24 pb-32">
      {/* Ambient Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-aurora-cyan/15 rounded-full blur-[180px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-aurora-cyan/10 rounded-full blur-[120px]" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-aurora flex items-center justify-center shadow-glow-cyan">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold">
                Popular <span className="text-gradient">Artists</span>
              </h1>
              <p className="text-white/50 mt-1">Discover trending artists and their music</p>
            </div>
          </div>
        </div>

        {/* Artists Grid */}
        <div className="flex flex-wrap gap-10 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {musicInfo.map((song) => (
            <Link to="/innerartist" key={song.id}>
              <div
                className="group cursor-pointer text-center"
                onClick={() => play(song.id)}
                onMouseEnter={() => setHoveredId(song.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative mb-4">
                  <div className={`w-40 h-40 rounded-full overflow-hidden transition-all duration-500 ${
                    hoveredId === song.id ? 'ring-4 ring-aurora-cyan/50 shadow-glow-cyan' : 'ring-2 ring-white/10'
                  }`}>
                    <img
                      src={song.image.url}
                      alt={song.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Play Overlay */}
                  <div className={`absolute inset-0 rounded-full flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
                    hoveredId === song.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="w-14 h-14 rounded-full bg-aurora-cyan flex items-center justify-center shadow-glow-cyan">
                      <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-sm font-medium text-white group-hover:text-aurora-cyan transition-colors truncate max-w-[160px]">
                  {song.name}
                </h3>
                <p className="text-xs text-white/40 mt-1">Artist</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ArtistPage;
