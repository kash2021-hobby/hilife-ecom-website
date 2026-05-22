import { eq, and, like, desc, asc, sql, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, categories, cartItems, wishlistItems, reviews, orders, orderItems, productVariants, browsingHistory } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== CATEGORIES =====
export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0];
}

// ===== PRODUCTS =====
export async function getProducts(opts: { categoryId?: number; featured?: boolean; bestseller?: boolean; search?: string; limit?: number; offset?: number; sortBy?: string; sortOrder?: string }) {
  const db = await getDb();
  if (!db) return { products: [], total: 0 };
  
  const conditions = [];
  if (opts.categoryId) conditions.push(eq(products.categoryId, opts.categoryId));
  if (opts.featured) conditions.push(eq(products.featured, true));
  if (opts.bestseller) conditions.push(eq(products.bestseller, true));
  if (opts.search) conditions.push(like(products.name, `%${opts.search}%`));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  let orderClause;
  if (opts.sortBy === 'price') {
    orderClause = opts.sortOrder === 'desc' ? desc(products.price) : asc(products.price);
  } else if (opts.sortBy === 'newest') {
    orderClause = desc(products.createdAt);
  } else if (opts.sortBy === 'rating') {
    orderClause = desc(products.averageRating);
  } else {
    orderClause = desc(products.bestseller);
  }

  const [items, countResult] = await Promise.all([
    db.select().from(products).where(whereClause).orderBy(orderClause).limit(opts.limit || 12).offset(opts.offset || 0),
    db.select({ count: sql<number>`count(*)` }).from(products).where(whereClause),
  ]);

  return { products: items, total: countResult[0]?.count || 0 };
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result[0];
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}

export async function getProductVariants(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(productVariants).where(eq(productVariants.productId, productId));
}

export async function searchProducts(query: string, limit = 6) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(like(products.name, `%${query}%`)).limit(limit);
}

// ===== CART =====
export async function getCartItems(userId?: number, sessionId?: string) {
  const db = await getDb();
  if (!db) return [];
  const condition = userId ? eq(cartItems.userId, userId) : eq(cartItems.sessionId, sessionId || '');
  return db.select().from(cartItems).where(condition);
}

export async function addToCart(data: { userId?: number; sessionId?: string; productId: number; variantId?: number; quantity: number }) {
  const db = await getDb();
  if (!db) return;
  const condition = data.userId 
    ? and(eq(cartItems.userId, data.userId), eq(cartItems.productId, data.productId), data.variantId ? eq(cartItems.variantId, data.variantId) : sql`${cartItems.variantId} IS NULL`)
    : and(eq(cartItems.sessionId, data.sessionId || ''), eq(cartItems.productId, data.productId), data.variantId ? eq(cartItems.variantId, data.variantId) : sql`${cartItems.variantId} IS NULL`);
  
  const existing = await db.select().from(cartItems).where(condition).limit(1);
  if (existing.length > 0) {
    await db.update(cartItems).set({ quantity: existing[0].quantity + data.quantity }).where(eq(cartItems.id, existing[0].id));
  } else {
    await db.insert(cartItems).values(data);
  }
}

export async function updateCartItemQuantity(id: number, quantity: number) {
  const db = await getDb();
  if (!db) return;
  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  } else {
    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id));
  }
}

export async function removeCartItem(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(cartItems).where(eq(cartItems.id, id));
}

export async function clearCart(userId?: number, sessionId?: string) {
  const db = await getDb();
  if (!db) return;
  const condition = userId ? eq(cartItems.userId, userId) : eq(cartItems.sessionId, sessionId || '');
  await db.delete(cartItems).where(condition);
}

// ===== WISHLIST =====
export async function getWishlistItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(wishlistItems).where(eq(wishlistItems.userId, userId));
}

export async function addToWishlist(userId: number, productId: number) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(wishlistItems).where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId))).limit(1);
  if (existing.length === 0) {
    await db.insert(wishlistItems).values({ userId, productId });
  }
}

export async function removeFromWishlist(userId: number, productId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(wishlistItems).where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)));
}

// ===== REVIEWS =====
export async function getProductReviews(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).where(and(eq(reviews.productId, productId), eq(reviews.approved, true))).orderBy(desc(reviews.createdAt));
}

export async function createReview(data: { productId: number; userId: number; userName?: string; rating: number; title?: string; content?: string; photos?: string[] }) {
  const db = await getDb();
  if (!db) return;
  await db.insert(reviews).values(data);
  // Update product average rating
  const allReviews = await db.select({ rating: reviews.rating }).from(reviews).where(and(eq(reviews.productId, data.productId), eq(reviews.approved, true)));
  const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  await db.update(products).set({ averageRating: avg.toFixed(2), reviewCount: allReviews.length }).where(eq(products.id, data.productId));
}

// ===== ORDERS =====
export async function createOrder(data: { userId: number; items: Array<{ productId: number; variantId?: number; productName: string; variantName?: string; price: string; quantity: number; image?: string }>; subtotal: string; shippingCost: string; total: string; shippingName?: string; shippingAddress?: string; shippingCity?: string; shippingState?: string; shippingZip?: string; shippingCountry?: string; shippingPhone?: string; shippingMethod?: string; paymentMethod?: string }) {
  const db = await getDb();
  if (!db) return undefined;
  const orderNumber = `KN-${Date.now().toString(36).toUpperCase()}`;
  const [result] = await db.insert(orders).values({
    userId: data.userId,
    orderNumber,
    subtotal: data.subtotal,
    shippingCost: data.shippingCost,
    total: data.total,
    shippingName: data.shippingName,
    shippingAddress: data.shippingAddress,
    shippingCity: data.shippingCity,
    shippingState: data.shippingState,
    shippingZip: data.shippingZip,
    shippingCountry: data.shippingCountry,
    shippingPhone: data.shippingPhone,
    shippingMethod: data.shippingMethod,
    paymentMethod: data.paymentMethod,
  }).$returningId();
  
  if (result?.id) {
    for (const item of data.items) {
      await db.insert(orderItems).values({ orderId: result.id, ...item });
    }
  }
  return { id: result?.id, orderNumber };
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getOrderWithItems(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) return undefined;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  return { ...order, items };
}

// ===== BROWSING HISTORY =====
export async function trackBrowsing(data: { userId?: number; sessionId?: string; productId: number }) {
  const db = await getDb();
  if (!db) return;
  await db.insert(browsingHistory).values(data);
}

export async function getRecentlyViewed(userId?: number, sessionId?: string, limit = 8) {
  const db = await getDb();
  if (!db) return [];
  const condition = userId ? eq(browsingHistory.userId, userId) : eq(browsingHistory.sessionId, sessionId || '');
  return db.select().from(browsingHistory).where(condition).orderBy(desc(browsingHistory.viewedAt)).limit(limit);
}

// ===== ADMIN =====
export async function upsertProduct(data: any) {
  const db = await getDb();
  if (!db) return;
  if (data.id) {
    const { id, ...rest } = data;
    await db.update(products).set(rest).where(eq(products.id, id));
  } else {
    await db.insert(products).values(data);
  }
}

export async function upsertCategory(data: any) {
  const db = await getDb();
  if (!db) return;
  if (data.id) {
    const { id, ...rest } = data;
    await db.update(categories).set(rest).where(eq(categories.id, id));
  } else {
    await db.insert(categories).values(data);
  }
}
