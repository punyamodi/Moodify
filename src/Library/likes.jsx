import { fetchHistory, fetchUser } from "../Firebase/database";
import useMediaQuery from "../useMedia";
import { useEffect, useState, useContext } from "react";
import { Context } from "../main";

function Likes() {
    const [likes, setLikes] = useState([]);
    const isAboveMedium = useMediaQuery("(min-width:768px)");
    const { setSongid } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const localUser = JSON.parse(localStorage.getItem("Users"));

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const res = await fetchUser();
                setLikes(res);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLikes();
    }, []);

    const play = (id) => {
        localStorage.setItem("songid", id);
        setSongid(id);
    };

    return (
        <>
            {!loading ? (
                <>
                    {localUser ? (
                        <>
                            {isAboveMedium ? (
                                <div
                                    className="h-screen w-5/6 m-12 mb-12 flex flex-col bg-black text-white shadow-lg overflow-y-scroll scrollbar-hide"
                                >
                                    <div className="w-full h-64 bg-gradient-to-b from-green-500 to-black flex items-center p-4">
                                        <img
                                            src="https://misc.scdn.co/liked-songs/liked-songs-300.png"
                                            alt="Liked Songs"
                                            className="h-48 w-48 rounded-lg shadow-md"
                                        />
                                        <div className="ml-5">
                                            <h1 className="font-bold text-5xl">Liked Songs</h1>
                                        </div>
                                    </div>

                                    <div className="flex flex-col p-6">
                                        {likes.map((song, index) => (
                                            <div
                                                className="flex items-center gap-8 py-4 hover:bg-gray-800 rounded-lg cursor-pointer transition duration-200"
                                                key={song.id}
                                                onClick={() => play(song.songId)}
                                            >
                                                <span className="text-xl w-12">{index + 1}</span>
                                                <img
                                                    src={song.songUrl}
                                                    className="h-12 w-12 rounded-lg object-cover"
                                                    alt={song.songName}
                                                />
                                                <div className="flex flex-grow justify-between">
                                                    <h1 className="text-md font-bold">{song.songName}</h1>
                                                    <h1 className="text-md text-gray-400">{song.songYear}</h1>
                                                </div>
                                                <img
                                                    src="https://cdn-icons-png.flaticon.com/128/9376/9376391.png"
                                                    className="h-8 w-8"
                                                    alt="Options"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="h-24"></div>
                                </div>
                            ) : (
                                <div
                                    className="h-screen w-full mb-24 flex flex-col bg-black text-white shadow-lg overflow-y-scroll scrollbar-hide"
                                >
                                    <div className="w-full h-64 bg-gradient-to-b from-green-500 to-black flex items-center p-4">
                                        <img
                                            src="https://misc.scdn.co/liked-songs/liked-songs-300.png"
                                            alt="Liked Songs"
                                            className="h-48 w-48 rounded-lg shadow-md"
                                        />
                                        <div className="ml-5">
                                            <h1 className="font-bold text-4xl">Liked Songs</h1>
                                        </div>
                                    </div>

                                    <div className="flex flex-col p-6">
                                        {likes.map((song, index) => (
                                            <div
                                                className="flex items-center gap-8 py-4 hover:bg-gray-800 rounded-lg cursor-pointer transition duration-200"
                                                key={song.id}
                                                onClick={() => play(song.songId)}
                                            >
                                                <span className="text-sm w-8">{index + 1}</span>
                                                <img
                                                    src={song.songUrl}
                                                    className="h-12 w-12 rounded-lg object-cover"
                                                    alt={song.songName}
                                                />
                                                <div className="flex flex-grow justify-between">
                                                    <h1 className="text-sm font-bold">{song.songName}</h1>
                                                    <h1 className="text-sm text-gray-400">{song.songYear}</h1>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="h-24"></div>
                                </div>
                            )}
                        </>
                    ) : (
                        <h1 className="text-green-500 text-3xl font-bold text-center mt-10">Login to view your likes</h1>
                    )}
                </>
            ) : (
                <span className="text-green-500 text-3xl font-bold">Loading.....</span>
            )}
        </>
    );
}

export default Likes;
