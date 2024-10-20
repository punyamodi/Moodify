import img from "../src/assets/music icon2.png";
import useMediaQuery from "./useMedia";
import bgimage from "../src/assets/7tqQ0e.jpg";

const mystyle = {
  bg1: {
    backgroundImage: `url(${bgimage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
  },
};

export default function AboutUs() {
  const isAboveMedium = useMediaQuery("(min-width: 768px)");

  return (
    <>
      {isAboveMedium ? (
        <div
          className="bg-black text-white p-8 h-screen flex items-center justify-center"
          style={{ ...mystyle.bg1, overflowY: "scroll" }}
        >
          <div className="max-w-3xl mx-auto bg-opacity-80 bg-gray-900 p-10 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold mb-6 text-green-500">About Us</h2>
            <p className="mb-6 text-lg leading-relaxed">
              Welcome to <span className="font-bold text-green-500">MelodyMinds</span>, where every beat matters. At MelodyMinds, we believe music is more than just sound – it’s an experience, a journey, and a way to connect with the world. We’re passionate about bringing the joy of music to your fingertips, making every note count and every playlist unforgettable.
            </p>

            <h2 className="text-4xl font-bold mb-6 text-green-500">Our Mission</h2>
            <p className="mb-6 text-lg leading-relaxed">
              Our mission is to empower music lovers by providing a platform that delivers exceptional sound quality, innovative features, and an unparalleled user experience. We strive to be the go-to app for all your music needs, making it easy for you to explore, enjoy, and share your favorite songs.
            </p>

            <div className="flex items-center mb-6">
              <img
                src={img}
                alt="not found"
                className="w-16 h-16 bg-green-500 p-2 rounded-full mr-4 border-2 border-gray-800 shadow-lg"
              />
              <p className="text-lg">
                Our Music App is your ultimate destination for discovering and enjoying music!
              </p>
            </div>

            <h2 className="text-3xl font-bold text-green-500 mb-4">Join Our Community</h2>
            <p className="mb-4 text-lg leading-relaxed">
              We’re more than just an app – we’re a community of music enthusiasts who share a common passion. Connect with us on social media, share your playlists, and join the conversation. We’re excited to have you on this musical journey with us.
            </p>

            <div className="flex mt-6 items-center justify-center gap-7">
              <a href="#" className="mr-4">
                <i className="fa-brands fa-facebook text-4xl hover:text-green-500 transition duration-300"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-instagram text-4xl hover:text-green-500 transition duration-300"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-linkedin text-4xl hover:text-green-500 transition duration-300"></i>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="bg-black text-white p-8 h-screen flex items-center justify-center"
          style={{ ...mystyle.bg1, overflowY: "scroll" }}
        >
          <div className="max-w-xl mx-auto bg-opacity-80 bg-gray-900 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-green-500">About Us</h2>
            <p className="mb-6 text-md leading-relaxed">
              Welcome to <span className="font-bold text-green-500">MelodyMinds</span>, where every beat matters. At MelodyMinds, we believe music is more than just sound – it’s an experience, a journey, and a way to connect with the world. We’re passionate about bringing the joy of music to your fingertips.
            </p>

            <h2 className="text-3xl font-bold mb-6 text-green-500">Our Mission</h2>
            <p className="mb-6 text-md leading-relaxed">
              Our mission is to empower music lovers by providing a platform that delivers exceptional sound quality, innovative features, and an unparalleled user experience.
            </p>

            <div className="flex items-center mb-6">
              <img
                src={img}
                alt="not found"
                className="w-12 h-12 bg-green-500 p-2 rounded-full mr-4 border-2 border-gray-800 shadow-lg"
              />
              <p className="text-md">
                Our Music App is your ultimate destination for discovering and enjoying music!
              </p>
            </div>

            <h2 className="text-2xl font-bold text-green-500 mb-4">Join Our Community</h2>
            <p className="mb-4 text-md">
              We’re more than just an app – we’re a community of music enthusiasts who share a common passion. Connect with us on social media, share your playlists, and join the conversation.
            </p>

            <div className="flex mt-6 items-center justify-center gap-7">
              <a href="#" className="mr-4">
                <i className="fa-brands fa-facebook text-3xl hover:text-green-500 transition duration-300"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-instagram text-3xl hover:text-green-500 transition duration-300"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-linkedin text-3xl hover:text-green-500 transition duration-300"></i>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
