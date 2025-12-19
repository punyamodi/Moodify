import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { artist } from "../saavnapi";
import { Link } from "react-router-dom";

function Artist({ names }) {
  const { setSinger, setSelected } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [limit, setLimit] = useState(6);
  const isAboveMedium = useMediaQuery("(min-width: 1025px)");
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  const expandResults = () => {
    setLimit(musicInfo.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await artist();

        if (res.data && res.data.data && res.data.data.results) {
          setMusicInfo(
            res.data.data.results.map((song) => ({
              id: song.id,
              name: song.name,
              image: song.image[1].url,
            }))
          );
        }
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
    localStorage.setItem("selected", "/");
    setSelected("/");
  };

  if (loading) {
    return (
      <div className="flex gap-6 flex-wrap">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="skeleton w-32 h-32 rounded-full mb-3" />
            <div className="skeleton h-4 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (isAboveMedium) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap gap-8">
          {musicInfo.slice(0, limit).map((song, index) => (
            <Link to="/innerartist" key={song.id}>
              <div
                className="group cursor-pointer text-center"
                onClick={() => play(song.id)}
                onMouseEnter={() => setHoveredId(song.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative mb-4">
                  <div className={`w-36 h-36 rounded-full overflow-hidden transition-all duration-500 ${
                    hoveredId === song.id ? 'ring-4 ring-aurora-cyan/50 shadow-glow-cyan' : 'ring-2 ring-white/10'
                  }`}>
                    {song.image ? (
                      <img
                        src={song.image}
                        alt={song.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-aurora-cyan/20 to-aurora-teal/20 flex items-center justify-center">
                        <svg className="w-12 h-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Play Icon Overlay */}
                  <div className={`absolute inset-0 rounded-full flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
                    hoveredId === song.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="w-12 h-12 rounded-full bg-aurora-cyan flex items-center justify-center">
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-sm font-medium text-white group-hover:text-aurora-cyan transition-colors truncate max-w-[144px]">
                  {song.name}
                </h3>
                <p className="text-xs text-white/40 mt-1">Artist</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Expand/Collapse */}
        {musicInfo.length > 6 && (
          <div className="flex justify-center">
            <button
              onClick={limit === 6 ? expandResults : () => setLimit(6)}
              className={`px-6 py-2 rounded-full border text-sm font-medium transition-all flex items-center gap-2 group ${
                limit === 6 
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-aurora-cyan/30 text-white hover:text-aurora-cyan' 
                  : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-400'
              }`}
            >
              <span>{limit === 6 ? 'View All Artists' : 'Show Less'}</span>
              <svg 
                className={`w-4 h-4 transition-transform ${limit === 6 ? 'group-hover:translate-x-1' : 'group-hover:-translate-y-1'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={limit === 6 ? "M17 8l4 4m0 0l-4 4m4-4H3" : "M5 15l7-7 7 7"} />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Mobile View
  return (
    <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2">
      {musicInfo.map((song) => (
        <Link to="/innerartist" key={song.id} className="flex-shrink-0">
          <div
            className="flex flex-col items-center"
            onClick={() => play(song.id)}
          >
            <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10 mb-3">
              {song.image ? (
                <img
                  src={song.image}
                  alt={song.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-aurora-cyan/20 to-aurora-teal/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-xs font-medium text-white truncate w-24 text-center">
              {song.name}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Artist;
