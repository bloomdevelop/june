import { Client } from "revolt.js";
import type { Command } from "./types";
import { readdir } from "node:fs/promises";
import { parse } from "valibot";
import { config } from "./config";

/**
 * @description Client instance
 * @type {Client}
 */
export const client = new Client();

/**
 * @description Collection of commands
 */
export const collections: Map<string, Command> = new Map();

client.on("ready", async () => {
  console.log(`Logged in as ${client.user?.username}`);

  const commands = await readdir("./src/commands");

  const importPromises = commands.map(async (command) => {
    const { default: cmd } = await import(`./commands/${command}`);
    collections.set(cmd.name, cmd);
  });

  await Promise.all(importPromises).then(() => {
    console.log(`${commands.length} commands loaded`);
  });
});

client.on("disconnected", () => {
  console.log("Bot got disconnected, trying it again...");
});

client.on("messageCreate", async (message) => {
  if (!message.author) return;
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName) return;

  const command = collections.get(commandName);

  if (!command) return;

  try {
    if (command.disabled) {
      await message.reply(`Command "${command.name}" is disabled`);
    } else {
      await command.execute(message, args);
    }
  } catch (error) {
    console.error(error);
    await message.reply("An error occurred while executing the command.");
  }
});

client.loginBot(config.token);
