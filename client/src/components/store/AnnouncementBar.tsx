import { Leaf, Truck, Shield } from "lucide-react";

const announcements = [
  { icon: Truck, text: "Free shipping on orders over ₹75" },
  { icon: Leaf, text: "100% natural ingredients, ethically sourced" },
  { icon: Shield, text: "30-day satisfaction guarantee" },
];

export default function AnnouncementBar() {
  return (
    <div className="bg-brand-green text-white/90 text-xs py-2.5 overflow-hidden">
      {/* Desktop: centered static */}
      <div className="hidden md:container md:flex md:items-center md:justify-center md:gap-8">
        {announcements.map((item, i) => (
          <div key={i} className="flex items-center gap-2 whitespace-nowrap">
            <item.icon className="w-3.5 h-3.5" />
            <span className="tracking-wide">{item.text}</span>
          </div>
        ))}
      </div>
      {/* Mobile: marquee */}
      <div className="md:hidden overflow-hidden">
        <div className="flex gap-12 animate-marquee" style={{ width: `${announcements.length * 2 * 280}px` }}>
          {[...announcements, ...announcements].map((item, i) => (
            <div key={i} className="flex items-center gap-2 whitespace-nowrap shrink-0" style={{ width: "260px" }}>
              <item.icon className="w-3.5 h-3.5" />
              <span className="tracking-wide">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
