import dotenv from 'dotenv';
import SpotifyWebApi from 'spotify-web-api-node';
dotenv.config();
export const CLIENTID = process.env.CLIENTID;
export const CLIENTSECRET = process.env.CLIENTSECRET;
export const REDIRECTURI = process.env.REDIRECTURI || 'http://localhost:3000/callback';
export function setupSpotifyAuth() {
    if (!CLIENTID || !CLIENTSECRET) {
        throw new Error("Spotify authentication failed: CLIENTID and CLIENTSECRET environment variables are required");
    }
    const spotifyApi = new SpotifyWebApi({
        clientId: CLIENTID,
        clientSecret: CLIENTSECRET,
        redirectUri: REDIRECTURI
    });
    console.log("Spotify authentication config initialized successfully.");
    return spotifyApi;
}
