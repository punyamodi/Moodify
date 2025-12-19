import { fetchHistory, fetchUser } from "../Firebase/database";
import useMediaQuery from "../useMedia";
import { useEffect, useState, useContext } from "react";
import { Context } from "../main";
import { Link } from "react-router-dom";

function Likes() {
    const [likes, setLikes] = useState([]);
    const isAboveMedium = useMediaQuery("(min-width:768px)");
    const { setSongid } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const localUser = JSON.parse(localStorage.getItem("Users"));
    const [hoveredId, setHoveredId] = useState(null);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const res = await fetchUser();
                setLikes(res);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        if (localUser) {
            fetchLikes();
        } else {
            setLoading(false);
        }
    }, []);

    const play = (id) => {
        localStorage.setItem("songid", id);
        setSongid(id);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-deep-space pt-24 pb-32">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="animate-pulse">
                        <div className="h-48 rounded-3xl bg-gradient-to-r from-aurora-cyan/20 to-aurora-teal/20 mb-8" />
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="skeleton h-16 rounded-xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!localUser) {
        return (
            <div className="min-h-screen bg-deep-space flex items-center justify-center pt-24 pb-32">
                <div className="text-center max-w-md mx-auto px-6 animate-fade-in">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-aurora flex items-center justify-center shadow-glow-cyan">
                        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-display font-bold mb-4">
                        Your Liked Songs
                    </h2>
                    <p className="text-white/50 mb-8">
                        Sign in to save your favorite songs and access them anytime.
                    </p>
                    <Link to="/login" className="btn-primary">
                        <span>Sign In</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-deep-space pt-24 pb-32">
            {/* Ambient Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-aurora-teal/10 rounded-full blur-[150px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-aurora-cyan/8 rounded-full blur-[120px]" style={{ animationDelay: '2s' }} />
            </div>

            <div className={`max-w-4xl mx-auto px-6 relative z-10 ${isAboveMedium ? '' : 'pb-20'}`}>
                {/* Hero Section */}
                <div className="glass-card p-8 mb-8 animate-fade-in overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-aurora-teal/20 via-aurora-cyan/10 to-transparent" />
                    <div className="relative flex items-center gap-6">
                        <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl bg-gradient-aurora shadow-glow-teal flex items-center justify-center flex-shrink-0">
                            <svg className="w-16 h-16 lg:w-20 lg:h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-white/50 mb-2">Playlist</p>
                            <h1 className="text-3xl lg:text-5xl font-display font-bold mb-2">
                                Liked Songs
                            </h1>
                            <p className="text-white/50">
                                {likes.length} {likes.length === 1 ? 'song' : 'songs'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Song List */}
                {likes.length > 0 ? (
                    <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {likes.map((song, index) => (
                            <div
                                key={song.id}
                                className="song-item group"
                                onClick={() => play(song.songId)}
                                onMouseEnter={() => setHoveredId(song.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                {/* Rank */}
                                <span className="w-10 text-center">
                                    {hoveredId === song.id ? (
                                        <svg className="w-5 h-5 mx-auto text-aurora-teal" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    ) : (
                                        <span className="text-sm text-white/40">{index + 1}</span>
                                    )}
                                </span>

                                {/* Image & Title */}
                                <img
                                    src={song.songUrl}
                                    className="song-item-image"
                                    alt={song.songName}
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-white truncate group-hover:text-aurora-teal transition-colors">
                                        {song.songName}
                                    </h3>
                                    <p className="text-sm text-white/40">{song.songYear}</p>
                                </div>

                                {/* Like Button */}
                                <button className="w-10 h-10 rounded-full text-aurora-teal flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-12 text-center animate-fade-in">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
                            <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-display font-bold mb-2">No liked songs yet</h3>
                        <p className="text-white/50 mb-6">Start exploring and like songs to build your collection</p>
                        <Link to="/discover" className="btn-primary">
                            <span>Discover Music</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Likes;
