import { server } from "../index.js";
import { getSpotifyApi } from "../auth/spotify.js";
function play_current() {
    server.tool("play_current", "Plays the current track", {}, async () => {
        try {
            const spotifyApi = getSpotifyApi();
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
                        text: `Playback failed: ${error instanceof Error ? error.message : 'Unknown error'}. You may need to authenticate first by visiting http://localhost:3000/login`
                    }]
            };
        }
    });
}
// Called by server.ts to register tools
export function register_tools() {
    play_current();
}
