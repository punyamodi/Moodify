import React, { useContext, useState, useEffect } from "react";
import { addRecents } from "../Firebase/database";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { Searchsongs, Searchsongs2 } from "../saavnapi";
import he from "he";
import { Link, useNavigate } from "react-router-dom";

function Result({ names }) {
  const { setSongid, setSelected, setSinger, setInneralbum } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [albuminfo, setAlbuminfo] = useState([]);
  const [artistinfo, setArtistinfo] = useState([]);
  const [topquery, setTopquery] = useState([]);
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Searchsongs(names);
        const res2 = await Searchsongs2(names);

        setMusicInfo(
          res2.results.map((song) => ({
            id: song.id,
            name: he.decode(song.name),
            image: song.image[1].url,
          }))
        );

        setAlbuminfo(
          res.albums.results.map((album) => ({
            id: album.id,
            name: he.decode(album.title),
            image: album.image[1].url,
          }))
        );

        setArtistinfo(
          res.artists.results.map((artist) => ({
            id: artist.id,
            name: he.decode(artist.title),
            image: artist.image[1].url,
          }))
        );

        setTopquery(
          res.topQuery.results.map((query) => ({
            id: query.id,
            name: he.decode(query.title),
            image: query.image[1].url,
            type: query.type,
          }))
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [names]);

  const play = async (id, name, image) => {
    localStorage.setItem("songid", id);
    setSongid(id);

    const user = JSON.parse(localStorage.getItem("Users"));
    if (user) {
      try {
        await addRecents(user.uid, id, name, image);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const playsinger = (id) => {
    localStorage.setItem("singer", id);
    setSinger(id);
    localStorage.setItem("selected", "/artist");
    setSelected("/artist");
  };

  const playalbum = (id) => {
    localStorage.setItem("innerAlbum", id);
    setInneralbum(id);
    localStorage.setItem("selected", "/albums");
    setSelected("/albums");
  };

  const playquery = async (id, type) => {
    switch (type) {
      case "album":
        playalbum(id);
        Navigate("/innerAlbum");
        break;
      case "artist":
        playsinger(id);
        Navigate("/innerartist");
        break;
      case "song":
        play(id);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="space-y-12 pb-12">
        {[...Array(3)].map((_, sectionIndex) => (
          <div key={sectionIndex}>
            <div className="skeleton h-8 w-48 mb-6 rounded-lg" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  <div className="skeleton aspect-square mb-3 rounded-2xl" />
                  <div className="skeleton h-4 w-3/4 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const SectionHeader = ({ title, accent }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${accent}`} />
      <h2 className="text-xl font-display font-semibold text-white">{title}</h2>
    </div>
  );

  const MusicCard = ({ item, onClick, isArtist = false }) => (
    <div
      className="music-card group cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setHoveredId(item.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      <div className={`relative overflow-hidden ${isArtist ? 'rounded-full' : 'rounded-xl'} mb-4`}>
        <img
          src={item.image}
          alt={item.name}
          className={`w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110 ${
            isArtist ? 'rounded-full' : ''
          }`}
        />
        
        {/* Play Overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
          hoveredId === item.id ? 'opacity-100' : 'opacity-0'
        } ${isArtist ? 'rounded-full' : ''}`}>
          <div className="w-12 h-12 rounded-full bg-gradient-aurora flex items-center justify-center shadow-glow-cyan">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      
      <h3 className={`text-sm font-medium text-white truncate group-hover:text-aurora-cyan transition-colors ${
        isArtist ? 'text-center' : ''
      }`}>
        {item.name}
      </h3>
      {isArtist && <p className="text-xs text-white/40 text-center mt-1">Artist</p>}
    </div>
  );

  return (
    <div className="space-y-12 pb-32">
      {/* Top Songs */}
      {musicInfo.length > 0 && (
        <section className="animate-fade-in">
          <SectionHeader title="Songs" accent="from-aurora-cyan to-aurora-teal" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {musicInfo.slice(0, isAboveMedium ? 10 : 6).map((song) => (
              <MusicCard
                key={song.id}
                item={song}
                onClick={() => play(song.id, song.name, song.image)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Top Albums */}
      {albuminfo.length > 0 && (
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <SectionHeader title="Albums" accent="from-aurora-teal to-aurora-cyan" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {albuminfo.slice(0, isAboveMedium ? 10 : 6).map((album) => (
              <Link to="/innerAlbum" key={album.id}>
                <MusicCard
                  item={album}
                  onClick={() => playalbum(album.id)}
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Top Artists */}
      {artistinfo.length > 0 && (
        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <SectionHeader title="Artists" accent="from-aurora-cyan to-aurora-blue" />
          <div className="flex flex-wrap gap-8">
            {artistinfo.slice(0, isAboveMedium ? 8 : 4).map((artist) => (
              <Link to="/innerartist" key={artist.id} className="w-32">
                <MusicCard
                  item={artist}
                  onClick={() => playsinger(artist.id)}
                  isArtist
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Top Queries */}
      {topquery.length > 0 && (
        <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <SectionHeader title="Top Results" accent="from-aurora-green to-aurora-cyan" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {topquery.slice(0, isAboveMedium ? 10 : 6).map((query) => (
              <MusicCard
                key={query.id}
                item={query}
                onClick={() => playquery(query.id, query.type)}
                isArtist={query.type === 'artist'}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Result;
