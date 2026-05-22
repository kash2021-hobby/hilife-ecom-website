import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

export default function CartDrawer() {
  const { isOpen, closeCart, cartId } = useCart();
  const { data: cartData, refetch } = trpc.cart.get.useQuery(
    { cartId: cartId || undefined },
    { enabled: !!cartId }
  );
  const utils = trpc.useUtils();

  const updateQuantity = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => { utils.cart.get.invalidate(); },
  });

  const removeItem = trpc.cart.remove.useMutation({
    onSuccess: () => { utils.cart.get.invalidate(); },
  });

  const cartItems = cartData?.lines || [];
  const subtotal = cartItems.reduce((sum: number, item: any) => {
    const price = parseFloat(item.merchandise?.price?.amount || "0");
    return sum + price * item.quantity;
  }, 0);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="font-serif text-xl flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {(!cartItems || cartItems.length === 0) ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/40" />
            <p className="text-muted-foreground text-sm">Your cart is empty</p>
            <Button
              variant="outline"
              onClick={closeCart}
              className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cartItems.map((item: any) => {
                const product = item.merchandise?.product;
                const variantTitle = item.merchandise?.title;
                const imageUrl = product?.images?.edges?.[0]?.node?.src;
                const price = item.merchandise?.price?.amount || "0";
                return (
                  <div key={item.id} className="flex gap-4 p-3 rounded-lg bg-secondary/30">
                    <div className="w-16 h-16 rounded-md bg-secondary overflow-hidden flex-shrink-0">
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={product?.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{product?.title}</h4>
                      {variantTitle && variantTitle !== "Default Title" && (
                        <p className="text-xs text-muted-foreground">{variantTitle}</p>
                      )}
                      <p className="text-sm text-brand-green font-medium mt-0.5">₹{price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity.mutate({ cartId, lineId: item.id, quantity: item.quantity - 1 })}
                          className="w-7 h-7 rounded-md border flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity.mutate({ cartId, lineId: item.id, quantity: item.quantity + 1 })}
                          className="w-7 h-7 rounded-md border flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem.mutate({ cartId, lineIds: [item.id] })}
                          className="ml-auto p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <SheetFooter className="border-t pt-4">
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Shipping calculated at checkout</p>
                <Link href="/checkout" onClick={closeCart}>
                  <Button className="w-full bg-brand-green hover:bg-brand-green/90 text-white h-12 text-sm font-medium tracking-wide">
                    Proceed to Checkout
                  </Button>
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
