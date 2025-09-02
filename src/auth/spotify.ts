import express from 'express';
import querystring from 'querystring';
import SpotifyWebApi from 'spotify-web-api-node';
import fs from 'fs';
import path from 'path';
import { CLIENTID, CLIENTSECRET, REDIRECTURI } from './index.js';

const app = express();
const PORT = 8888;
const TOKEN_FILE = path.join(process.cwd(), 'data', 'tokens.json');

const spotifyApi = new SpotifyWebApi({
    clientId: CLIENTID,
    clientSecret: CLIENTSECRET,
    redirectUri: REDIRECTURI
});

// Authentication route
app.get('/login', (_req: express.Request, res: express.Response): void => {
    const scopes: string[] = [
        'user-read-private',
        'user-read-email',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'user-top-read',
        'streaming'
    ];

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: CLIENTID,
            scope: scopes.join(' '),
            redirect_uri: REDIRECTURI,
        }));
});

app.get('/callback', async (req: express.Request, res: express.Response) => {
    const code = req.query.code as string;
    
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
        
        // Store tokens securely
        await storeTokens(accessToken, refreshToken);
        console.log('Tokens stored successfully!');
        
        res.send('Authentication successful! You can now use the Spotify MCP tools.');
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.send('Authentication failed');
    }
});

export function startAuthServer(): void {
    app.listen(PORT, () => {
        console.log(`Spotify auth server running on http://127.0.0.1:${PORT}`);
        console.log(`Visit http://127.0.0.1:${PORT}/login to authenticate`);
    });
}

async function storeTokens(accessToken: string, refreshToken: string): Promise<void> {
    const tokens = {
        access_token: accessToken,
        refresh_token: refreshToken,
        timestamp: Date.now()
    };
    
    // Ensure data directory exists
    const dataDir = path.dirname(TOKEN_FILE);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
}

export function loadStoredTokens(): { accessToken: string; refreshToken: string } | null {
    try {
        if (!fs.existsSync(TOKEN_FILE)) {
            return null;
        }
        
        const data = fs.readFileSync(TOKEN_FILE, 'utf8');
        const tokens = JSON.parse(data);
        
        return {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token
        };
    } catch (error) {
        console.error('Error loading stored tokens:', error);
        return null;
    }
}

export function getSpotifyApi(): SpotifyWebApi {
    return spotifyApi;
}

export function getAuthenticatedSpotifyApi(): SpotifyWebApi | null {
    const tokens = loadStoredTokens();
    if (!tokens) {
        return null;
    }
    
    spotifyApi.setAccessToken(tokens.accessToken);
    spotifyApi.setRefreshToken(tokens.refreshToken);
    return spotifyApi;
}