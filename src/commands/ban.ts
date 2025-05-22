import { config } from "@/config";
import type { Command } from "@/types";
import { t } from "@/utils/i18n";
import { client } from "..";

const banCommand: Command = {
	name: "ban",
	description: await t("ban"),
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
		if (!botMember?.server?.havePermission("BanMembers")) {
			msg.reply({
				embeds: [
					{
						title: await t("system.error.title"),
						description: await t("system.missingPermission.ban"),
						colour: config.embedColor,
					},
				],
			});
			return;
		}

		try {
			const permission = msg.member?.server?.havePermission("BanMembers");

			console.log(permission);

			if (!permission) {
				msg.reply(await t("system.noPermission.ban"));
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
								title: await t("ban.dm.title"),
								description: await t("ban.dm.description", {
									values: { reason: reason },
								}),
								colour: config.embedColor,
							},
						],
					});
				});

				msg.server
					?.banUser(member, { reason })
					.then(async () => {
						msg.reply(await t("ban.success", { values: { userId: userId } }));
					})
					.catch(async (error) => {
						msg.reply(
							await t("ban.failed", {
								values: {
									error: error.message,
								},
							}),
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
				return;
			}
		}
	},
};

export default banCommand;
