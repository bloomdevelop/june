import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";

export const messages = sqliteTable("messages", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => {
			return ulid();
		}),
	userId: integer("user_id"),
	content: text("content"),
});
