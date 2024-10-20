import React, { useContext, useState } from "react";
import useMediaQuery from "../useMedia";
import Topsongs from "./topsong";
import Newrelease from "./newrelease";
import Trending from "../Trendy/trending";
import Artist from "../Playlist/artist";
import Albums from "../Albumsongs/albums";
import { Context } from "../main";
import Trendingmobile from "./trendingmobile";

function Home() {
  const isAboveMedium = useMediaQuery("(min-width:1025px)");
  const { Viewall, setViewall, setPage, page } = useContext(Context);

  const handleCLick = (name) => {
    if (page === name) {
      setViewall(3);
      setPage("");
    } else {
      setViewall(40);
      setPage(name);
    }
  };

  return (
    <>
      {isAboveMedium ? (
        <div
          className="overflow-y-auto h-screen w-full mb-12 bg-black text-white"
          style={{ overflowX: "scroll", minWidth: "100%" }}
        >
          <div className="mb-8">
            <h1 className="text-3xl p-4 m-5 text-white font-bold">
              Weekly Top <span className="text-green-500">Songs</span>
            </h1>
            <Topsongs />
          </div>
          <div className="mb-8">
            <h1 className="text-3xl p-4 m-5 text-white font-bold">
              New Releases <span className="text-green-500">Songs</span>
            </h1>
            <Newrelease />
          </div>
          <div className="mb-8">
            <h1 className="text-3xl p-4 m-5 text-white font-bold">
              Trending <span className="text-green-500">Songs</span>
            </h1>
            <Trending />
          </div>
          <div className="mb-8">
            <h1 className="text-3xl p-4 m-5 text-white font-bold">
              Popular <span className="text-green-500">Artists</span>
            </h1>
            <Artist />
          </div>
          <div className="mb-16">
            <h1 className="text-3xl p-4 m-5 text-white font-bold">
              Top <span className="text-green-500">Album</span>
            </h1>
            <Albums />
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-y-auto h-screen w-full bg-black text-white">
            <h1 className="text-2xl p-2 m-1 font-bold text-white">
              Weekly Top <span className="text-green-500">Songs</span>
            </h1>
            <div className="flex overflow-x-scroll overflow-y-hidden space-x-2 p-2">
              <Topsongs />
            </div>

            <h1 className="text-2xl p-2 m-1 font-bold text-white">
              New Releases <span className="text-green-500">Songs</span>
            </h1>
            <div className="flex overflow-x-scroll overflow-y-hidden space-x-2 p-2">
              <Newrelease />
            </div>

            <h1 className="text-2xl p-2 m-1 font-bold text-white">
              Trending <span className="text-green-500">Songs</span>
            </h1>
            <div className="flex overflow-x-scroll overflow-y-hidden space-x-2 p-2">
              <Trendingmobile names={"songs"} />
            </div>

            <h1 className="text-2xl p-2 m-1 font-bold text-white">
              Popular <span className="text-green-500">Artists</span>
            </h1>
            <div className="flex overflow-x-scroll overflow-y-hidden space-x-2 p-2">
              <Artist />
            </div>

            <h1 className="text-2xl p-2 m-0 font-bold text-white">
              Popular <span className="text-green-500">Albums</span>
            </h1>
            <div className="flex overflow-x-scroll overflow-y-hidden space-x-2 p-2">
              <Albums />
            </div>

            <div className="h-1/6 mb-24"></div>
          </div>
        </>
      )}
    </>
  );
}
export default Home;
