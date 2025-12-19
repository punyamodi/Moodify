import { FaHome, FaSearch, FaHeart, FaUser, FaCompactDisc, FaSignOutAlt, FaClock, FaBrain } from "react-icons/fa";
import useMediaQuery from "../useMedia";
import { auth } from "../Firebase/firebaseConfig";
import { useContext } from "react";
import { Context } from "../main";
import { Link } from "react-router-dom";

function Sidebar() {
  const isAboveMedium = useMediaQuery("(min-width: 1025px)");
  const localUser = JSON.parse(localStorage.getItem("Users"));
  const { selected, setSelected } = useContext(Context);

  const signout = async () => {
    await auth.signOut(auth);
    localStorage.removeItem("Users");
    window.location.reload();
  };

  const menuItems = [
    { to: "/", icon: FaHome, label: "Home" },
    { to: "/discover", icon: FaSearch, label: "Discover" },
    { to: "/albums", icon: FaCompactDisc, label: "Albums" },
    { to: "/artist", icon: FaUser, label: "Artists" },
  ];

  const libraryItems = [
    { to: "/recently", icon: FaClock, label: "Recently Played" },
    { to: "/liked", icon: FaHeart, label: "Liked Songs" },
  ];

  const mobileItems = [
    { to: "/", icon: FaHome, label: "Home" },
    { to: "/discover", icon: FaSearch, label: "Discover" },
    { to: "/albums", icon: FaCompactDisc, label: "Albums" },
    { to: "/liked", icon: FaHeart, label: "Library" },
  ];

  if (isAboveMedium) {
    return (
      <aside className="w-72 h-screen bg-gradient-to-b from-cosmic-dark/90 to-deep-space/95 backdrop-blur-xl border-r border-white/5 flex flex-col">
        {/* Logo */}
        <div className="p-6 pb-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-aurora flex items-center justify-center shadow-glow-cyan transition-transform group-hover:scale-105">
              <span className="text-2xl font-display font-bold text-white">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-display font-bold">
                Mood<span className="text-gradient">ify</span>
              </span>
              <span className="text-[10px] text-white/30 uppercase tracking-widest">Premium</span>
            </div>
          </Link>
        </div>

        {/* Quick Mood Analysis Button */}
        <div className="px-4 mb-6">
          <Link 
            to="/mood"
            onClick={() => setSelected("/mood")}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-gradient-aurora text-white font-medium 
                     hover:shadow-glow-cyan transition-all duration-300 group"
          >
            <FaBrain className="w-5 h-5 group-hover:animate-pulse" />
            <span>Mood Analysis</span>
          </Link>
        </div>

        {/* Main Menu */}
        <nav className="px-4 space-y-1">
          <h3 className="px-4 mb-3 text-[10px] font-medium text-white/30 uppercase tracking-widest">Menu</h3>
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSelected(item.to)}
              className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                selected === item.to
                  ? "bg-aurora-cyan/15 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {selected === item.to && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-aurora rounded-full" />
              )}
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                selected === item.to ? "text-aurora-cyan" : ""
              }`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Library Section */}
        <nav className="px-4 mt-8 space-y-1">
          <h3 className="px-4 mb-3 text-[10px] font-medium text-white/30 uppercase tracking-widest">Your Library</h3>
          {libraryItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSelected(item.to)}
              className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                selected === item.to
                  ? "bg-aurora-cyan/15 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {selected === item.to && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-aurora rounded-full" />
              )}
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                selected === item.to ? "text-aurora-teal" : ""
              }`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User Section */}
        {localUser && (
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-cyan to-aurora-teal flex items-center justify-center flex-shrink-0">
                {localUser.photoURL ? (
                  <img src={localUser.photoURL} alt="user" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="text-lg font-bold text-white">
                    {localUser.displayName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{localUser.displayName}</p>
                <p className="text-xs text-white/40 truncate">{localUser.email}</p>
              </div>
              <button 
                onClick={signout}
                className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400/70 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-all"
                title="Sign Out"
              >
                <FaSignOutAlt className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </aside>
    );
  }

  // Mobile Bottom Navigation
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-deep-space via-deep-space/95 to-transparent backdrop-blur-xl border-t border-white/5 pb-safe">
      <nav className="flex justify-around items-stretch h-20 max-w-lg mx-auto px-4">
        {mobileItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => {
              localStorage.setItem("selected", item.to);
              setSelected(item.to);
            }}
            className="flex-1 flex flex-col items-center justify-center gap-1.5 group"
          >
            <div className={`relative p-2 rounded-xl transition-all duration-200 ${
              selected === item.to 
                ? "bg-aurora-cyan/20" 
                : "group-hover:bg-white/5"
            }`}>
              <item.icon className={`w-5 h-5 transition-all duration-200 ${
                selected === item.to 
                  ? "text-aurora-cyan scale-110" 
                  : "text-white/40 group-hover:text-white/60"
              }`} />
              {selected === item.to && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-aurora-cyan" />
              )}
            </div>
            <span className={`text-[10px] font-medium transition-colors ${
              selected === item.to ? "text-white" : "text-white/40"
            }`}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </footer>
  );
}

export default Sidebar;
