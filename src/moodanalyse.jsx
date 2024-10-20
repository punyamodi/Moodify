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
        videoRef.current.muted = true; // Ensure muted for autoplay
        videoRef.current.play().catch(err => console.error("Error playing video:", err));
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models")
      ]);
      faceMyDetect();
    } catch (err) {
      console.error("Error loading models:", err);
    }
  };

  const faceMyDetect = async () => {
    try {
      setInterval(async () => {
        if (!videoRef.current || !canvasRef.current) return;

        // Detect faces, landmarks, and expressions
        const detections = await faceapi.detectAllFaces(videoRef.current,
          new faceapi.TinyFaceDetectorOptions({
            scoreThreshold: 0.3 // Set minimum confidence to 30%
          })
        ).withFaceLandmarks().withFaceExpressions();
        

        if (detections.length > 0) {
          const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };

          // Ensure canvas matches the video's size
          faceapi.matchDimensions(canvasRef.current, displaySize);

          const resizedDetections = faceapi.resizeResults(detections, displaySize);

          const context = canvasRef.current.getContext('2d');
          context.clearRect(0, 0, displaySize.width, displaySize.height);

          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

          const firstDetection = resizedDetections[0];
          if (firstDetection) {
            const expressions = firstDetection.expressions;
            const dominant = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
            setDominantExpression(dominant);
          }
        }
      }, 100); // Reduce the interval to 10ms for faster detection
    } catch (err) {
      console.error("Error detecting faces:", err);
    }
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
      intervalId = setInterval(fetchSong, 300);
    }
    return () => clearInterval(intervalId);
  }, [dominantExpression]);

  const play = async (id) => {
    localStorage.setItem("songid", id);
    setSongid(id);
  };

  return (
    <div className="bg-black text-white h-screen">
      {isAboveMedium ? (
        <div className="flex flex-col items-center">
          <h1 className="text-4xl text-green-500 mt-8 font-semibold">Let Your Mood Sing For You</h1>
          <div className="w-full flex mt-10">
            <div className="w-1/3 p-4 relative">
              <h1 className="text-2xl text-green-400 mb-4 font-semibold">Face Detection</h1>
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="rounded-2xl shadow-lg"
                  style={{ height: "600px", width: "800px", objectFit: "cover", borderRadius: '20px' }}
                />
                {/* Manually adjust canvas position using top, left, right, bottom */}
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 rounded-2xl"
                  style={{ height: "600px", width: "800px", zIndex: 10, borderRadius: '20px', top: '0', left: '-160px' }} 
                />
              </div>
            </div>
            <div className="w-2/3 pl-10">
              <h1 className="text-xl text-green-400 mb-4 font-semibold">Suggested Songs for Your Mood</h1>
              <div className="overflow-y-scroll h-full pr-4">
                {musicInfo.slice(0, 10).map((song, index) => (
                  <div
                    key={song.id}
                    className="flex items-center gap-4 bg-gray-800 p-4 mb-4 rounded-lg cursor-pointer hover:bg-gray-700 transition duration-300"
                    onClick={() => play(song.id)}
                  >
                    <h1 className="text-lg font-semibold">#{index + 1}</h1>
                    <img
                      src={song.image.url}
                      alt={song.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div className="flex-grow">
                      <h1 className="text-lg font-bold">{song.name}</h1>
                      <p className="text-gray-400">{song.artist} • {song.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="text-3xl text-green-500 mt-8 font-semibold">Let Your Mood Sing For You</h1>
          <div className="relative mt-6" style={{ width: '300px', height: '300px' }}>
            <h1 className="text-lg text-green-400 mb-2 font-semibold">Face Detection</h1>
            <video
              ref={videoRef}
              autoPlay
              muted
              className="absolute top-0 left-0 z-1 rounded-2xl shadow-lg"
              style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '20px' }}
            />
            {/* Canvas manually positioned */}
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 z-10 rounded-2xl"
              style={{ width: '300px', height: '300px', top: '0', left: '0' }}
            />
          </div>
          <div className="mt-8">
            {musicInfo.slice(0, 10).map((song, index) => (
              <div
                key={song.id}
                className="flex items-center gap-4 bg-gray-800 p-4 mb-4 rounded-lg cursor-pointer hover:bg-gray-700 transition duration-300"
                onClick={() => play(song.id)}
              >
                <h1 className="text-lg font-semibold">#{index + 1}</h1>
                <img
                  src={song.image.url}
                  alt={song.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="flex-grow">
                  <h1 className="text-lg font-bold">{song.name}</h1>
                  <p className="text-gray-400">{song.artist} • {song.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Moodanalyse;
