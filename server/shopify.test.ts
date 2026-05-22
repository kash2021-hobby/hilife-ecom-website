import { describe, it, expect } from "vitest";

describe("Shopify Storefront API", () => {
  it("should have valid Shopify credentials configured", () => {
    const storeUrl = process.env.VITE_SHOPIFY_STORE_URL;
    const token = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

    expect(storeUrl).toBeDefined();
    expect(storeUrl).toMatch(/\.myshopify\.com$/);
    
    expect(token).toBeDefined();
    expect(token?.length).toBeGreaterThan(0);
  });

  it("should construct valid Shopify GraphQL endpoint", () => {
    const storeUrl = process.env.VITE_SHOPIFY_STORE_URL;
    const endpoint = `https://${storeUrl}/api/2024-01/graphql.json`;
    
    expect(endpoint).toMatch(/^https:\/\/.+\.myshopify\.com\/api\/\d{4}-\d{2}\/graphql\.json$/);
  });

  it("should validate token format", () => {
    const token = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
    
    // Shopify tokens are typically 32+ character hex strings
    expect(token).toMatch(/^[a-f0-9]{32,}$/i);
  });
});
