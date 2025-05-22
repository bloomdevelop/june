import { config } from "@/config";
import type { Command } from "@/types";
import { t } from "@/utils/i18n";
import textBuilder from "@/utils/textBuilder";
import { client } from "..";

const voteDuration = 10 * 1000; // 10 seconds
const voteThreshold = 0.5; // 50% of votes needed to kick

const votekickCommand: Command = {
	name: "votekick",
	description: await t("votekick"),
	disabled: false,
	execute: async (msg, args) => {
		const userId = args[0];
		const reason =
			args.slice(1).join(" ") || (await t("system.reasonFallback"));

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

		if (!userId) {
			throw new Error(await t("system.missingUserIdField"));
		}

		try {
			const members = await msg.channel?.server?.fetchMembers();
			const user = members?.members.find((member) => {
				const searchTerm = args[0]?.trim();
				const username = member.user?.username?.trim();

				return (
					member.id.user === searchTerm ||
					(username && username.toLowerCase() === searchTerm?.toLowerCase())
				);
			});

			if (!user) {
				throw new Error(await t("system.userNotFound"));
			}

			if (user?.user?.bot) {
				throw new Error(await t("system.attemptedVotekickBot"));
			}

			const votekickText = textBuilder([
				await t("votekick.voteStart", {
					values: {
						user: msg.author?.displayName || msg.author?.username,
						target: user?.displayName || user?.user?.username,
					},
				}),
				reason,
				await t("votekick.hint"),
			]);

			msg.channel
				?.sendMessage({
					embeds: [
						{
							title: await t("votekick.title"),
							description: votekickText,
						},
					],
				})
				.then(async (voteMsg) => {
					try {
						await Promise.all([
							voteMsg.react(encodeURIComponent("\u2705")),
							voteMsg.react(encodeURIComponent("\u274C")),
						]);

						await new Promise((resolve) => setTimeout(resolve, voteDuration));

						const yesReactions = voteMsg.reactions.get("\u2705");
						const noReactions = voteMsg.reactions.get("\u274C");

						const yesCount = yesReactions?.size || 0;
						const noCount = noReactions?.size || 0;

						const allMembers =
							(await voteMsg.server?.fetchMembers())?.members || [];
						const onlineMembers = allMembers.filter(
							(m) => m.user?.online === true,
						);
						const memberCount = onlineMembers.length;
						if (!memberCount) {
							throw new Error(await t("system.noOnlineUsers"));
						}

						const requiredVotes = Math.ceil(memberCount * voteThreshold);
						const doesVoteKickPass =
							yesCount > noCount && yesCount >= requiredVotes;

						if (doesVoteKickPass) {
							await user.user?.openDM().then(async (dm) => {
								dm.sendMessage({
									embeds: [
										{
											title: await t("votekick.dm.title"),
											description: await t("votekick.dm.description", {
												values: {
													reason: reason,
												},
											}),
											colour: config.embedColor,
										},
									],
								});
							});

							await msg.server?.kickUser(user);

							const resultSuccessText = textBuilder([
								`## ${await t("votekick.result.title.success")}`,
								await t("votekick.result.success", {
									values: {
										target: user.displayName || user.user?.username,
									},
								}),
								await t("votekick.result.yesCount", {
									values: {
										yesCount,
									},
								}),
								await t("votekick.result.noCount", {
									values: {
										noCount,
									},
								}),
								await t("votekick.result.requiredVotes", {
									values: {
										requiredVotes,
									},
									count: requiredVotes,
								}),
							]);

							voteMsg.edit({
								embeds: [
									{
										title: await t("votekick.result.title"),
										description: resultSuccessText,
										colour: config.embedColor,
									},
								],
							});
						} else {
							const resultFailedText = textBuilder([
								`## ${await t("votekick.result.title.failed")}`,
								await t("votekick.result.failed", {
									values: {
										target: user.displayName || user.user?.username,
									},
								}),
								await t("votekick.result.yesCount", {
									values: {
										yesCount,
									},
								}),
								await t("votekick.result.noCount", {
									values: {
										noCount,
									},
								}),
								await t("votekick.result.requiredVotes", {
									values: {
										requiredVotes,
									},
									count: requiredVotes,
								}),
							]);

							voteMsg.edit({
								embeds: [
									{
										title: await t("votekick.result.title"),
										description: resultFailedText,
										colour: config.embedColor,
									},
								],
							});
						}
					} catch (error) {
						if (error instanceof Error) {
							console.error(error);
							voteMsg.edit({
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
	},
};

export default votekickCommand;
