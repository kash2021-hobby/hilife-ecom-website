import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import ProductCard from "@/components/store/ProductCard";
import FilterSidebar, { FilterState, EnhancedProduct, PRICE_MIN, PRICE_MAX, matchesProductFilter, categoryLabel, collectionLabel } from "@/components/store/FilterSidebar";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, X, Grid3X3, List } from "lucide-react";

function determineCategory(tags: string[] | null): string {
  if (!tags || tags.length === 0) return "uncategorized";
  const lower = tags.map((t) => t.toLowerCase());
  if (lower.some((t) => t === "teas" || t === "tea")) return "teas";
  if (lower.some((t) => t === "wellness")) return "wellness";
  return "uncategorized";
}

function slugToPreFilter(slug: string): Partial<FilterState> {
  const lower = slug.toLowerCase();
  if (lower === "bestsellers" || lower === "best-sellers") return { collections: ["best-sellers"] };
  if (lower === "new-arrivals") return { collections: ["new-arrivals"] };
  if (lower === "teas" || lower === "tea") return { categories: ["teas"] };
  if (lower === "wellness" || lower === "wellness-supplement" || lower === "supplement") return { categories: ["wellness"] };
  return {};
}

export default function Collections() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "bestsellers";
  const [location, setLocation] = useLocation();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const preFilter = useMemo(() => slugToPreFilter(slug), [slug]);

  const [filters, setFilters] = useState<FilterState>(() => ({
    categories: preFilter.categories || [],
    collections: preFilter.collections || [],
    minPrice: 0,
    maxPrice: PRICE_MAX,
  }));

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    collection: true,
    price: true,
  });

  const hasActiveFilters = filters.categories.length > 0 || filters.collections.length > 0 || filters.minPrice > 0 || filters.maxPrice < PRICE_MAX;

  const clearAll = useCallback(() => {
    setFilters({ categories: [], collections: [], minPrice: 0, maxPrice: PRICE_MAX });
  }, []);

  const updateFilters = useCallback((next: FilterState) => {
    setFilters(next);
  }, []);

  const toggleSection = (key: "category" | "collection" | "price") => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const removeFilter = useCallback(
    (type: "category" | "collection", value: string) => {
      if (type === "category") {
        setFilters((prev) => ({ ...prev, categories: prev.categories.filter((c) => c !== value) }));
      } else {
        setFilters((prev) => ({ ...prev, collections: prev.collections.filter((c) => c !== value) }));
      }
    },
    []
  );

  const { data: category } = trpc.categories.bySlug.useQuery({ slug }, { enabled: !["bestsellers", "best-sellers", "new-arrivals", "teas", "tea", "wellness", "wellness-supplement", "supplement"].includes(slug) });

  const isBestsellers = slug === "bestsellers";

  // Data for filter counts & rich product data
  const { data: richData } = trpc.products.list.useQuery({ limit: 100 });
  const { data: categoriesData } = trpc.categories.list.useQuery();
  const { data: naData } = trpc.products.byTag.useQuery({ tag: "new-arrivals", limit: 50 });
  const { data: bsData } = trpc.products.byTag.useQuery({ tag: "bestseller", limit: 50 });

  const teaSlug = useMemo(() => {
    if (!categoriesData) return "tea";
    const match = categoriesData.find((c: any) => c.name?.toLowerCase().includes("tea"));
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
    const richMap = new Map<string, any>();
    (richData?.products || []).forEach((p: any) => richMap.set(p.id, p));

    const naIds = new Set((naData?.products || []).map((p: any) => p.id));
    const bsIds = new Set((bsData?.products || []).map((p: any) => p.id));

    const merged = new Map<string, EnhancedProduct>();

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

  const filteredProducts = useMemo(
    () => allProducts.filter((p) => matchesProductFilter(p, filters)),
    [allProducts, filters]
  );

  const totalFiltered = filteredProducts.length;

  const title = useMemo(() => {
    if (filters.categories.length === 1) return categoryLabel(filters.categories[0]);
    if (filters.collections.length === 1) return collectionLabel(filters.collections[0]);
    if (isBestsellers) return "Bestsellers";
    if (category?.name) return category.name;
    if (slug === "new-arrivals") return "New Arrivals";
    if (slug === "teas" || slug === "tea") return "Teas";
    if (slug === "wellness" || slug === "wellness-supplement" || slug === "supplement") return "Wellness Supplements";
    return "Shop";
  }, [filters, slug, isBestsellers, category]);

  const description = useMemo(() => {
    if (isBestsellers) return "Our most loved products, chosen by our community";
    if (hasActiveFilters) return "";
    return category?.description || "";
  }, [isBestsellers, hasActiveFilters, category]);

  const sidebar = (
    <FilterSidebar
      allProducts={allProducts}
      filters={filters}
      onUpdateFilters={updateFilters}
      hasActiveFilters={hasActiveFilters}
      onClearAll={clearAll}
      expandedSections={expandedSections}
      onToggleSection={toggleSection}
    />
  );

  return (
    <div className="section-spacing">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-serif text-3xl md:text-4xl text-foreground">{title}</h1>
          {description && (
            <p className="mt-3 text-muted-foreground max-w-xl">{description}</p>
          )}
        </div>

        <div className="flex gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-[260px] lg:w-[280px] shrink-0 self-start sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[#d4d4d4] [&::-webkit-scrollbar-thumb]:rounded-[2px]">
            {sidebar}
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
                    {sidebar}
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
                      onClick={() => setFilters((prev) => ({ ...prev, minPrice: 0, maxPrice: PRICE_MAX }))}
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
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[4/5] rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
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
