import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/store/ProductCard";
import MobileHeroVideoSection from "../components/MobileHeroVideoSection";
import MarqueeBanner from "../components/MarqueeBanner";
import { Star, Leaf, Shield, Droplets, Heart, Sparkles, ChevronRight, ChevronLeft, Quote, Zap, Flame, Wind, Brain } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const TABS = [
  { label: "Bestselling Products" },
  { label: "New Arrivals" },
];

export default function Home() {
  const { data: featuredProducts } = trpc.products.byCollection.useQuery({ handle: "featured-products", limit: 6 });
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: bestsellerData, isLoading: isBestsellerLoading } = trpc.products.byTag.useQuery({ tag: "bestseller", limit: 8 });
  const { data: newArrivalsData, isLoading: isNewArrivalsLoading } = trpc.products.byTag.useQuery({ tag: "new-arrivals", limit: 8 });
  const [activeTab, setActiveTab] = useState(0);
  const tabProductsData = activeTab === 0 ? bestsellerData : newArrivalsData;
  const isTabLoading = activeTab === 0 ? isBestsellerLoading : isNewArrivalsLoading;
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scrollCarousel = useCallback((direction) => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth / 4;
    el.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  }, []);

  useEffect(() => {
    requestAnimationFrame(updateScrollState);
  }, [activeTab, tabProductsData, updateScrollState]);

  return (
    <div>
      <MobileHeroVideoSection />

      <MarqueeBanner />

      {/* Shop by Category */}
      <section id="explore-range" className="py-12 md:py-16 bg-[#FBF5EA]">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-[1500px]">
          <div className="text-center mb-10 md:mb-12">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Explore Our Range
            </p>
            <h2 className="heading-serif text-4xl md:text-5xl text-foreground">
              Shop by Category
            </h2>
            <div className="gold-accent mx-auto mt-4" />
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-5 lg:gap-6">
            {(categories || []).map((cat) => {
              const gradients = [
                "from-[#2d4a3b]/90 to-[#1a2e1a]/60",
                "from-[#8b6f4e]/90 to-[#5c4a32]/60",
              ];
              const bgGrad = gradients[(cat as any).id % gradients.length] || gradients[0];
              return (
                <Link key={cat.id} href={`/collections/${cat.slug}`} className="flex-1">
                  <div className="group relative h-64 md:h-80 lg:h-96 rounded-xl md:rounded-2xl overflow-hidden shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_50px_-16px_rgba(0,0,0,0.22)] transition-all duration-500 ease-out hover:-translate-y-0.5">
                    {/* Background image */}
                    <div className="absolute inset-0 bg-cover bg-center scale-100 group-hover:scale-110 transition-transform duration-700 ease-out" style={cat.image ? { backgroundImage: `url(${cat.image})` } : undefined} />
                    {/* Gradient fallback when no image */}
                    {!cat.image && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${bgGrad}`} />
                    )}
                    {/* Cinematic overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-black/60 group-hover:brightness-110 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent pointer-events-none" />
                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-end items-end h-full p-8 md:p-10 lg:p-14 text-right">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-amber-200/60 to-transparent mb-3" />
                      <div className="mt-3 md:mt-4 text-white/70 group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="section-spacing bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-green/[0.02] rounded-full blur-[100px] pointer-events-none" />
        <div className="container relative z-10">
          <div className="text-center mb-8 md:mb-10">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4 md:mb-5">
              Customer Favorites
            </p>
          </div>
          {/* Tab Navigation */}
          <div className="flex justify-center gap-2 md:gap-3 mb-8 md:mb-10">
            {TABS.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`shrink-0 px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                  i === activeTab
                    ? "bg-brand-green text-white shadow-sm"
                    : "bg-white text-muted-foreground border border-border/30 hover:border-brand-green/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Carousel wrapper */}
          <div className="relative">
            {/* Desktop arrows */}
            {canScrollLeft && (
              <button
                onClick={() => scrollCarousel(-1)}
                className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-border/30 items-center justify-center hover:bg-secondary/50 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scrollCarousel(1)}
                className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-border/30 items-center justify-center hover:bg-secondary/50 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Desktop: horizontal carousel — 5 products visible */}
            <div
              ref={carouselRef}
              onScroll={updateScrollState}
              className="hidden lg:flex overflow-x-auto gap-4 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {isTabLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="min-w-[20%] animate-pulse">
                    <div className="aspect-[4/5] bg-secondary/40 rounded-xl mb-3" />
                    <div className="h-3 bg-secondary/40 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-secondary/40 rounded w-1/2" />
                  </div>
                ))
              ) : (
                (tabProductsData?.products || []).map((product) => (
                  <div key={product.id} className="min-w-[20%]">
                    <ProductCard product={product as any} />
                  </div>
                ))
              )}
            </div>

            {/* Tablet & mobile: grid — max 4 products */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:hidden gap-5 md:gap-8">
              {isTabLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/5] bg-secondary/40 rounded-xl mb-3" />
                    <div className="h-3 bg-secondary/40 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-secondary/40 rounded w-1/2" />
                  </div>
                ))
              ) : (
                (tabProductsData?.products || []).slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))
              )}
            </div>
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/shop?collection=best-sellers&category=teas,wellness">
              <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Product */}
      {featuredProducts?.products && featuredProducts.products.length > 0 && (
        <section className="section-spacing bg-gradient-to-b from-secondary/30 to-white relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-green/[0.04] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-amber-200/[0.03] rounded-full blur-[80px] pointer-events-none" />
          <div className="container relative z-10">
            <div className="text-center mb-12">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Spotlight
              </p>
              <h2 className="heading-serif text-4xl md:text-5xl text-foreground">
                Featured Product
              </h2>
              <div className="gold-accent mx-auto mt-4" />
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white rounded-2xl overflow-hidden shadow-[0_8px_32px_-12px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_48px_-16px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-0.5">
                {/* Product Image */}
                <div className="aspect-square bg-secondary/20 flex items-center justify-center overflow-hidden">
                  {featuredProducts.products[0]?.images?.[0] ? (
                    <img 
                      src={featuredProducts.products[0].images[0]} 
                      alt={featuredProducts.products[0].name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Product Image</p>
                    </div>
                  )}
                </div>
                
                {/* Product Details */}
                <div className="p-8 md:p-10">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-brand-green/10 text-brand-green text-xs font-semibold rounded-full">
                      This Month's Pick
                    </span>
                  </div>
                  <h3 className="heading-serif text-2xl md:text-3xl text-foreground mb-4">
                    {featuredProducts.products[0]?.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      (248 reviews)
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {featuredProducts.products[0]?.description?.substring(0, 150)}...
                  </p>
                  
                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-foreground">
                        ₹{featuredProducts.products[0]?.price}
                      </span>
                      {featuredProducts.products[0]?.compareAtPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ₹{featuredProducts.products[0].compareAtPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* CTA */}
                  <Link href={`/product/${featuredProducts.products[0]?.slug}`}>
                    <Button className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-medium py-3">
                      View Product Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Fitness & Active Wellness */}
      <FitnessWellness />

      {/* Wellness Lifestyle */}
      <WellnessLifestyleSection />

      {/* Trust Icons */}
      <TrustBar />

      {/* Brand Story */}
      <BrandStory />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* New Arrivals */}
      <NewArrivalsSection />

      {/* FAQ */}
      <FAQSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-cover bg-center bg-no-repeat max-md:bg-[url('/images/mobileview-herosection.png')] max-md:bg-[position:center_35%] bg-[url('/images/hero-banner.png')]">
      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-black/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/10 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.15) 100%)" }} />
      {/* Desktop atmospheric depth - strictly hidden on mobile */}
      <div className="hidden md:block absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-green/[0.05] rounded-full blur-[120px] pointer-events-none" />
      <div className="hidden md:block absolute top-2/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-200/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/20 via-black/5 to-transparent pointer-events-none" />
      <div className="hidden md:block absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/15 via-black/5 to-transparent pointer-events-none" />
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 pointer-events-none" />
      <div className="container relative z-10">
        <div className="pt-12 pb-[372px] max-md:pb-[260px] md:py-24 lg:py-32 max-w-3xl mx-auto text-center">
          <h1 className="heading-serif text-5xl md:text-6xl lg:text-7xl text-white leading-tight drop-shadow-lg">
            Wellness Crafted<br />
            <span className="text-[#1B451E]">By Nature</span>
          </h1>

          <div className="flex justify-center my-6 max-sm:my-2">
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
          </div>

          <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed drop-shadow">
            Botanical wellness teas designed to nourish the body, ease the mind, and elevate daily rituals.
          </p>

          <div className="flex justify-center mt-10 max-sm:mt-4">
            <a href="#explore-range" onClick={(e) => { e.preventDefault(); document.getElementById("explore-range")?.scrollIntoView({ behavior: "smooth" }); }}>
              <Button className="bg-brand-green hover:bg-brand-green/90 text-white btn-premium h-12 px-8 max-sm:h-9 max-sm:px-3 max-sm:text-[11px] rounded-lg shadow-lg">
                Explore Our Collection
              </Button>
            </a>
          </div>
        </div>
      </div>


    </section>
  );
}

