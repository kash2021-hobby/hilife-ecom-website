import { useAuth } from "@/_core/hooks/useAuth";
import ProductCard from "@/components/store/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { useState, useEffect } from "react";

export default function Wishlist() {
  const { isAuthenticated, loading } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  useEffect(() => {
    // Load wishlist from localStorage
    const saved = localStorage.getItem("kn-wishlist");
    if (saved) {
      try {
        setWishlistItems(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      }
    }
  }, []);

  if (!loading && !isAuthenticated) {
    return (
      <div className="section-spacing">
        <div className="container text-center max-w-md mx-auto">
          <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="heading-serif text-2xl mb-3">Your Wishlist</h1>
          <p className="text-muted-foreground text-sm mb-6">Sign in to save your favorite products and access them anytime.</p>
          <a href={getLoginUrl()}>
            <Button className="bg-brand-green hover:bg-brand-green/90 text-white">
              Sign In to View Wishlist
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="section-spacing">
      <div className="container">
        <h1 className="heading-serif text-3xl md:text-4xl mb-8">Your Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
            <Link href="/collections">
              <Button variant="outline" className="border-brand-green text-brand-green">
                Discover Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
            {wishlistItems.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
