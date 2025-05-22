import { config } from "@/config";
import type { Command } from "@/types";
import { t } from "@/utils/i18n";
import textBuilder from "@/utils/textBuilder";

const text = textBuilder([
	"June is a Revolt.chat bot",
	`Bun Version: \`${Bun.version}\``,
	`Bun Revision: \`${Bun.revision}\``,
	`Memory Usage: \`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB\``,
	`Platform: \`${process.platform}\``,
	`Architecture: \`${process.arch}\``,
	`Node Version: \`${process.version}\``,
]);

const aboutCommand: Command = {
	name: "about",
	description: await t("about"),
	disabled: false,
	execute: async (msg) => {
		await msg.reply({
			embeds: [
				{
					colour: config.embedColor,
					title: await t("about.title"),
					description: text,
				},
			],
		});
	},
};

export default aboutCommand;