function TrustBar() {
  const trustItems = [
    { icon: Leaf, title: "Natural & Pure", desc: "Made with 100% natural ingredients" },
    { icon: Shield, title: "No Additives", desc: "No artificial flavors or preservatives" },
    { icon: Droplets, title: "Holistic Wellness", desc: "Blends crafted for mind, body & soul" },
    { icon: Heart, title: "Daily Rituals", desc: "Simple choices for healthier living" },
    { icon: Sparkles, title: "Sustainable", desc: "Responsibly sourced for a better tomorrow" },
  ];

  return (
    <section className="py-8 bg-white border-y border-border/30 overflow-hidden">
      <div className="container">
        {/* Desktop: grid */}
        <div className="hidden md:grid md:grid-cols-5 gap-4">
          {trustItems.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/60 to-secondary/40 flex items-center justify-center shadow-sm">
                <item.icon className="w-5 h-5 text-brand-green" />
              </div>
              <h4 className="text-xs font-semibold uppercase tracking-wider">{item.title}</h4>
              <p className="text-[11px] text-muted-foreground leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
        {/* Mobile: marquee */}
        <div className="md:hidden overflow-hidden">
          <div className="flex gap-8 animate-marquee" style={{ width: `${trustItems.length * 2 * 220}px` }}>
            {[...trustItems, ...trustItems].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2 shrink-0" style={{ width: "200px" }}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/60 to-secondary/40 flex items-center justify-center shadow-sm">
                  <item.icon className="w-5 h-5 text-brand-green" />
                </div>
                <h4 className="text-xs font-semibold uppercase tracking-wider">{item.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section className="section-spacing bg-[#FBF5EA]">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Our Story
            </p>
            <div className="w-10 h-0.5 bg-gradient-to-r from-brand-green/40 to-transparent mb-5" />
            <h2 className="heading-serif text-4xl md:text-5xl text-foreground mb-8">
              A Legacy of Wellness
            </h2>
            <div className="space-y-6 text-muted-foreground leading-[1.8] text-[15px] md:text-base max-w-lg">
              <p>
                KN Naturals was born from a simple belief: that nature holds the key to balanced, 
                vibrant living. We source the finest botanicals from trusted farmers across Japan, 
                India, Sri Lanka, and beyond.
              </p>
              <p>
                Every blend is crafted with intention — to support your active lifestyle, 
                nourish your body, and create moments of calm in your busy day. From our 
                ceremonial-grade matcha to our adaptogenic wellness powders, quality and 
                purity are never compromised.
              </p>
            </div>
            <Link href="/about">
              <Button variant="outline" className="mt-10 border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
                Learn More About Us
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-cover bg-center shadow-[0_16px_48px_-16px_rgba(0,0,0,0.15)] relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-transparent pointer-events-none" />
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/images/ourstory-bgimage.png')" }} />
            </div>
            <div className="absolute -bottom-6 -right-6 w-56 h-56 bg-brand-green/[0.06] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-6 -left-6 w-40 h-40 bg-amber-200/[0.06] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-green/[0.03] rounded-full blur-[120px] pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FitnessWellness() {
  const benefits = [
    { title: "Natural Energy Support", desc: "Sustain energy throughout your workouts with clean, caffeine-conscious herbal blends.", icon: Zap },
    { title: "Recovery & Relaxation", desc: "Post-workout recovery blends help soothe muscles and restore balance naturally.", icon: Heart },
    { title: "Metabolism Support", desc: "Thermogenic properties from green tea and botanicals to complement an active metabolism.", icon: Flame },
    { title: "Clean Daily Ingredients", desc: "Every blend is free from artificial additives — just pure botanicals for real results.", icon: Leaf },
    { title: "Gut & Digestive Wellness", desc: "Digestive-friendly herbs support nutrient absorption and overall gut health.", icon: Wind },
    { title: "Stress Balance for Active Lifestyles", desc: "Adaptogenic herbs help manage stress responses so you can perform at your best.", icon: Brain },
  ];

  return (
    <section className="section-spacing relative overflow-hidden bg-[#FBF5EA]">
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] -translate-y-1/2 bg-brand-green/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Wellness for Active Living
            </p>
            <h2 className="heading-serif text-4xl md:text-5xl text-foreground mb-6">
              Natural Wellness for Your Fitness Journey
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Thoughtfully formulated to complement an active lifestyle — from pre-workout energy to post-workout recovery.
            </p>
            <div className="space-y-4 mb-8">
              {benefits.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/60 to-secondary/40 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <item.icon className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/shop?category=wellness">
              <Button className="bg-brand-green hover:bg-brand-green/90 text-white btn-premium h-12 px-8 rounded-lg shadow-lg">
                Explore Wellness Collection
              </Button>
            </Link>
          </div>
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none z-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-transparent pointer-events-none z-10" />
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/images/healthbenefits.png')" }} />
            </div>
            <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-brand-green/[0.06] rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}

function WellnessLifestyleSection() {
  const routines = [
    { title: "Morning Energy", img: "/images/Wellness Benefits/Moringa powder.png" },
    { title: "Hair Nutrition", img: "/images/Wellness Benefits/Hairtox.png" },
    { title: "Skin Clarity", img: "/images/Wellness Benefits/Acnetox.png" },
    { title: "Glow Radiance", img: "/images/Wellness Benefits/Glowtox.png" },
    { title: "Weight Balance", img: "/images/Wellness Benefits/Slimtox.png" },
  ];

  return (
    <section className="py-10 md:py-14 bg-[#FBF5EA]">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Wellness Lifestyle
          </p>
          <h2 className="heading-serif text-3xl md:text-4xl text-foreground">
            Wellness for Every Routine
          </h2>
          <div className="gold-accent mx-auto mt-3" />
        </div>

        {/* 5 image-dominant cards in one row */}
        <div className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 md:mx-0 md:px-0">
          {routines.map((item, i) => (
            <div
              key={i}
              className="group snap-start shrink-0 w-[230px] md:w-0 md:flex-1 aspect-[4/5] rounded-xl overflow-hidden shadow-[0_4px_20px_-8px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.18)] transition-all duration-500 flex flex-col bg-white"
            >
              {/* Image — dominates ~80% of card */}
              <div className="flex-1 min-h-0 relative bg-secondary/30">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
              {/* Text label — compact bottom area */}
              <div className="shrink-0 px-3 pb-2 pt-1.5 flex flex-col justify-center bg-white">
                <span className="text-[9px] font-medium uppercase tracking-wider text-foreground/70">
                  Wellness Ritual
                </span>
                <h3 className="text-[11px] font-semibold text-foreground leading-tight">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    { name: "Sarah M.", rating: 5, text: "The Ceremonial Matcha is incredible. Smooth, no bitterness, and gives me calm energy all morning. Best matcha I've ever had.", location: "Wellness Coach" },
    { name: "James R.", rating: 5, text: "I've been using the Daily Detox blend for 3 months. My digestion has improved significantly and I feel lighter every day.", location: "Fitness Trainer" },
    { name: "Priya K.", rating: 5, text: "The Ashwagandha Calm Blend has transformed my evening routine. I sleep so much better now. Truly premium quality.", location: "Yoga Instructor" },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const updateScrollState = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    const slideW = el.clientWidth * 0.85 + 24;
    setCurrentSlide(Math.round(el.scrollLeft / slideW));
  }, []);

  const scrollCarousel = useCallback((dir: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const slideW = el.clientWidth * 0.85 + 24;
    el.scrollBy({ left: dir * slideW, behavior: "smooth" });
  }, []);

  useEffect(() => {
    requestAnimationFrame(updateScrollState);
  }, [updateScrollState]);

  const avatarStyles = [
    "from-brand-green/15 to-brand-green/20 text-brand-green",
    "from-amber-200/30 to-amber-300/20 text-amber-700",
    "from-emerald-200/30 to-teal-300/20 text-emerald-700",
  ];

  return (
    <section className="section-spacing bg-[#FBF5EA] relative overflow-hidden">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Trusted by Thousands
          </p>
          <h2 className="heading-serif text-4xl md:text-5xl text-foreground">
            What Our Community Says
          </h2>
          <div className="flex items-center justify-center gap-1 mt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">4.9/5 from 2,500+ reviews</span>
          </div>
        </div>

        <div className="relative">
          {/* Arrows */}
          {canScrollLeft && (
            <button
              onClick={() => scrollCarousel(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-border/30 flex items-center justify-center hover:bg-secondary/50 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scrollCarousel(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-border/30 flex items-center justify-center hover:bg-secondary/50 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Carousel track */}
          <div
            ref={carouselRef}
            onScroll={updateScrollState}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4"
          >
            {testimonials.map((t, i) => {
              const avatarStyle = avatarStyles[i % avatarStyles.length];
              return (
                <div
                  key={i}
                  className="snap-start shrink-0 w-[85%] md:w-[45%] lg:w-[31%] p-6 md:p-8 rounded-xl bg-white border border-border/15 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_-16px_rgba(0,0,0,0.14)] transition-all duration-500 hover:-translate-y-0.5"
                >
                  <Quote className="w-8 h-8 text-brand-green/15 mb-4" />
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border/15">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarStyle.split(" ").slice(0, 2).join(" ")} flex items-center justify-center shrink-0 shadow-sm`}>
                      <span className={`text-xs font-semibold ${avatarStyle.split(" ").slice(2).join(" ")}`}>{t.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t.name}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs text-muted-foreground">{t.location}</p>
                        <span className="text-[11px] text-brand-green font-semibold">✓ Verified Purchase</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  const el = carouselRef.current;
                  if (!el) return;
                  const slideW = el.clientWidth * 0.85 + 24;
                  el.scrollTo({ left: i * slideW, behavior: "smooth" });
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "bg-brand-green w-6" : "bg-brand-green/30"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NewArrivalsSection() {
  const { data, isLoading } = trpc.products.byTag.useQuery({ tag: "new-arrivals", limit: 4 });
  const products = data?.products || [];

  return (
    <section className="section-spacing bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-green/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="container relative z-10">
        <div className="text-center mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Fresh from the Garden
          </p>
          <h2 className="heading-serif text-4xl md:text-5xl text-foreground">
            New Arrivals
          </h2>
          <div className="gold-accent mx-auto mt-4" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-secondary/40 rounded-xl mb-3" />
                <div className="h-3 bg-secondary/40 rounded w-3/4 mb-2" />
                <div className="h-3 bg-secondary/40 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/shop?collection=new-arrivals&category=teas,wellness">
            <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    { q: "What makes KN Naturals different from other tea brands?", a: "We source directly from premium farms, use only organic ingredients where possible, and craft each blend with specific wellness benefits in mind. No fillers, no artificial additives — just pure, potent botanicals." },
    { q: "How should I store my teas and powders?", a: "Store in a cool, dry place away from direct sunlight. Our resealable pouches and tins are designed to maintain freshness. For matcha, we recommend refrigeration after opening." },
    { q: "Are your products organic and certified?", a: "Most of our products are certified organic (USDA or equivalent). Each product page lists specific certifications. All products are non-GMO and free from artificial additives." },
    { q: "What is your shipping and return policy?", a: "We offer free shipping on orders over ₹75. Standard shipping takes 3-5 business days. We have a 30-day satisfaction guarantee — if you're not happy, we'll make it right." },
    { q: "Can I subscribe for regular deliveries?", a: "Yes! Subscribe & Save is coming soon. Sign up for our newsletter to be the first to know when subscription options launch." },
  ];

  return (
    <section className="section-spacing bg-background">
      <div className="container max-w-3xl">
        <div className="text-center mb-12 md:mb-14">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Common Questions
          </p>
          <h2 className="heading-serif text-4xl md:text-5xl text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="gold-accent mx-auto mt-4" />
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border border-border/50 rounded-lg px-6 data-[state=open]:bg-white data-[state=open]:shadow-sm">
              <AccordionTrigger className="text-sm font-medium text-left py-5 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
