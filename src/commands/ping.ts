import { t } from "@/utils/i18n";
import type { Command } from "../types";

const pingCommand: Command = {
	name: "ping",
	description: await t("ping"),
	disabled: false,
	execute: async (msg) => {
		msg.channel?.sendMessage("Pong!");
	},
};

export default pingCommand;
