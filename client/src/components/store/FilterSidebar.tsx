import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterState {
  categories: string[];
  collections: string[];
  minPrice: number;
  maxPrice: number;
}

export interface EnhancedProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  compareAtPrice: string | null;
  images: string[];
  tags: string[];
  averageRating: string;
  reviewCount: number;
  variantId: string | null;
  description: string | null;
  shortDescription: string;
  bestseller: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  category: string;
}

export const PRICE_MIN = 0;
export const PRICE_MAX = 2000;
export const STEP = 10;

export function matchesProductFilter(product: EnhancedProduct, filters: FilterState): boolean {
  if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false;
  if (filters.collections.length > 0) {
    const match = filters.collections.some((c) =>
      (c === "new-arrivals" && product.isNewArrival) ||
      (c === "best-sellers" && product.isBestSeller)
    );
    if (!match) return false;
  }
  const price = parseFloat(product.price);
  if (price < filters.minPrice || price > filters.maxPrice) return false;
  return true;
}

export function categoryLabel(slug: string): string {
  const map: Record<string, string> = { teas: "Teas", wellness: "Wellness Supplements" };
  return map[slug] || slug;
}

export function collectionLabel(slug: string): string {
  const map: Record<string, string> = { "new-arrivals": "New Arrivals", "best-sellers": "Best Sellers" };
  return map[slug] || slug;
}

interface FilterSidebarProps {
  allProducts: EnhancedProduct[];
  filters: FilterState;
  onUpdateFilters: (next: FilterState) => void;
  hasActiveFilters: boolean;
  onClearAll: () => void;
  expandedSections: Record<string, boolean>;
  onToggleSection: (key: "category" | "collection" | "price") => void;
}

export default function FilterSidebar({
  allProducts,
  filters,
  onUpdateFilters,
  hasActiveFilters,
  onClearAll,
  expandedSections,
  onToggleSection,
}: FilterSidebarProps) {
  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-gold" />
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-gold">Filters</span>
        </div>
        {hasActiveFilters && (
          <button onClick={onClearAll} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Clear All
          </button>
        )}
      </div>

      {/* Price */}
      <div className="py-4 border-b border-border/50">
        <button onClick={() => onToggleSection("price")} className="flex items-center justify-between w-full text-left">
          <span className="text-sm font-semibold uppercase tracking-wider">Price</span>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
              expandedSections.price && "rotate-180"
            )}
          />
        </button>
        {expandedSections.price && (
          <div className="mt-4 space-y-3">
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={([min, max]) => onUpdateFilters({ ...filters, minPrice: min, maxPrice: max })}
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={STEP}
              className="[&_[data-slot=slider-range]]:bg-brand-green [&_[data-slot=slider-thumb]]:border-brand-green"
            />
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground">₹</span>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => {
                    const v = Math.max(PRICE_MIN, Math.min(filters.maxPrice - STEP, Number(e.target.value) || 0));
                    onUpdateFilters({ ...filters, minPrice: v });
                  }}
                  className="w-16 h-7 text-xs border border-border/50 rounded px-1.5 bg-white text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
              <span className="text-[11px] text-muted-foreground">—</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground">₹</span>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => {
                    const v = Math.min(PRICE_MAX, Math.max(filters.minPrice + STEP, Number(e.target.value) || PRICE_MAX));
                    onUpdateFilters({ ...filters, maxPrice: v });
                  }}
                  className="w-16 h-7 text-xs border border-border/50 rounded px-1.5 bg-white text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category */}
      <div className="py-4 border-b border-border/50">
        <button onClick={() => onToggleSection("category")} className="flex items-center justify-between w-full text-left">
          <span className="text-sm font-semibold uppercase tracking-wider">Category</span>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
              expandedSections.category && "rotate-180"
            )}
          />
        </button>
        {expandedSections.category && (
          <div className="mt-3 space-y-2.5">
            {["teas", "wellness"].map((cat) => {
              const count = allProducts.filter(
                (p) => p.category === cat && (filters.collections.length === 0 || filters.collections.some((c) => (c === "new-arrivals" && p.isNewArrival) || (c === "best-sellers" && p.isBestSeller)))
              ).length;
              return (
                <div
                  key={cat}
                  className="flex items-center gap-2.5 text-base cursor-pointer group"
                  onClick={() => {
                    const next = filters.categories.includes(cat)
                      ? filters.categories.filter((c) => c !== cat)
                      : [...filters.categories, cat];
                    onUpdateFilters({ ...filters, categories: next });
                  }}
                >
                  <Checkbox
                    checked={filters.categories.includes(cat)}
                    className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green pointer-events-none"
                  />
                  <span className="flex-1">{categoryLabel(cat)}</span>
                  <span className="text-xs text-muted-foreground">({count})</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Collection */}
      <div className="py-4 border-b border-border/50">
        <button onClick={() => onToggleSection("collection")} className="flex items-center justify-between w-full text-left">
          <span className="text-sm font-semibold uppercase tracking-wider">Collection</span>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
              expandedSections.collection && "rotate-180"
            )}
          />
        </button>
        {expandedSections.collection && (
          <div className="mt-3 space-y-2.5">
            {["new-arrivals", "best-sellers"].map((col) => {
              const count = allProducts.filter(
                (p) => (col === "new-arrivals" ? p.isNewArrival : p.isBestSeller) && (filters.categories.length === 0 || filters.categories.includes(p.category))
              ).length;
              return (
                <div
                  key={col}
                  className="flex items-center gap-2.5 text-base cursor-pointer group"
                  onClick={() => {
                    const next = filters.collections.includes(col)
                      ? filters.collections.filter((c) => c !== col)
                      : [...filters.collections, col];
                    onUpdateFilters({ ...filters, collections: next });
                  }}
                >
                  <Checkbox
                    checked={filters.collections.includes(col)}
                    className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green pointer-events-none"
                  />
                  <span className="flex-1">{collectionLabel(col)}</span>
                  <span className="text-xs text-muted-foreground">({count})</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
