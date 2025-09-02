import { server } from "../index.js";
import { getAuthenticatedSpotifyApi } from "../auth/spotify.js";
function play_current() {
    server.tool("play_current", "Plays the current track", {}, async () => {
        try {
            const spotifyApi = getAuthenticatedSpotifyApi();
            if (!spotifyApi) {
                return {
                    content: [{
                            type: "text",
                            text: "Not authenticated. Please visit http://127.0.0.1:8888/login to authenticate first."
                        }]
                };
            }
            // Check for available devices first
            const devices = await spotifyApi.getMyDevices();
            if (!devices.body.devices || devices.body.devices.length === 0) {
                return {
                    content: [{
                            type: "text",
                            text: "No active Spotify devices found. Please open Spotify on a device (phone, computer, etc.) first."
                        }]
                };
            }
            await spotifyApi.play();
            return {
                content: [{
                        type: "text",
                        text: "Successfully started playback"
                    }]
            };
        }
        catch (error) {
            console.error("Error in playback", error);
            return {
                content: [{
                        type: "text",
                        text: `Playback failed: ${error instanceof Error ? error.message : 'Unknown error'}.`
                    }]
            };
        }
    });
}
function getTopArtists() {
    server.tool("get_top_artists", "Gets the current user's top artists", {}, async () => {
        try {
            const spotifyApi = getAuthenticatedSpotifyApi();
            if (!spotifyApi) {
                return {
                    content: [{
                            type: "text",
                            text: "Not authenticated. Please visit http://127.0.0.1:8888/login to authenticate first."
                        }]
                };
            }
            const topArtists = await spotifyApi.getMyTopArtists();
            return {
                content: [{
                        type: "text",
                        text: `Your top artists are: ${topArtists.body.items.map(artist => artist.name).join(", ")}`
                    }]
            };
        }
        catch (error) {
            console.error("Error getting top artists", error);
            return {
                content: [{
                        type: "text",
                        text: `Failed to get top artists: ${error instanceof Error ? error.message : 'Unknown error'}.`
                    }]
            };
        }
    });
}
// Called by server.ts to register tools
export function register_tools() {
    play_current();
    getTopArtists();
}
