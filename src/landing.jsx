import AlbumFull from "./Albumsongs/albumfull";
import AudioPlayerr from "./AudioPlayer/audioplayer";
import Discover from "./Discover/discover";
import Home from "./Home/home";
import Searchfunc from "./Search/search";
import Navbar from "./navbar/navbar";
import useMediaQuery from "./useMedia";
import ArtistPage from "./Playlist/artistpage";
import Inneralbum from "./Albumsongs/inneralbum";
import { useContext } from "react";
import { Context } from "./main";
import Innerartist from "./Playlist/innerartist";
import Innersongs from "./AudioPlayer/innersongs";
import Moodanalyse from "./moodanalyse";
import { Route, Routes } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";
import Likes from "./Library/likes";
import Recents from "./Library/recents";

function Landing() {
  const { selected, setSelected } = useContext(Context);
  const isAboveMedium = useMediaQuery("(min-width: 768px)");
  const localUser = JSON.parse(localStorage.getItem("Users"));

  return (
    <div className="w-full min-h-screen flex flex-col bg-deep-space">
      {/* Top Navbar */}
      <Navbar selected={selected} setSelected={setSelected} />
      
      {/* Main Content Area */}
      <main className="flex-1 pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/albums" element={<AlbumFull />} />
          <Route path="/innerAlbum" element={<Inneralbum />} />
          <Route path="/albums/innerAlbum" element={<Inneralbum />} />
          {isAboveMedium && (
            <Route path="/artist" element={<ArtistPage />} />
          )}
          <Route path="/innerartist" element={<Innerartist />} />
          <Route path="/search" element={<Searchfunc />} />
          <Route path="/mood" element={<Moodanalyse />} />
          <Route path="/innersong" element={<Innersongs />} />
          {!localUser ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </>
          ) : (
            <Route path="/" element={<Home />} />
          )}
          <Route path="/recently" element={<Recents />} />
          <Route path="/liked" element={<Likes />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Audio Player */}
      <AudioPlayerr />
    </div>
  );
}

export default Landing;
