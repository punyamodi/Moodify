import React, { useContext, useEffect, useState } from "react";
import menubar from "../assets/menu.svg";
import useMediaQuery from "../useMedia";
import { Context } from "../main";
import close from "../assets/close-icon.svg";
import { Link } from "react-router-dom";
import { getLanguages } from "../saavnapi";
import { auth } from "../Firebase/firebaseConfig";
import { signOut } from "firebase/auth";

function Navbar() {
  const { search, setSearch, setLanguage, languages, selected, setSelected } = useContext(Context);
  const isAboveMedium = useMediaQuery("(min-width: 1025px)");
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const localUser = JSON.parse(localStorage.getItem("Users"));

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchquery = (e) => {
    setSearch(e.target.value);
  };

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

  return (
    <nav className={`fixed top-0 right-0 z-50 transition-all duration-300 ${
      isAboveMedium ? 'left-72' : 'left-0'
    } ${
      isScrolled 
        ? 'bg-deep-space/80 backdrop-blur-xl border-b border-white/5' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between gap-8">
        {/* Logo */}
        {/* Logo - Hidden on Desktop as Sidebar has one */}
        <Link to="/" className={`flex items-center gap-3 group ${isAboveMedium ? 'hidden' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-aurora flex items-center justify-center shadow-glow-cyan transition-all group-hover:scale-110 group-hover:shadow-glow-teal">
            <span className="text-xl font-display font-bold text-white">M</span>
          </div>
          <span className="text-xl font-display font-bold hidden sm:block">
            Mood<span className="text-gradient">ify</span>
          </span>
        </Link>

        {/* Search Bar */}
        {isAboveMedium && (
          <div className="flex-1 max-w-lg">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search songs, artists, albums..."
                className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-5 pl-12 text-sm 
                         placeholder:text-white/30 focus:bg-white/10 focus:border-aurora-cyan/50
                         transition-all duration-300"
                onChange={searchquery}
                value={search}
              />
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-aurora-cyan transition-colors" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {isAboveMedium && (
            <>
              {/* Mood Analysis Link */}
              <Link 
                to="mood" 
                onClick={() => setSelected("/mood")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selected === "/mood" 
                    ? "bg-aurora-cyan/20 text-aurora-cyan border border-aurora-cyan/30" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mood Analysis
                </span>
              </Link>

              {/* Language Selector */}
              <div className="relative">
                <select
                  className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 text-sm 
                           text-white/70 focus:bg-white/10 focus:border-aurora-cyan/50 outline-none cursor-pointer
                           transition-all"
                  value={languages}
                  onChange={handleLanguageChange}
                >
                  {["hindi", "english", "kannada", "tamil", "telugu", "urdu", "punjabi"].map(lang => (
                    <option key={lang} className="bg-deep-space capitalize" value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </>
          )}

          {/* Auth Buttons / User Profile */}
          {!localUser ? (
            <div className="flex items-center gap-3">
              <Link to="login" className="text-sm font-medium text-white/70 hover:text-white transition-colors hidden sm:block">
                Login
              </Link>
              <Link to="signup" className="btn-primary py-2.5 px-5 text-sm">
                <span>Get Started</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-white">
                  {localUser.displayName || localUser.email?.split('@')[0] || 'User'}
                </span>
                <button 
                  onClick={signout} 
                  className="text-xs text-white/40 hover:text-red-400 transition-colors"
                >
                  Sign Out
                </button>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-cyan to-aurora-teal flex items-center justify-center overflow-hidden">
                {localUser.photoURL ? (
                  <img src={localUser.photoURL} alt="user" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-white">
                    {localUser.displayName?.charAt(0).toUpperCase() || localUser.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          {!isAboveMedium && (
            <button 
              onClick={() => setIsMenuToggled(true)} 
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuToggled && (
        <div className="fixed inset-0 z-[100] animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-deep-space/95 backdrop-blur-xl"
            onClick={() => setIsMenuToggled(false)}
          />
          
          {/* Menu Content */}
          <div className="relative h-full flex flex-col p-8 animate-slide-in-right">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-aurora flex items-center justify-center">
                  <span className="text-xl font-display font-bold text-white">M</span>
                </div>
                <span className="text-xl font-display font-bold">Moodify</span>
              </div>
              <button 
                onClick={() => setIsMenuToggled(false)}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Bar Mobile */}
            <div className="mt-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 pl-12 text-base
                           placeholder:text-white/30 focus:bg-white/10"
                  onChange={searchquery}
                  value={search}
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2 mt-12 flex-1">
              {[
                { to: "/", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
                { to: "/mood", label: "Mood Analysis", icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                { to: "/discover", label: "Discover", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
                { to: "/albums", label: "Albums", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
                { to: "/liked", label: "Liked Songs", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" }
              ].map((item, i) => (
                <Link
                  key={i}
                  to={item.to}
                  onClick={() => setIsMenuToggled(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-medium transition-all ${
                    selected === item.to 
                      ? "bg-aurora-cyan/20 text-white border border-aurora-cyan/30" 
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            {!localUser && (
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <Link 
                  to="login" 
                  onClick={() => setIsMenuToggled(false)} 
                  className="btn-secondary text-center py-4"
                >
                  Login
                </Link>
                <Link 
                  to="signup" 
                  onClick={() => setIsMenuToggled(false)} 
                  className="btn-primary text-center py-4"
                >
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            {localUser && (
              <div className="mt-auto pt-8 border-t border-white/5">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-aurora flex items-center justify-center">
                    <span className="text-xl font-bold">{localUser.displayName?.charAt(0) || 'U'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{localUser.displayName}</p>
                    <p className="text-sm text-white/40">{localUser.email}</p>
                  </div>
                  <button 
                    onClick={signout}
                    className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;