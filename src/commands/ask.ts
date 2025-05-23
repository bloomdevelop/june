import { config } from "@/config";
import type { Command } from "@/types";
import { t } from "@/utils/i18n";
import textBuilder from "@/utils/textBuilder";
import { GoogleGenAI } from "@google/genai/node";

const askCommand: Command = {
	name: "ask",
	description: await t("ask"),
	disabled: !config.geminiApiKey,
	execute: async (msg, args) => {
		const ai = new GoogleGenAI({
			apiKey: config.geminiApiKey,
		});

		const prompt = args.join(" ");

		try {
			// TODO)) Change the system instruction to something else while maintaing the same limit.
			const response = await ai.models.generateContent({
				model: "gemma-3n-e4b-it",
				config: {
					maxOutputTokens: 512,
					systemInstruction:
						"You are an assistant, keep it short, try to don't get above 2,000 character limit, like do don't attempt doing that ever again.",
				},
				contents: prompt,
			});

			msg.reply(
				response.text ||
					response.candidates?.[0]?.content?.parts?.[0]?.text ||
					(await t("system.responseFallback")),
			);
		} catch (error) {
			if (error instanceof Error) {
				const errorText = textBuilder([
					await t("system.error.description.noReason"),
					"```",
					error.message,
					"```",
				]);

				await msg?.reply({
					embeds: [
						{
							title: await t("system.error.title"),
							description: errorText,
							colour: config.embedColor,
						},
					],
				});
			}
		}
	},
};

export default askCommand;
