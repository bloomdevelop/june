import type { ILogger } from "./types";

/**
 * Logger class for logging messages to the console.
 * @class
 * @implements {ILogger}
 */
export class Logger implements ILogger {
    /**
     * Logs a message to the console.
     * @param message - The message to log
     */
	log(message: string): void {
		console.log(`[LOG] ${message}`);
	}

    /**
     * Logs an error message to the console.
     * @param message - The error message to log
     */
	error(message: string): void {
		console.error(`[ERROR] ${message}`);
	}

    /**
     * Logs a warning message to the console.
     * @param message - The warning message to log
     */
	warn(message: string): void {
		console.warn(`[WARN] ${message}`);
	}

    /**
     * Logs an informational message to the console.
     * @param message - The informational message to log
     */
	info(message: string): void {
		console.info(`[INFO] ${message}`);
	}
}
