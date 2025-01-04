import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../main";
import { getLanguages } from "../saavnapi";
import { auth } from "../Firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import useMediaQuery from "../useMedia";
import menubar from "../assets/menu.svg";
import close from "../assets/close-icon.svg";
import searchicon from "../assets/searchicon.svg";

const Navbar = () => {
  const { search, setSearch, setLanguage, languages, selected, setSelected } = useContext(Context);
  const isAboveMedium = useMediaQuery("(min-width: 1025px)");
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const localUser = JSON.parse(localStorage.getItem("Users"));

  const searchquery = (e) => setSearch(e.target.value);

  const signout = async () => {
    await signOut(auth);
    localStorage.removeItem("Users");
    window.location.reload();
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem("languages", selectedLanguage);
    window.location.reload();
  };

  useEffect(() => {
    getLanguages(languages);
  }, [languages]);

  const LanguageSelector = () => (
    <select
      className="w-24 h-8 border-2 border-green-500 rounded-lg bg-transparent text-green-500 outline-none hover:bg-green-500/10 transition-colors duration-200"
      value={languages}
      onChange={handleLanguageChange}
    >
      {[
        "hindi", "english", "kannada", "tamil", "telugu", "urdu", "arabic",
        "malayalam", "punjabi", "korean", "japanese", "spanish", "french",
        "german", "italian", "portuguese", "turkish", "dutch", "swedish",
        "indonesian"
      ].map(lang => (
        <option key={lang} className="bg-neutral-900 capitalize" value={lang}>
          {lang.charAt(0).toUpperCase() + lang.slice(1)}
        </option>
      ))}
    </select>
  );

  return (
    <>
      {isAboveMedium ? (
        <nav className="z-40 w-full px-6 py-4 bg-[#121212] sticky top-0 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            {/* Improved Search Bar */}
            <div className="flex-1 max-w-[400px]">
              <div className="relative">
                <div className="flex items-center bg-[#242424] hover:bg-[#2a2a2a] rounded-full h-[48px] w-full transition-all duration-300 focus-within:bg-[#2a2a2a] focus-within:ring-2 focus-within:ring-white/20">
                  <img
                    src={searchicon}
                    alt="search icon"
                    className="w-5 h-5 opacity-70 ml-4 mr-2"
                  />
                  <input
                    type="text"
                    placeholder="What do you want to listen to?"
                    className="bg-transparent outline-none w-full text-[15px] text-white placeholder:text-[#909090] font-normal py-2 pr-4"
                    onChange={searchquery}
                    value={search}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Links and Actions */}
            <div className="flex items-center gap-6">
              <Link to="mood" onClick={() => setSelected("/mood")}>
                <span className={`${
                  selected === "/mood"
                    ? "text-green-500 font-bold"
                    : "text-white hover:text-green-500"
                  } text-lg tracking-wide cursor-pointer transition-all duration-200 flex items-center gap-2`}
                >
                  Discover Your Mood 🎵 (AI)
                </span>
              </Link>

              <LanguageSelector />

              {!localUser ? (
                <div className="flex items-center gap-3">
                  <Link to="login">
                    <button className="bg-white hover:bg-neutral-200 text-black font-medium rounded-full px-6 py-2 transition-colors duration-200">
                      Log in
                    </button>
                  </Link>
                  <Link to="signup">
                    <button className="bg-green-500 hover:bg-green-400 text-black font-medium rounded-full px-6 py-2 transition-colors duration-200">
                      Sign up
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-neutral-800/50 rounded-full py-1 px-3">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/16802/16802273.png"
                      className="w-6 h-6"
                      alt="user"
                    />
                    <span className="text-white font-medium">{localUser.displayName}</span>
                  </div>
                  <button
                    onClick={signout}
                    className="text-neutral-400 hover:text-white transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      ) : (
        // Mobile Menu
        <div className="relative">
          <nav className="z-40 w-full p-4 bg-black/95 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl text-white font-bold">MelodyMind</h1>
              <div className="flex items-center gap-4">
                <LanguageSelector />
                <button onClick={() => setIsMenuToggled(true)}>
                  <img src={menubar} alt="menu" className="w-6 h-6" />
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile Menu Overlay */}
          {isMenuToggled && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40">
              <div className="w-5/6 bg-neutral-900 h-screen absolute right-0 top-0 p-6">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-2xl text-white font-bold">MelodyMind</h1>
                  <button 
                    onClick={() => setIsMenuToggled(false)}
                    className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
                  >
                    <img src={close} alt="close" className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  <Link 
                    to="mood" 
                    onClick={() => {
                      setSelected("/mood");
                      setIsMenuToggled(false);
                    }}
                  >
                    <span className={`${
                      selected === "/mood"
                        ? "text-green-500 font-bold"
                        : "text-white"
                      } text-lg tracking-wide cursor-pointer transition-all duration-200`}
                    >
                      Discover Your Mood 🎵
                    </span>
                  </Link>

                  {!localUser ? (
                    <div className="flex flex-col gap-4">
                      <Link to="login">
                        <button className="w-full bg-white hover:bg-neutral-200 text-black font-medium rounded-full py-3 transition-colors duration-200">
                          Log in
                        </button>
                      </Link>
                      <Link to="signup">
                        <button className="w-full bg-green-500 hover:bg-green-400 text-black font-medium rounded-full py-3 transition-colors duration-200">
                          Sign up
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 bg-neutral-800/50 rounded-full py-2 px-4 w-fit">
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/16802/16802273.png"
                          className="w-6 h-6"
                          alt="user"
                        />
                        <span className="text-white font-medium">{localUser.displayName}</span>
                      </div>
                      <button
                        onClick={signout}
                        className="text-red-500 hover:text-red-400 flex items-center gap-2 transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;