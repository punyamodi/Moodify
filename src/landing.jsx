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
import {BrowserRouter, Route, Routes} from "react-router-dom";
function Landing() {
  const {selected,setSelected}=useContext(Context)
  const isAboveMedium = useMediaQuery("(min-width: 768px)");

  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar selected={selected} setSelected={setSelected} />
     
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/discover" element={<Discover/>}></Route>
          <Route path="/albums" element={<AlbumFull/>}></Route>
          <Route path="/innerAlbum" element={<Inneralbum/>}></Route>
          <Route path="albums/innerAlbum" element={<Inneralbum/>}></Route>
          {isAboveMedium &&(
          <Route path="/artist" element={<ArtistPage/>}></Route>
          )}
          <Route path="/innerartist" element={<Innerartist/>}></Route>
          <Route path="/search" element={<Searchfunc/>}></Route>
          <Route path="/mood" element={<Moodanalyse/>}></Route>
          <Route path="/innersong" element={<Innersongs/>}></Route>
          <Route path="/about" element={<h1>About</h1>}></Route>
          <Route path="/contact" element={<h1>Contact</h1>}></Route>
          <Route path="/login" element={<h1>Login</h1>}></Route>
          <Route path="/signup" element={<h1>Sign Up</h1>}></Route>
          <Route path="/recently" element={<h1>Recently</h1>}></Route>
          <Route path="/liked" element={<h1>Liked</h1>}></Route>
          <Route path="*" element={<Home/>}></Route>
        </Routes>
     
      {isAboveMedium ? (
        <div className="fixed bottom-0 w-full">
          <AudioPlayerr />
        </div>
      ) : (
        <div className="fixed  w-full z-40">
          <AudioPlayerr />
        </div>
      )}
    </div>
  );
}
export default Landing;
