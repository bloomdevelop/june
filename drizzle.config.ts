import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: (() => {
			if (!process.env.DB_FILE_NAME) {
				throw new Error("DB_FILE_NAME environment variable is not set");
			}

			return process.env.DB_FILE_NAME;
		})(),
	},
});
