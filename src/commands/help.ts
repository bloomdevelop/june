import { config } from "@/config";
import type { Command } from "@/types";
import { t } from "@/utils/i18n";
import { collections } from "@/utils/loadCommands";
import textBuilder from "@/utils/textBuilder";

const helpCommand: Command = {
	name: "help",
	description: await t("help"),
	disabled: false,
	execute: async (msg, args) => {
		const commandName = args[0]?.toLocaleLowerCase();

		if (!commandName) {
			const commandList = Array.from(collections.values()).map((command) => {
				return `- ${command.name}`;
			});

			const commandText = textBuilder([
				await t("help.availableCommands"),
				...commandList,
				await t("help.hint"),
			]);

			msg.reply({
				embeds: [
					{
						title: await t("help.title"),
						description: commandText,
						colour: config.embedColor,
					},
				],
			});
			return;
		}

		const command = collections.get(commandName);

		if (!command) {
			msg.reply({
				embeds: [
					{
						title: await t("help.title"),
						description: await t("system.commandNotFound", {
							values: { command: commandName },
						}),
						colour: config.embedColor,
					},
				],
			});
			return;
		}

		const commandText = textBuilder([
			command.description,
            await t("help.command.disabled", {
                values: {
                    value: command.disabled ? "Yes" : "No",
                }
            })
		]);

		msg.reply({
			embeds: [
				{
					title: await t("help.commandHelp"),
					description: commandText,
					colour: config.embedColor,
				},
			],
		});
	},
};

export default helpCommand;
