import React, { useRef, useEffect, useState } from 'react';
import { useContext } from 'react';
import { Context } from './main';
import useMediaQuery from './useMedia';
import * as faceapi from 'face-api.js';
import { songBymood } from './saavnapi';
import he from 'he';

function Moodanalyse() {
  const { setSongid } = useContext(Context);
  const isAboveMedium = useMediaQuery("(min-width: 768px)");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [dominantExpression, setDominantExpression] = useState(null);
  const [musicInfo, setMusicInfo] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const moodEmojis = {
    happy: { emoji: "😊", color: "from-yellow-400 to-orange-500", label: "Happy" },
    sad: { emoji: "😢", color: "from-blue-400 to-blue-600", label: "Sad" },
    angry: { emoji: "😠", color: "from-red-400 to-red-600", label: "Angry" },
    fearful: { emoji: "😨", color: "from-cyan-400 to-cyan-600", label: "Fearful" },
    disgusted: { emoji: "🤢", color: "from-green-400 to-green-600", label: "Disgusted" },
    surprised: { emoji: "😲", color: "from-teal-400 to-teal-600", label: "Surprised" },
    neutral: { emoji: "😐", color: "from-gray-400 to-gray-600", label: "Neutral" },
  };

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      startVideo();
      loadModels();
    } else {
      console.error("getUserMedia is not supported in this browser.");
    }
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.play().catch(err => console.error("Error playing video:", err));
        setCameraReady(true);
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  const loadModels = async () => {
    try {
      setIsAnalyzing(true);
      // Only load the essential models for expression detection
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models")
      ]);
      setIsAnalyzing(false);
      faceMyDetect();
    } catch (err) {
      console.error("Error loading models:", err);
      setIsAnalyzing(false);
    }
  };

  const faceMyDetect = async () => {
    let detectionInterval = null;
    
    const detect = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      try {
        const detections = await faceapi.detectAllFaces(videoRef.current,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 224,
            scoreThreshold: 0.5
          })
        ).withFaceExpressions();
        
        if (detections.length > 0) {

          const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
          faceapi.matchDimensions(canvasRef.current, displaySize);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          
          const context = canvasRef.current.getContext('2d');
          context.clearRect(0, 0, displaySize.width, displaySize.height);
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

          const firstDetection = resizedDetections[0];
          if (firstDetection) {
            const expressions = firstDetection.expressions;
            const dominant = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
            setDominantExpression(dominant);
          }
        }
      } catch (err) {
        console.error("Error detecting faces:", err);
      }
    };

    // Detection interval - 500ms for better performance
    detectionInterval = setInterval(detect, 500);
    
    // Cleanup on unmount
    return () => {
      if (detectionInterval) clearInterval(detectionInterval);
    };
  };

  useEffect(() => {
    let intervalId;

    if (dominantExpression) {
      const fetchSong = async () => {
        try {
          const res = await songBymood(dominantExpression);
          setMusicInfo(
            res.data.data.results.map((song) => ({
              id: song.id,
              name: he.decode(song.name),
              image: song.image[1],
              artist: song.artists.primary[0].name,
              year: song.year,
            }))
          );
        } catch (err) {
          console.error("Error fetching song:", err);
        }
      };

      fetchSong();
      // Reduced frequency to 5 seconds for better performance
      intervalId = setInterval(fetchSong, 5000);
    }
    return () => clearInterval(intervalId);
  }, [dominantExpression]);

  const play = async (id) => {
    localStorage.setItem("songid", id);
    setSongid(id);
  };

  const currentMood = moodEmojis[dominantExpression] || moodEmojis.neutral;

  return (
    <div className="min-h-screen bg-deep-space text-white pb-32">
      {/* Ambient Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-aurora-cyan/15 rounded-full blur-[150px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-aurora-teal/10 rounded-full blur-[120px]" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative px-6 lg:px-12 pt-24 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-aurora flex items-center justify-center shadow-glow-cyan">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold">
                Mood <span className="text-gradient">Analysis</span>
              </h1>
              <p className="text-white/50 text-sm mt-1">Let your emotions guide the music</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className={`${isAboveMedium ? 'grid grid-cols-2 gap-12' : 'flex flex-col gap-8'}`}>
          {/* Camera Section */}
          <div className="space-y-6 animate-fade-in">
            <div className="glass-card p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-display font-semibold">Face Detection</h2>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                  cameraReady ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${cameraReady ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
                  <span className="text-xs font-medium">{cameraReady ? 'Live' : 'Loading...'}</span>
                </div>
              </div>

              {/* Video Container */}
              <div className="relative rounded-2xl overflow-hidden bg-black/30">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full aspect-[4/3] object-cover rounded-2xl"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                />
                
                {/* Analyzing Overlay */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                    <div className="loading-spinner" />
                    <span className="text-sm text-white/70">Initializing AI...</span>
                  </div>
                )}

                {/* Corner Frame */}
                <div className="absolute inset-4 border-2 border-aurora-cyan/30 rounded-xl pointer-events-none">
                  <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-2 border-l-2 border-aurora-cyan rounded-tl-lg" />
                  <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-2 border-r-2 border-aurora-cyan rounded-tr-lg" />
                  <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-2 border-l-2 border-aurora-cyan rounded-bl-lg" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-2 border-r-2 border-aurora-cyan rounded-br-lg" />
                </div>
              </div>

              {/* Current Mood Display */}
              {dominantExpression && (
                <div className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${currentMood.color} bg-opacity-20`}>
                  <span className="text-4xl">{currentMood.emoji}</span>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Detected Mood</p>
                    <p className="text-xl font-display font-bold">{currentMood.label}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Song Suggestions */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-semibold">
                {dominantExpression ? `Songs for ${currentMood.label} Mood` : 'Suggested for You'}
              </h2>
              {musicInfo.length > 0 && (
                <span className="text-sm text-white/40">{musicInfo.length} tracks</span>
              )}
            </div>

            {/* Song List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide">
              {musicInfo.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-aurora-cyan/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-aurora-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <p className="text-white/60">Position your face in the camera</p>
                  <p className="text-sm text-white/40 mt-2">We'll suggest songs based on your mood</p>
                </div>
              ) : (
                musicInfo.slice(0, 10).map((song, index) => (
                  <div
                    key={song.id}
                    className="song-item group"
                    onClick={() => play(song.id)}
                  >
                    <span className="song-item-number">{index + 1}</span>
                    <img
                      src={song.image.url}
                      alt={song.name}
                      className="song-item-image"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate group-hover:text-aurora-cyan transition-colors">
                        {song.name}
                      </h3>
                      <p className="text-sm text-white/40 truncate">
                        {song.artist} • {song.year}
                      </p>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-aurora-cyan/20 text-aurora-cyan flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-aurora-cyan hover:text-white">
                      <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Moodanalyse;
