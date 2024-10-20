import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { MelodyMusicsongs } from "../saavnapi";
import he from "he";
import { addRecents } from "../Firebase/database";

function Newreleasemobile({ names }) {
  const { setSongid, Viewall, page } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await MelodyMusicsongs(names);
        if (res) {
          setMusicInfo(
            res.map((song) => ({
              id: song.id,
              name: he.decode(song.name),
              image: song.image[1],
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
    <div className="flex overflow-x-scroll overflow-y-hidden space-x-2 p-4 bg-black">
      {!loading ? (
        musicInfo.map((song) => (
          <div
            className="flex flex-col items-center pb-6 cursor-pointer"
            key={song.id}
            onClick={() => play(song.id, song.name, song.image.url)}
          >
            <div className="h-28 w-28 bg-gray-800 p-2 rounded-lg hover:scale-105 transform transition-all duration-200">
              <img
                src={song.image.url}
                alt={song.title}
                className="h-24 w-24 mb-2 object-cover rounded-lg"
              />
              <p className="text-center font-bold text-white text-sm truncate">
                {song.name}
              </p>
            </div>
          </div>
        ))
      ) : (
        <span className="text-green-500 text-2xl font-bold">Loading...</span>
      )}
    </div>
  );
}

export default Newreleasemobile;
