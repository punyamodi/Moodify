import axios from 'axios';

const clientId = import.meta.env.VITE_CLIENT;
const clientSecret = import.meta.env.VITE_SECRET;

let token = null;



const fetchWebApi = async (endpoint, method, body) => {
    try {
        if (!token) {
            await getAccessToken(); // Ensure token is available
        }

        const res = await fetch(`https://api.spotify.com/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method,
            body: body ? JSON.stringify(body) : null
        });

        if (!res.ok) {
            console.error(`Error status: ${res.status}`);
            return "error";
        }

        const res2 = await res.json();
        return res2;
    } catch (error) {
        console.error('Error fetching from Spotify API:', error);
        return "error";
    }
};

const levenshteinDistance = (a, b) => {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i])
        .map((row, i) => row.concat(Array.from({ length: a.length + 1 }, (_, j) => (i === 0 ? j : 0))));

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
    }

    return matrix[b.length][a.length];
};

export const getRecommendations = async (songName) => {
    try {
     
        const encodedSongName = encodeURIComponent(songName);
        const res5 = await fetchWebApi(`v1/search?q=${encodedSongName}&type=track&limit=2`, 'GET');
 
        
        if (!res5 || res5.error) {
            console.error('Error fetching top tracks:', res5.error);
            return "error";
        }

        const track1 = `${res5.tracks.items[0].artists[0].name} ${res5.tracks.items[0].name}`;
        const track2 = `${res5.tracks.items[1].artists[0].name} ${res5.tracks.items[1].name}`;

        const distance1 = levenshteinDistance(songName, track1);
        const distance2 = levenshteinDistance(songName, track2);

        const bestTrack = distance1 < distance2 ? res5.tracks.items[0] : res5.tracks.items[1];
        const id = bestTrack.id;

        const res4 = await fetchWebApi(`v1/recommendations?seed_tracks=${id}`, 'GET');
        if (res4.error) {
            console.error('Error fetching recommendations:', res4.error);
            return "error";
        }
      
        return res4;
    } catch (error) {
        console.error('Error in getRecommendations:', error);
        return "error";
    }
};
