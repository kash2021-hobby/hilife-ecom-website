import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { client, GET_PRODUCTS, GET_PRODUCT_BY_HANDLE, GET_COLLECTIONS, GET_COLLECTION_BY_HANDLE, SEARCH_PRODUCTS, CREATE_CART, GET_CART, ADD_TO_CART, UPDATE_CART_LINE, REMOVE_FROM_CART } from "./shopify";
import { invokeLLM } from "./_core/llm";

// Helper to transform Shopify product to our format
function transformShopifyProduct(node: any) {
  const images = node.images?.edges?.map((edge: any) => edge.node.src) || [];
  const price = node.priceRange?.minVariantPrice?.amount || "0";
  const compareAtPrice = node.compareAtPriceRange?.minVariantPrice?.amount || null;
  
  // Extract metafields
  const metafields: Record<string, string> = {};
  node.metafields?.forEach((mf: any) => {
    if (mf.key && mf.value) {
      metafields[mf.key] = mf.value;
    }
  });

  return {
    id: node.id,
    name: node.title,
    slug: node.handle,
    description: node.description,
    shortDescription: metafields.short_description || node.description?.substring(0, 100),
    price,
    compareAtPrice,
    images,
    tags: node.tags || [],
    ingredients: metafields.ingredients || null,
    brewingInstructions: metafields.brewing_instructions || null,
    wellnessBenefits: metafields.wellness_benefits ? JSON.parse(metafields.wellness_benefits) : [],
    weight: metafields.weight || null,
    servings: metafields.servings || null,
    origin: metafields.origin || null,
    certifications: metafields.certifications ? JSON.parse(metafields.certifications) : [],
    averageRating: node.rating?.value || "0",
    reviewCount: node.reviewCount?.value ? parseInt(node.reviewCount.value) : 0,
    variants: node.variants?.edges?.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      price: edge.node.price?.amount,
      compareAtPrice: edge.node.compareAtPrice?.amount,
      sku: edge.node.sku,
      availableForSale: edge.node.availableForSale,
      image: edge.node.image?.src,
    })) || [],
  };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Collections (from Shopify)
  categories: router({
    list: publicProcedure.query(async () => {
      try {
        const data: any = await client.request(GET_COLLECTIONS, { first: 50 });
        return data.collections.edges.map((edge: any) => ({
          id: edge.node.id,
          name: edge.node.title,
          slug: edge.node.handle,
          description: edge.node.description,
          image: edge.node.image?.src,
        }));
      } catch (error) {
        console.error("Error fetching collections:", error);
        return [];
      }
    }),
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      try {
        const data: any = await client.request(GET_COLLECTION_BY_HANDLE, { 
          handle: input.slug,
          first: 50 
        });
        return {
          id: data.collectionByHandle.id,
          name: data.collectionByHandle.title,
          slug: data.collectionByHandle.handle,
          description: data.collectionByHandle.description,
          image: data.collectionByHandle.image?.src,
        };
      } catch (error) {
        console.error("Error fetching collection:", error);
        return null;
      }
    }),
  }),

  // Products (from Shopify)
  products: router({
    list: publicProcedure.input(z.object({
      categoryId: z.string().optional(),
      featured: z.boolean().optional(),
      bestseller: z.boolean().optional(),
      search: z.string().optional(),
      limit: z.number().optional().default(20),
      offset: z.number().optional().default(0),
      sortBy: z.string().optional(),
      sortOrder: z.string().optional(),
    }).optional()).query(async ({ input }) => {
      try {
        const params = input as any || { limit: 20 };
        let query = "";
        
        // Build Shopify search query
        if (params?.search) {
          query = params.search;
        }
        
        const data: any = await client.request(GET_PRODUCTS, {
          first: params.limit ?? 20,
          query: query || undefined,
        });

        return data.products.edges.map((edge: any) => transformShopifyProduct(edge.node));
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      }
    }),
    
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      try {
        const data: any = await client.request(GET_PRODUCT_BY_HANDLE, { handle: input.slug });
        return transformShopifyProduct(data.productByHandle);
      } catch (error) {
        console.error("Error fetching product:", error);
        return null;
      }
    }),

    search: publicProcedure.input(z.object({ 
      query: z.string(), 
      limit: z.number().optional().default(10) 
    })).query(async ({ input }) => {
      try {
        const data: any = await client.request(SEARCH_PRODUCTS, {
          query: input.query,
          first: input.limit ?? 10,
        });

        return data.search.edges.map((edge: any) => ({
          id: edge.node.id,
          name: edge.node.title,
          slug: edge.node.handle,
          image: edge.node.images?.edges?.[0]?.node?.src,
          price: edge.node.priceRange?.minVariantPrice?.amount,
        }));
      } catch (error) {
        console.error("Error searching products:", error);
        return [];
      }
    }),
  }),

  // Cart (using Shopify Cart API)
  cart: router({
    get: publicProcedure.input(z.object({ cartId: z.string().optional() })).query(async ({ input }) => {
      if (!input?.cartId) {
        return { id: null, lines: [], cost: { subtotalAmount: "0", totalAmount: "0" } };
      }

      try {
        const data: any = await client.request(GET_CART, { cartId: input.cartId });
        return {
          id: data.cart.id,
          checkoutUrl: data.cart.checkoutUrl,
          lines: data.cart.lines.edges.map((edge: any) => ({
            id: edge.node.id,
            quantity: edge.node.quantity,
            merchandise: edge.node.merchandise,
          })),
          cost: data.cart.cost,
        };
      } catch (error) {
        console.error("Error fetching cart:", error);
        return { id: null, lines: [], cost: { subtotalAmount: "0", totalAmount: "0" } };
      }
    }),

    create: publicProcedure.mutation(async () => {
      try {
        const data: any = await client.request(CREATE_CART, { input: {} });
        return {
          id: data.cartCreate.cart.id,
          checkoutUrl: data.cartCreate.cart.checkoutUrl,
        };
      } catch (error) {
        console.error("Error creating cart:", error);
        throw error;
      }
    }),

    add: publicProcedure.input(z.object({
      cartId: z.string(),
      variantId: z.string(),
      quantity: z.number().default(1),
    })).mutation(async ({ input }) => {
      try {
        const data: any = await client.request(ADD_TO_CART, {
          cartId: input.cartId,
          lines: [{
            merchandiseId: input.variantId,
            quantity: input.quantity,
          }],
        });
        return {
          success: true,
          cart: data.cartLinesAdd.cart,
          errors: data.cartLinesAdd.userErrors,
        };
      } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
      }
    }),

    updateQuantity: publicProcedure.input(z.object({
      cartId: z.string(),
      lineId: z.string(),
      quantity: z.number(),
    })).mutation(async ({ input }) => {
      try {
        const data: any = await client.request(UPDATE_CART_LINE, {
          cartId: input.cartId,
          lines: [{
            id: input.lineId,
            quantity: input.quantity,
          }],
        });
        return {
          success: true,
          cart: data.cartLinesUpdate.cart,
          errors: data.cartLinesUpdate.userErrors,
        };
      } catch (error) {
        console.error("Error updating cart:", error);
        throw error;
      }
    }),

    remove: publicProcedure.input(z.object({
      cartId: z.string(),
      lineIds: z.array(z.string()),
    })).mutation(async ({ input }) => {
      try {
        const data: any = await client.request(REMOVE_FROM_CART, {
          cartId: input.cartId,
          lineIds: input.lineIds,
        });
        return {
          success: true,
          cart: data.cartLinesRemove.cart,
          errors: data.cartLinesRemove.userErrors,
        };
      } catch (error) {
        console.error("Error removing from cart:", error);
        throw error;
      }
    }),
  }),

  // Personalization (LLM-powered)
  personalization: router({
    getRecommendations: publicProcedure.query(async () => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are a wellness expert for KN Naturals tea and supplement products. Generate personalized wellness recommendations and tips based on a holistic wellness approach.",
            },
            {
              role: "user",
              content: "Generate a personalized wellness recommendation and tip for someone starting their wellness journey with premium teas and supplements. Keep it concise (1-2 sentences) and inspiring.",
            },
          ],
        });

        const content = response.choices?.[0]?.message?.content || "";
        return {
          recommendation: content,
          products: [],
        };
      } catch (error) {
        console.error("Error generating recommendations:", error);
        return {
          recommendation: "Start your wellness journey with a balanced approach! Consider incorporating a daily detox tea, a calming blend, and a natural energy boost into your routine for overall well-being.",
          products: [],
        };
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
