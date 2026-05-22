import { Link } from "wouter";
import { Leaf, Mail } from "lucide-react";

const footerLinks = {
  shop: [
    { name: "Green Teas", href: "/collections/green-teas" },
    { name: "Herbal Infusions", href: "/collections/herbal-infusions" },
    { name: "Detox Blends", href: "/collections/detox-blends" },
    { name: "Wellness Powders", href: "/collections/wellness-powders" },
    { name: "Gift Collections", href: "/collections/gift-collections" },
  ],
  company: [
    { name: "Our Story", href: "/about" },
    { name: "Sustainability", href: "/about" },
    { name: "Blog", href: "/about" },
    { name: "Wholesale", href: "/about" },
  ],
  support: [
    { name: "FAQ", href: "/faq" },
    { name: "Shipping & Returns", href: "/faq" },
    { name: "Contact Us", href: "/about" },
    { name: "Track Order", href: "/account" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[oklch(0.935_0.012_78)] border-t border-border/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-serif font-semibold text-brand-green">KN Naturals</span>
            </Link>
            <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-sm">
              Premium teas and herbal wellness essentials crafted for a balanced, healthier you. 
              Ethically sourced, naturally pure.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-lg border border-border/50 shadow-sm">
                <Mail className="w-4 h-4 text-brand-green/60" />
                <span className="text-sm text-muted-foreground">hello@knnaturals.com</span>
              </div>
            </div>
            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Leaf className="w-3.5 h-3.5 text-brand-green" />
                <span>USDA Organic</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Leaf className="w-3.5 h-3.5 text-brand-green" />
                <span>Non-GMO</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Leaf className="w-3.5 h-3.5 text-brand-green" />
                <span>Free Shipping ₹75+</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Leaf className="w-3.5 h-3.5 text-brand-green" />
                <span>30-Day Guarantee</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-5 font-sans">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-brand-green transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-5 font-sans">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-brand-green transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-5 font-sans">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-brand-green transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} KN Naturals. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Leaf className="w-3 h-3 text-brand-green" />
            <span>Crafted with care for your wellness journey</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
