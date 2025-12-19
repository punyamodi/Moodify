import React from "react";
import useMediaQuery from "../useMedia";
import Topsongs from "./topsong";
import Newreleasemobile from "./newreleasemobile";

function Newrelease() {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const time = new Date().getFullYear();

  return (
    <div className="bg-transparent">
      {isAboveMedium ? (
        <Topsongs names={`${time} songs`} />
      ) : (
        <Newreleasemobile names={`${time}`} />
      )}
    </div>
  );
}

export default Newrelease;
