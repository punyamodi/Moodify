import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { albumsongs } from "../saavnapi";
import viewall from "../assets/viewall.svg";
import viewclose from "../assets/viewclose.svg";
import he from "he";

function Albums() {
  const { setInneralbum, setSelected } = useContext(Context);
  const [limit, setLimit] = useState(5);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const isAboveMedium = useMediaQuery("(min-width:1025px)");

  // Function to handle expanding to show more results
  const expandResults = () => {
    setLimit(musicInfo.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await albumsongs();
        setMusicInfo(
          res.data.data.results.map((song) => ({
            id: song.id,
            name: he.decode(song.name),
            artist: song.artists.primary[0].name,
            image: song.image[1].url,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const play = (id) => {
    localStorage.setItem("innerAlbum", id);
    setInneralbum(id);
    localStorage.setItem("selected", "/albums");
    setSelected("/albums");
  };

  return (
    <>
      {!loading ? (
        isAboveMedium ? (
          <div className="flex p-6 gap-5 mb-8 flex-wrap">
            {musicInfo.slice(0, limit).map((song) => (
              <Link to="/innerAlbum" key={song.id}>
                <div
                  className="relative h-72 w-56 bg-deep-grey text-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  onClick={() => play(song.id)}
                >
                  <img
                    src={song.image}
                    alt={song.name}
                    className="h-48 w-full object-cover rounded-t-lg"
                  />
                  <h1 className="text-center text-xl font-bold mt-4 px-2 truncate">
                    {song.name}
                  </h1>
                </div>
              </Link>
            ))}
            {/* View All or Close Button */}
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
                onClick={expandResults}
                className="flex flex-col items-center justify-center text-white font-bold"
              >
                <img src={viewall} alt="View All" className="mb-2" />
                <h1 className="text-green-500">View All</h1>
              </button>
            )}
          </div>
        ) : (
          <div className="flex p-4 overflow-x-scroll gap-4">
            {musicInfo.map((song) => (
              <Link to="/innerAlbum" key={song.id}>
                <div
                  className="flex flex-col items-center pb-4"
                  onClick={() => play(song.id)}
                >
                  <div className="h-32 w-32 bg-deep-grey rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                    <img
                      src={song.image}
                      alt={song.name}
                      className="h-28 w-28 mb-2 object-cover rounded-md"
                    />
                    <p className="text-center text-sm font-bold text-white truncate">
                      {song.name}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      ) : (
        <span className="text-red-500 text-3xl font-bold">Loading.....</span>
      )}
    </>
  );
}

export default Albums;
