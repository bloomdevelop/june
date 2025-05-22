import { config } from "@/config";
import type { Command } from "@/types";
import { t } from "@/utils/i18n";
import { client } from "..";

const kickCommand: Command = {
	name: "kick",
	description: await t("kick"),
	disabled: false,
	execute: async (msg, args) => {
		const userId = args[0];
		const reason =
			args.slice(1).join(" ") || (await t("system.reasonFallback"));

		if (!userId) {
			msg.reply(await t("system.missingUserIdField"));
			return;
		}

		const botMember = (await msg.channel?.server?.fetchMembers())?.members.find(
			(member) => member.id.user === client.user?.id,
		);
		if (!botMember?.server?.havePermission("KickMembers")) {
			msg.reply({
				embeds: [
					{
						title: await t("system.error.title"),
						description: await t("system.missingPermission.kick"),
						colour: config.embedColor,
					},
				],
			});
			return;
		}

		try {
			const permission = msg.member?.server?.havePermission("KickMembers");

			if (!permission) {
				msg.reply(await t("system.noPermission.kick"));
				return;
			}

			msg.server?.fetchMember(userId).then(async (member) => {
				if (!member) {
					msg.reply(await t("system.userNotFound"));
					return;
				}

				member.user?.openDM().then(async (dm) => {
					dm.sendMessage({
						embeds: [
							{
								title: await t("kick.dm.title"),
								description: await t("kick.dm.description", {
									values: { reason },
								}),
								colour: config.embedColor,
							},
						],
					});
				});

				msg.server
					?.kickUser(member)
					.then(async () => {
						msg.reply(await t("kick.success", { values: { userId } }));
					})
					.catch(async (error) => {
						msg.reply(
							await t("kick.failed", { values: { reason: error.message } }),
						);
					});
			});
		} catch (error) {
			if (error instanceof Error) {
				msg.reply({
					embeds: [
						{
							title: await t("system.error.title"),
							description: error.message,
							colour: config.embedColor,
						},
					],
				});
			}
		}
	},
};

export default kickCommand;
