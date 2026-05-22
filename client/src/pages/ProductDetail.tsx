import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/store/ProductCard";
import { Star, Minus, Plus, ShoppingBag, Shield, Truck, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useLayoutEffect } from "react";

export default function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const { data: product, isLoading } = trpc.products.bySlug.useQuery({ slug: params.slug || "" });
  const { data: relatedData } = trpc.products.list.useQuery({ limit: 4 });
  const { openCart } = useCart();
  const utils = trpc.useUtils();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cartId, setCartId] = useState<string>("");
  const [isBuying, setIsBuying] = useState(false);

  // Scroll to top when this page mounts
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product?.variants]);

  const createCart = trpc.cart.create.useMutation();
  
  const addToCartMutation = trpc.cart.add.useMutation();

  const ensureCart = async () => {
    let id = cartId || "";
    if (!id) {
      const result = await createCart.mutateAsync();
      id = result.id;
      setCartId(id);
    }
    return id;
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }
    try {
      const id = await ensureCart();
      await addToCartMutation.mutateAsync({ cartId: id, variantId: selectedVariant.id, quantity });
      toast.success("Added to cart!");
      openCart();
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }
    setIsBuying(true);
    try {
      const id = await ensureCart();
      const result = await addToCartMutation.mutateAsync({ cartId: id, variantId: selectedVariant.id, quantity });
      if (result?.cart?.checkoutUrl) {
        window.location.href = result.cart.checkoutUrl;
      } else {
        toast.error("Checkout URL not available");
      }
    } catch {
      toast.error("Failed to process Buy Now");
    } finally {
      setIsBuying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-20">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
          <Link href="/collections">
            <Button>Back to Collections</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = (product.images as string[]) || [];
  const rating = parseFloat(product.averageRating || "0");
  const hasDiscount = product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price);

  return (
    <div className="min-h-screen bg-background">
      <div className="container pt-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-secondary/30">
              {images[selectedImage] ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full object-contain max-h-[600px]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? "border-brand-green" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {rating > 0 && (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">({product.reviewCount})</span>
                  </div>
                )}
              </div>
              <h1 className="heading-serif text-4xl md:text-5xl text-foreground mb-3">{product.name}</h1>
              <p className="text-lg text-muted-foreground">{product.shortDescription}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-brand-green">₹{product.price}</span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">₹{product.compareAtPrice}</span>
              )}
              {hasDiscount && (
                <span className="px-3 py-1 bg-red-500/10 text-red-600 text-sm font-medium rounded-full">
                  Save {Math.round(((parseFloat(product.compareAtPrice!) - parseFloat(product.price)) / parseFloat(product.compareAtPrice!)) * 100)}%
                </span>
              )}
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 1 && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Size / Weight</label>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((variant: any) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedVariant?.id === variant.id
                          ? "border-brand-green bg-brand-green/5"
                          : "border-border hover:border-brand-green/30"
                      }`}
                    >
                      <div className="font-medium text-sm">{variant.title}</div>
                      <div className="text-xs text-muted-foreground">₹{variant.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border border-border bg-background flex-[0_0_30%] px-1 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center text-brand-green hover:text-brand-green/70 transition-colors rounded-full hover:bg-brand-green/5"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="flex-1 text-center font-medium text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-brand-green hover:text-brand-green/70 transition-colors rounded-full hover:bg-brand-green/5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending || !selectedVariant}
                  className="flex-1 bg-brand-green hover:bg-brand-green/90 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                </Button>
              </div>

              {/* Buy Now */}
              <Button
                onClick={handleBuyNow}
                disabled={isBuying || !selectedVariant}
                variant="outline"
                className="w-full py-2.5 rounded-lg border-brand-green/70 text-brand-green bg-background hover:bg-brand-green/5 text-sm"
              >
                {isBuying ? "Processing..." : "Buy Now"}
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-brand-green" />
                <span className="text-sm text-foreground">Free shipping on orders over ₹75</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-brand-green" />
                <span className="text-sm text-foreground">30-day satisfaction guarantee</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-brand-green" />
                <span className="text-sm text-foreground">100% natural ingredients</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-20">
          <TabsList className="w-full justify-start overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TabsTrigger value="description" className="shrink-0 px-3 md:px-4">Description</TabsTrigger>
            <TabsTrigger value="ingredients" className="shrink-0 px-3 md:px-4">Ingredients</TabsTrigger>
            <TabsTrigger value="brewing" className="shrink-0 px-3 md:px-4">Brewing</TabsTrigger>
            <TabsTrigger value="benefits" className="shrink-0 px-3 md:px-4">Benefits</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4">
            <div
              className="product-description prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </TabsContent>

          <TabsContent value="ingredients" className="space-y-4">
            {product.ingredients ? (
              <div className="product-description text-foreground leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.ingredients }} />
            ) : (
              <p className="text-muted-foreground">No ingredient information available</p>
            )}
          </TabsContent>

          <TabsContent value="brewing" className="space-y-4">
            {product.brewingInstructions ? (
              <div className="product-description text-foreground leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.brewingInstructions }} />
            ) : (
              <p className="text-muted-foreground">No brewing instructions available</p>
            )}
          </TabsContent>

          <TabsContent value="benefits" className="space-y-4">
            {product.wellnessBenefits ? (
              <div className="product-description text-foreground leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.wellnessBenefits }} />
            ) : (
              <p className="text-muted-foreground">No wellness benefits listed</p>
            )}
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedData?.products && relatedData.products.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
                You Might Also Like
              </p>
              <h2 className="heading-serif text-3xl md:text-4xl text-foreground">
                Related Products
              </h2>
              <div className="gold-accent mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedData.products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
