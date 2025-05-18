import { config } from "@/config";
import type { Command } from "@/types";
import { collections } from "@/utils/loadCommands";
import { estimateShallowMemoryUsageOf } from "bun:jsc";

const estimateCommand: Command = {
	name: "estimate",
	description:
		"Returns a best-effort estimate of the memory usage of a collection in bytes",
	disabled: false,
	execute: async (msg) => {
		try {
			const usage = estimateShallowMemoryUsageOf(collections);
			await msg.reply({
				embeds: [
					{
						title: "Estimated Memory Usage from Command Collections",
						description: `\`${usage}\` bytes`,
						colour: config.embedColor,
					},
				],
			});
		} catch (error) {
			if (error instanceof Error) {
				console.error(`Error estimating memory usage: ${error.message}`);
				await msg.reply({
					embeds: [
						{
							title: "Error",
							description: `Error estimating memory usage: ${error.message}`,
							colour: config.embedColor,
						},
					],
				});
			} else {
				console.error(`Error estimating memory usage: ${String(error)}`);
				await msg.reply({
					embeds: [
						{
							title: "Error",
							description: `Error estimating memory usage: ${String(error)}`,
							colour: config.embedColor,
						},
					],
				});
			}
		}
	},
};

export default estimateCommand;
