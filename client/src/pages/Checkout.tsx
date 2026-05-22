import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Check, MapPin, Truck, CreditCard, Package } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

type Step = "address" | "shipping" | "payment" | "confirmation";

export default function Checkout() {
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>("address");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderNumber, setOrderNumber] = useState("");

  const { data: cartItems } = trpc.cart.get.useQuery();
  const utils = trpc.useUtils();

  const [address, setAddress] = useState({
    name: user?.name || "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    phone: "",
  });

  const [shippingMethod, setShippingMethod] = useState("standard");

  const createOrder = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      setOrderId(data?.id || null);
      setOrderNumber(data?.orderNumber || "");
      setStep("confirmation");
      utils.cart.get.invalidate();
    },
    onError: () => {
      toast.error("Failed to place order. Please try again.");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="section-spacing">
        <div className="container text-center max-w-md mx-auto">
          <h1 className="heading-serif text-2xl mb-3">Checkout</h1>
          <p className="text-muted-foreground text-sm mb-6">Please sign in to complete your purchase.</p>
          <a href={getLoginUrl()}>
            <Button className="bg-brand-green hover:bg-brand-green/90 text-white">Sign In to Checkout</Button>
          </a>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    if (step !== "confirmation") {
      return (
        <div className="section-spacing">
          <div className="container text-center max-w-md mx-auto">
            <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h1 className="heading-serif text-2xl mb-3">Your cart is empty</h1>
            <Link href="/collections/bestsellers">
              <Button className="bg-brand-green hover:bg-brand-green/90 text-white">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      );
    }
  }

  const subtotal = cartItems?.reduce((sum, item) => sum + parseFloat(item.product?.price || "0") * item.quantity, 0) || 0;
  const shippingCost = shippingMethod === "express" ? 12.99 : subtotal >= 75 ? 0 : 5.99;
  const total = subtotal + shippingCost;

  const steps: { key: Step; label: string; icon: any }[] = [
    { key: "address", label: "Address", icon: MapPin },
    { key: "shipping", label: "Shipping", icon: Truck },
    { key: "payment", label: "Payment", icon: CreditCard },
    { key: "confirmation", label: "Confirmation", icon: Check },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  const handlePlaceOrder = () => {
    if (!cartItems) return;
    createOrder.mutate({
      items: cartItems.map(item => ({
        productId: item.productId,
        variantId: item.variantId || undefined,
        productName: item.product?.name || "Product",
        price: item.product?.price || "0",
        quantity: item.quantity,
        image: (item.product?.images as string[])?.[0],
      })),
      subtotal: subtotal.toFixed(2),
      shippingCost: shippingCost.toFixed(2),
      total: total.toFixed(2),
      shippingName: address.name,
      shippingAddress: address.address,
      shippingCity: address.city,
      shippingState: address.state,
      shippingZip: address.zip,
      shippingCountry: address.country,
      shippingPhone: address.phone,
      shippingMethod,
      paymentMethod: "card",
    });
  };

  return (
    <div className="section-spacing">
      <div className="container max-w-4xl">
        <h1 className="heading-serif text-3xl text-center mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className={`flex items-center gap-2 ${i <= currentStepIndex ? "text-brand-green" : "text-muted-foreground/50"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  i < currentStepIndex ? "bg-brand-green text-white" : i === currentStepIndex ? "border-2 border-brand-green text-brand-green" : "border border-muted-foreground/30"
                }`}>
                  {i < currentStepIndex ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-sm font-medium hidden sm:block">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-px mx-2 ${i < currentStepIndex ? "bg-brand-green" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === "address" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm text-muted-foreground mb-1.5 block">Full Name</label>
                    <input type="text" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border bg-white text-sm outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green" placeholder="John Doe" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm text-muted-foreground mb-1.5 block">Address</label>
                    <input type="text" value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border bg-white text-sm outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green" placeholder="123 Wellness St" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">City</label>
                    <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border bg-white text-sm outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green" placeholder="New York" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">State</label>
                    <input type="text" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border bg-white text-sm outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green" placeholder="NY" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">ZIP Code</label>
                    <input type="text" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border bg-white text-sm outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green" placeholder="10001" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Phone</label>
                    <input type="text" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border bg-white text-sm outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <Button onClick={() => setStep("shipping")} className="bg-brand-green hover:bg-brand-green/90 text-white h-11 px-8">
                  Continue to Shipping
                </Button>
              </div>
            )}

            {step === "shipping" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Shipping Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${shippingMethod === "standard" ? "border-brand-green bg-brand-green/5" : "border-border hover:border-brand-green/50"}`}>
                    <input type="radio" name="shipping" value="standard" checked={shippingMethod === "standard"} onChange={() => setShippingMethod("standard")} className="accent-[oklch(0.35_0.08_145)]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Standard Shipping</p>
                      <p className="text-xs text-muted-foreground">3-5 business days</p>
                    </div>
                    <span className="text-sm font-medium">{subtotal >= 75 ? "Free" : "₹5.99"}</span>
                  </label>
                  <label className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${shippingMethod === "express" ? "border-brand-green bg-brand-green/5" : "border-border hover:border-brand-green/50"}`}>
                    <input type="radio" name="shipping" value="express" checked={shippingMethod === "express"} onChange={() => setShippingMethod("express")} className="accent-[oklch(0.35_0.08_145)]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Express Shipping</p>
                      <p className="text-xs text-muted-foreground">1-2 business days</p>
                    </div>
                    <span className="text-sm font-medium">₹12.99</span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("address")}>Back</Button>
                  <Button onClick={() => setStep("payment")} className="bg-brand-green hover:bg-brand-green/90 text-white h-11 px-8">
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Order Review & Payment</h2>
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                  <h4 className="text-sm font-medium mb-3">Shipping to:</h4>
                  <p className="text-sm text-muted-foreground">{address.name}</p>
                  <p className="text-sm text-muted-foreground">{address.address}</p>
                  <p className="text-sm text-muted-foreground">{address.city}, {address.state} {address.zip}</p>
                </div>
                <div className="p-4 rounded-lg border border-border/50">
                  <p className="text-sm text-muted-foreground mb-2">Payment will be processed securely. This is a demo checkout.</p>
                  <div className="flex items-center gap-2 text-xs text-brand-green">
                    <Check className="w-3.5 h-3.5" />
                    <span>Secure 256-bit SSL encryption</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("shipping")}>Back</Button>
                  <Button
                    onClick={handlePlaceOrder}
                    className="bg-brand-green hover:bg-brand-green/90 text-white h-11 px-8"
                    disabled={createOrder.isPending}
                  >
                    {createOrder.isPending ? "Placing Order..." : `Place Order — ₹${total.toFixed(2)}`}
                  </Button>
                </div>
              </div>
            )}

            {step === "confirmation" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-brand-green" />
                </div>
                <h2 className="heading-serif text-2xl mb-2">Order Confirmed!</h2>
                <p className="text-muted-foreground mb-2">Thank you for your order.</p>
                <p className="text-sm font-medium text-brand-green mb-6">Order #{orderNumber}</p>
                <p className="text-sm text-muted-foreground mb-8">
                  You'll receive a confirmation email shortly with tracking details.
                </p>
                <Link href="/collections/bestsellers">
                  <Button className="bg-brand-green hover:bg-brand-green/90 text-white">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {step !== "confirmation" && (
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 rounded-xl border border-border/50 bg-white">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {cartItems?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-secondary overflow-hidden flex-shrink-0">
                        {item.product?.images && (item.product.images as string[])[0] && (
                          <img src={(item.product.images as string[])[0]} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{item.product?.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs font-medium">₹{(parseFloat(item.product?.price || "0") * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shippingCost === 0 ? "Free" : `₹${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-brand-green">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
