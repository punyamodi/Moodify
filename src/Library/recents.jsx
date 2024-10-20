import { fetchHistory, deleteRecents } from "../Firebase/database";
import useMediaQuery from "../useMedia";
import { useEffect, useState, useContext } from "react";
import { Context } from "../main";

function Recents() {
  const [likes, setLikes] = useState([]);
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { setSongid } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const localUser = JSON.parse(localStorage.getItem("Users"));

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        let res = await fetchHistory();

        // If the number of items exceeds 100, delete the oldest item
        if (res.length > 100) {
          res = res.sort((a, b) => a.timestamp - b.timestamp);
          const oldestSong = res[0]; // Get the oldest song

          // Delete the oldest song from the database
          await deleteRecents(oldestSong.id);

          // Remove the oldest song from the local array
          res = res.slice(1);
        }

        // Sort the remaining items in descending order (newest first) for display
        res = res.sort((a, b) => b.timestamp - a.timestamp);

        // Update the state with the sorted list
        setLikes(res);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching or deleting likes:', error);
        setLoading(false);
      }
    };

    fetchLikes();
  }, []); // Empty dependency array ensures this runs once on mount

  const play = (id) => {
    localStorage.setItem("songid", id);
    setSongid(id);
  };

  const deleteRecent = async (id) => {
    try {
      await deleteRecents(id);
      // Update the likes state after deletion
      setLikes(likes.filter((song) => song.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {!loading ? (
        <>
          {localUser ? (
            <>
              {isAboveMedium ? (
                <div
                  className="h-screen w-5/6 m-12 mb-12 flex flex-col bg-black text-white shadow-lg overflow-y-scroll scrollbar-hide"
                >
                  <div className="w-full h-64 bg-gradient-to-b from-green-500 to-black flex items-center p-4">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/7462/7462205.png"
                      alt="Recents"
                      className="h-48 w-48 rounded-lg shadow-md"
                    />
                    <div className="ml-5">
                      <h1 className="font-bold text-5xl">Recent Songs</h1>
                    </div>
                  </div>

                  <div className="flex flex-col p-6">
                    {likes.map((song, index) => (
                      <div
                        className="flex items-center gap-8 py-4 hover:bg-gray-800 rounded-lg cursor-pointer transition duration-200"
                        key={song.id}
                      >
                        <span className="text-xl w-12">#{index + 1}</span>
                        <img
                          src={song.songUrl}
                          className="h-12 w-12 rounded-lg object-cover"
                          alt={song.songName}
                          onClick={() => play(song.songId)}
                        />
                        <div className="flex flex-grow justify-between">
                          <h1 className="text-md font-bold">{song.songName}</h1>
                        </div>
                        <button
                          className="text-red-500 text-xl cursor-pointer"
                          onClick={() => deleteRecent(song.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="h-24"></div>
                </div>
              ) : (
                <div
                  className="h-screen w-full mb-24 flex flex-col bg-black text-white shadow-lg overflow-y-scroll scrollbar-hide"
                >
                  <div className="w-full h-64 bg-gradient-to-b from-green-500 to-black flex items-center p-4">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/7462/7462205.png"
                      alt="Recents"
                      className="h-48 w-48 rounded-lg shadow-md"
                    />
                    <div className="ml-5">
                      <h1 className="font-bold text-4xl">Recent Songs</h1>
                    </div>
                  </div>

                  <div className="flex flex-col p-6">
                    {likes.map((song, index) => (
                      <div
                        className="flex items-center gap-8 py-4 hover:bg-gray-800 rounded-lg cursor-pointer transition duration-200"
                        key={song.id}
                      >
                        <span className="text-sm w-8">#{index + 1}</span>
                        <img
                          src={song.songUrl}
                          className="h-12 w-12 rounded-lg object-cover"
                          alt={song.songName}
                          onClick={() => play(song.songId)}
                        />
                        <div className="flex flex-grow justify-between">
                          <h1 className="text-sm font-bold">{song.songName}</h1>
                        </div>
                        <button
                          className="text-red-500 text-lg cursor-pointer"
                          onClick={() => deleteRecent(song.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="h-24"></div>
                </div>
              )}
            </>
          ) : (
            <h1 className="text-green-500 text-3xl font-bold text-center mt-10">
              Login to view your Recents
            </h1>
          )}
        </>
      ) : (
        <span className="text-green-500 text-3xl font-bold">Loading...</span>
      )}
    </>
  );
}

export default Recents;
