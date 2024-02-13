CREATE TABLE `books` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`desc` text NOT NULL,
	`author` text NOT NULL,
	`img` text DEFAULT '',
	`status` integer DEFAULT 0 NOT NULL,
	`orderBy` integer,
	`owner` integer NOT NULL,
	`number` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`orderBy`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`name` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tagsToBooks` (
	`tag` text NOT NULL,
	`bookId` integer NOT NULL,
	PRIMARY KEY(`bookId`, `tag`),
	FOREIGN KEY (`tag`) REFERENCES `tags`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`password` text NOT NULL,
	`avatar` text DEFAULT null,
	`role` integer DEFAULT 0 NOT NULL,
	`stuNum` text NOT NULL,
	`college` text,
	`class` text,
	`lastRevokeTime` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `book_number_idx` ON `books` (`number`);--> statement-breakpoint
CREATE INDEX `book_id_idx` ON `tagsToBooks` (`bookId`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_stuNum_unique` ON `users` (`stuNum`);--> statement-breakpoint
CREATE INDEX `stu_num_idx` ON `users` (`stuNum`);