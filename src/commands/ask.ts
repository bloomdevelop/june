import { FunctionCallingConfigMode, Type } from "@google/genai";
import { config } from "@/config";
import type { Command, Tools } from "@/types";
import textBuilder from "@/utils/textBuilder";
import { GoogleGenAI } from "@google/genai/node";
import { callTools } from "@/utils/callTools";

const tools: Tools[] = [
  {
    functionDeclarations: [
      {
        name: "fetch",
        description: "gets the content of website",
        parameters: {
          type: Type.OBJECT,
          properties: {
            url: {
              type: Type.STRING,
            },
          },
        },
      },
    ],
  },
];

const askCommand: Command = {
  name: "ask",
  disabled: !config.geminiApiKey,
  execute: async (msg, args) => {
    const ai = new GoogleGenAI({
      apiKey: config.geminiApiKey,
    });

    const prompt = args.join(" ");

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-lite",
        config: {
          toolConfig: {
            functionCallingConfig: {
              mode: FunctionCallingConfigMode.ANY,
              allowedFunctionNames: ["fetch"],
            },
          },
          tools,
          maxOutputTokens: 512,
          systemInstruction:
            "You are an assistant, keep it short, try to don't get above 2,000 character limit.",
        },
        contents: prompt,
      });

      if (response.functionCalls && response.functionCalls.length > 0) {
        const functionCall = response.functionCalls[0];
        if (functionCall?.name && functionCall?.args) {
          console.log(`Function to call: ${functionCall.name}`);
          console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
          // Call the tool and reply with its result
          try {
            const toolResult = await callTools(functionCall.name as string, functionCall.args as Record<string, unknown>);
            await msg.reply({ content: String(toolResult) });
          } catch (toolError) {
            await msg.reply({ content: `Tool error: ${toolError instanceof Error ? toolError.message : toolError}` });
          }
        } else {
          await msg.reply({ content: "Invalid function call from model." });
        }
      } else {
        msg.reply({ content: response.text });
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorText = textBuilder([
          "Something wrong happened:",
          "```",
          error.message,
          "```",
        ]);

        await msg?.reply({
          content: errorText,
        });
      }
    }
  },
};

export default askCommand;
