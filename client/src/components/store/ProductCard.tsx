import { Link } from "wouter";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import type { Product } from "@shared/types";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

export default function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const { openCart, cartId, setCartId } = useCart();
  const utils = trpc.useUtils();

  const createCart = trpc.cart.create.useMutation();

  const addToCartMutation = trpc.cart.add.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate();
      openCart();
      toast.success("Added to cart");
    },
    onError: (err) => {
      toast.error("Failed to add to cart");
    },
  });

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variantId = (product as any).variantId || product.id;

    let id = cartId;
    if (!id) {
      try {
        const result = await createCart.mutateAsync();
        id = result.id;
        setCartId(id);
      } catch {
        toast.error("Failed to create cart");
        return;
      }
    }

    addToCartMutation.mutate({ cartId: id, variantId, quantity: 1 });
  };

  const images = product.images as string[] | null;
  const rating = parseFloat(product.averageRating || "0");
  const hasDiscount = product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price);
  const discountPercent = hasDiscount
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.compareAtPrice!)) * 100)
    : 0;

  return (
    <div className="group relative transition-all duration-500">
      {/* Image */}
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-white mb-3">
          <div className="w-full h-full p-1.5">
            {images && images[0] ? (
              <img
                src={images[0]}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground/40 text-sm">No image</span>
              </div>
            )}
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.bestseller && (
              <span className="px-2.5 py-1 bg-brand-green text-white text-[10px] font-semibold uppercase tracking-wider rounded-full">
                Bestseller
              </span>
            )}
            {hasDiscount && (
              <span className="px-2.5 py-1 bg-red-500/90 text-white text-[10px] font-semibold uppercase tracking-wider rounded-full">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 max-lg:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast("Sign in to save to wishlist", { description: "Create an account to save your favorites" });
              }}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white transition-colors"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart overlay (desktop hover) */}
          <div className="hidden lg:block absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-brand-green text-white text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-brand-green/90 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <Link href={`/product/${product.slug}`}>
        <div className="space-y-1.5">
          {/* Rating */}
          <div className="flex items-center gap-1.5 min-h-[18px]">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 md:w-4 md:h-4 ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`}
                />
              ))}
            </div>
            <span className="text-xs md:text-sm text-muted-foreground font-medium">
              {rating.toFixed(1)}/5 ({product.reviewCount})
            </span>
          </div>

          {/* Name */}
          <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-brand-green transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-[17px] md:text-xl font-semibold text-foreground">₹{product.price}</span>
            {hasDiscount && (
              <span className="text-xs md:text-sm text-muted-foreground line-through">₹{product.compareAtPrice}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Mobile Add to Cart (below price) */}
      <div className="lg:hidden mt-3">
        <button
          onClick={handleAddToCart}
          className="w-full py-2.5 bg-brand-green text-white text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-brand-green/90 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
