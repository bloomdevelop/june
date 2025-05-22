import { Client } from "revolt.js";
import { config } from "./config";
import { loadCommands, collections } from "./utils/loadCommands";
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

client.on("messageCreate", async (message) => {
	if (!message.author) return;
	if (!message.content.startsWith(config.prefix)) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const commandName = args.shift()?.toLowerCase();

	if (!commandName) return;

	const command = collections.get(commandName);

	if (!command) return;

	try {
		if (command.disabled) {
			await message.reply(`Command "${command.name}" is disabled`);
		} else {
			// Check if the command is implemented correctly
			if (typeof command.execute !== "function") {
				logger.error(
					`Command "${command.name}" doesn't have an "execute" method.`,
				);
				await message.reply({
					embeds: [
						{
							title: "Error",
							description: "This command is not implemented correctly.",
							colour: config.embedColor,
						},
					],
				});
			}

			await command.execute(message, args);
		}
	} catch (error) {
		if (error instanceof Error) {
			logger.error(
				`Error executing command "${command.name}": ${error.message}`,
			);
		} else {
			logger.error(
				`Error executing command "${command.name}": ${String(error)}`,
			);
		}

		await message.reply({
			embeds: [
				{
					title: "Error",
					description: `An error occurred while executing the command:\n\`\`\`\n${error}\n\`\`\``,
					colour: config.embedColor,
				},
			],
		});
	}
});

process.on("SIGINT", async () => {
	logger.info("System: SIGINT received. Shutting down...");
	collections.clear();
	logger.info("Commands collection cleared. Now Exiting...");
	process.exit(0);
});

await client.loginBot(config.token);
