import { db } from "@/db";
import { messagesTable } from "@/db/schema";
import type { Message } from "revolt.js";
import { config } from "../config";
import { collections } from "../utils/loadCommands";
import { Logger } from "../utils/logger";

const logger = new Logger();

export async function handleMessageCreate(message: Message) {
	if (!message.author) return;
	if (!message.content.startsWith(config.prefix)) {
		const newMessage: typeof messagesTable.$inferInsert = {
			messageId: message.id,
			userId: message.author.id,
			content: message.content,
		};

		await db
			.insert(messagesTable)
			.values(newMessage)
			.then(() => {
				logger.info(`Message saved: ${message.content}`);
			})
			.catch((error) => {
				logger.error(`Error saving message: ${error}`);
			});
	}

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
					description: `An error occurred while executing the command:\n\
${error}\n\
`,
					colour: config.embedColor,
				},
			],
		});
	}
}
