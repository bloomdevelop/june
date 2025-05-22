import { estimateShallowMemoryUsageOf } from "bun:jsc";
import { config } from "@/config";
import type { Command } from "@/types";
import { t } from "@/utils/i18n";
import { collections } from "@/utils/loadCommands";

const estimateCommand: Command = {
	name: "estimate",
	description: await t("estimate"),
	disabled: false,
	execute: async (msg) => {
		try {
			const usage = estimateShallowMemoryUsageOf(collections);
			await msg.reply({
				embeds: [
					{
						title: await t("estimate.title"),
						description: `\`${usage}\` bytes`,
						colour: config.embedColor,
					},
				],
			});
		} catch (error) {
			if (error instanceof Error) {
				console.error(`Error estimating memory usage: ${error.message}`);
				await msg.reply({
					embeds: [
						{
							title: await t("system.error.title"),
							description: await t("estimate.error", {
								values: { error: error.message },
							}),
							colour: config.embedColor,
						},
					],
				});
			} else {
				console.error(`Error estimating memory usage: ${String(error)}`);
				await msg.reply({
					embeds: [
						{
							title: await t("system.error.title"),
							description: await t("estimate.error", {
								values: { error: String(error) },
							}),
							colour: config.embedColor,
						},
					],
				});
			}
		}
	},
};

export default estimateCommand;
