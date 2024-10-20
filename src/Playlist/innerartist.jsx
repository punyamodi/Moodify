import useMediaQuery from "../useMedia";
import { useEffect, useState, useContext } from "react";
import he from "he";
import { artistSongs } from "../saavnapi";
import { Link } from "react-router-dom";
import { addRecents } from "../Firebase/database";
import { Context } from "../main";

function Innerartist({ names }) {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { setSongid, singer, setInneralbum, setSelected } = useContext(Context);
  const [image, setImage] = useState({});
  const [albuminfo, setAlbuminfo] = useState([]);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await artistSongs(singer);
        setImage(res.data.data);

        setMusicInfo(
          res.data.data.topSongs.map((song) => ({
            id: song.id,
            name: he.decode(song.name),
            image: song.image[1].url,
            artist: song.artists.primary[0].name,
            year: song.year,
          }))
        );
        setAlbuminfo(
          res.data.data.topAlbums.map((album) => ({
            aid: album.id,
            aname: he.decode(album.name),
            aimage: album.image[1].url,
            aartist: album.artists.primary[0].name,
            ayear: album.year,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [singer]);

  const play = async (id, name, image) => {
    localStorage.setItem("songid", id);
    setSongid(id);
    const user = JSON.parse(localStorage.getItem("Users"));

    if (user) {
      try {
        await addRecents(user.uid, id, name, image);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const plays = (id) => {
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
            <div className="h-screen w-5/6 m-12 mb-28 flex flex-col bg-black text-white overflow-y-scroll scrollbar-hide">
              <div className="w-full h-64 bg-gradient-to-b from-green-500 to-black flex p-4 items-center">
                <img
                  src={image.image[1].url}
                  alt={image.name}
                  className="h-48 w-48 rounded-full mr-6"
                />
                <h1 className="font-bold text-5xl">{image.name}</h1>
              </div>

              <div className="p-6">
                <h2 className="text-3xl mb-4 font-bold">Top Songs</h2>
                {musicInfo.map((song, index) => (
                  <div
                    className="flex items-center gap-8 py-4 bg-gray-800 rounded-lg mb-4 hover:bg-gray-700 cursor-pointer transition duration-200"
                    key={song.id}
                    onClick={() => play(song.id, song.name, song.image)}
                  >
                    <span className="text-xl w-12">#{index + 1}</span>
                    <img src={song.image} alt={song.name} className="h-12 w-12 rounded-lg" />
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold">{song.name}</h3>
                      <p className="text-gray-400">{song.year}</p>
                    </div>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/9376/9376391.png"
                      alt="options"
                      className="h-8"
                    />
                  </div>
                ))}

                <h2 className="text-3xl mt-6 mb-4 font-bold">Top Albums</h2>
                {albuminfo.map((album, index) => (
                  <Link to="/innerAlbum" key={album.aid}>
                    <div
                      className="flex items-center gap-8 py-4 bg-gray-800 rounded-lg mb-4 hover:bg-gray-700 cursor-pointer transition duration-200"
                      onClick={() => plays(album.aid)}
                    >
                      <span className="text-xl w-12">#{index + 1}</span>
                      <img
                        src={album.aimage}
                        alt={album.aname}
                        className="h-12 w-12 rounded-lg"
                      />
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold">{album.aname}</h3>
                        <p className="text-gray-400">{album.ayear}</p>
                      </div>
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/9376/9376391.png"
                        alt="options"
                        className="h-8"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-screen w-full mb-24 flex flex-col bg-black text-white overflow-y-scroll scrollbar-hide">
              <div className="w-full h-64 bg-gradient-to-b from-green-500 to-black flex p-4 items-center">
                <img
                  src={image.image[1].url}
                  alt={image.name}
                  className="h-48 w-48 rounded-full mr-6"
                />
                <h1 className="font-bold text-4xl">{image.name}</h1>
              </div>

              <div className="p-6">
                <h2 className="text-2xl mb-4 font-bold">Top Songs</h2>
                {musicInfo.map((song, index) => (
                  <div
                    className="flex items-center gap-8 py-4 bg-gray-800 rounded-lg mb-4 hover:bg-gray-700 cursor-pointer transition duration-200"
                    key={song.id}
                    onClick={() => play(song.id, song.name, song.image)}
                  >
                    <span className="text-sm w-12">#{index + 1}</span>
                    <img src={song.image} alt={song.name} className="h-12 w-12 rounded-lg" />
                    <div className="flex-grow">
                      <h3 className="text-md font-bold">{song.name}</h3>
                      <p className="text-gray-400">{song.year}</p>
                    </div>
                  </div>
                ))}

                <h2 className="text-2xl mt-6 mb-4 font-bold">Top Albums</h2>
                {albuminfo.map((album, index) => (
                  <Link to="/innerAlbum" key={album.aid}>
                    <div
                      className="flex items-center gap-8 py-4 bg-gray-800 rounded-lg mb-4 hover:bg-gray-700 cursor-pointer transition duration-200"
                      onClick={() => plays(album.aid)}
                    >
                      <span className="text-sm w-12">#{index + 1}</span>
                      <img
                        src={album.aimage}
                        alt={album.aname}
                        className="h-12 w-12 rounded-lg"
                      />
                      <div className="flex-grow">
                        <h3 className="text-md font-bold">{album.aname}</h3>
                        <p className="text-gray-400">{album.ayear}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <span className="text-green-500 text-3xl font-bold">Loading...</span>
      )}
    </>
  );
}

export default Innerartist;
