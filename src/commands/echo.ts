import type { Command } from "../types";

const echoCommand: Command = {
  name: "echo",
  description: "Echoes the message back to you",
  disabled: false,
  execute: async (msg, args) => {
    await msg.reply(args.join(" "));
  },
};

export default echoCommand;
