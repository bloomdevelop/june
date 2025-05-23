import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";

export const messagesTable = sqliteTable("messages", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => {
			return ulid();
		}),
	messageId: text("messageId"),
	userId: text("user_id"),
	userDisplayName: text("user_display_name"),
	userUsername: text("user_username"),
	content: text("content"),
});
