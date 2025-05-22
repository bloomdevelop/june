import type { Command } from "@/types";
import { t } from "@/utils/i18n";

const testCommand: Command = {
	name: "test",
	description: await t("test"),
	disabled: false,
	execute: async (message) => {
		await message.reply(await t("test.text"));
	},
};

export default testCommand;
