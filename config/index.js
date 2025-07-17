
import dotenv from 'dotenv';

dotenv.config();

export const CLIENTID = process.env.CLIENTID;
export const CLIENTSECRET = process.env.CLIENTSECRET;

export function setupSpotifyAuth() {
    const authConfig = {
        client_id: CLIENTID,
        client_secret: CLIENTSECRET,
        redirect_uri: "http://127.0.0.1:8888/callback",
        scope: "user-read-playback-state user-modify-playback-state user-library-read user-library-modify playlist-modify-public playlist-modify-private"
    };

    if (!CLIENTID || !CLIENTSECRET) {
        throw new Error("Spotify authentication failed: CLIENTID and CLIENTSECRET environment variables are required");
    }

    console.log("Spotify authentication config initialized successfully.");
    return authConfig;
}
