import fs from "node:fs/promises";
import path from "node:path";

/**
 * Supported language codes for translations.
 */
export type SupportedLang = "en" | "es";

/**
 * In-memory cache for loaded translation resources.
 */
const loadedTranslations: Partial<
	Record<SupportedLang, Record<string, string>>
> = {};

/**
 * Values for interpolation in translation strings.
 * Keys are variable names, values can be string, number, boolean, or undefined.
 */
type InterpolationValues = Record<
	string,
	string | number | boolean | undefined
>;

/**
 * Replaces {{variable}} placeholders in a string with provided values.
 * @param str The string containing interpolation placeholders.
 * @param values The values to interpolate into the string.
 * @returns The interpolated string.
 */
function interpolate(str: string, values?: InterpolationValues): string {
	if (!values) return str;

	return str.replace(/{{(\w+)}}/g, (_, key) =>
		values[key] !== undefined ? String(values[key]) : `{{${key}}}`,
	);
}

/**
 * Handles basic pluralization for translation strings in the format "one|other".
 * @param str The translation string with plural forms separated by '|'.
 * @param count The count to determine which form to use.
 * @returns The correct pluralized string.
 */
function pluralize(str: string, count: number): string {
	if (!str.includes("|")) return str;
	const [one = "", other = ""] = str.split("|");

	return count === 1 ? one : other;
}

/**
 * Loads translation resources for a given language from the locales directory.
 * Uses in-memory cache to avoid redundant file reads.
 * @param lang The language code to load.
 * @returns The translation key-value pairs for the language.
 */
async function loadTranslations(
	lang: SupportedLang,
): Promise<Record<string, string>> {
	if (loadedTranslations[lang]) return loadedTranslations[lang] || {};
	try {
		const filePath = path.resolve(
			__dirname,
			`../locales/${lang}/translation.json`,
		);
		const data = await fs.readFile(filePath, "utf-8");
		loadedTranslations[lang] = JSON.parse(data);

		return loadedTranslations[lang] || {};
	} catch (e) {
		return {};
	}
}

// TODO)) Make it dynamic via server config
let currentLang: SupportedLang = "en";

/**
 * Sets the current language for translations.
 * @param lang The language code to set as current.
 */
export function setLang(lang: SupportedLang) {
	currentLang = lang;
}

/**
 * Retrieves a translated string for a given key, with optional interpolation and pluralization.
 * Falls back to English if the key is missing in the current language.
 * @param key The translation key.
 * @param options Optional interpolation values and count for pluralization.
 * @returns The translated, interpolated, and pluralized string.
 */
export async function t(
	key: string,
	options?: { values?: InterpolationValues; count?: number },
): Promise<string> {
	const translations = await loadTranslations(currentLang);
	const fallback = await loadTranslations("en");

	let str = translations[key] || fallback[key] || key;

	if (options?.count !== undefined) {
		str = pluralize(str, options.count);
	}

	str = interpolate(str, options?.values);
	return str;
}
