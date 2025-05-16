import type { Command } from "../types";

const echoCommand: Command = {
  name: "echo",
  disabled: false,
  execute: async (msg, args) => {
    await msg.reply(args.join(" "));
  },
};

export default echoCommand;
