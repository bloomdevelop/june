import type { Command } from "../types";
import { readdir } from "node:fs/promises";
import { Logger } from "./logger";

/**
 * @description Collection of commands
 */
export const collections: Map<string, Command> = new Map();

/**
 * Asynchronously loads all command modules from the "./src/commands" directory.
 * Each command file is expected to export a default object conforming to the Command type.
 * Commands are loaded in parallel. If a command file has issues (e.g., missing name,
 * invalid structure, duplicate name), a warning is logged, and that specific command is skipped.
 * Successfully loaded commands are added to the provided `collections` Map.
 *
 * @async
 * @function loadCommands
 * @param {Map<string, Command>} collections - The Map instance to store loaded commands.
 * @returns {Promise<void>} A promise that resolves once all command loading attempts are complete.
 *                          It does not reject on individual command load failures; these are logged as warnings.
 */
export async function loadCommands(
	collections: Map<string, Command>,
): Promise<void> {
	const logger = new Logger();
	const start = Date.now();
	const commandFiles = await readdir("./src/commands");

	const importPromises = commandFiles.map(async (file) => {
		try {
			const { default: cmd } = await import(`../commands/${file}`);

			if (!cmd || typeof cmd !== "object") {
				logger.warn(`Invalid export in ${file}. Skipping.`);
				return;
			}
			if (typeof cmd.name !== "string" || !cmd.name.trim()) {
				logger.warn(`Command name is missing or invalid in ${file}. Skipping.`);
				return;
			}
			if (typeof cmd.execute !== "function") {
				logger.warn(
					`Command ${cmd.name} (from ${file}) is missing an execute function. Skipping.`,
				);
				return;
			}
			if (collections.has(cmd.name)) {
				logger.warn(
					`Duplicate command name "${cmd.name}" found in ${file}. Skipping.`,
				);
				return;
			}
			logger.info(`Loaded command: ${cmd.name}`);
			collections.set(cmd.name, cmd);
		} catch (error) {
			if (error instanceof Error) {
				logger.error(`Error loading command from ${file}: ${error.message}`);
			} else {
				logger.error(`Error loading command from ${file}: ${String(error)}`);
			}
		}
	});

	await Promise.all(importPromises);
	const end = Date.now();
	const seconds = ((end - start) / 1000).toFixed(3);
	logger.info(
		`${collections.size} commands loaded successfully. (${seconds}s wasted)`,
	);
}
