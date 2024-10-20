import React, { useContext } from "react";
import useMediaQuery from "../useMedia";
import Topsongs from "../Home/topsong";
import Newrelease from "../Home/newrelease";
import Trending from "../Trendy/trending";
import Artist from "../Playlist/artist";
import Albums from "../Albumsongs/albums";
import { Context } from "../main";
import Trendingmobile from "../Home/trendingmobile";
import Newreleasemobile from "../Home/newreleasemobile";

function Discover() {
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
        <div className="overflow-y-auto h-screen w-full p-4">
          {/* Section: New Releases */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold p-4 text-white">
              New Releases <span className="text-green-500">Songs</span>
            </h1>
            <Newrelease />
          </div>

          {/* Section: Trending Songs */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold p-4 text-white">
              Trending <span className="text-green-500">Songs</span>
            </h1>
            <Trending />
          </div>

          {/* Section: Weekly Top Songs */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold p-4 text-white">
              Weekly Top <span className="text-green-500">Songs</span>
            </h1>
            <Topsongs />
          </div>

          {/* Section: Popular Albums */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold p-4 text-white">
              Top <span className="text-green-500">Albums</span>
            </h1>
            <Albums />
          </div>

          {/* Section: Popular Artists */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold p-4 text-white">
              Popular <span className="text-green-500">Artists</span>
            </h1>
            <Artist />
          </div>
        </div>
      ) : (
        <div className="overflow-y-auto h-screen w-full p-4">
          {/* Mobile View */}
          <h1 className="text-2xl font-semibold p-4 text-white">
            New Releases <span className="text-green-500">Songs</span>
          </h1>
          <Newreleasemobile />

          <h1 className="text-2xl font-semibold p-4 text-white">
            Trending <span className="text-green-500">Songs</span>
          </h1>
          <Trendingmobile names={"songs"} />

          <h1 className="text-2xl font-semibold p-4 text-white">
            Weekly Top <span className="text-green-500">Songs</span>
          </h1>
          <Topsongs />

          <h1 className="text-2xl font-semibold p-4 text-white">
            Popular <span className="text-green-500">Albums</span>
          </h1>
          <Albums />

          <h1 className="text-2xl font-semibold p-4 text-white">
            Popular <span className="text-green-500">Artists</span>
          </h1>
          <Artist />

          {/* Bottom spacing */}
          <div className="mb-24"></div>
        </div>
      )}
    </>
  );
}

export default Discover;
