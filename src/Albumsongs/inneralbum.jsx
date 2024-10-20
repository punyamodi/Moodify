import useMediaQuery from "../useMedia";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { Context } from "../main";
import { addRecents } from "../Firebase/database";
import he from "he";
import { albumsongsinner } from "../saavnapi";

function Inneralbum({ names }) {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { setSongid, innerAlbum } = useContext(Context);
  const [image, setImage] = useState({});
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await albumsongsinner(innerAlbum);
        setImage(res.data.data);

        setMusicInfo(
          res.data.data.songs.map((song) => ({
            id: song.id,
            name: he.decode(song.name),
            image: song.image[1],
            artist: song.artists.primary[0].name,
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
            <div
              className="h-screen w-5/6 mx-auto mt-12 mb-28 flex flex-col bg-gradient-to-b from-black via-gray-900 to-black border-1 border-gray-800 shadow-lg overflow-y-auto"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {/* Album Header */}
              <div className="w-full h-72 flex items-center p-6 bg-gradient-to-b from-gray-800 to-gray-600 border-b border-gray-700 shadow-lg">
                <img
                  src={image.image ? image.image[1].url : ""}
                  alt={image.name}
                  className="h-64 w-64 object-cover rounded-lg shadow-md"
                />
                <div className="ml-8">
                  <h1 className="font-bold text-5xl text-white">{image.name}</h1>
                  <p className="text-lg text-gray-400 mt-2">
                    {image.language ? image.language.toUpperCase() : ""}
                  </p>
                </div>
              </div>

              {/* Songs List */}
              <div className="p-8">
                {musicInfo.map((song, index) => (
                  <div
                    className="flex items-center gap-8 bg-gray-800 hover:bg-gray-700 p-4 mb-4 rounded-lg cursor-pointer transition duration-300 ease-in-out shadow-lg"
                    key={song.id}
                    onClick={() => play(song.id, song.name, song.image.url)}
                  >
                    <h1 className="text-2xl text-white font-semibold w-16 text-center">#{index + 1}</h1>
                    <img
                      src={song.image.url}
                      alt={song.name}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                    <div className="flex-grow">
                      <h1 className="text-xl text-white font-bold">{song.name}</h1>
                      <p className="text-gray-400">{song.artist}</p>
                    </div>
                    <p className="text-gray-400">{song.year}</p>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/9376/9376391.png"
                      className="h-8"
                      alt="play icon"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="h-screen w-full mx-auto mt-12 mb-24 flex flex-col bg-gradient-to-b from-black via-gray-900 to-black border-1 border-gray-800 shadow-lg overflow-y-auto"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {/* Album Header for Mobile */}
              <div className="w-full h-48 flex items-center p-4 bg-gradient-to-b from-gray-800 to-gray-600 border-b border-gray-700 shadow-lg">
                <img
                  src={image.image ? image.image[1].url : ""}
                  alt={image.name}
                  className="h-32 w-32 object-cover rounded-lg shadow-md"
                />
                <div className="ml-4">
                  <h1 className="font-bold text-3xl text-white">{image.name}</h1>
                  <p className="text-md text-gray-400 mt-1">
                    {image.language ? image.language.toUpperCase() : ""}
                  </p>
                </div>
              </div>

              {/* Songs List for Mobile */}
              <div className="p-4">
                {musicInfo.map((song, index) => (
                  <div
                    className="flex items-center gap-4 bg-gray-800 hover:bg-gray-700 p-3 mb-3 rounded-lg cursor-pointer transition duration-300 ease-in-out shadow-lg"
                    key={song.id}
                    onClick={() => play(song.id, song.name, song.image.url)}
                  >
                    <p className="text-lg text-white font-semibold w-12 text-center">#{index + 1}</p>
                    <img
                      src={song.image.url}
                      alt={song.name}
                      className="h-12 w-12 object-cover rounded-md"
                    />
                    <div className="flex-grow">
                      <p className="text-md text-white font-bold">{song.name}</p>
                      <p className="text-gray-400">{song.artist}</p>
                    </div>
                    <p className="text-gray-400 text-sm">{song.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <span className="text-red-500 text-3xl font-bold">Loading.....</span>
      )}
    </>
  );
}

export default Inneralbum;
