import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

export const server = new McpServer({
    name: "spotify-assist",
    version: "0.0.1",
    capabilities: {
        prompts: {},  
        resources: {},
        tools: {},   
    }
});

// Main entry point for the server application
async function main(): Promise<void> {
    const transport = new StdioServerTransport();
    // Connect the server logic to the transport layer
    await server.connect(transport);
}

main().catch((error: Error) => {
	console.error("Error starting server:", error);
	process.exit(1);
});
