import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createContext } from "react";

export const Context = createContext();

const Appwrapper = () => {
  const[selected, setSelected] = useState(localStorage.getItem("selected")||"home");
  const [songid, setSongid] = useState(localStorage.getItem("songid") || "");
  const [search, setSearch] = useState("");
  const [singer, setSinger] = useState("");
  const [innerAlbum, setInneralbum] = useState(localStorage.getItem("innerAlbum") || "");
  const [languages, setLanguage] = useState(localStorage.getItem("languages")|| "hindi" );
  return (
    <Context.Provider value={{ songid, setSongid, search, setSearch,languages,setLanguage,innerAlbum,setInneralbum,selected,setSelected }}>
      <App
      selected={selected}
      setSelected={setSelected}
        songid={songid}
        setSongid={setSongid}
        search={search}
        setSearch={setSearch}
        singer={singer}
        setSinger={setSinger}
        languages={languages}
        setLanguage={setLanguage}
        innerAlbum={innerAlbum}
        setInneralbum={setInneralbum}
      />
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Appwrapper />
  </React.StrictMode>
);
