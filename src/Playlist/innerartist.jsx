import useMediaQuery from "../useMedia";
import { useEffect, useState, useContext } from "react";
import he from "he";
import { artistSongs } from "../saavnapi";
import { Link } from "react-router-dom";
import { addRecents } from "../Firebase/database";
import { Context } from "../main";

function Innerartist({ names }) {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { setSongid, singer, setInneralbum, setSelected } = useContext(Context);
  const [image, setImage] = useState({});
  const [albuminfo, setAlbuminfo] = useState([]);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await artistSongs(singer);
        setImage(res.data.data);

        setMusicInfo(
          res.data.data.topSongs.map((song) => ({
            id: song.id,
            name: he.decode(song.name),
            image: song.image[1].url,
            artist: song.artists.primary[0].name,
            year: song.year,
          }))
        );
        setAlbuminfo(
          res.data.data.topAlbums.map((album) => ({
            aid: album.id,
            aname: he.decode(album.name),
            aimage: album.image[1].url,
            aartist: album.artists.primary[0].name,
            ayear: album.year,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [singer]);

  const play = async (id, name, imgUrl) => {
    localStorage.setItem("songid", id);
    setSongid(id);
    const user = JSON.parse(localStorage.getItem("Users"));

    if (user) {
      try {
        await addRecents(user.uid, id, name, imgUrl);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const plays = (id) => {
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
            <div className="flex items-center gap-8 mb-8">
              <div className="w-40 h-40 rounded-full skeleton" />
              <div className="flex-1 space-y-4">
                <div className="skeleton h-10 w-64 rounded-lg" />
                <div className="skeleton h-4 w-32 rounded-lg" />
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
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
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-aurora-cyan/15 rounded-full blur-[180px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-aurora-cyan/10 rounded-full blur-[120px]" style={{ animationDelay: '2s' }} />
      </div>

      <div className={`relative z-10 ${isAboveMedium ? 'max-w-5xl mx-auto px-6' : 'px-4 pb-24'}`}>
        {/* Artist Header */}
        <div className="glass-card p-6 lg:p-8 mb-10 animate-fade-in overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-aurora-cyan/20 via-aurora-cyan/10 to-transparent" />
          <div className="relative flex flex-col lg:flex-row items-center gap-8">
            {/* Artist Image */}
            <div className="relative group">
              <div className="w-40 h-40 lg:w-52 lg:h-52 rounded-full overflow-hidden ring-4 ring-aurora-cyan/30 shadow-glow-cyan">
                <img
                  src={image.image[1].url}
                  alt={image.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button 
                  onClick={() => musicInfo[0] && play(musicInfo[0].id, musicInfo[0].name, musicInfo[0].image)}
                  className="w-16 h-16 rounded-full bg-gradient-aurora flex items-center justify-center shadow-glow-cyan hover:scale-110 transition-transform"
                >
                  <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Artist Info */}
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm text-aurora-cyan font-medium uppercase tracking-wider mb-2">Artist</p>
              <h1 className="text-4xl lg:text-6xl font-display font-bold mb-4">{image.name}</h1>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
                <span className="text-white/50">{musicInfo.length} Popular Tracks</span>
                <span className="text-white/50">{albuminfo.length} Albums</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Songs */}
        <section className="animate-fade-in-up mb-12" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-aurora-cyan to-aurora-teal" />
            <h2 className="text-xl font-display font-semibold">Popular Tracks</h2>
          </div>

          <div className="space-y-2">
            {musicInfo.slice(0, 8).map((song, index) => (
              <div
                key={song.id}
                className="song-item group"
                onClick={() => play(song.id, song.name, song.image)}
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
                  src={song.image} 
                  alt={song.name}
                  className="song-item-image" 
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate group-hover:text-aurora-cyan transition-colors">
                    {song.name}
                  </h3>
                  <p className="text-sm text-white/40">{song.year}</p>
                </div>

                {/* Play Button */}
                <button className="w-10 h-10 rounded-full bg-aurora-cyan/20 text-aurora-cyan flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-aurora-cyan hover:text-white">
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Albums */}
        {albuminfo.length > 0 && (
          <section className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-aurora-cyan to-aurora-blue" />
              <h2 className="text-xl font-display font-semibold">Albums</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {albuminfo.map((album) => (
                <Link to="/innerAlbum" key={album.aid}>
                  <div
                    className="music-card group"
                    onClick={() => plays(album.aid)}
                  >
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <img
                        src={album.aimage}
                        alt={album.aname}
                        className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-gradient-aurora flex items-center justify-center shadow-glow-cyan">
                          <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-deep-space/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-sm font-medium text-white truncate group-hover:text-aurora-cyan transition-colors">
                      {album.aname}
                    </h3>
                    <p className="text-xs text-white/40 mt-1">{album.ayear}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Innerartist;
