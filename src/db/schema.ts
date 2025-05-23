import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";

export const messagesTable = sqliteTable("messages", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => {
			return ulid();
		}),
	messageId: text("messageId"),
	userId: text("user_id"),
	content: text("content"),
});
