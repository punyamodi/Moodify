import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { MelodyMusicsongs } from "../saavnapi";
import he from "he";

function Trending({ names }) {
  const { setSongid } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [limit, setLimit] = useState(5);
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const [loading, setLoading] = useState(true);

  // Function to handle expanding to show more results
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

  return (
    <>
      {!loading ? (
        <>
          {isAboveMedium ? (
            <div className="h-full flex flex-col bg-black text-white p-4">
              {musicInfo.slice(0, limit).map((song, index) => (
                <div
                  className="flex items-center gap-4 p-4 mb-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition duration-200"
                  key={song.id}
                  onClick={() => play(song.id)}
                >
                  <h1 className="text-xl w-12 font-bold">#{index + 1}</h1>
                  <img src={song.image.url} className="h-12 w-12 rounded-md" alt={song.name} />
                  <div className="flex-grow">
                    <h1 className="text-md font-bold">{song.name}</h1>
                    <p className="text-gray-400">{song.album} • {song.year}</p>
                  </div>
                  <h1 className="text-md">{song.duration}</h1>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/9376/9376391.png"
                    className="h-8"
                    alt="options"
                  />
                </div>
              ))}

              <div className="flex justify-center">
                {musicInfo.length > 5 && limit === 5 ? (
                  <button
                    onClick={expandResults}
                    className="bg-green-500 text-white w-32 h-10 rounded-md hover:bg-green-600 transition duration-200"
                  >
                    View All
                  </button>
                ) : (
                  <button
                    onClick={() => setLimit(5)}
                    className="bg-green-500 text-white w-32 h-10 rounded-md hover:bg-green-600 transition duration-200"
                  >
                    View Less
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 p-4 bg-black text-white">
              {musicInfo.slice(0, musicInfo.length).map((song) => (
                <div
                  className="flex items-center cursor-pointer"
                  key={song.id}
                  onClick={() => play(song.id)}
                >
                  <div className="h-24 w-24 bg-gray-800 rounded-md">
                    <img
                      src={song.image.url}
                      alt={song.title}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <span className="text-green-500 text-3xl font-bold">Loading...</span>
      )}
    </>
  );
}

export default Trending;
