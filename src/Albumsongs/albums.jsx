import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { albumsongs } from "../saavnapi";
import he from "he";

function Albums() {
  const { setInneralbum, setSelected } = useContext(Context);
  const [limit, setLimit] = useState(6);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const isAboveMedium = useMediaQuery("(min-width:1025px)");

  const expandResults = () => {
    setLimit(musicInfo.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await albumsongs();
        setMusicInfo(
          res.data.data.results.map((song) => ({
            id: song.id,
            name: he.decode(song.name),
            artist: song.artists.primary[0].name,
            image: song.image[1].url,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const play = (id) => {
    localStorage.setItem("innerAlbum", id);
    setInneralbum(id);
    localStorage.setItem("selected", "/albums");
    setSelected("/albums");
  };

  if (loading) {
    return (
      <div className="flex gap-5 flex-wrap">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-48">
            <div className="skeleton aspect-square mb-3 rounded-2xl" />
            <div className="skeleton h-4 w-3/4 mb-2 rounded-lg" />
            <div className="skeleton h-3 w-1/2 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (isAboveMedium) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
          {musicInfo.slice(0, limit).map((song, index) => (
            <Link to="/innerAlbum" key={song.id}>
              <div
                className="music-card group"
                onClick={() => play(song.id)}
                onMouseEnter={() => setHoveredId(song.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={song.image}
                    alt={song.name}
                    className="music-card-image"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${
                    hoveredId === song.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="w-14 h-14 rounded-full bg-gradient-aurora flex items-center justify-center shadow-glow-cyan transform transition-all duration-300 hover:scale-110">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-space/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-sm font-semibold text-white truncate group-hover:text-aurora-cyan transition-colors">
                  {song.name}
                </h3>
                <p className="text-xs text-white/40 mt-1 truncate">{song.artist}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        {musicInfo.length > 6 && (
          <div className="flex justify-center pt-2">
            <button
              onClick={limit === 6 ? expandResults : () => setLimit(6)}
              className={`px-6 py-2 rounded-full border text-sm font-medium transition-all flex items-center gap-2 group ${
                limit === 6 
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-aurora-cyan/30 text-white hover:text-aurora-cyan' 
                  : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-400'
              }`}
            >
              <span>{limit === 6 ? 'View All Albums' : 'Show Less'}</span>
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
    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2">
      {musicInfo.map((song) => (
        <Link to="/innerAlbum" key={song.id} className="flex-shrink-0">
          <div
            className="w-36 music-card"
            onClick={() => play(song.id)}
          >
            <div className="relative overflow-hidden rounded-xl mb-3">
              <img
                src={song.image}
                alt={song.name}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-space/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-aurora-cyan/80 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-sm font-medium text-white truncate">{song.name}</h3>
            <p className="text-xs text-white/40 truncate mt-1">{song.artist}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Albums;
