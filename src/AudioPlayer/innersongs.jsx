import React, { useContext, useEffect, useState, useCallback } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import {
  searchResult,
  searchSuggestion,
  songLyrics,
  newsearch,
} from "../saavnapi";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import he from "he";
import { getRecommendations } from "../spotify";
import { addLikes, deleteLikes, fetchUser } from "../Firebase/database";
import { auth } from "../Firebase/firebaseConfig";

function Innersongs() {
  const isAboveMedium = useMediaQuery("(min-width: 768px)");
  const { songid, lyrics, setLyrics, setSongid, spotify, setSpotify } = useContext(Context);
  const [details, setDetails] = useState("");
  const [image, setImage] = useState("");
  const [songName, setSongName] = useState("");
  const [midsection, setMidsection] = useState("song");
  const [recommendation, setRecommendation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dloading, setDloading] = useState(false);
  const [download, setDownload] = useState("");
  const [liked, setLiked] = useState(false);
  const [dbId, setDbId] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetchUser();
        const foundSong = res.find((song) => song.songId === songid);
        if (foundSong) {
          setLiked(true);
          setDbId(foundSong.id);
        } else {
          setLiked(false);
          setDbId("");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchLikes();
  }, [songid]);

  const downloadAudio = async () => {
    const url = download;
    try {
      setDloading(true);
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${songName}.mp3`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDloading(false);
      toast.success("Downloaded Successfully");
    } catch (error) {
      console.error("Error downloading audio:", error);
      toast.error("Download Failed");
      setDloading(false);
    }
  };

  const fetchLyrics = useCallback(async () => {
    setLoading(false);
    if (songid) {
      try {
        const res = await searchResult(songid);
        setDetails(res.data.data[0]);
        setDownload(res.data.data[0].downloadUrl[4].url);
        const new2 = he.decode(res.data.data[0].name);
        setSongName(new2);
        setImage(res.data.data[0].image[2].url);
      } catch (error) {
        console.error(error);
      }
      try {
        const res2 = await songLyrics(songid);
        const decodedRes = he.decode(res2.data.lyrics);
        setLyrics(decodedRes);
      } catch (error) {
        setLyrics("Lyrics Not found");
      }
    }
    setLoading(true);
  }, [songid, setLyrics]);

  const fetchRecommendations = async () => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      setDloading(true);
      const res4 = await getRecommendations(spotify);
      if (res4 === "error") {
        const res3 = await searchSuggestion(songid);
        setRecommendation(
          res3.data.map((song) => ({
            id: song.id,
            name: he.decode(song.name),
            image: song.image[1].url,
            artist: song.artists.primary[0].name,
            year: song.year,
            album: song.album.name,
          }))
        );
      } else {
        setRecommendation(
          res4.tracks.map((song) => ({
            name: he.decode(song.name),
            image: song.album.images[1].url,
            year: song.album.release_date.slice(0, 4),
            album: song.album.name,
            artist: song.artists[0].name,
          }))
        );
      }
      setDloading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDloading(false);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [spotify]);

  useEffect(() => {
    fetchLyrics();
  }, [fetchLyrics]);

  const play = async (id) => {
    const res = await newsearch(id);
    localStorage.setItem("spotify", id);
    setSpotify(id);
    localStorage.setItem("songid", res);
    setSongid(res);
  };

  const handleLikes = async () => {
    try {
      setLiked(true);
      const name = he.decode(details.name);
      const imageUrl = details.image[2].url;
      const year = details.year;
      const songId = songid;
      await addLikes(songId, name, imageUrl, year, auth.currentUser.uid);
      toast.success("Added to Liked Songs");
    } catch (error) {
      console.error(error);
      toast.error("Failed to like song");
    }
  };

  const handleDelete = async () => {
    try {
      setLiked(false);
      await deleteLikes(dbId);
      toast.success("Removed from Liked Songs");
    } catch (error) {
      console.error(error);
      toast.error("Failed to unlike song");
    }
  };

  if (!loading) {
    return (
      <div className="min-h-screen bg-deep-space flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-space text-white pt-8 pb-40">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        theme="dark"
        transition={Bounce}
        toastStyle={{
          background: 'rgba(15, 15, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
        }}
      />

      {/* Ambient Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-aurora-cyan/20 rounded-full blur-[180px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-aurora-teal/10 rounded-full blur-[120px]" style={{ animationDelay: '2s' }} />
      </div>

      <div className={`relative z-10 max-w-4xl mx-auto px-6 ${isAboveMedium ? '' : 'pb-32'}`}>
        {/* Song Hero Section */}
        <div className="flex flex-col items-center mb-12 animate-fade-in">
          {/* Album Art */}
          <div className="relative group mb-8">
            <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-3xl overflow-hidden shadow-card ring-1 ring-white/10">
              <img 
                src={image} 
                alt={songName} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-deep-space/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Song Info */}
          <div className="text-center space-y-4">
            <h1 className="text-2xl lg:text-4xl font-display font-bold">{songName}</h1>
            {details && (
              <p className="text-white/50">
                {details.artists?.primary?.map(a => a.name).join(', ') || 'Unknown Artist'} • {details.year}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-8">
            {/* Like Button */}
            <button 
              onClick={liked ? handleDelete : handleLikes}
              disabled={dloading}
              className={`btn-icon ${liked ? 'bg-aurora-teal/20 text-aurora-teal border-aurora-teal/30' : ''}`}
            >
              <svg className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={liked ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Download Button */}
            <button 
              onClick={downloadAudio}
              disabled={dloading}
              className="btn-icon"
            >
              {dloading ? (
                <div className="loading-spinner" style={{ width: '20px', height: '20px' }} />
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="inline-flex p-1 bg-white/5 rounded-2xl border border-white/10">
            <button
              onClick={() => setMidsection("song")}
              className={`px-8 py-3 rounded-xl text-sm font-medium transition-all ${
                midsection === "song" 
                  ? "bg-gradient-aurora text-white shadow-glow-cyan" 
                  : "text-white/60 hover:text-white"
              }`}
            >
              Up Next
            </button>
            <button
              onClick={() => setMidsection("lyric")}
              className={`px-8 py-3 rounded-xl text-sm font-medium transition-all ${
                midsection === "lyric" 
                  ? "bg-gradient-aurora text-white shadow-glow-cyan" 
                  : "text-white/60 hover:text-white"
              }`}
            >
              Lyrics
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          {midsection === "song" && (
            <div className="space-y-2">
              {recommendation.map((song, index) => (
                <div
                  key={song.id || index}
                  className="song-item group"
                  onClick={() => play(song.name + " " + song.artist)}
                  onMouseEnter={() => setHoveredId(index)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Index/Play */}
                  <span className="w-10 text-center">
                    {hoveredId === index ? (
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
                  <img src={song.image} alt={song.name} className="song-item-image" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate group-hover:text-aurora-cyan transition-colors">
                      {song.name}
                    </h3>
                    <p className="text-sm text-white/40 truncate">{song.artist}</p>
                  </div>

                  {/* Year */}
                  {isAboveMedium && (
                    <span className="w-16 text-right text-sm text-white/40">
                      {song.year}
                    </span>
                  )}

                  {/* Play Button */}
                  <button className="w-10 h-10 rounded-full bg-aurora-cyan/20 text-aurora-cyan flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-aurora-cyan hover:text-white">
                    <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {midsection === "lyric" && (
            <div className="glass-card p-8 space-y-6">
              {/* Song Details */}
              <div className="flex items-center gap-6 pb-6 border-b border-white/10">
                <img src={image} alt={songName} className="w-20 h-20 rounded-xl object-cover" />
                <div>
                  <h2 className="text-xl font-display font-bold">{he.decode(details.name || '')}</h2>
                  <p className="text-white/50">{details.year} • {details.album?.name}</p>
                </div>
              </div>

              {/* Lyrics */}
              <div 
                className="text-lg text-white/80 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: lyrics || "Lyrics not available for this song" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Innersongs;
