import React, { useContext, useEffect, useState } from "react";
import menubar from "../assets/menu.svg";
import useMediaQuery from "../useMedia";
import { Context } from "../main";
import close from "../assets/close-icon.svg";
import searchicon from "../assets/searchicon.svg";
import { Link } from "react-router-dom";
import { getLanguages } from "../saavnapi";
import { auth } from "../Firebase/firebaseConfig";
import { signOut } from "firebase/auth";

function Navbar() {
  const { search, setSearch, setLanguage, languages, selected, setSelected } = useContext(Context);
  const isAboveMedium = useMediaQuery("(min-width: 1025px)");
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const localUser = JSON.parse(localStorage.getItem("Users"));

  const searchquery = (e) => {
    setSearch(e.target.value);
  };

  const signout = async () => {
    await signOut(auth);
    localStorage.removeItem("Users");
    window.location.reload();
  };

  const clearSearch = () => {
    setSearch("");
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

  return (
    <>
      {isAboveMedium ? (
        <section>
          <nav className="z-40 w-full px-6 py-4 bg-[#121212] sticky top-0 shadow-lg">
            <ul className="flex items-center justify-between">
              {/* Enhanced Search Bar */}
              <Link to="search" className="flex-1 max-w-[400px]">
                <div className="relative">
                  <div className="flex items-center bg-[#121212] text-white rounded-full h-[48px] pr-3 pl-5 w-full border border-transparent focus-within:border-[#1DB954] hover:border-[#1DB954] transition-all duration-300">
                    <div className="flex items-center flex-1 gap-2">
                      <img src={searchicon} alt="search icon" className="w-6 h-6 opacity-80" />
                      <input
                        type="text"
                        placeholder="Search for music, podcasts, artists..."
                        className="bg-transparent outline-none w-full text-[14px] text-white placeholder:text-[#A0A0A0] font-normal leading-normal"
                        onChange={searchquery}
                        value={search}
                      />
                    </div>
                    {search && (
                      <button
                        className="w-6 h-6 flex items-center justify-center text-[#A0A0A0] hover:text-white transition-colors duration-200"
                        onClick={clearSearch}
                        aria-label="Clear search"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-6">
              <Link to="mood" onClick={() => setSelected("/mood")}>
                <h1
                  className={`${
                    selected === "/mood"
                      ? "text-green-500 font-bold transition-all duration-200"
                      : "text-white hover:text-green-500 transition-all duration-200"
                  } text-lg tracking-wide cursor-pointer`}
                >
                  Discover Your Mood 🎵
                </h1>
              </Link>


                <select
                  className={`w-24 h-8 border-0 rounded-md hover:shadow-md bg-transparent text-green outline-none`}
                  value={languages}
                  onChange={handleLanguageChange}
                >
                  <option className="bg-deep-grey" value="hindi">Hindi</option>
                  <option className="bg-deep-grey" value="english">English</option>
                  <option className="bg-deep-grey" value="kannada">Kannada</option>
                  <option className="bg-deep-grey" value="tamil">Tamil</option>
                  <option className="bg-deep-grey" value="telugu">Telugu</option>
                  <option className="bg-deep-grey" value="urdu">Urdu</option>
                  <option className="bg-deep-grey" value="arabic">Arabic</option>
                  <option className="bg-deep-grey" value="malayalam">Malayalam</option>
                  <option className="bg-deep-grey" value="punjabi">Punjabi</option>
                  <option className="bg-deep-grey" value="korean">Korean</option>
                  <option className="bg-deep-grey" value="japanese">Japanese</option>
                  <option className="bg-deep-grey" value="spanish">Spanish</option>
                  <option className="bg-deep-grey" value="french">French</option>
                  <option className="bg-deep-grey" value="german">German</option>
                  <option className="bg-deep-grey" value="italian">Italian</option>
                  <option className="bg-deep-grey" value="portuguese">Portuguese</option>
                  <option className="bg-deep-grey" value="turkish">Turkish</option>
                  <option className="bg-deep-grey" value="dutch">Dutch</option>
                  <option className="bg-deep-grey" value="swedish">Swedish</option>
                  <option className="bg-deep-grey" value="indonesian">Indonesian</option>
                </select>


                {!localUser ? (
                  <div className="flex items-center gap-4">
                    <Link to="login">
                      <button className="text-gray-300 hover:text-white font-medium transition-colors duration-200">
                        Log in
                      </button>
                    </Link>
                    <Link to="signup">
                      <button className="bg-green-500 hover:bg-green-600 text-black font-medium rounded-full px-8 py-3 transition-colors duration-200">
                        Sign up
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/16802/16802273.png"
                      className="h-8 rounded-full"
                      alt="user"
                    />
                    <h1 className="text-white font-medium">{localUser.displayName}</h1>
                    <button
                      className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
                      onClick={signout}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </ul>
          </nav>
        </section>
      ) : (
        // Mobile menu code
        <section className="flex justify-end relative right-0">
          <nav className="z-40 w-full p-4 bg-[#121212]">
            <ul className="flex items-center justify-between">
              <li>
                <h1 className="text-2xl text-white font-bold">MelodyMind</h1>
              </li>
              <li>
              <select
                className={`w-24 h-8 border-0 rounded-md hover:shadow-md bg-transparent text-green outline-none`}
                value={languages}
                onChange={handleLanguageChange}
              >
                <option className="bg-deep-grey" value="hindi">Hindi</option>
                <option className="bg-deep-grey" value="english">English</option>
                <option className="bg-deep-grey" value="kannada">Kannada</option>
                <option className="bg-deep-grey" value="tamil">Tamil</option>
                <option className="bg-deep-grey" value="telugu">Telugu</option>
                <option className="bg-deep-grey" value="urdu">Urdu</option>
                <option className="bg-deep-grey" value="arabic">Arabic</option>
                <option className="bg-deep-grey" value="malayalam">Malayalam</option>
                <option className="bg-deep-grey" value="punjabi">Punjabi</option>
                <option className="bg-deep-grey" value="korean">Korean</option>
                <option className="bg-deep-grey" value="japanese">Japanese</option>
                <option className="bg-deep-grey" value="spanish">Spanish</option>
                <option className="bg-deep-grey" value="french">French</option>
                <option className="bg-deep-grey" value="german">German</option>
                <option className="bg-deep-grey" value="italian">Italian</option>
                <option className="bg-deep-grey" value="portuguese">Portuguese</option>
                <option className="bg-deep-grey" value="turkish">Turkish</option>
                <option className="bg-deep-grey" value="dutch">Dutch</option>
                <option className="bg-deep-grey" value="swedish">Swedish</option>
                <option className="bg-deep-grey" value="indonesian">Indonesian</option>
              </select>

              </li>
              <img
                src={menubar}
                alt="menu icon"
                className="p-2 cursor-pointer"
                onClick={() => setIsMenuToggled(true)}
              />
            </ul>
          </nav>
        </section>
      )}
      {isMenuToggled && !isAboveMedium && (
        <section className="w-5/6 bg-[#121212] h-screen fixed right-0 top-0 z-50">
          <div className="flex justify-end p-4">
            <button onClick={() => setIsMenuToggled(false)}>
              <img src={close} alt="close" className="w-6" />
            </button>
          </div>
          <h1 className="text-2xl text-white font-bold p-6">MelodyMind</h1>
          <div className="flex flex-col items-start p-6 gap-4">
          <Link to="mood" onClick={() => setSelected("/mood")}>
            <h1
              className={`${
                selected === "/mood"
                  ? "text-green-500 font-bold transition-all duration-200"
                  : "text-white hover:text-green-500 transition-all duration-200"
              } text-lg tracking-wide cursor-pointer`}
            >
              Discover Your Mood 🎵
            </h1>
          </Link>

            {!localUser ? (
              <>
                <Link to="login">
                  <button className="text-green-500 hover:text-green-600">Login</button>
                </Link>
                <Link to="signup">
                  <button className="text-orange-500 hover:text-orange-600">Sign Up</button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/16802/16802273.png"
                  className="h-8"
                  alt="user"
                />
                <h1 className="text-white">{localUser.displayName}</h1>
              </div>
            )}
            {localUser && (
              <button className="text-red-500 hover:text-red-600" onClick={signout}>
                Logout
              </button>
            )}
          </div>
        </section>
      )}
    </>
  );
}

export default Navbar;
