interface ILogger {
	log(message: string): void;
	error(message: string): void;
	warn(message: string): void;
	info(message: string): void;
}

export type { ILogger };
