import axios from "axios";
import viewall from "../assets/viewall.svg";
import viewclose from "../assets/viewclose.svg";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { MelodyMusicsongs } from "../saavnapi";
import he from "he";
import { addRecents } from "../Firebase/database";

function Topsongs({ names }) {
  const { setSongid } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [limit, setLimit] = useState(5);
  const isAboveMedium = useMediaQuery("(min-width: 1025px)");
  const [loading, setLoading] = useState(true);
  const { Viewall, page } = useContext(Context);

  // Function to handle expanding to show more results
  const expandResults = () => {
    setLimit(musicInfo.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await MelodyMusicsongs(names);

        if (res) {
          setMusicInfo(
            res.map((song) => ({
              id: song.id,
              name: he.decode(song.name),
              image: song.image[1].url, // Assuming image is an array and you need the second element
            }))
          );
        }
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
        console.log(error);
      }
    }
  };

  return (
    <>
      {!loading ? (
        <>
          {isAboveMedium ? (
            <div className="flex flex-wrap gap-6 p-4 bg-black text-white">
              {musicInfo.slice(0, limit).map((song) => (
                <div
                  className="w-56 h-68 bg-gray-800 p-4 rounded-lg hover:scale-105 transform transition-all duration-200 cursor-pointer"
                  key={song.id}
                  onClick={() => play(song.id, song.name, song.image)}
                >
                  <img
                    src={song.image}
                    alt={song.name}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <h1 className="text-center font-bold text-white truncate">
                    {song.name}
                  </h1>
                </div>
              ))}
              {musicInfo.length > 5 && limit === 5 ? (
                <button
                  onClick={expandResults}
                  className="flex flex-col items-center justify-center text-white font-bold"
                >
                  <img src={viewall} alt="View All" className="mb-2" />
                  <h1 className="text-green-500">View All</h1>
                </button>
              ) : (
                <button
                  onClick={() => setLimit(5)}
                  className="flex flex-col items-center justify-center text-white font-bold"
                >
                  <img src={viewclose} alt="Close" className="mb-2" />
                  <h1 className="text-green-500">Close</h1>
                </button>
              )}
            </div>
          ) : (
            <div className="flex overflow-x-scroll overflow-y-hidden space-x-4 p-2 bg-black">
              {musicInfo.map((song) => (
                <div
                  className="flex flex-col items-center pb-6 cursor-pointer"
                  key={song.id}
                  onClick={() => play(song.id, song.name, song.image)}
                >
                  <div className="h-28 w-28 bg-gray-800 p-2 rounded-lg hover:scale-105 transform transition-all duration-200">
                    <img
                      src={song.image}
                      alt={song.name}
                      className="h-24 w-24 object-cover rounded-lg mb-2"
                    />
                    <h1 className="text-center font-bold text-white text-sm truncate">
                      {song.name}
                    </h1>
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

export default Topsongs;
