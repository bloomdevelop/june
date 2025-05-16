import type { Command } from "../types";

const pingCommand: Command = {
  name: "ping",
  description: "Check if the bot is alive",
  disabled: false,
  execute: async (msg) => {
    msg.channel?.sendMessage("Pong!");
  },
};

export default pingCommand;
