import React, { useContext, useState } from "react";
import useMediaQuery from "./useMedia";
import { auth, googleProvider, appleProvider } from "./Firebase/firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Context } from "./main";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const { Users, setUsers } = useContext(Context);
  const isAboveMedium = useMediaQuery("(min-width: 768px)");
  const [user, setUser] = useState({ email: "", password: "" });
  const [dloading, setDloading] = useState(true);

  const signAuth = async (provider) => {
    try {
      let res;
      if (provider === "google") {
        res = await signInWithPopup(auth, googleProvider);
      } else if (provider === "apple") {
        res = await signInWithPopup(auth, appleProvider);
      }

      localStorage.setItem("Users", JSON.stringify(res.user));
      setUsers(res.user);
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      toast.error("Error with login provider");
    }
  };

  const signin = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onsubmit = async (e) => {
    try {
      setDloading(false);
      e.preventDefault();
      const res = await signInWithEmailAndPassword(auth, user.email, user.password);
      localStorage.setItem("Users", JSON.stringify(res.user));
      setUsers(res.user);
      setDloading(true);
    } catch (error) {
      console.log(error);
      toast.error("Wrong Password or Email");
      setDloading(true);
    }
  };

  return (
    <div className="bg-black h-screen text-white flex items-center justify-center">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

      {isAboveMedium ? (
        <div className="flex flex-col items-center justify-center w-1/2">
          <h1 className="text-4xl font-bold mb-8">LOGIN TO CONTINUE</h1>
          <form onSubmit={onsubmit} className="w-full flex flex-col items-center">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-gray-800 text-white rounded-full p-4 mb-4 focus:ring-2 focus:ring-green-500"
              name="email"
              onChange={signin}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-gray-800 text-white rounded-full p-4 mb-4 focus:ring-2 focus:ring-green-500"
              name="password"
              onChange={signin}
              required
              minLength={6}
            />
            <div className="flex justify-between w-full items-center">
              <h1 className="text-sm hover:text-green-500 cursor-pointer">Forget Password {">"}</h1>
              {dloading ? (
                <button className="bg-green-500 text-white rounded-full px-8 py-3 hover:bg-green-600 transition duration-300">
                  Login
                </button>
              ) : (
                <button className="bg-green-500 text-white rounded-full px-8 py-3 hover:bg-green-600 transition duration-300">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/1665/1665733.png"
                    className="animate-spin h-6"
                    alt="Loading"
                  />
                </button>
              )}
            </div>
          </form>

          <div className="flex flex-col items-center mt-8">
            <button
              className="bg-transparent border border-white text-white rounded-full px-8 py-3 flex items-center gap-3 hover:bg-white hover:text-black transition duration-300"
              onClick={() => signAuth("google")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/281/281764.png"
                className="h-6"
                alt="Google Login"
              />
              Google Login
            </button>
            <button
              className="bg-transparent border border-white text-white rounded-full px-8 py-3 flex items-center gap-3 mt-4 hover:bg-white hover:text-black transition duration-300"
              onClick={() => signAuth("apple")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/888/888857.png"
                className="h-6"
                alt="Apple Login"
              />
              Apple Login
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full px-6">
          <h1 className="text-3xl font-bold mb-6">LOGIN TO CONTINUE</h1>
          <form onSubmit={onsubmit} className="w-full flex flex-col items-center">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-gray-800 text-white rounded-full p-4 mb-4 focus:ring-2 focus:ring-green-500"
              name="email"
              onChange={signin}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-gray-800 text-white rounded-full p-4 mb-4 focus:ring-2 focus:ring-green-500"
              name="password"
              onChange={signin}
              required
              minLength={6}
            />
            <div className="flex justify-between w-full items-center">
              <h1 className="text-sm hover:text-green-500 cursor-pointer">Forget Password {">"}</h1>
              {dloading ? (
                <button className="bg-green-500 text-white rounded-full px-8 py-3 hover:bg-green-600 transition duration-300">
                  Login
                </button>
              ) : (
                <button className="bg-green-500 text-white rounded-full px-8 py-3 hover:bg-green-600 transition duration-300">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/1665/1665733.png"
                    className="animate-spin h-6"
                    alt="Loading"
                  />
                </button>
              )}
            </div>
          </form>

          <div className="flex flex-col items-center mt-8">
            <button
              className="bg-transparent border border-white text-white rounded-full px-8 py-3 flex items-center gap-3 hover:bg-white hover:text-black transition duration-300"
              onClick={() => signAuth("google")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/281/281764.png"
                className="h-6"
                alt="Google Login"
              />
              Google Login
            </button>
            <button
              className="bg-transparent border border-white text-white rounded-full px-8 py-3 flex items-center gap-3 mt-4 hover:bg-white hover:text-black transition duration-300"
              onClick={() => signAuth("apple")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/888/888857.png"
                className="h-6"
                alt="Apple Login"
              />
              Apple Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
