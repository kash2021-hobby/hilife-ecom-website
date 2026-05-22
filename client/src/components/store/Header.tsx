import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";

const megaMenuData = [
  { label: "Teas", href: "/shop?category=teas" },
  { label: "Wellness", href: "/shop?category=wellness" },
  { label: "Our Story", href: "/about" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { openCart, cartCount } = useCart();
  const [location] = useLocation();

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border/50">
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20 relative">
            {/* Mobile menu button */}
            <div className="lg:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10">
              <button
                className="p-2 -ml-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mx-auto lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2">
              <img src="/images/Logo.jpg" alt="KN Naturals" className="h-10 lg:h-12 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:mx-auto items-center gap-1">
              {megaMenuData.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(item.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium tracking-wide transition-colors hover:text-brand-green flex items-center gap-1 ${
                      location.startsWith(item.href) ? "text-brand-green" : "text-foreground/80"
                    }`}
                  >
                    {item.label}
                    {item.children && <ChevronDown className="w-3 h-3" />}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {item.children && activeMenu === item.label && (
                    <div className="absolute top-full left-0 pt-2 z-50">
                      <div className="bg-white rounded-lg shadow-xl border border-border/50 p-6 min-w-[320px]">
                        <div className="space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="block px-4 py-3 rounded-md hover:bg-secondary/50 transition-colors group"
                            >
                              <span className="text-sm font-medium text-foreground group-hover:text-brand-green transition-colors">
                                {child.name}
                              </span>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {child.description}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 max-lg:absolute max-lg:right-0 max-lg:top-1/2 max-lg:-translate-y-1/2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-full hover:bg-secondary/50 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {isAuthenticated && (
                <Link
                  href="/wishlist"
                  className="p-2.5 rounded-full hover:bg-secondary/50 transition-colors hidden sm:block"
                >
                  <Heart className="w-5 h-5" />
                </Link>
              )}

              {isAuthenticated ? (
                <Link
                  href="/account"
                  className="p-2.5 rounded-full hover:bg-secondary/50 transition-colors hidden sm:block"
                >
                  <User className="w-5 h-5" />
                </Link>
              ) : (
                <a
                  href={getLoginUrl()}
                  className="p-2.5 rounded-full hover:bg-secondary/50 transition-colors hidden sm:block"
                >
                  <User className="w-5 h-5" />
                </a>
              )}

              <button
                onClick={openCart}
                className="p-2.5 rounded-full hover:bg-secondary/50 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-green text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <img src="/images/Logo.jpg" alt="KN Naturals" className="h-9 w-auto" />
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {megaMenuData.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      className="block py-3 text-base font-medium text-foreground hover:text-brand-green transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <div className="pl-4 space-y-1 mb-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block py-2 text-sm text-muted-foreground hover:text-brand-green transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              <div className="mt-8 pt-6 border-t border-border">
                {!isAuthenticated && (
                  <a href={getLoginUrl()} className="block">
                    <Button className="w-full bg-brand-green hover:bg-brand-green/90">
                      Sign In
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <SearchOverlay onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const { data: results } = trpc.products.search.useQuery(
    { query, limit: 6 },
    { enabled: query.length >= 2 }
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="container pt-24" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl mx-auto overflow-hidden">
          <div className="flex items-center gap-3 p-5 border-b">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search teas, powders, wellness blends..."
              className="flex-1 text-base outline-none bg-transparent placeholder:text-muted-foreground/60"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button onClick={onClose} className="p-1.5 rounded-md hover:bg-secondary">
              <X className="w-4 h-4" />
            </button>
          </div>

          {query.length >= 2 && results && results.length > 0 && (
            <div className="p-4 max-h-96 overflow-y-auto">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Products
              </p>
              <div className="space-y-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                    onClick={onClose}
                  >
                    <div className="w-12 h-12 rounded-md bg-secondary overflow-hidden flex-shrink-0">
                      {product.images && (product.images as string[])[0] && (
                        <img
                          src={(product.images as string[])[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">₹{product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {query.length >= 2 && results && results.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No products found for "{query}"</p>
            </div>
          )}

          {query.length < 2 && (
            <div className="p-6">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["Matcha", "Detox", "Turmeric", "Ashwagandha", "Green Tea", "Collagen"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 text-sm bg-secondary/70 rounded-full hover:bg-secondary transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { trpc } from "@/lib/trpc";
