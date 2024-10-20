import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import Result from "../Search/result";
import Topsongs from "../Home/topsong";

function Searchfunc() {
  const { search, setSearch } = useContext(Context);
  const [rerender, setRerender] = useState(false);
  const isAboveMedium = useMediaQuery("(min-width:1025px)");

  // Listen for changes in the search state
  useEffect(() => {
    setRerender(true);
  }, [search]);

  const searchquery = (e) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch(""); // Clear the search query
  };

  return (
    <div
      className="h-screen mb-16 bg-black text-white"
      style={{
        overflowY: "scroll",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {isAboveMedium ? (
        <>
          <div className="flex items-center justify-center p-4 bg-black border-b border-gray-700">
            <input
              type="text"
              placeholder="Search for Music, Artists, Albums..."
              className="p-4 w-2/3 bg-gray-800 text-white rounded-full outline-none placeholder-gray-400 focus:ring-2 focus:ring-green-500"
              onChange={searchquery}
              value={search}
            />
            {search && (
              <button
                className="ml-4 text-green-500 hover:text-green-600"
                onClick={clearSearch}
              >
                Clear
              </button>
            )}
          </div>

          {rerender && search ? (
            <div className="h-screen">
              <Result names={search} />
            </div>
          ) : (
            <Topsongs names={"Top songs"} />
          )}
        </>
      ) : (
        <div className="h-screen p-4">
          <div className="flex w-full h-10 p-2 bg-gray-900 border-b-2 border-gray-700 rounded-md">
            <input
              type="text"
              placeholder="Search for Music, Artists, Albums..."
              className="p-4 h-8 w-full bg-transparent text-white outline-none placeholder-gray-400"
              onChange={searchquery}
              value={search}
            />
            {search && (
              <button
                className="text-green-500 text-md ml-2"
                onClick={clearSearch}
              >
                X
              </button>
            )}
          </div>
          
          {rerender && search ? (
            <>
              <Result names={search} />
              <div className="h-24"></div>
            </>
          ) : (
            <Topsongs names={"Top songs"} />
          )}
        </div>
      )}
    </div>
  );
}

export default Searchfunc;
