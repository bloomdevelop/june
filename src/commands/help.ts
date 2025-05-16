import type { Command } from "@/types";
import { collections } from "..";
import { config } from "@/config";
import textBuilder from "@/utils/textBuilder";

const helpCommand: Command = {
	name: "help",
    description: "Get help about commands",
	disabled: false,
	execute: async (msg, args) => {
		const commandName = args[0]?.toLocaleLowerCase();

		if (!commandName) {
            const commandList = Array.from(collections.values()).map((command) => {
                return `- ${command.name}`;
            });
            
            const commandText = textBuilder([
                "Available commands:",
                ...commandList,
                "Use `!help <command>` for more information about a specific command.",
            ])

			msg.reply({
				embeds: [
					{
						title: "Help",
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
                        title: "Help",
                        description: `Command "${commandName}" not found`,
                        colour: config.embedColor,
                    },
                ],
            });
            return;
        }

        const commandText = textBuilder([
            command.description,
            `Disabled: ${command.disabled ? "Yes" : "No"}`,
        ]);

        msg.reply({
            embeds: [
                {
                    title: `Help for command "${command.name}"`,
                    description: commandText,
                    colour: config.embedColor,
                },
            ]
        })
	},
};

export default helpCommand;
