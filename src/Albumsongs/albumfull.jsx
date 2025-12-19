import useMediaQuery from "../useMedia";
import { useEffect, useState, useContext } from "react";
import { Context } from "../main";
import he from "he";
import { Link } from "react-router-dom";
import { albumsongs } from "../saavnapi";

function AlbumFull({ names }) {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { setInneralbum, setSelected } = useContext(Context);
  const [limit, setLimit] = useState(8);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await albumsongs();

        setMusicInfo(
          res.data.data.results.map((song) => ({
            id: song.id,
            name: he.decode(song.name),
            image: song.image[1],
            artist: song.artists.primary[0].name,
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

  const play = async (id) => {
    localStorage.setItem("innerAlbum", id);
    setInneralbum(id);
    localStorage.setItem("selected", "/albums");
    setSelected("/albums");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-space pt-24 pb-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-48 rounded-3xl bg-gradient-to-r from-aurora-cyan/20 to-aurora-teal/20 mb-8" />
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton h-16 rounded-xl" />
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
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-aurora-cyan/15 rounded-full blur-[180px] animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-aurora-cyan/10 rounded-full blur-[120px]" style={{ animationDelay: '2s' }} />
      </div>

      <div className={`relative z-10 ${isAboveMedium ? 'max-w-5xl mx-auto px-6' : 'px-4 pb-24'}`}>
        {/* Header */}
        <div className="glass-card p-8 mb-10 animate-fade-in overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-aurora-cyan/30 via-aurora-teal/20 to-aurora-cyan/10" />
          <div className="relative flex flex-col lg:flex-row items-center gap-8">
            {/* Album Art */}
            <div className="w-40 h-40 lg:w-52 lg:h-52 rounded-2xl bg-gradient-aurora shadow-glow-cyan flex items-center justify-center">
              <svg className="w-20 h-20 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm text-aurora-cyan font-medium uppercase tracking-wider mb-2">Collection</p>
              <h1 className="text-4xl lg:text-6xl font-display font-bold mb-4">
                Trending <span className="text-gradient">Albums</span>
              </h1>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
                <span className="text-white/50">{musicInfo.length} albums</span>
                <span className="px-3 py-1 rounded-full bg-aurora-cyan/20 text-aurora-cyan border border-aurora-cyan/30">
                  Featured
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Album List */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Header Row */}
          {isAboveMedium && (
            <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium text-white/40 uppercase tracking-wider border-b border-white/5 mb-2">
              <span className="w-10 text-center">#</span>
              <span className="flex-1">Album</span>
              <span className="w-32 hidden lg:block">Artist</span>
              <span className="w-20 text-right">Year</span>
            </div>
          )}

          {/* Album Rows */}
          <div className="space-y-2">
            {musicInfo.slice(0, limit).map((song, index) => (
              <Link to="/innerAlbum" key={song.id}>
                <div
                  className="song-item group"
                  onClick={() => play(song.id)}
                  onMouseEnter={() => setHoveredId(song.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Index/Play */}
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
                  <img 
                    src={song.image.url} 
                    alt={song.name}
                    className="song-item-image" 
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate group-hover:text-aurora-cyan transition-colors">
                      {song.name}
                    </h3>
                    {!isAboveMedium && (
                      <p className="text-sm text-white/40 truncate">{song.artist}</p>
                    )}
                  </div>

                  {/* Artist (Desktop) */}
                  {isAboveMedium && (
                    <span className="w-32 text-sm text-white/40 truncate hidden lg:block">
                      {song.artist}
                    </span>
                  )}

                  {/* Year */}
                  <span className="w-20 text-right text-sm text-white/40">
                    {song.year}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Expand/Collapse Button */}
          {musicInfo.length > 8 && (
            <div className="flex justify-center pt-8">
              <button
                onClick={() => setLimit(limit === 8 ? musicInfo.length : 8)}
                className={`btn-secondary group ${limit > 8 ? 'border-red-400/30 text-red-400 hover:bg-red-500/10' : ''}`}
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
      </div>
    </div>
  );
}

export default AlbumFull;