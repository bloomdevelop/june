import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

// Export the Drizzle ORM database instance
const dbFileName = process.env.DB_FILE_NAME;
if (!dbFileName) {
  throw new Error("DB_FILE_NAME environment variable is not set.");
}
export const db = drizzle(dbFileName, { schema });
