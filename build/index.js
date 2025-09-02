import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { register_tools } from "./tools/index.js";
import { startAuthServer } from "./auth/spotify.js";
export const server = new McpServer({
    name: "spotify-assist",
    version: "0.0.1",
    capabilities: {
        prompts: {},
        resources: {},
        tools: {},
    }
});
register_tools(); // Register tools with the server
// Main entry point for the server application
async function main() {
    // Start the auth server automatically
    startAuthServer();
    // Open login page in browser automatically
    const open = await import('open');
    setTimeout(() => {
        open.default('http://127.0.0.1:8888/login');
    }, 1000);
    const transport = new StdioServerTransport();
    // Connect the server logic to the transport layer
    await server.connect(transport);
}
main().catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
});
