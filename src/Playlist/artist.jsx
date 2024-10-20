import axios from "axios";
import viewall from "../assets/viewall.svg";
import viewclose from "../assets/viewclose.svg";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { artist } from "../saavnapi";
import { Link } from "react-router-dom";

function Artist({ names }) {
  const { setSinger, setSelected } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [limit, setLimit] = useState(5);
  const isAboveMedium = useMediaQuery("(min-width: 1025px)");
  const [loading, setLoading] = useState(true);

  // Function to handle expanding to show more results
  const expandResults = () => {
    setLimit(musicInfo.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await artist(); // Assuming artist() is a function that fetches artist data

        if (res.data && res.data.data && res.data.data.results) {
          setMusicInfo(
            res.data.data.results.map((song) => ({
              id: song.id,
              name: song.name,
              image: song.image[1].url, // Adjust accordingly if image structure varies
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

  const play = (id) => {
    localStorage.setItem("singer", id);
    setSinger(id);

    localStorage.setItem("selected", "/");
    setSelected("/");
  };

  return (
    <>
      {!loading ? (
        <div>
          {isAboveMedium ? (
            <div className="flex p-4 flex-wrap gap-6 mb-4 cursor-pointer">
              {musicInfo.slice(0, limit).map((song) => (
                <Link to="/innerartist" key={song.id}>
                  <div
                    className="bg-gray-800 text-white rounded-lg p-4 hover:bg-gray-700 transition duration-200"
                    onClick={() => play(song.id)}
                  >
                    {song.image ? (
                      <img
                        src={song.image}
                        alt={song.name}
                        className="h-48 w-48 object-cover rounded-full mb-4"
                      />
                    ) : (
                      <div className="h-48 w-48 flex items-center justify-center bg-gray-200 text-gray-400 rounded-full">
                        Image Not Available
                      </div>
                    )}
                    <h1 className="text-center font-bold">{song.name}</h1>
                  </div>
                </Link>
              ))}
              {musicInfo.length > 5 && limit === 5 ? (
                <button onClick={expandResults} className="text-green-500 font-bold mt-4">
                  <img src={viewall} alt="View All" className="mb-2" />
                  View All
                </button>
              ) : (
                <button onClick={() => setLimit(5)} className="text-green-500 font-bold mt-4">
                  <img src={viewclose} alt="Close" className="mb-2" />
                  Close
                </button>
              )}
            </div>
          ) : (
            <div className="flex p-4 overflow-x-scroll space-x-4">
              {musicInfo.map((song) => (
                <Link to="/innerartist" key={song.id}>
                  <div
                    className="flex flex-col items-center pb-4 cursor-pointer"
                    onClick={() => play(song.id)}
                  >
                    <div className="h-28 w-28 bg-gray-800 text-white rounded-full flex items-center justify-center">
                      {song.image ? (
                        <img
                          src={song.image}
                          alt={song.name}
                          className="h-24 w-24 object-cover rounded-full"
                        />
                      ) : (
                        <div className="h-24 w-24 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center">
                          Image Not Available
                        </div>
                      )}
                    </div>
                    <p className="text-center font-bold text-white text-sm truncate mt-2">
                      {song.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <span className="text-green-500 text-3xl font-bold">Loading.....</span>
      )}
    </>
  );
}

export default Artist;
