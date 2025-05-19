import type { Command } from "@/types";

const testCommand: Command = {
	name: "test",
	description: "Test Command",
	disabled: false,
	execute: async (message) => {
		await message.reply("Test command executed!");
	},
};

export default testCommand;
