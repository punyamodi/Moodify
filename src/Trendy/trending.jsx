import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { MelodyMusicsongs } from "../saavnapi";
import he from "he";

function Trending({ names }) {
  const { setSongid } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [limit, setLimit] = useState(8);
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  const expandResults = () => {
    setLimit(musicInfo.length);
  };

  const formatDuration = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await MelodyMusicsongs("topsongs");
        setMusicInfo(
          res.map((song) => ({
            id: song.id,
            name: he.decode(song.name),
            image: song.image[1],
            duration: formatDuration(song.duration),
            album: he.decode(song.album.name),
            year: song.year,
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
    setSongid(id);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3">
            <div className="skeleton w-8 h-4 rounded" />
            <div className="skeleton w-12 h-12 rounded-xl" />
            <div className="flex-1">
              <div className="skeleton h-4 w-48 mb-2 rounded" />
              <div className="skeleton h-3 w-32 rounded" />
            </div>
            <div className="skeleton h-4 w-12 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (isAboveMedium) {
    return (
      <div className="space-y-2">
        {/* Table Header */}
        <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium text-white/40 uppercase tracking-wider border-b border-white/5">
          <span className="w-10 text-center">#</span>
          <span className="flex-1">Title</span>
          <span className="w-48">Album</span>
          <span className="w-20 text-right">Duration</span>
        </div>

        {/* Song Rows */}
        {musicInfo.slice(0, limit).map((song, index) => (
          <div
            key={song.id}
            className="song-item group"
            onClick={() => play(song.id)}
            onMouseEnter={() => setHoveredId(song.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Rank */}
            <span className="w-10 text-center">
              {hoveredId === song.id ? (
                <svg className="w-5 h-5 mx-auto text-aurora-cyan" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <span className={`text-sm font-medium ${index < 3 ? 'text-aurora-cyan' : 'text-white/40'}`}>
                  {index + 1}
                </span>
              )}
            </span>

            {/* Image & Title */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <img 
                src={song.image.url} 
                className="song-item-image" 
                alt={song.name} 
              />
              <div className="min-w-0">
                <h3 className="font-medium text-white truncate group-hover:text-aurora-cyan transition-colors">
                  {song.name}
                </h3>
                <p className="text-sm text-white/40">{song.year}</p>
              </div>
            </div>

            {/* Album */}
            <span className="w-48 text-sm text-white/40 truncate hidden lg:block">
              {song.album}
            </span>

            {/* Duration */}
            <span className="w-20 text-right text-sm text-white/40">
              {song.duration}
            </span>
          </div>
        ))}

        {/* Expand/Collapse Button */}
        {musicInfo.length > 8 && (
          <div className="flex justify-center pt-6">
            <button
              onClick={limit === 8 ? expandResults : () => setLimit(8)}
              className={`btn-secondary group ${limit === 8 ? '' : 'border-red-400/30 text-red-400 hover:bg-red-500/10'}`}
            >
              <span className="flex items-center gap-2">
                {limit === 8 ? (
                  <>
                    View All
                    <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                ) : (
                  <>
                    Show Less
                    <svg className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Mobile View - Grid
  return (
    <div className="grid grid-cols-3 gap-3">
      {musicInfo.map((song, index) => (
        <div
          key={song.id}
          className="music-card relative group"
          onClick={() => play(song.id)}
        >
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={song.image.url}
              alt={song.name}
              className="w-full aspect-square object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-space via-transparent to-transparent" />
            
            {/* Rank Badge */}
            {index < 3 && (
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-aurora-cyan text-white text-xs font-bold flex items-center justify-center">
                {index + 1}
              </div>
            )}
            
            {/* Play Button */}
            <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-aurora-cyan/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Trending;
