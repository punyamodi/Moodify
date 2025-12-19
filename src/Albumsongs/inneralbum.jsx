import useMediaQuery from "../useMedia";
import { useEffect, useState, useContext } from "react";
import { Context } from "../main";
import { addRecents } from "../Firebase/database";
import he from "he";
import { albumsongsinner } from "../saavnapi";

function Inneralbum({ names }) {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { setSongid, innerAlbum } = useContext(Context);
  const [image, setImage] = useState({});
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await albumsongsinner(innerAlbum);
        setImage(res.data.data);

        setMusicInfo(
          res.data.data.songs.map((song) => ({
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
  }, [names, innerAlbum]);

  const play = async (id, name, imgUrl) => {
    localStorage.setItem("songid", id);
    setSongid(id);
    const user = JSON.parse(localStorage.getItem("Users"));

    if (user) {
      try {
        await addRecents(user.uid, id, name, imgUrl);
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-space pt-24 pb-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-64 rounded-3xl bg-gradient-to-r from-aurora-cyan/20 to-aurora-teal/20 mb-8" />
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
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-aurora-cyan/15 rounded-full blur-[150px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-aurora-teal/10 rounded-full blur-[120px]" style={{ animationDelay: '2s' }} />
      </div>

      <div className={`relative z-10 ${isAboveMedium ? 'max-w-5xl mx-auto px-6' : 'px-4'}`}>
        {/* Album Header */}
        <div className="glass-card p-6 lg:p-8 mb-8 animate-fade-in overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-aurora-cyan/20 via-aurora-teal/10 to-transparent" />
          <div className="relative flex flex-col lg:flex-row items-center lg:items-end gap-6">
            {/* Album Cover */}
            <div className="relative group">
              <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-2xl overflow-hidden shadow-card">
                <img
                  src={image.image ? image.image[1].url : ""}
                  alt={image.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-deep-space/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Play All Button */}
              <button 
                onClick={() => musicInfo[0] && play(musicInfo[0].id, musicInfo[0].name, musicInfo[0].image.url)}
                className="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-gradient-aurora flex items-center justify-center
                         shadow-glow-cyan transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 
                         transition-all duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>

            {/* Album Info */}
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm text-aurora-cyan font-medium uppercase tracking-wider mb-2">Album</p>
              <h1 className="text-3xl lg:text-5xl font-display font-bold mb-3">{image.name}</h1>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-white/50">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  {image.language ? image.language.toUpperCase() : "MUSIC"}
                </span>
                <span>{musicInfo.length} songs</span>
                {image.year && <span>{image.year}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Songs List */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Header Row */}
          {isAboveMedium && (
            <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium text-white/40 uppercase tracking-wider border-b border-white/5 mb-2">
              <span className="w-10 text-center">#</span>
              <span className="flex-1">Title</span>
              <span className="w-32 hidden lg:block">Artist</span>
              <span className="w-20 text-right">Year</span>
            </div>
          )}

          {/* Song Rows */}
          <div className="space-y-2">
            {musicInfo.map((song, index) => (
              <div
                key={song.id}
                className="song-item group"
                onClick={() => play(song.id, song.name, song.image.url)}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inneralbum;
