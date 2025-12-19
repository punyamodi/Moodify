import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { MelodyMusicsongs } from "../saavnapi";
import he from "he";
import { addRecents } from "../Firebase/database";

function Newreleasemobile({ names }) {
  const { setSongid } = useContext(Context);
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

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-36">
            <div className="skeleton aspect-square mb-3 rounded-2xl" />
            <div className="skeleton h-4 w-3/4 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2">
      {musicInfo.map((song) => (
        <div
          key={song.id}
          className="flex-shrink-0 w-36 music-card"
          onClick={() => play(song.id, song.name, song.image?.url || song.image)}
        >
          <div className="relative overflow-hidden rounded-xl mb-3">
            <img
              src={song.image?.url || song.image}
              alt={song.name}
              className="w-full aspect-square object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-space/80 via-transparent to-transparent" />
            <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-aurora-cyan/80 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-white truncate">{song.name}</h3>
        </div>
      ))}
    </div>
  );
}

export default Newreleasemobile;
