import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import { MelodyMusicsongs } from "../saavnapi";
import he from "he";
import { addRecents } from '../Firebase/database';

function Trendingmobile({ names }) {
  const { setSongid } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const { page } = useContext(Context);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await MelodyMusicsongs(names);
        if (res) {
          setMusicInfo(
            res.map((song) => ({
              id: song.id,
              name: he.decode(song.name),
              image: song.image[1].url, // Assuming `song.image` is an object with a `url` property
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
    <div className="flex p-4 gap-4 overflow-x-scroll space-x-4 bg-black">
      {!loading ? (
        <>
          {musicInfo.map((song) => (
            <div
              className="flex flex-col items-center cursor-pointer"
              key={song.id}
              onClick={() => play(song.id, song.name, song.image)}
            >
              <div className="h-28 w-28 p-2 bg-gray-800 rounded-lg hover:scale-105 transform transition-all duration-200">
                <img
                  src={song.image}
                  alt={song.name}
                  className="h-24 w-24 object-cover mb-2 rounded-lg"
                />
                <p className="text-center font-bold text-white text-sm truncate">
                  {song.name}
                </p>
              </div>
            </div>
          ))}
        </>
      ) : (
        <span className="text-green-500 text-2xl font-bold">Loading...</span>
      )}
    </div>
  );
}

export default Trendingmobile;
