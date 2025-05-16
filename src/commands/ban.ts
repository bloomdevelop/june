import type { Command } from "@/types";
import { config } from "@/config";

const banCommand: Command = {
	name: "ban",
	description: "Ban a user from the server",
	disabled: false,
	execute: async (msg, args) => {
		const userId = args[0];
		const reason = args.slice(1).join(" ") || "No reason provided";

		if (!userId) {
			msg.reply("Please provide a user ID to ban.");
			return;
		}

		try {
			const permission = msg.member?.server?.havePermission("BanMembers");

			console.log(permission);

			if (!permission) {
				msg.reply("You don't have permission to use this command.");
				return;
			}

			msg.server?.fetchMember(userId).then((member) => {
				if (!member) {
					msg.reply("User not found in the server.");
					return;
				}

				member.user?.openDM().then((dm) => {
					dm.sendMessage({
						embeds: [
							{
								title: "You have been banned",
								description: `You have been banned from the server for the following reason: ${reason}`,
								colour: config.embedColor,
							},
						]
					})
				})

				msg.server?.banUser(member, { reason }).then(() => {
					msg.reply(`User ${userId} has been banned.`);
				}).catch((error) => {
					msg.reply(`Failed to ban user: ${error.message}`);
				});
			})
		} catch (error) {
			if (error instanceof Error) {
				msg.reply({
					embeds: [
						{
							title: "Error",
							description: error.message,
							colour: config.embedColor,
						},
					],
				});
				return;
			}
		}
	},
};

export default banCommand;
