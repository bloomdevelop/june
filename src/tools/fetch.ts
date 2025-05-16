import fetch from "node-fetch";

/**
 * Fetches the content of a website given a URL.
 * @param {Object} params - The parameters object.
 * @param {string} params.url - The URL to fetch.
 * @returns {Promise<string>} The content of the website as text.
 */
export async function fetchTool({ url }: { url: string }): Promise<string> {
  if (!url) throw new Error("URL is required");
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  return await response.text();
}
