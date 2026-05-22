import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Package, User, LogOut } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Account() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { data: orders } = trpc.orders.list.useQuery(undefined, { enabled: isAuthenticated });

  if (!loading && !isAuthenticated) {
    return (
      <div className="section-spacing">
        <div className="container text-center max-w-md mx-auto">
          <User className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="heading-serif text-2xl mb-3">My Account</h1>
          <p className="text-muted-foreground text-sm mb-6">Sign in to view your orders and manage your account.</p>
          <a href={getLoginUrl()}>
            <Button className="bg-brand-green hover:bg-brand-green/90 text-white">Sign In</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="section-spacing">
      <div className="container max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="heading-serif text-3xl">My Account</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user?.name || "there"}!</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => logout()} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Orders */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order History
          </h2>
          {!orders || orders.length === 0 ? (
            <div className="text-center py-12 border border-border/50 rounded-xl">
              <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="p-5 rounded-xl border border-border/50 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Order #{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-brand-green">₹{order.total}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === "delivered" ? "bg-green-100 text-green-700" :
                        order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
