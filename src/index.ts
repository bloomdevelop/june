import { Client } from "revolt.js";
import type { Command } from "./types";
import { config } from "./config";
import { loadCommands, collections } from "./utils/loadCommands";

/**
 * @description Client instance
 */
export const client = new Client();

// Initialize and load commands
await loadCommands(collections);

client.on("ready", async () => {
	console.log(`Logged in as ${client.user?.username}`);
});

client.on("disconnected", () => {
	console.log("Bot got disconnected, trying it again...");
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
			await command.execute(message, args);
		}
	} catch (error) {
		console.error(error);
		await message.reply("An error occurred while executing the command.");
	}
});

client.loginBot(config.token);
