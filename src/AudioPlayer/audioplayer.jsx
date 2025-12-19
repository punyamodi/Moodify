import React, { useContext, useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import he from "he";
import { searchResult, searchSuggestion, newsearch } from "../saavnapi";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { getRecommendations } from "../spotify";
import { addRecents, addLikes, deleteLikes, fetchUser } from "../Firebase/database";

function AudioPlayerComponent() {
  const isAboveMedium = useMediaQuery("(min-width:1025px)");
  const { songid, setSongid, setSelected, spotify, setSpotify } = useContext(Context);
  const [music, setMusic] = useState("");
  const [names, setNames] = useState("");
  const [prev, setPrev] = useState([]);
  const [array, setArray] = useState("");
  const [image, setImage] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [year, setYear] = useState("");

  // Media Session API
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: names,
        album: array,
        artist: " ",
        artwork: [
          { src: image, sizes: "96x96", type: "image/jpeg" },
          { src: image, sizes: "128x128", type: "image/jpeg" },
          { src: image, sizes: "192x192", type: "image/jpeg" },
          { src: image, sizes: "256x256", type: "image/jpeg" },
          { src: image, sizes: "384x384", type: "image/jpeg" },
          { src: image, sizes: "512x512", type: "image/jpeg" },
        ],
      });
    }
  }, [names, array, image]);

  const fetchSongData = async () => {
    try {
      const res = await searchResult(songid);
      const decodedName = he.decode(res.data.data[0].name);
     
      if (decodedName) {
        localStorage.setItem("spotify", res.data.data[0].artists.primary[0].name + " " + decodedName);
        setSpotify(res.data.data[0].artists.primary[0].name + " " + decodedName);
      }
      setArray(res.data.data[0].album.name);
      setImage(res.data.data[0].image[1].url);
      setNames(decodedName);
      setYear(res.data.data[0].year || "");
      const url = res.data.data[0].downloadUrl[4].url;
      setMusic(url);

      // Handle User Data (Recents & Likes)
      const user = JSON.parse(localStorage.getItem("Users"));
      if (user) {
        // Add to Recents
        addRecents(user.uid, res.data.data[0].id, decodedName, res.data.data[0].image[1].url);
        
        // Check if Liked
        const likes = await fetchUser();
        const found = likes.find(l => l.songId === songid);
        if (found) {
            setIsLiked(true);
            setLikeId(found.id);
        } else {
            setIsLiked(false);
            setLikeId(null);
        }
      }
    } catch (error) {
      console.error("Error fetching song data:", error);
    }
  };

  const handleLike = async () => {
    const user = JSON.parse(localStorage.getItem("Users"));
    if (!user) {
      toast.error("Please login to like songs");
      return;
    }
    
    try {
      if (isLiked) {
        await deleteLikes(likeId);
        setIsLiked(false);
        setLikeId(null);
        toast.success("Removed from Liked Songs");
      } else {
        await addLikes(songid, names, image, year, user.uid);
        setIsLiked(true);
        // Refresh to get new ID
        const likes = await fetchUser();
        const found = likes.find(l => l.songId === songid);
        if (found) setLikeId(found.id);
        toast.success("Added to Liked Songs");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating likes");
    }
  };

  useEffect(() => {
    if (songid) {
      fetchSongData();
    }
  }, [songid]);

  const handleNext = async () => {
    if (isFetching) return;
    setIsFetching(true);

    try {
      const prevItem = { name: spotify, id: songid };
      setPrev([...prev, prevItem]);

      const res2 = await getRecommendations(spotify);

      if (res2 === "error") {
        const res = await searchSuggestion(songid);
        let i = 0;
        while (i < res.data.length && prev.some(item => item.id === res.data[i].id)) {
          i++;
        }

        if (i === res.data.length) {
          toast.error('No more songs to play, please select another song.');
          setIsFetching(false);
          return;
        }
        localStorage.setItem('songid', res.data[i].id);
        setSongid(res.data[i].id);
        localStorage.setItem("spotify", res.data[i].artists.primary[0].name + " " + res.data[i].name);
        setSpotify(res.data[i].artists.primary[0].name + " " + res.data[i].name);

        const user = JSON.parse(localStorage.getItem("Users"));
        if (user) {
          try {
            await addRecents(
              user.uid,
              res.data[i].id,
              he.decode(res.data[i].name),
              res.data[i].image[1].url
            );
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        let i = 0;
        while (
          i < res2.tracks.length &&
          prev.some(item => item.name === res2.tracks[i].artists[0].name + " " + res2.tracks[i].name)
        ) {
          i++;
        }

        if (i === res2.tracks.length) {
          toast.error("No more songs to play, please select another song.");
          setIsFetching(false);
          return;
        }

        const res3 = await newsearch(res2.tracks[i].name + " " + res2.tracks[i].artists[0].name);
        localStorage.setItem("songid", res3);
        setSongid(res3);
        localStorage.setItem("spotify", res2.tracks[i].artists[0].name + " " + res2.tracks[i].name);
        setSpotify(res2.tracks[i].artists[0].name + " " + res2.tracks[i].name);

        const user = JSON.parse(localStorage.getItem("Users"));
        if (user) {
          try {
            await addRecents(
              user.uid,
              res2.tracks[i].id,
              res2.tracks[i].name,
              res2.tracks[i].album.images[0].url
            );
          } catch (error) {
            console.log(error);
          }
        }
      }
    } catch (error) {
      console.error("Error handling next song:", error);
      toast.error("No more songs to play, please select another song.");
    } finally {
      setIsFetching(false);
    }
  };

  const handlePrev = async () => {
    if (prev.length === 0) {
      toast.error("No previous songs available");
      return;
    }

    const last = prev[prev.length - 1];
    const res3 = last.name;
    const res = await newsearch(res3);
    localStorage.setItem("songid", res);
    setSongid(res);
    setPrev(prev.slice(0, -1));
  };

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("nexttrack", handleNext);
      navigator.mediaSession.setActionHandler("previoustrack", handlePrev);
    }
  }, [handleNext, handlePrev]);

  const setdisplay = () => {
    localStorage.setItem("selected", "innersong");
    setSelected("innersong");
  };

  if (!songid) return null;

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        toastStyle={{
          background: 'rgba(15, 15, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
        }}
      />
      
      {isAboveMedium ? (
        // Desktop Player
        <div className="fixed bottom-0 left-72 right-0 z-40">
          <div className="bg-gradient-to-t from-deep-space via-deep-space/98 to-transparent backdrop-blur-2xl border-t border-white/5">
            <div className="flex items-center gap-6 px-6 py-3">
              {/* Current Song Info */}
              <Link 
                to="innersong" 
                onClick={setdisplay}
                className="flex items-center gap-4 w-72 group cursor-pointer"
              >
                <div className="relative">
                  <img 
                    src={image} 
                    alt={names}
                    className="w-14 h-14 rounded-xl object-cover shadow-lg group-hover:shadow-glow-cyan transition-shadow" 
                  />
                  <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white truncate group-hover:text-aurora-cyan transition-colors">
                    {names || "No song playing"}
                  </h4>
                  <p className="text-sm text-white/40 truncate">{array || "Select a song"}</p>
                </div>
              </Link>

              <button 
                onClick={handleLike}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isLiked ? 'text-aurora-cyan' : 'text-white/40 hover:text-white'}`}
              >
                <svg className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Main Player */}
              <div className="flex-1">
                <AudioPlayer
                  showSkipControls
                  onClickNext={handleNext}
                  onClickPrevious={handlePrev}
                  onEnded={handleNext}
                  src={music}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="custom-audio-player !bg-transparent !shadow-none !p-0"
                />
              </div>

              {/* Visualizer (Decorative) */}
              <div className="flex items-center gap-1 h-10">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-1 bg-gradient-to-t from-aurora-cyan to-aurora-teal rounded-full transition-all ${
                      isPlaying ? 'animate-pulse' : ''
                    }`}
                    style={{ 
                      height: isPlaying ? `${20 + Math.random() * 20}px` : '6px',
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Mobile Player
        <div className="fixed bottom-20 left-0 right-0 z-40 px-4">
          <div className="glass-card p-3 rounded-2xl backdrop-blur-xl border border-white/10 shadow-card">
            <div className="flex items-center gap-3">
              {/* Mini Song Info */}
              <Link to="innersong" onClick={setdisplay} className="flex items-center gap-3 flex-1 min-w-0">
                <img 
                  src={image} 
                  alt={names}
                  className="w-12 h-12 rounded-xl object-cover shadow-lg" 
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-white truncate">{names}</h4>
                  <p className="text-xs text-white/40 truncate">{array}</p>
                </div>
              </Link>

              <button 
                onClick={handleLike}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isLiked ? 'text-aurora-cyan' : 'text-white/60 hover:text-white'}`}
              >
                 <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Compact Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                  </svg>
                </button>
                <button className="w-12 h-12 rounded-full bg-gradient-aurora flex items-center justify-center text-white shadow-glow-cyan">
                  <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <button 
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Hidden Audio Player */}
            <div className="hidden">
              <AudioPlayer
                showSkipControls
                onClickNext={handleNext}
                onClickPrevious={handlePrev}
                onEnded={handleNext}
                src={music}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AudioPlayerComponent;
