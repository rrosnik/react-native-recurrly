CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`icon` text NOT NULL,
	`name` text NOT NULL,
	`plan` text,
	`category` text,
	`payment_method` text,
	`status` text,
	`start_date` text,
	`price` numeric NOT NULL,
	`currency` text,
	`billing` text NOT NULL,
	`renewal_date` text,
	`color` text
);
