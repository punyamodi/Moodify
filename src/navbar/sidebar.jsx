import { FaHome, FaSearch, FaMusic, FaHeart, FaUser, FaCompactDisc, FaSignOutAlt, FaClock } from "react-icons/fa"; // FontAwesome icons
import useMediaQuery from "../useMedia";
import { auth } from "../Firebase/firebaseConfig";
import { useContext } from "react";
import { Context } from "../main";
import { Link } from "react-router-dom";

function Sidebar() {
  const isAboveMedium = useMediaQuery("(min-width: 1025px)");
  const localUser = JSON.parse(localStorage.getItem("Users"));
  const selectedStyle = `bg-gray-800 text-white font-bold rounded-md`;
  const { selected, setSelected } = useContext(Context);

  const signout = async () => {
    await auth.signOut(auth);
    localStorage.removeItem("Users");
    window.location.reload();
  };

  return (
    <>
      {isAboveMedium ? (
        <aside className="w-64 bg-black h-screen text-gray-400 font-sans text-lg"> {/* Text size increased */}
          {/* Spotify-like Logo */}
          <h1 className="text-white text-4xl p-6 font-bold">Moodify</h1> {/* Logo text size increased */}

          {/* Menu Section */}
          <div className="flex flex-col p-4">
            <Link to="/">
              <div className={`flex items-center p-2 mb-2 rounded-md ${selected === "/" ? "bg-gray-800 text-white font-bold" : "hover:bg-gray-900 hover:text-white"} transition duration-200`}>
                <FaHome className="mr-4 h-8 w-8" />
                <span>Home</span>
              </div>
            </Link>

            <Link to="/discover">
              <div className={`flex items-center p-2 mb-2 rounded-md ${selected === "/discover" ? "bg-gray-800 text-white font-bold" : "hover:bg-gray-900 hover:text-white"} transition duration-200`}>
                <FaSearch className="mr-4 h-8 w-8" />
                <span>Discover</span>
              </div>
            </Link>

            <Link to="/albums">
              <div className={`flex items-center p-2 mb-2 rounded-md ${selected === "/albums" ? "bg-gray-800 text-white font-bold" : "hover:bg-gray-900 hover:text-white"} transition duration-200`}>
                <FaCompactDisc className="mr-4 h-8 w-8" />
                <span>Albums</span>
              </div>
            </Link>

            <Link to="/artist">
              <div className={`flex items-center p-2 mb-2 rounded-md ${selected === "/artist" ? "bg-gray-800 text-white font-bold" : "hover:bg-gray-900 hover:text-white"} transition duration-200`}>
                <FaUser className="mr-4 h-8 w-8" />
                <span>Artists</span>
              </div>
            </Link>
          </div>

          {/* Library Section */}
          <div className="flex flex-col p-4 mt-4">
            <h2 className="text-gray-500 uppercase tracking-wide mb-4">Your Library</h2>

            <Link to="/recently">
              <div className={`flex items-center p-2 mb-2 rounded-md ${selected === "/recently" ? "bg-gray-800 text-white font-bold" : "hover:bg-gray-900 hover:text-white"} transition duration-200`}>
                <FaClock className="mr-4 h-8 w-8" />
                <span>Recently Played</span>
              </div>
            </Link>

            <Link to="/liked">
              <div className={`flex items-center p-2 mb-2 rounded-md ${selected === "/liked" ? "bg-gray-800 text-white font-bold" : "hover:bg-gray-900 hover:text-white"} transition duration-200`}>
                <FaHeart className="mr-4 h-8 w-8" />
                <span>Liked Songs</span>
              </div>
            </Link>
          </div>

          {/* General Section */}
          {localUser && (
            <div className="flex flex-col p-4 mt-4">
              <h2 className="text-gray-500 uppercase tracking-wide mb-4">General</h2>
              <div className="flex items-center p-2 mb-2 hover:text-red-500 cursor-pointer transition duration-200" onClick={signout}>
                <FaSignOutAlt className="mr-4 h-8 w-8" />
                <span>Logout</span>
              </div>
            </div>
          )}
        </aside>
      ) : (
        // Bottom Navigation for mobile view
        <footer className="fixed bottom-0 w-full bg-black h-24 text-gray-400 z-40 font-sans text-lg">
          <nav className="flex justify-around items-center h-full">
            <Link to="/">
              <div
                onClick={() => {
                  localStorage.setItem("selected", "/");
                  setSelected("/");
                }}
                className="text-center"
              >
                <FaHome className="mx-auto mb-1 h-8 w-8" />
<span className={`${selected === "/" ? "text-white" : "hover:bg-gray-900 hover:text-white"} transition duration-200`}>Home</span>
              </div>
            </Link>

            <Link to="/discover">
              <div
                onClick={() => {
                  localStorage.setItem("selected", "/discover");
                  setSelected("/discover");
                }}
                className="text-center"
              >
                <FaSearch className="mx-auto mb-1 h-8 w-8" />
<span className={`${selected === "/discover" ? "text-white" : "hover:bg-gray-900 hover:text-white"} transition duration-200`}>Discover</span>
              </div>
            </Link>

            <Link to="/albums">
              <div
                onClick={() => {
                  localStorage.setItem("selected", "/albums");
                  setSelected("/albums");
                }}
                className="text-center"
              >
                <FaCompactDisc className="mx-auto mb-1 h-8 w-8" />
<span className={`${selected === "/albums" ? "text-white" : "hover:bg-gray-900 hover:text-white"} transition duration-200`}>Albums</span>
              </div>
            </Link>

            <Link to="/liked">
              <div
                onClick={() => {
                  localStorage.setItem("selected", "/liked");
                  setSelected("/liked");
                }}
                className="text-center"
              >
                <FaHeart className="mx-auto mb-1 h-8 w-8" />
<span className={`${selected === "/liked" ? "text-white" : "hover:bg-gray-900 hover:text-white"} transition duration-200`}>Library</span>
              </div>
            </Link>
          </nav>
        </footer>
      )}
    </>
  );
}

export default Sidebar;
