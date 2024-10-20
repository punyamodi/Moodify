import React, { useContext, useState, useEffect } from "react";
import { addRecents } from "../Firebase/database";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { Searchsongs, Searchsongs2 } from "../saavnapi";
import he from "he";
import { Link, useNavigate } from "react-router-dom";

function Result({ names }) {
  const { setSongid, setSelected, setSinger, setInneralbum } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [albuminfo, setAlbuminfo] = useState([]);
  const [artistinfo, setArtistinfo] = useState([]);
  const [topquery, setTopquery] = useState([]);
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Searchsongs(names);
        const res2 = await Searchsongs2(names);

        setMusicInfo(
          res2.results.map((song) => ({
            id: song.id,
            name: he.decode(song.name),
            image: song.image[1].url,
          }))
        );

        setAlbuminfo(
          res.albums.results.map((album) => ({
            id: album.id,
            name: he.decode(album.title),
            image: album.image[1].url,
          }))
        );

        setArtistinfo(
          res.artists.results.map((artist) => ({
            id: artist.id,
            name: he.decode(artist.title),
            image: artist.image[1].url,
          }))
        );

        setTopquery(
          res.topQuery.results.map((query) => ({
            id: query.id,
            name: he.decode(query.title),
            image: query.image[1].url,
            type: query.type,
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
        console.error(error);
      }
    }
  };

  const playsinger = (id) => {
    localStorage.setItem("singer", id);
    setSinger(id);

    localStorage.setItem("selected", "/artist");
    setSelected("/artist");
  };

  const playalbum = (id) => {
    localStorage.setItem("innerAlbum", id);
    setInneralbum(id);

    localStorage.setItem("selected", "/albums");
    setSelected("/albums");
  };

  const playquery = async (id, type) => {
    switch (type) {
      case "album":
        playalbum(id);
        Navigate("/innerAlbum");
        break;
      case "artist":
        playsinger(id);
        Navigate("/innerartist");
        break;
      case "song":
        play(id);
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-4 gap-5 mb-12 cursor-pointer">
      {!loading ? (
        <>
          {isAboveMedium ? (
            <>
              {/* Top Songs Section */}
              <h1 className="text-2xl p-2 m-2 text-white font-semibold">
                Top <span className="text-green-500">Songs</span>
              </h1>
              <div className="grid grid-cols-4 gap-6">
                {musicInfo.slice(0, 20).map((song) => (
                  <div
                    className="bg-gray-900 hover:bg-gray-800 transition duration-300 p-4 rounded-md"
                    key={song.id}
                    onClick={() => play(song.id, song.name, song.image)}
                  >
                    <img
                      src={song.image}
                      alt={song.name}
                      className="h-48 w-full object-cover rounded-md mb-4"
                    />
                    <h1 className="text-center text-white font-semibold truncate">{song.name}</h1>
                  </div>
                ))}
              </div>

              {/* Top Albums Section */}
              <h1 className="text-2xl p-2 m-2 text-white font-semibold">
                Top <span className="text-green-500">Albums</span>
              </h1>
              <div className="grid grid-cols-4 gap-6">
                {albuminfo.map((album) => (
                  <Link to="/innerAlbum" key={album.id}>
                    <div
                      className="bg-gray-900 hover:bg-gray-800 transition duration-300 p-4 rounded-md"
                      onClick={() => playalbum(album.id)}
                    >
                      <img
                        src={album.image}
                        alt={album.name}
                        className="h-48 w-full object-cover rounded-md mb-4"
                      />
                      <h1 className="text-center text-white font-semibold truncate">{album.name}</h1>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Top Artists Section */}
              <h1 className="text-2xl p-2 m-2 text-white font-semibold">
                Top <span className="text-green-500">Artists</span>
              </h1>
              <div className="grid grid-cols-4 gap-6">
                {artistinfo.map((artist) => (
                  <Link to="/innerartist" key={artist.id}>
                    <div
                      className="bg-gray-900 hover:bg-gray-800 transition duration-300 p-4 rounded-md"
                      onClick={() => playsinger(artist.id)}
                    >
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="h-48 w-full object-cover rounded-full mb-4"
                      />
                      <h1 className="text-center text-white font-semibold truncate">{artist.name}</h1>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Top Queries Section */}
              <h1 className="text-2xl p-2 m-2 text-white font-semibold">
                Top <span className="text-green-500">Queries</span>
              </h1>
              <div className="grid grid-cols-4 gap-6">
                {topquery.map((query) => (
                  <div
                    className="bg-gray-900 hover:bg-gray-800 transition duration-300 p-4 rounded-md"
                    key={query.id}
                    onClick={() => playquery(query.id, query.type)}
                  >
                    <img
                      src={query.image}
                      alt={query.name}
                      className="h-48 w-full object-cover rounded-md mb-4"
                    />
                    <h1 className="text-center text-white font-semibold truncate">{query.name}</h1>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Mobile View */}
              <h1 className="text-2xl p-2 m-2 text-white font-semibold">
                Top <span className="text-green-500">Songs</span>
              </h1>
              <div className="flex overflow-x-scroll space-x-4 p-2">
                {musicInfo.slice(0, 20).map((song) => (
                  <div
                    className="h-28 p-2 bg-gray-900 w-28 text-white rounded-md hover:bg-gray-800 transition duration-200"
                    key={song.id}
                    onClick={() => play(song.id, song.name, song.image)}
                  >
                    <img
                      src={song.image}
                      alt={song.name}
                      className="h-24 w-24 object-cover rounded-md mb-2"
                    />
                    <h1 className="text-center text-sm truncate font-semibold">{song.name}</h1>
                  </div>
                ))}
              </div>

              {/* Top Albums Section */}
              <h1 className="text-2xl p-2 m-2 text-white font-semibold">
                Top <span className="text-green-500">Albums</span>
              </h1>
              <div className="flex overflow-x-scroll space-x-4 p-2">
                {albuminfo.slice(0, 10).map((album) => (
                  <Link to="/innerAlbum" key={album.id}>
                    <div
                      className="h-28 p-2 bg-gray-900 w-28 text-white rounded-md hover:bg-gray-800 transition duration-200"
                      onClick={() => playalbum(album.id)}
                    >
                      <img
                        src={album.image}
                        alt={album.name}
                        className="h-24 w-24 object-cover rounded-md mb-2"
                      />
                      <h1 className="text-center text-sm truncate font-semibold">{album.name}</h1>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Top Artists Section */}
              <h1 className="text-2xl p-2 m-2 text-white font-semibold">
                Top <span className="text-green-500">Artists</span>
              </h1>
              <div className="flex overflow-x-scroll space-x-4 p-2">
                {artistinfo.slice(0, 10).map((artist) => (
                  <Link to="/innerartist" key={artist.id}>
                    <div
                      className="h-28 p-2 bg-gray-900 w-28 text-white rounded-md hover:bg-gray-800 transition duration-200"
                      onClick={() => playsinger(artist.id)}
                    >
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="h-24 w-24 object-cover rounded-full mb-2"
                      />
                      <h1 className="text-center text-sm truncate font-semibold">{artist.name}</h1>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Top Queries Section */}
              <h1 className="text-2xl p-2 m-2 text-white font-semibold">
                Top <span className="text-green-500">Queries</span>
              </h1>
              <div className="flex overflow-x-scroll space-x-4 p-2">
                {topquery.slice(0, 10).map((query) => (
                  <div
                    className="h-28 p-2 bg-gray-900 w-28 text-white rounded-md hover:bg-gray-800 transition duration-200"
                    key={query.id}
                    onClick={() => playquery(query.id, query.type)}
                  >
                    <img
                      src={query.image}
                      alt={query.name}
                      className="h-24 w-24 object-cover rounded-md mb-2"
                    />
                    <h1 className="text-center text-sm truncate font-semibold">{query.name}</h1>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <span className="text-green-500 text-3xl font-bold">Loading...</span>
      )}
    </div>
  );
}

export default Result;
