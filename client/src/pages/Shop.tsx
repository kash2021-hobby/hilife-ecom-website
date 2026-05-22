import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import ProductCard from "@/components/store/ProductCard";
import FilterSidebar, { FilterState, EnhancedProduct, PRICE_MIN, PRICE_MAX, STEP, matchesProductFilter, categoryLabel, collectionLabel } from "@/components/store/FilterSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Grid3X3, List, SlidersHorizontal, X,
} from "lucide-react";

function parseFiltersFromURL(location: string): FilterState {
  const qs = new URLSearchParams(location.split("?").slice(1).join("?"));
  return {
    categories: qs.get("category")?.split(",").filter(Boolean) || [],
    collections: qs.get("collection")?.split(",").filter(Boolean) || [],
    minPrice: Number(qs.get("min")) || 0,
    maxPrice: Number(qs.get("max")) || PRICE_MAX,
  };
}

function filtersToQuery(f: FilterState): string {
  const params = new URLSearchParams();
  if (f.categories.length) params.set("category", f.categories.join(","));
  if (f.collections.length) params.set("collection", f.collections.join(","));
  if (f.minPrice > 0) params.set("min", String(f.minPrice));
  if (f.maxPrice < PRICE_MAX) params.set("max", String(f.maxPrice));
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

function determineCategory(tags: string[] | null): string {
  if (!tags || tags.length === 0) return "uncategorized";
  const lower = tags.map((t) => t.toLowerCase());
  if (lower.some((t) => t === "teas" || t === "tea")) return "teas";
  if (lower.some((t) => t === "wellness")) return "wellness";
  return "uncategorized";
}

function sortProducts(products: EnhancedProduct[], sortBy: string): EnhancedProduct[] {
  const sorted = [...products];
  switch (sortBy) {
    case "newest":
      return sorted;
    case "price-asc":
      return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    case "price-desc":
      return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    case "rating":
      return sorted.sort((a, b) => parseFloat(b.averageRating || "0") - parseFloat(a.averageRating || "0"));
    default:
      return sorted;
  }
}

export default function Shop() {
  const [location, setLocation] = useLocation();

  const [filters, setFilters] = useState<FilterState>(() => parseFiltersFromURL(location));
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    collection: true,
    price: true,
  });

  useEffect(() => {
    const newFilters = parseFiltersFromURL(location);
    setFilters(newFilters);
  }, [location]);

  const updateFilters = useCallback(
    (next: FilterState) => {
      setFilters(next);
      setLocation(filtersToQuery(next), { replace: true });
    },
    [setLocation]
  );

  const { data: richData } = trpc.products.list.useQuery({ limit: 100 });
  const { data: categoriesData } = trpc.categories.list.useQuery();

  // Use byTag for definitive tag membership (Shopify-side filtering)
  const { data: naData } = trpc.products.byTag.useQuery({ tag: "new-arrivals", limit: 50 });
  const { data: bsData } = trpc.products.byTag.useQuery({ tag: "bestseller", limit: 50 });

  // Dynamically find collection handles from Shopify categories
  const teaSlug = useMemo(() => {
    if (!categoriesData) return "tea";
    const match = categoriesData.find(
      (c: any) => c.name?.toLowerCase().includes("tea")
    );
    return match?.slug || "tea";
  }, [categoriesData]);

  const wellnessSlug = useMemo(() => {
    if (!categoriesData) return "wellness";
    const match = categoriesData.find(
      (c: any) => c.name?.toLowerCase().includes("wellness") || c.name?.toLowerCase().includes("supplement")
    );
    return match?.slug || "wellness";
  }, [categoriesData]);

  const { data: teaCollection } = trpc.products.byCollection.useQuery({ handle: teaSlug, limit: 50 });
  const { data: wellnessCollection } = trpc.products.byCollection.useQuery({ handle: wellnessSlug, limit: 50 });

  const productCategoryMap = useMemo(() => {
    const map = new Map<string, string>();
    (teaCollection?.products || []).forEach((p: any) => {
      if (!map.has(p.id)) map.set(p.id, "teas");
    });
    (wellnessCollection?.products || []).forEach((p: any) => {
      if (!map.has(p.id)) map.set(p.id, "wellness");
    });
    return map;
  }, [teaCollection, wellnessCollection]);

  const isLoading = !richData || !naData || !bsData;

  const allProducts: EnhancedProduct[] = useMemo(() => {
    // Build rich data map from products.list
    const richMap = new Map<string, any>();
    (richData?.products || []).forEach((p: any) => richMap.set(p.id, p));

    // Get definitive tag membership from byTag results
    const naIds = new Set((naData?.products || []).map((p: any) => p.id));
    const bsIds = new Set((bsData?.products || []).map((p: any) => p.id));

    // Merge all products from byTag results, enriched with rich data
    const merged = new Map<string, EnhancedProduct>();

    // First, add products from byTag results (definitive tag membership)
    const taggedRaw = [...(naData?.products || []), ...(bsData?.products || [])];
    taggedRaw.forEach((p: any) => {
      const rich = richMap.get(p.id) || p;
      const tags: string[] = rich.tags || p.tags || [];
      if (!merged.has(p.id)) {
        merged.set(p.id, {
          id: p.id,
          name: rich.name || p.name,
          slug: rich.slug || p.slug,
          price: rich.price || p.price,
          compareAtPrice: rich.compareAtPrice || p.compareAtPrice || null,
          images: rich.images || p.images || [],
          tags,
          averageRating: rich.averageRating || "0",
          reviewCount: rich.reviewCount || 0,
          variantId: rich.variantId || p.variantId || null,
          description: rich.description || null,
          shortDescription: rich.shortDescription || "",
          bestseller: false,
          isNewArrival: naIds.has(p.id),
          isBestSeller: bsIds.has(p.id),
          category: productCategoryMap.get(p.id) || determineCategory(tags),
        });
      }
    });

    // Then add remaining products from richData (not tagged as new-arrival or bestseller)
    (richData?.products || []).forEach((p: any) => {
      if (!merged.has(p.id)) {
        const tags: string[] = p.tags || [];
        merged.set(p.id, {
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          compareAtPrice: p.compareAtPrice || null,
          images: p.images || [],
          tags,
          averageRating: p.averageRating || "0",
          reviewCount: p.reviewCount || 0,
          variantId: p.variantId || null,
          description: p.description || null,
          shortDescription: p.shortDescription || "",
          bestseller: false,
          isNewArrival: false,
          isBestSeller: false,
          category: productCategoryMap.get(p.id) || determineCategory(tags),
        });
      }
    });

    return Array.from(merged.values());
  }, [richData, naData, bsData, productCategoryMap]);

  const newArrivals = useMemo(
    () => sortProducts(allProducts.filter((p) => p.isNewArrival && matchesProductFilter(p, filters)), sortBy),
    [allProducts, filters, sortBy]
  );

  const bestSellers = useMemo(
    () => sortProducts(allProducts.filter((p) => p.isBestSeller && matchesProductFilter(p, filters)), sortBy),
    [allProducts, filters, sortBy]
  );

  const totalFiltered = useMemo(
    () => allProducts.filter((p) => matchesProductFilter(p, filters)).length,
    [allProducts, filters]
  );

  const hasActiveFilters = filters.categories.length > 0 || filters.collections.length > 0 || filters.minPrice > 0 || filters.maxPrice < PRICE_MAX;

  const clearAll = useCallback(() => {
    updateFilters({ categories: [], collections: [], minPrice: 0, maxPrice: PRICE_MAX });
  }, [updateFilters]);

  const removeFilter = useCallback(
    (type: "category" | "collection", value: string) => {
      if (type === "category") {
        updateFilters({ ...filters, categories: filters.categories.filter((c) => c !== value) });
      } else {
        updateFilters({ ...filters, collections: filters.collections.filter((c) => c !== value) });
      }
    },
    [filters, updateFilters]
  );

  const allProductsFiltered = useMemo(
    () => sortProducts(allProducts.filter((p) => matchesProductFilter(p, filters)), sortBy),
    [allProducts, filters, sortBy]
  );

  const showAllProducts = !hasActiveFilters;

  const toggleSection = (key: "category" | "collection" | "price") => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isLoadingState = isLoading;

  return (
    <div className="bg-[#FEFEFE]">
      {/* Banner Image - full width, touches header */}
      <div className="w-full h-[180px] bg-muted flex items-center justify-center text-muted-foreground text-sm">
        Banner Image
      </div>
      <div className="section-spacing pt-4 md:pt-6">
        <div className="container">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="heading-serif text-3xl md:text-4xl text-foreground">Shop</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Discover premium teas and wellness supplements crafted for your daily rituals.
          </p>
        </div>

        <div className="flex gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-[260px] lg:w-[280px] shrink-0 self-start sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[#d4d4d4] [&::-webkit-scrollbar-thumb]:rounded-[2px]">
            <div>
              <FilterSidebar
                allProducts={allProducts}
                filters={filters}
                onUpdateFilters={updateFilters}
                hasActiveFilters={hasActiveFilters}
                onClearAll={clearAll}
                expandedSections={expandedSections}
                onToggleSection={toggleSection}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Button + Controls Row */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50 gap-3">
              <div className="flex items-center gap-2">
                {/* Mobile Filters Trigger */}
                <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="md:hidden h-8 text-xs gap-1.5 border-border/50"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      Filters
                      {hasActiveFilters && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:max-w-sm p-5 overflow-y-auto">
                    <SheetHeader className="p-0 mb-0">
                      <SheetTitle className="sr-only">Filters</SheetTitle>
                    </SheetHeader>
                    <FilterSidebar
                      allProducts={allProducts}
                      filters={filters}
                      onUpdateFilters={updateFilters}
                      hasActiveFilters={hasActiveFilters}
                      onClearAll={clearAll}
                      expandedSections={expandedSections}
                      onToggleSection={toggleSection}
                    />
                  </SheetContent>
                </Sheet>

                <p className="text-xs text-muted-foreground hidden sm:block">
                  {totalFiltered} product{totalFiltered !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn("p-1.5 transition-colors", viewMode === "grid" ? "bg-secondary" : "hover:bg-secondary/50")}
                  >
                    <Grid3X3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn("p-1.5 transition-colors", viewMode === "list" ? "bg-secondary" : "hover:bg-secondary/50")}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {filters.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-brand-green/10 text-brand-green rounded-full"
                  >
                    {categoryLabel(cat)}
                    <button onClick={() => removeFilter("category", cat)} className="hover:text-brand-green/70">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.collections.map((col) => (
                  <span
                    key={col}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-brand-green/10 text-brand-green rounded-full"
                  >
                    {collectionLabel(col)}
                    <button onClick={() => removeFilter("collection", col)} className="hover:text-brand-green/70">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {(filters.minPrice > 0 || filters.maxPrice < PRICE_MAX) && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-brand-green/10 text-brand-green rounded-full">
                    ₹{filters.minPrice} – ₹{filters.maxPrice}
                    <button
                      onClick={() => updateFilters({ ...filters, minPrice: 0, maxPrice: PRICE_MAX })}
                      className="hover:text-brand-green/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAll}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product count - mobile only */}
            <p className="text-xs text-muted-foreground md:hidden mb-4">
              {totalFiltered} product{totalFiltered !== 1 ? "s" : ""}
            </p>

            {/* Loading Skeleton */}
            {isLoadingState ? (
              <div>
                <div className="h-6 w-48 bg-secondary/40 rounded mb-5 animate-pulse" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-[4/5] rounded-xl" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Single product grid — filtered by active filters */
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="heading-serif text-xl md:text-2xl text-foreground">
                    {hasActiveFilters ? "Filtered Products" : "All Products"}
                  </h2>
                </div>
                {allProductsFiltered.length > 0 ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
                      {allProductsFiltered.map((product) => (
                        <ProductCard key={product.id} product={product as any} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {allProductsFiltered.map((product) => (
                        <ListProductCard key={product.id} product={product as any} />
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground">No products match your filters.</p>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAll}
                        className="mt-4 border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

function ListProductCard({ product }: { product: any }) {
  const images = product.images as string[] | null;
  return (
    <div className="flex gap-6 p-4 rounded-xl border border-border/50 hover:shadow-md transition-shadow">
      <div className="w-24 h-24 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
        {images && images[0] && (
          <img src={images[0]} alt={product.name} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.shortDescription}</p>
        <p className="text-sm font-semibold text-brand-green mt-2">₹{product.price}</p>
      </div>
    </div>
  );
}
