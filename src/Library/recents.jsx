import { fetchHistory, deleteRecents } from "../Firebase/database";
import useMediaQuery from "../useMedia";
import { useEffect, useState, useContext } from "react";
import { Context } from "../main";
import { Link } from "react-router-dom";

function Recents() {
  const [likes, setLikes] = useState([]);
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { setSongid } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const localUser = JSON.parse(localStorage.getItem("Users"));
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        let res = await fetchHistory();

        if (res.length > 100) {
          res = res.sort((a, b) => a.timestamp - b.timestamp);
          const oldestSong = res[0];
          await deleteRecents(oldestSong.id);
          res = res.slice(1);
        }

        res = res.sort((a, b) => b.timestamp - a.timestamp);
        setLikes(res);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching or deleting likes:', error);
        setLoading(false);
      }
    };

    if (localUser) {
      fetchLikes();
    } else {
      setLoading(false);
    }
  }, []);

  const play = (id) => {
    localStorage.setItem("songid", id);
    setSongid(id);
  };

  const deleteRecent = async (id) => {
    try {
      await deleteRecents(id);
      setLikes(likes.filter((song) => song.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-space pt-24 pb-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-48 rounded-3xl bg-gradient-to-r from-aurora-cyan/20 to-aurora-blue/20 mb-8" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-16 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!localUser) {
    return (
      <div className="min-h-screen bg-deep-space flex items-center justify-center pt-24 pb-32">
        <div className="text-center max-w-md mx-auto px-6 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-aurora-cyan to-aurora-blue flex items-center justify-center shadow-glow-cyan">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">
            Recently Played
          </h2>
          <p className="text-white/50 mb-8">
            Sign in to view your listening history and pick up where you left off.
          </p>
          <Link to="/login" className="btn-primary">
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-space pt-24 pb-32">
      {/* Ambient Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-aurora-cyan/10 rounded-full blur-[150px] animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-aurora-blue/8 rounded-full blur-[120px]" style={{ animationDelay: '2s' }} />
      </div>

      <div className={`max-w-4xl mx-auto px-6 relative z-10 ${isAboveMedium ? '' : 'pb-20'}`}>
        {/* Hero Section */}
        <div className="glass-card p-8 mb-8 animate-fade-in overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-aurora-cyan/20 via-aurora-blue/10 to-transparent" />
          <div className="relative flex items-center gap-6">
            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl bg-gradient-to-br from-aurora-cyan to-aurora-blue shadow-glow-cyan flex items-center justify-center flex-shrink-0">
              <svg className="w-16 h-16 lg:w-20 lg:h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-white/50 mb-2">History</p>
              <h1 className="text-3xl lg:text-5xl font-display font-bold mb-2">
                Recently Played
              </h1>
              <p className="text-white/50">
                {likes.length} {likes.length === 1 ? 'song' : 'songs'}
              </p>
            </div>
          </div>
        </div>

        {/* Song List */}
        {likes.length > 0 ? (
          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {likes.map((song, index) => (
              <div
                key={song.id}
                className="song-item group"
                onMouseEnter={() => setHoveredId(song.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Rank */}
                <span className="w-10 text-center">
                  {hoveredId === song.id ? (
                    <svg 
                      className="w-5 h-5 mx-auto text-aurora-cyan cursor-pointer" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                      onClick={() => play(song.songId)}
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <span className="text-sm text-white/40">{index + 1}</span>
                  )}
                </span>

                {/* Image & Title */}
                <img
                  src={song.songUrl}
                  className="song-item-image cursor-pointer"
                  alt={song.songName}
                  onClick={() => play(song.songId)}
                />
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => play(song.songId)}>
                  <h3 className="font-medium text-white truncate group-hover:text-aurora-cyan transition-colors">
                    {song.songName}
                  </h3>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => deleteRecent(song.id)}
                  className="w-10 h-10 rounded-full text-white/30 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
              <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-xl font-display font-bold mb-2">No listening history</h3>
            <p className="text-white/50 mb-6">Start playing music to build your history</p>
            <Link to="/discover" className="btn-primary">
              <span>Discover Music</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recents;
