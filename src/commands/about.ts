import type { Command } from "@/types";
import textBuilder from "@/utils/textBuilder";
import pkg from "@/../package.json";
import { config } from "@/config";

const text = textBuilder([
	"June is a Revolt.chat bot built with bun and revolt.js, it's designed to be a multi-purpose bot.",
	`Version: \`${pkg.version}\``,
	`Bun Version: \`${Bun.version}\``,
	`Bun Revision: \`${Bun.revision}\``,
	`Memory Usage: \`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB\``,
	`Platform: \`${process.platform}\``,
	`Architecture: \`${process.arch}\``,
	`Node Version: \`${process.version}\``,
]);

const aboutCommand: Command = {
	name: "about",
	description: "Get information about June",
	disabled: false,
	execute: async (msg) => {
		await msg.reply({
			embeds: [
				{
					colour: config.embedColor,
					title: "About June",
					description: text,
				},
			],
		});
	},
};

export default aboutCommand;
