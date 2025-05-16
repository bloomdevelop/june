import type { Command } from "../types";

const pingCommand: Command = {
  name: "ping",
  disabled: false,
  execute: async (msg) => {
    msg.channel?.sendMessage("Pong!");
  },
};

export default pingCommand;
