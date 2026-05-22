CREATE TABLE `browsing_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionId` varchar(128),
	`productId` int NOT NULL,
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `browsing_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cart_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionId` varchar(128),
	`productId` int NOT NULL,
	`variantId` int,
	`quantity` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cart_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`image` text,
	`parentId` int,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`variantId` int,
	`productName` varchar(255) NOT NULL,
	`variantName` varchar(255),
	`price` decimal(10,2) NOT NULL,
	`quantity` int NOT NULL,
	`image` text,
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`orderNumber` varchar(50) NOT NULL,
	`status` enum('pending','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`subtotal` decimal(10,2) NOT NULL,
	`shippingCost` decimal(10,2) DEFAULT '0',
	`total` decimal(10,2) NOT NULL,
	`shippingName` varchar(255),
	`shippingAddress` text,
	`shippingCity` varchar(100),
	`shippingState` varchar(100),
	`shippingZip` varchar(20),
	`shippingCountry` varchar(100),
	`shippingPhone` varchar(20),
	`shippingMethod` varchar(100),
	`paymentMethod` varchar(50),
	`paymentStatus` enum('pending','paid','failed','refunded') DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `product_variants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`sku` varchar(100),
	`price` decimal(10,2) NOT NULL,
	`compareAtPrice` decimal(10,2),
	`option1` varchar(100),
	`option2` varchar(100),
	`inStock` boolean DEFAULT true,
	`stockQuantity` int DEFAULT 100,
	CONSTRAINT `product_variants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`shortDescription` text,
	`price` decimal(10,2) NOT NULL,
	`compareAtPrice` decimal(10,2),
	`categoryId` int,
	`images` json,
	`tags` json,
	`ingredients` text,
	`brewingInstructions` text,
	`wellnessBenefits` json,
	`weight` varchar(50),
	`servings` varchar(50),
	`origin` varchar(255),
	`certifications` json,
	`featured` boolean DEFAULT false,
	`bestseller` boolean DEFAULT false,
	`inStock` boolean DEFAULT true,
	`stockQuantity` int DEFAULT 100,
	`averageRating` decimal(3,2) DEFAULT '0',
	`reviewCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`userId` int NOT NULL,
	`userName` varchar(255),
	`rating` int NOT NULL,
	`title` varchar(255),
	`content` text,
	`photos` json,
	`verified` boolean DEFAULT false,
	`approved` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wishlist_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wishlist_items_id` PRIMARY KEY(`id`)
);
