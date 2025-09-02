import express from 'express';
import querystring from 'querystring';
import SpotifyWebApi from 'spotify-web-api-node';
import { CLIENTID, CLIENTSECRET, REDIRECTURI } from './index.js';
const app = express();
const PORT = 3000;
const spotifyApi = new SpotifyWebApi({
    clientId: CLIENTID,
    clientSecret: CLIENTSECRET,
    redirectUri: REDIRECTURI
});
// Authentication route
app.get('/login', (_req, res) => {
    const scopes = [
        'user-read-private',
        'user-read-email',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-read-playback-state',
        'user-modify-playback-state'
    ];
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: CLIENTID,
            scope: scopes.join(' '),
            redirect_uri: REDIRECTURI,
        }));
});
app.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        res.send('Authorization failed');
        return;
    }
    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        const accessToken = data.body['access_token'];
        const refreshToken = data.body['refresh_token'];
        spotifyApi.setAccessToken(accessToken);
        spotifyApi.setRefreshToken(refreshToken);
        // Store tokens securely (you might want to use a database or file)
        console.log('Access token:', accessToken);
        console.log('Refresh token:', refreshToken);
        res.send('Authentication successful! You can now use the Spotify MCP tools.');
    }
    catch (error) {
        console.error('Error getting tokens:', error);
        res.send('Authentication failed');
    }
});
export function startAuthServer() {
    app.listen(PORT, () => {
        console.log(`Spotify auth server running on http://localhost:${PORT}`);
        console.log(`Visit http://localhost:${PORT}/login to authenticate`);
    });
}
export function getSpotifyApi() {
    return spotifyApi;
}
