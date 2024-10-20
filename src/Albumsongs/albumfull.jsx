import useMediaQuery from "../useMedia";
import album from "../assets/albumfull.svg";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { Context } from "../main";
import he from "he";
import { Link } from "react-router-dom";
import { albumsongs } from "../saavnapi";

function AlbumFull({ names }) {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { setInneralbum, setSelected } = useContext(Context);
  const [limit, setLimit] = useState(5);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  const expandResults = () => {
    setLimit(musicInfo.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await albumsongs();

        setMusicInfo(
          res.data.data.results.map((song) => ({
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

  const play = async (id) => {
    localStorage.setItem("innerAlbum", id);
    setInneralbum(id);
    localStorage.setItem("selected", "/albums");
    setSelected("/albums");
  };

  return (
    <>
      {!loading ? (
        <>
          {isAboveMedium ? (
            <div className="h-screen w-5/6 m-12 mb-12 flex flex-col bg-black text-white rounded-lg shadow-lg overflow-y-auto" 
                 style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {/* Album Banner */}
              <div className="w-full h-64 flex bg-gradient-to-r from-purple-600 to-blue-500 rounded-t-lg p-4 shadow-2xl items-center">
                <img src={album} className="h-48 rounded-lg shadow-lg" alt="Album Art" />
                <h1 className="font-bold text-5xl p-5">Trending Songs <span className="text-green-400">Mix</span></h1>
              </div>

              {/* Song List */}
              {musicInfo.slice(0, limit).map((song, index) => (
                <Link to="/innerAlbum" key={song.id}>
                  <div
                    className="w-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 flex items-center gap-4 p-4 m-2 rounded-lg cursor-pointer shadow-md"
                    onClick={() => play(song.id)}
                  >
                    <h1 className="text-lg w-12 font-semibold">#{index + 1}</h1>
                    <img src={song.image.url} className="h-12 w-12 rounded-lg" alt={song.name} />
                    <div className="flex-grow">
                      <h1 className="text-xl font-bold">{song.name}</h1>
                      <p className="text-gray-400">{song.artist} • {song.year}</p>
                    </div>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/9376/9376391.png"
                      className="h-6 w-6"
                      alt="Play"
                    />
                  </div>
                </Link>
              ))}

              {/* View All / View Less Button */}
              <div className="flex justify-center mb-8">
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
            </div>
          ) : (
            <div className="h-screen w-full mb-24 flex flex-col bg-black text-white rounded-lg shadow-lg overflow-y-auto">
              <div className="w-full h-64 flex bg-gradient-to-r from-purple-600 to-blue-500 rounded-t-lg p-4 shadow-2xl items-center">
                <img src={album} className="h-48 rounded-lg shadow-lg" alt="Album Art" />
                <h1 className="font-bold text-4xl p-5">Trending Songs <span className="text-green-400">Mix</span></h1>
              </div>

              {musicInfo.slice(0, limit).map((song, index) => (
                <Link to="/innerAlbum" key={song.id}>
                  <div
                    className="w-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 flex items-center gap-4 p-4 m-2 rounded-lg cursor-pointer shadow-md"
                    onClick={() => play(song.id)}
                  >
                    <p className="text-sm w-full">#{index + 1}</p>
                    <img src={song.image.url} className="h-12 w-12 rounded-lg" alt={song.name} />
                    <div className="flex-grow">
                      <p className="text-sm font-bold">{song.name}</p>
                      <p className="text-gray-400">{song.artist} • {song.year}</p>
                    </div>
                  </div>
                </Link>
              ))}

              <div className="flex justify-center mb-8">
                {musicInfo.length > 5 && limit === 5 ? (
                  <button
                    onClick={expandResults}
                    className="bg-green-500 text-black rounded-full px-4 py-2 hover:bg-green-600 transition-all duration-300"
                  >
                    View All
                  </button>
                ) : (
                  <button
                    onClick={() => setLimit(5)}
                    className="bg-green-500 text-black rounded-full px-4 py-2 hover:bg-green-600 transition-all duration-300"
                  >
                    View Less
                  </button>
                )}
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

export default AlbumFull;
