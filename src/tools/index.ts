import { server } from "../index.js";
import { z } from "zod";
import { getAuthenticatedSpotifyApi } from "../auth/spotify.js";

// Helper function to wrap tool handlers with authentication
function withAuth(handler: (spotifyApi: any, args?: any) => Promise<any>) {
    return async (args?: any) => {
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
            
            return await handler(spotifyApi, args);
        } catch (error) {
            console.error("Error in tool execution", error);
            return {
                content: [{
                    type: "text", 
                    text: `Operation failed: ${error instanceof Error ? error.message : 'Unknown error'}.`
                }]
            };
        }
    };
}

function play_current() {
    server.tool(
        "play_current",
        "Plays the current track",
        {},
        withAuth(async (spotifyApi) => {
            // Check for available devices first
            const devices = await spotifyApi.getMyDevices();
            await spotifyApi.play();
            return {
                content: [{
                    type: "text",
                    text: "Successfully started playback"
                }]
            };
        })
    );
}

function getTopArtists() {
    server.tool(
        "get_top_artists",
        "Gets the current user's top artists",
        {}, 
        withAuth(async (spotifyApi) => {
            const topArtists = await spotifyApi.getMyTopArtists();
            return {
                content: [{
                    type: "text",
                    text: `Your top artists are: ${topArtists.body.items.map((artist: any) => artist.name).join(", ")}`
                }]
            };
        })
    );
}

function createPlaylist() {
    const newPlaylistShape = {
        name: z.string().describe("The name of the playlist"),
        description: z.string().describe("A description for the playlist"),
        public: z.boolean().describe("Whether the playlist is public or private").default(true)
    };

    server.tool(
        "create_playlist",
        "Creates a new empty playlist",
        newPlaylistShape,
        withAuth(async (spotifyApi, args) => {
            const newPlaylist = await spotifyApi.createPlaylist(args.name, { 
                description: args.description,
                public: args.public 
            });
            return {
                content: [{
                    type: "text",
                    text: `Created new playlist: ${newPlaylist.body.name}`
                }]
            };
        })
    );  
}

// Called by server.ts to register tools
export function register_tools() {
    play_current();
    getTopArtists();
    createPlaylist();
}