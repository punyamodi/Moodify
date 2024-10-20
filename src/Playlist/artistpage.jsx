import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { artist } from "../saavnapi";
import Home from "../Home/home";
import { Link } from "react-router-dom";

function ArtistPage({ names }) {
  const { setSinger, setSelected } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAboveMedium = useMediaQuery("(min-width:768px)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await artist();

        setMusicInfo(
          res.data.data.results.map((song) => ({
            id: song.id,
            name: song.name,
            image: song.image[1],
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
    localStorage.setItem("singer", id);
    setSinger(id);
    localStorage.setItem("selected", "/artist");
    setSelected("/artist");
  };

  return (
    <>
      {isAboveMedium ? (
        <div className="overflow-y-auto h-screen w-screen mb-12 bg-black text-white">
          <div className="flex p-4 gap-5 mb-12 cursor-pointer flex-wrap justify-center">
            {!loading ? (
              <>
                {musicInfo.map((song) => (
                  <Link to="/innerartist" key={song.id}>
                    <div
                      className="h-68 w-56 bg-gray-800 rounded-lg p-4 mt-5 hover:bg-gray-700 transition duration-200"
                      onClick={() => play(song.id)}
                    >
                      <img
                        src={song.image.url}
                        alt={song.name}
                        className="h-48 w-48 object-cover rounded-full mb-4 mx-auto"
                      />
                      <h1 className="text-center font-bold text-white">
                        {song.name}
                      </h1>
                    </div>
                  </Link>
                ))}
              </>
            ) : (
              <span className="text-green-500 text-3xl font-bold">Loading...</span>
            )}
          </div>
        </div>
      ) : (
        <Home />
      )}
    </>
  );
}

export default ArtistPage;
