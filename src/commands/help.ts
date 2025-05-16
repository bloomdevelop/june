import type { Command } from "@/types";
import { collections } from "..";
import { config } from "@/config";

const helpCommand: Command = {
	name: "help",
	disabled: false,
	execute: async (msg, args) => {
		const commandName = args[0]?.toLocaleLowerCase();

		if (!commandName) {
			msg.reply({
				embeds: [
					{
						title: "Help",
						description: "Speficy a command to get help about it",
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

        msg.reply({
            embeds: [
                {
                    title: `Help for command "${command.name}"`,
                    description: `Disabled: ${command.disabled ? "Yes" : "No"}`,
                    colour: config.embedColor,
                },
            ]
        })
	},
};

export default helpCommand;
