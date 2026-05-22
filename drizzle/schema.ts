import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Product Categories
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  image: text("image"),
  parentId: int("parentId"),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Products
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: text("shortDescription"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compareAtPrice", { precision: 10, scale: 2 }),
  categoryId: int("categoryId"),
  images: json("images").$type<string[]>(),
  tags: json("tags").$type<string[]>(),
  // Metafields-style structured data
  ingredients: text("ingredients"),
  brewingInstructions: text("brewingInstructions"),
  wellnessBenefits: json("wellnessBenefits").$type<string[]>(),
  weight: varchar("weight", { length: 50 }),
  servings: varchar("servings", { length: 50 }),
  origin: varchar("origin", { length: 255 }),
  certifications: json("certifications").$type<string[]>(),
  featured: boolean("featured").default(false),
  bestseller: boolean("bestseller").default(false),
  inStock: boolean("inStock").default(true),
  stockQuantity: int("stockQuantity").default(100),
  averageRating: decimal("averageRating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: int("reviewCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Product Variants
export const productVariants = mysqlTable("product_variants", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compareAtPrice", { precision: 10, scale: 2 }),
  option1: varchar("option1", { length: 100 }),
  option2: varchar("option2", { length: 100 }),
  inStock: boolean("inStock").default(true),
  stockQuantity: int("stockQuantity").default(100),
});

// Cart Items
export const cartItems = mysqlTable("cart_items", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  sessionId: varchar("sessionId", { length: 128 }),
  productId: int("productId").notNull(),
  variantId: int("variantId"),
  quantity: int("quantity").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Wishlist
export const wishlistItems = mysqlTable("wishlist_items", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Reviews
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  userId: int("userId").notNull(),
  userName: varchar("userName", { length: 255 }),
  rating: int("rating").notNull(),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  photos: json("photos").$type<string[]>(),
  verified: boolean("verified").default(false),
  approved: boolean("approved").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Orders
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shippingCost", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  // Shipping address
  shippingName: varchar("shippingName", { length: 255 }),
  shippingAddress: text("shippingAddress"),
  shippingCity: varchar("shippingCity", { length: 100 }),
  shippingState: varchar("shippingState", { length: 100 }),
  shippingZip: varchar("shippingZip", { length: 20 }),
  shippingCountry: varchar("shippingCountry", { length: 100 }),
  shippingPhone: varchar("shippingPhone", { length: 20 }),
  shippingMethod: varchar("shippingMethod", { length: 100 }),
  // Payment
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed", "refunded"]).default("pending"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Order Items
export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  variantId: int("variantId"),
  productName: varchar("productName", { length: 255 }).notNull(),
  variantName: varchar("variantName", { length: 255 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: int("quantity").notNull(),
  image: text("image"),
});

// Browsing History (for LLM personalization)
export const browsingHistory = mysqlTable("browsing_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  sessionId: varchar("sessionId", { length: 128 }),
  productId: int("productId").notNull(),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});
