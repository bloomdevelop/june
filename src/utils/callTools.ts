import { fetchTool } from "@/tools/fetch";

/**
 * Calls a tool by name with the given arguments.
 * @param {string} name - The name of the tool to call.
 * @param {Record<string, unknown>} args - The arguments to pass to the tool.
 * @returns {Promise<unknown>} The result of the tool call.
 */
export async function callTools(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case "fetch":
      return await fetchTool(args as { url: string });
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
