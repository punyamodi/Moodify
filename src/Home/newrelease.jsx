import React, { useState } from "react";
import useMediaQuery from "../useMedia";
import Topsongs from "./topsong";
import Newreleasemobile from "./newreleasemobile";

function Newrelease() {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const time = new Date().getFullYear();

  return (
    <div className="bg-black text-white p-4 rounded-lg">
      {isAboveMedium ? (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {time} <span className="text-green-500">Songs</span>
          </h2>
          <Topsongs names={`${time} songs`} />
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            New Releases <span className="text-green-500">2024</span>
          </h2>
          <Newreleasemobile names={"2024"} />
        </div>
      )}
    </div>
  );
}

export default Newrelease;
