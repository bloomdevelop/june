import { parse, safeParse } from "valibot";
import { ConfigSchema } from "./types";

/**
 * @description Bot's Configuration
 */
export const config = parse(ConfigSchema, {
  token: process.env.TOKEN,
  prefix: process.env.PREFIX,
  embedColor: process.env.EMBED_COLOR || "#C29359",
  geminiApiKey: process.env.GEMINI_API_KEY,
});
