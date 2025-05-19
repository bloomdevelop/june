import { config } from "@/config";
import type { Command } from "@/types";
import textBuilder from "@/utils/textBuilder";
import { client } from "..";

const voteDuration = 10 * 1000; // 10 seconds
const voteThreshold = 0.5; // 50% of votes needed to kick

const votekickCommand: Command = {
	name: "votekick",
	description:
		"TF2 insipred votekick, it lets you to vote to kick a user from the server",
	disabled: false,
	execute: async (msg, args) => {
		const userId = args[0];
		const reason = args.slice(1).join(" ") || "No reason provided";

		const botMember = (await msg.channel?.server?.fetchMembers())?.members.find(
			(member) => member.id.user === client.user?.id,
		);
		if (!botMember?.server?.havePermission("KickMembers")) {
			msg.reply({
				embeds: [
					{
						title: "Error",
						description:
							"I don't have permission to kick members.\nCould you please configure to give me kick permission?",
						colour: config.embedColor,
					},
				],
			});
			return;
		}

		if (!userId) {
			throw new Error("Please provide a user ID to votekick.");
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
				throw new Error("User not found in the server.");
			}

			if (user?.user?.bot) {
				throw new Error("You can't votekick a bot.");
			}

			const votekickText = textBuilder([
				`${msg.author?.displayName || msg.author?.username} has started a votekick against ${user?.displayName || user?.user?.username}`,
				`Reason: ${reason}`,
				"React with \u2705 to vote yes, \u274C to vote no.",
			]);

			msg.channel
				?.sendMessage({
					embeds: [
						{
							title: "Votekick",
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

						const yesVotes = yesReactions?.size || 0;
						const noVotes = noReactions?.size || 0;

						const allMembers =
							(await voteMsg.server?.fetchMembers())?.members || [];
						const onlineMembers = allMembers.filter(
							(m) => m.user?.online === true,
						);
						const memberCount = onlineMembers.length;
						if (!memberCount) {
							throw new Error("No online members found in the server.");
						}

						const requiredVotes = Math.ceil(memberCount * voteThreshold);
						const doesVoteKickPass =
							yesVotes > noVotes && yesVotes >= requiredVotes;

						if (doesVoteKickPass) {
							await user.user?.openDM().then((dm) => {
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

							await msg.server?.kickUser(user);

							voteMsg.edit({
								embeds: [
									{
										title: "Votekick Result",
										description: `## Votekick passed!\n ${user.displayName || user.user?.username} has been kicked from the server.\nYes: ${yesVotes}, No: ${noVotes}, Required: ${requiredVotes}`,
										colour: config.embedColor,
									},
								],
							});
						} else {
							voteMsg.edit({
								embeds: [
									{
										title: "Votekick Result",
										description: `## Votekick failed!\nNot enough votes to kick ${user.displayName || user.user?.username}.\nYes: ${yesVotes}, No: ${noVotes}, Required: ${requiredVotes}`,
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
