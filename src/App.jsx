import React, { useContext, useEffect } from "react";
import Sidebar from "./navbar/sidebar";
import { Context } from "./main";
import { useNavigate, useLocation } from 'react-router-dom';
import Landing from "./landing"
import "./App.css";

function App() {
  const { setSelected } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const lastSelected = localStorage.getItem("selected") || "/";
    setSelected(lastSelected);
    navigate(lastSelected);
  }, []);

  useEffect(() => {
    setSelected(location.pathname);
    localStorage.setItem("selected", location.pathname);
  }, [location.pathname, setSelected]);

  return (
    <div className="flex h-screen bg-spotify-black text-white">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="bg-gradient-to-b from-spotify-dark-gray to-spotify-black p-8">
          <Landing />
        </div>
      </div>
    </div>
  );
}

export default App;