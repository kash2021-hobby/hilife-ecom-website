/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

// Frontend-friendly product types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: string;
  compareAtPrice: string | null;
  categoryId: number | null;
  images: string[] | null;
  tags: string[] | null;
  ingredients: string | null;
  brewingInstructions: string | null;
  wellnessBenefits: string[] | null;
  weight: string | null;
  servings: string | null;
  origin: string | null;
  certifications: string[] | null;
  featured: boolean | null;
  bestseller: boolean | null;
  inStock: boolean | null;
  stockQuantity: number | null;
  averageRating: string | null;
  reviewCount: number | null;
  variantId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  sku: string | null;
  price: string;
  compareAtPrice: string | null;
  option1: string | null;
  option2: string | null;
  inStock: boolean | null;
  stockQuantity: number | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: number | null;
  sortOrder: number | null;
  createdAt: Date;
}

export interface CartItemWithProduct {
  id: number;
  userId: number | null;
  sessionId: string | null;
  productId: number;
  variantId: number | null;
  quantity: number;
  product?: Product | null;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string | null;
  rating: number;
  title: string | null;
  content: string | null;
  photos: string[] | null;
  verified: boolean | null;
  approved: boolean | null;
  createdAt: Date;
}
