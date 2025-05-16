import { config } from "@/config";
import type { Command } from "@/types";

const kickCommand: Command = {
    name: "kick",
    description: "Kick a user from the server",
    disabled: false,
    execute: async (msg, args) => {
        const userId = args[0];
        const reason = args.slice(1).join(" ") || "No reason provided";

        if (!userId) {
            msg.reply("Please provide a user ID to kick.");
            return;
        }

        try {
            const permission = msg.member?.server?.havePermission("KickMembers");

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
                                title: "You have been kicked",
                                description: `You have been kicked from the server for the following reason: ${reason}`,
                                colour: config.embedColor,
                            },
                        ],
                    });
                });

                msg.server?.kickUser(member).then(() => {
                    msg.reply(`User ${userId} has been kicked.`);
                }).catch((error) => {
                    msg.reply(`Failed to kick user: ${error.message}`);
                });
            });
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
            }
        }
    }
}