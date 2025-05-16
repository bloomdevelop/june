import type { FunctionDeclaration } from "@google/genai";
import type { Message } from "revolt.js";
import * as v from "valibot";

const CommandSchema = v.object({
  /**
   * Command's name
   */
  name: v.string(),
  /**
   * Disables the command
   */
  disabled: v.boolean(),
});

interface ICommand {
  /**
   * Runs the code inside when the command is executed
   * @param {Message} msg - The message that triggered the command
   * @param {string[]} args - The arguments passed to the command
   */
  execute: (msg: Message, args: string[]) => Promise<void>;
}

export type Command = v.InferInput<typeof CommandSchema> & ICommand;

export const ConfigSchema = v.object({
  /**
   * @description The token used to authenticate the bot with the Revolt API
   */
  token: v.string(),
  /**
   * @description The prefix for the bot
   */
  prefix: v.string(),
  /**
   * @description The color used for embeds
   */
  embedColor: v.string(),
  /**
   * @description The API token for Gemini API
   */
  geminiApiKey: v.optional(v.string()),
});

interface ITools {
  functionDeclarations: FunctionDeclaration[];
}

export type Tools = ITools;
