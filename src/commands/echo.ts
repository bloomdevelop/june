import { t } from "@/utils/i18n";
import type { Command } from "../types";

const echoCommand: Command = {
	name: "echo",
	description: await t("echo"),
	disabled: false,
	execute: async (msg, args) => {
		await msg.reply(args.join(" "));
	},
};

export default echoCommand;
