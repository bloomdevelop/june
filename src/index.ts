import { Client } from "revolt.js";
import { config } from "./config";
import { handleMessageCreate } from "./utils/handleMessageCreate";
import { collections, loadCommands } from "./utils/loadCommands";
import { Logger } from "./utils/logger";

/**
 * @description Client instance
 */
export const client = new Client();
const logger = new Logger();

// Initialize and load commands
await loadCommands(collections);

client.on("connecting", () => {
	logger.info("Client: Connecting...");
});

client.on("ready", async () => {
	logger.info(`Client: Logged in as ${client.user?.username}`);
});

client.on("disconnected", () => {
	logger.warn("Bot got disconnected, trying it again...");
});

client.on("error", (error) => {
	logger.error(
		`Client Error: ${error instanceof Error ? error.message : String(error)}`,
	);
});

client.on("messageCreate", handleMessageCreate);

process.on("SIGINT", async () => {
	logger.info("System: SIGINT received. Shutting down...");
	collections.clear();
	logger.info("Commands collection cleared. Now Exiting...");
	process.exit(0);
});

await client.loginBot(config.token);
