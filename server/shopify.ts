import { GraphQLClient, gql } from "graphql-request";

const storeUrl = process.env.VITE_SHOPIFY_STORE_URL;
const token = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

if (!storeUrl || !token) {
  throw new Error("Missing Shopify credentials: VITE_SHOPIFY_STORE_URL and VITE_SHOPIFY_STOREFRONT_TOKEN");
}

const endpoint = `https://${storeUrl}/api/2024-10/graphql.json`;

const client = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token,
    "Content-Type": "application/json",
  },
});

export { client };

// GraphQL Queries

export const GET_PRODUCTS = gql`
  query GetProducts($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
            }
            maxVariantPrice {
              amount
            }
          }
          images(first: 5) {
            edges {
              node {
                src
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                }
                sku
                image {
                  src
                  altText
                }
              }
            }
          }
          tags
          metafields(identifiers: [
            { namespace: "custom", key: "ingredients" }
            { namespace: "custom", key: "brewing" }
            { namespace: "custom", key: "benefits" }
            { namespace: "custom", key: "weight" }
            { namespace: "custom", key: "servings" }
            { namespace: "custom", key: "origin" }
            { namespace: "custom", key: "certifications" }
          ]) {
            key
            value
          }
          reviews: metafield(namespace: "custom", key: "reviews") {
            value
          }
          rating: metafield(namespace: "custom", key: "average_rating") {
            value
          }
          reviewCount: metafield(namespace: "custom", key: "review_count") {
            value
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = gql`
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
        }
        maxVariantPrice {
          amount
        }
      }
      images(first: 10) {
        edges {
          node {
            src
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
            }
            sku
            image {
              src
              altText
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
      tags
      metafields(identifiers: [
        { namespace: "custom", key: "ingredients" }
        { namespace: "custom", key: "brewing" }
        { namespace: "custom", key: "benefits" }
        { namespace: "custom", key: "weight" }
        { namespace: "custom", key: "servings" }
        { namespace: "custom", key: "origin" }
        { namespace: "custom", key: "certifications" }
        { namespace: "custom", key: "short_description" }
      ]) {
        key
        value
      }
      rating: metafield(namespace: "custom", key: "average_rating") {
        value
      }
      reviewCount: metafield(namespace: "custom", key: "review_count") {
        value
      }
    }
  }
`;

export const GET_COLLECTIONS = gql`
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            src
            altText
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_HANDLE = gql`
  query GetCollectionByHandle($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      id
      title
      handle
      description
      image {
        src
        altText
      }
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
              }
            }
            images(first: 1) {
              edges {
                node {
                  src
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const CREATE_CART = gql`
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
        cost {
          subtotalAmount {
            amount
          }
          totalAmount {
            amount
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const GET_CART = gql`
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                }
                product {
                  id
                  title
                  handle
                  images(first: 1) {
                    edges {
                      node {
                        src
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      cost {
        subtotalAmount {
          amount
        }
        totalAmount {
          amount
        }
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                  }
                }
              }
            }
          }
        }
        cost {
          subtotalAmount {
            amount
          }
          totalAmount {
            amount
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const UPDATE_CART_LINE = gql`
  mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 10) {
          edges {
            node {
              id
              quantity
            }
          }
        }
        cost {
          subtotalAmount {
            amount
          }
          totalAmount {
            amount
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        lines(first: 10) {
          edges {
            node {
              id
              quantity
            }
          }
        }
        cost {
          subtotalAmount {
            amount
          }
          totalAmount {
            amount
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: PRODUCT) {
      edges {
        node {
          ... on Product {
            id
            title
            handle
            images(first: 1) {
              edges {
                node {
                  src
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
              }
            }
          }
        }
      }
    }
  }
`;

// Fetch products from a specific collection by its handle
export const GET_COLLECTION_PRODUCTS = gql`
  query GetCollectionProducts($handle: String!, $limit: Int!) {
    collection(handle: $handle) {
      id
      title
      products(first: $limit) {
        edges {
          node {
            id
            title
            handle
            description
            tags
            availableForSale
            featuredImage { url altText }
            priceRange { minVariantPrice { amount currencyCode } }
            compareAtPriceRange { minVariantPrice { amount } }
            variants(first: 1) { edges { node { id } } }
          }
        }
      }
    }
  }
`;

// Fetch products filtered by a tag query
export const GET_PRODUCTS_BY_TAG = gql`
  query GetProductsByTag($query: String!, $limit: Int!) {
    products(first: $limit, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          tags
          availableForSale
          featuredImage { url altText }
          priceRange { minVariantPrice { amount currencyCode } }
          compareAtPriceRange { minVariantPrice { amount } }
      variants(first: 1) { edges { node { id } } }
        }
      }
    }
  }
`;
