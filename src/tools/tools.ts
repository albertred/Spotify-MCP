import { server } from "../server.js";
import { CLIENTID, CLIENTSECRET, setupSpotifyAuth } from "../../config/index.js";


function play_current() {
    server.tool(
        "play_current",
        "Plays the current track",
        {}, 
        async () => {
            try {
				var sp = setupSpotifyAuth(); // authenticate
				sp.start_playback();
            } catch (error) {
                console.error("Error in playback", error);
                throw error; 
            }
        }
    );
}