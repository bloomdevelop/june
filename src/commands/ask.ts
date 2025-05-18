import { config } from "@/config";
import type { Command } from "@/types";
import textBuilder from "@/utils/textBuilder";
import { GoogleGenAI } from "@google/genai/node";

const askCommand: Command = {
	name: "ask",
	description: "Ask a question to Gemini",
	disabled: !config.geminiApiKey,
	execute: async (msg, args) => {
		const ai = new GoogleGenAI({
			apiKey: config.geminiApiKey,
		});

		const prompt = args.join(" ");

		try {
			const response = await ai.models.generateContent({
				model: "gemini-2.5-flash-preview-04-17",
				config: {
					maxOutputTokens: 512,
					systemInstruction:
						"You are an assistant, keep it short, try to don't get above 2,000 character limit, like do don't attempt doing that ever again.",
				},
				contents: prompt,
			});

			msg.reply(response.text || "No response");
		} catch (error) {
			if (error instanceof Error) {
				const errorText = textBuilder([
					"Something wrong happened:",
					"```",
					error.message,
					"```",
				]);

				await msg?.reply({
					embeds: [
						{
							title: "Error",
							description: errorText,
							colour: config.embedColor
						},
					],
				});
			}
		}
	},
};

export default askCommand;
