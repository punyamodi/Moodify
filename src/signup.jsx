import React, { useState, useContext } from 'react';
import useMediaQuery from './useMedia';
import { auth, googleProvider } from './Firebase/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithRedirect, updateProfile } from 'firebase/auth';
import { Context } from './main';
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';

function Signup() {
  const { setUsers, Users } = useContext(Context);
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const isAboveMedium = useMediaQuery("(min-width: 768px)");
  const [dloading, setDloading] = useState(true);

  const configUser = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  const SignUp = async (e) => {
    e.preventDefault();
    try {
      setDloading(false);
      const res = await createUserWithEmailAndPassword(auth, user.email, user.password);
      const User = res.user;

      await updateProfile(User, { displayName: user.name });

      localStorage.setItem("Users", JSON.stringify(User));
      setUsers(User);
      setDloading(true);
      toast.success("Account created successfully! 🎉");
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error(error.message || "Failed to create account");
      setDloading(true);
    }
  }

  const signAuth = async (provider) => {
    try {
      if (provider === "google") {
        await signInWithRedirect(auth, googleProvider);
      }
    } catch (error) {
      console.error(`Error with ${provider}:`, error);
      toast.error("Authentication failed");
    }
  }

  return (
    <div className="min-h-screen bg-deep-space flex">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-aurora-teal/20 rounded-full blur-[200px] animate-float" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-aurora-cyan/15 rounded-full blur-[150px]" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-aurora-cyan/10 rounded-full blur-[120px]" />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        theme="dark"
        transition={Bounce}
        toastStyle={{
          background: 'rgba(15, 15, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
        }}
      />

      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          {/* Mobile Logo */}
          {!isAboveMedium && (
            <div className="flex items-center gap-3 justify-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-aurora flex items-center justify-center shadow-glow-cyan">
                <span className="text-2xl font-display font-bold text-white">M</span>
              </div>
              <span className="text-2xl font-display font-bold">
                Mood<span className="text-gradient">ify</span>
              </span>
            </div>
          )}

          {/* Form Card */}
          <div className="glass-card p-8 lg:p-10 space-y-8">
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-display font-bold text-white">
                Create Account
              </h2>
              <p className="text-white/50">
                Join millions of music lovers
              </p>
            </div>

            <form onSubmit={SignUp} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="John Doe"
                    name="name"
                    onChange={configUser}
                    required
                    className="w-full pl-12"
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    name="email"
                    onChange={configUser}
                    required
                    className="w-full pl-12"
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    name="password"
                    onChange={configUser}
                    required
                    minLength={6}
                    className="w-full pl-12"
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-xs text-white/40">Must be at least 6 characters</p>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input type="checkbox" required className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 checked:bg-aurora-cyan" />
                <span className="text-sm text-white/50">
                  I agree to the{' '}
                  <a href="#" className="text-aurora-cyan hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-aurora-cyan hover:underline">Privacy Policy</a>
                </span>
              </div>

              <button
                disabled={!dloading}
                type="submit"
                className="btn-primary w-full group mt-6"
              >
                {dloading ? (
                  <span className="flex items-center justify-center gap-2">
                    Create Account
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                ) : (
                  <div className="loading-spinner mx-auto" style={{ width: '24px', height: '24px' }} />
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-cosmic-dark text-sm text-white/40">or sign up with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => signAuth("google")}
                className="btn-secondary flex items-center justify-center gap-3 py-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium">Google</span>
              </button>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-white/50">
            Already have an account?{' '}
            <Link to="/login" className="text-aurora-cyan hover:text-aurora-teal transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Visual */}
      {isAboveMedium && (
        <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12">
          <div className="relative z-10 max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Decorative Rings */}
            <div className="absolute -top-32 -right-32 w-64 h-64 border border-aurora-teal/20 rounded-full animate-float" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 border border-aurora-cyan/20 rounded-full" style={{ animationDelay: '3s' }} />
            
            <div className="space-y-8">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-aurora-teal to-aurora-cyan flex items-center justify-center shadow-glow-teal animate-glow-pulse">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              
              <h1 className="text-6xl xl:text-7xl font-display font-bold leading-[0.9]">
                Start Your
                <br />
                <span className="text-gradient">Journey.</span>
              </h1>
              
              <p className="text-lg text-white/50 max-w-sm leading-relaxed">
                Create an account and unlock a world of personalized music experiences tailored to your unique mood and preferences.
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { icon: '🎯', title: 'Smart Match', desc: 'AI mood detection' },
                  { icon: '🎨', title: 'Customized', desc: 'Your unique sound' },
                  { icon: '🌍', title: 'Global', desc: '50M+ songs' },
                  { icon: '⚡', title: 'Fast', desc: 'Instant streaming' }
                ].map((item, i) => (
                  <div key={i} className="glass-card-subtle p-4 space-y-2">
                    <span className="text-2xl">{item.icon}</span>
                    <h4 className="font-medium text-white">{item.title}</h4>
                    <p className="text-sm text-white/40">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
