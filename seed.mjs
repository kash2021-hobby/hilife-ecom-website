import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const categories = [
  { name: "Green Teas", slug: "green-teas", description: "Premium Japanese & Chinese green teas for daily vitality", sortOrder: 1 },
  { name: "Herbal Infusions", slug: "herbal-infusions", description: "Caffeine-free healing blends for relaxation and wellness", sortOrder: 2 },
  { name: "Detox Blends", slug: "detox-blends", description: "Cleansing formulas to support metabolism and digestion", sortOrder: 3 },
  { name: "Wellness Powders", slug: "wellness-powders", description: "Superfood blends and adaptogens for peak performance", sortOrder: 4 },
  { name: "Gift Collections", slug: "gift-collections", description: "Curated wellness gift sets for every occasion", sortOrder: 5 },
];

const products = [
  { name: "Ceremonial Grade Matcha", slug: "ceremonial-grade-matcha", description: "Our finest ceremonial grade matcha, stone-ground from first-harvest tencha leaves grown in the shade of Uji, Kyoto. This vibrant green powder delivers a smooth, umami-rich flavor with natural L-theanine for calm, focused energy without the jitters.", shortDescription: "Premium Uji matcha for calm, focused energy", price: "42.00", compareAtPrice: "52.00", categorySlug: "green-teas", tags: ["matcha","energy","focus","antioxidants"], ingredients: "100% Organic Ceremonial Grade Matcha (Camellia sinensis), Stone-ground tencha leaves from Uji, Kyoto, Japan", brewingInstructions: "Sift 1-2g matcha into a bowl. Add 60ml water at 80°C. Whisk vigorously with a chasen in a W-motion until frothy.", wellnessBenefits: ["Sustained calm energy","Rich in antioxidants (EGCG)","Supports metabolism","Enhances focus & clarity","Promotes relaxation"], weight: "30g", servings: "30 servings", origin: "Uji, Kyoto, Japan", certifications: ["USDA Organic","JAS Certified","Non-GMO"], featured: true, bestseller: true, averageRating: "4.9", reviewCount: 342 },
  { name: "Daily Detox Green Tea", slug: "daily-detox-green-tea", description: "A gentle yet effective daily detox blend combining premium sencha green tea with lemongrass, ginger root, and dandelion. Supports your body's natural cleansing processes while providing a refreshing, slightly citrusy flavor profile.", shortDescription: "Gentle daily cleanse with sencha & lemongrass", price: "28.00", compareAtPrice: null, categorySlug: "detox-blends", tags: ["detox","green-tea","cleanse","digestive"], ingredients: "Organic Sencha Green Tea, Lemongrass, Ginger Root, Dandelion Leaf, Peppermint, Fennel Seeds", brewingInstructions: "Steep 1 tea bag or 1 tsp loose leaf in 250ml water at 85°C for 3-4 minutes. Best enjoyed in the morning or after meals.", wellnessBenefits: ["Supports natural detoxification","Aids digestion","Boosts metabolism","Rich in antioxidants"], weight: "50g (25 tea bags)", servings: "25 servings", origin: "Shizuoka, Japan & India", certifications: ["USDA Organic","Non-GMO"], featured: true, bestseller: true, averageRating: "4.7", reviewCount: 218 },
  { name: "Ashwagandha Calm Blend", slug: "ashwagandha-calm-blend", description: "A soothing adaptogenic blend featuring KSM-66 Ashwagandha root combined with chamomile, lavender, and passionflower. Designed to reduce stress, promote restful sleep, and support your body's natural relaxation response.", shortDescription: "Adaptogenic stress relief & sleep support", price: "34.00", compareAtPrice: "39.00", categorySlug: "herbal-infusions", tags: ["ashwagandha","sleep","stress-relief","adaptogen"], ingredients: "KSM-66 Ashwagandha Root Extract, Chamomile Flowers, Lavender Buds, Passionflower, Valerian Root, Lemon Balm", brewingInstructions: "Steep 1 tea bag in 250ml freshly boiled water for 5-7 minutes. Best enjoyed 30 minutes before bedtime.", wellnessBenefits: ["Reduces cortisol & stress","Promotes restful sleep","Supports adrenal health","Calms the nervous system"], weight: "40g (20 tea bags)", servings: "20 servings", origin: "India", certifications: ["USDA Organic","Non-GMO","GMP Certified"], featured: true, bestseller: true, averageRating: "4.8", reviewCount: 189 },
  { name: "Turmeric Golden Latte", slug: "turmeric-golden-latte", description: "A warming golden milk blend with organic turmeric, black pepper for enhanced bioavailability, Ceylon cinnamon, and ginger. Simply mix with your favorite milk for a nourishing anti-inflammatory latte that supports joint health and immunity.", shortDescription: "Anti-inflammatory golden milk blend", price: "32.00", compareAtPrice: null, categorySlug: "wellness-powders", tags: ["turmeric","anti-inflammatory","immunity","latte"], ingredients: "Organic Turmeric Root Powder, Ceylon Cinnamon, Ginger Root, Black Pepper (BioPerine), Cardamom, Coconut Milk Powder", brewingInstructions: "Mix 1 tsp with 250ml warm milk. Stir well or froth for a creamy latte. Add honey to taste.", wellnessBenefits: ["Powerful anti-inflammatory","Supports joint health","Boosts immunity","Aids digestion","Enhanced absorption with BioPerine"], weight: "100g", servings: "40 servings", origin: "India & Sri Lanka", certifications: ["USDA Organic","Non-GMO","Vegan"], featured: true, bestseller: true, averageRating: "4.8", reviewCount: 276 },
  { name: "Moringa Energy Powder", slug: "moringa-energy-powder", description: "Pure organic moringa leaf powder, known as the miracle tree for its exceptional nutrient density. Packed with iron, calcium, vitamins A, C, and E, plus all essential amino acids. A natural energy booster without caffeine.", shortDescription: "Nutrient-dense superfood for natural energy", price: "29.00", compareAtPrice: null, categorySlug: "wellness-powders", tags: ["moringa","energy","superfood","iron"], ingredients: "100% Organic Moringa Oleifera Leaf Powder", brewingInstructions: "Add 1 tsp to smoothies, juices, or warm water. Can also be sprinkled on food.", wellnessBenefits: ["Natural energy without caffeine","Rich in iron & calcium","Complete amino acid profile","Supports immune function"], weight: "100g", servings: "50 servings", origin: "India", certifications: ["USDA Organic","Non-GMO","Vegan","Raw"], featured: false, bestseller: true, averageRating: "4.6", reviewCount: 154 },
  { name: "Jasmine Pearl Green Tea", slug: "jasmine-pearl-green-tea", description: "Hand-rolled jasmine pearl tea from Fujian province. Each pearl unfurls in hot water, releasing layers of delicate jasmine fragrance and a smooth, sweet green tea base.", shortDescription: "Hand-rolled pearls with natural jasmine scent", price: "38.00", compareAtPrice: "45.00", categorySlug: "green-teas", tags: ["jasmine","green-tea","premium","floral"], ingredients: "Organic Green Tea Leaves, Natural Jasmine Blossoms", brewingInstructions: "Use 5-6 pearls per cup. Steep in 80°C water for 2-3 minutes. Can be re-steeped 3-4 times.", wellnessBenefits: ["Calming aromatherapy","Rich in catechins","Supports heart health","Gentle energy boost"], weight: "50g", servings: "25 servings", origin: "Fujian, China", certifications: ["Organic","Non-GMO"], featured: false, bestseller: false, averageRating: "4.7", reviewCount: 98 },
  { name: "Collagen Beauty Blend", slug: "collagen-beauty-blend", description: "A beauty-from-within powder combining marine collagen peptides with vitamin C-rich acerola cherry, hyaluronic acid, and biotin. Supports skin elasticity, hair strength, and nail growth.", shortDescription: "Marine collagen for skin, hair & nails", price: "48.00", compareAtPrice: "56.00", categorySlug: "wellness-powders", tags: ["collagen","beauty","skin","anti-aging"], ingredients: "Marine Collagen Peptides (Type I & III), Acerola Cherry Extract, Hyaluronic Acid, Biotin, Vitamin C, Zinc", brewingInstructions: "Mix 1 scoop (10g) into water, smoothies, coffee, or tea. Best taken daily on an empty stomach.", wellnessBenefits: ["Improves skin elasticity","Strengthens hair & nails","Supports joint mobility","Promotes gut health"], weight: "200g", servings: "20 servings", origin: "Norway & Brazil", certifications: ["Non-GMO","Gluten-Free","Sustainably Sourced"], featured: true, bestseller: false, averageRating: "4.8", reviewCount: 167 },
  { name: "Chamomile Honey Dream", slug: "chamomile-honey-dream", description: "A luxurious bedtime blend of Egyptian chamomile, raw honey crystals, vanilla bean, and valerian root. Creates a naturally sweet, soothing cup for deep, restorative sleep.", shortDescription: "Sweet bedtime blend for restful sleep", price: "24.00", compareAtPrice: null, categorySlug: "herbal-infusions", tags: ["chamomile","sleep","honey","caffeine-free"], ingredients: "Egyptian Chamomile Flowers, Raw Honey Crystals, Vanilla Bean, Valerian Root, Linden Flowers, Oat Straw", brewingInstructions: "Steep 1 tea bag in 250ml freshly boiled water for 5-8 minutes.", wellnessBenefits: ["Promotes deep sleep","Reduces anxiety","Soothes digestion","Naturally caffeine-free"], weight: "36g (18 tea bags)", servings: "18 servings", origin: "Egypt & Madagascar", certifications: ["USDA Organic","Non-GMO","Caffeine-Free"], featured: false, bestseller: true, averageRating: "4.9", reviewCount: 203 },
  { name: "Metabolism Fire Blend", slug: "metabolism-fire-blend", description: "An invigorating thermogenic blend designed to kickstart your metabolism. Features green tea extract, cayenne pepper, apple cider vinegar powder, and garcinia cambogia.", shortDescription: "Thermogenic blend for metabolism support", price: "36.00", compareAtPrice: "42.00", categorySlug: "detox-blends", tags: ["metabolism","fat-burning","thermogenic","energy"], ingredients: "Green Tea Extract (EGCG), Cayenne Pepper, Apple Cider Vinegar Powder, Garcinia Cambogia, Ginger Root, Black Pepper Extract", brewingInstructions: "Mix 1 tsp in warm water or add to your morning smoothie. Take before meals.", wellnessBenefits: ["Boosts metabolic rate","Supports fat oxidation","Increases energy","Aids appetite control"], weight: "60g", servings: "30 servings", origin: "India & Southeast Asia", certifications: ["Non-GMO","Vegan","GMP Certified"], featured: false, bestseller: true, averageRating: "4.5", reviewCount: 134 },
  { name: "Wellness Starter Gift Set", slug: "wellness-starter-gift-set", description: "The perfect introduction to KN Naturals. This beautifully packaged gift set includes our top 5 bestselling teas and powders in sample sizes, a bamboo measuring spoon, and a wellness guide booklet.", shortDescription: "Curated sampler of our top 5 bestsellers", price: "65.00", compareAtPrice: "82.00", categorySlug: "gift-collections", tags: ["gift","sampler","starter","collection"], ingredients: "Includes: Ceremonial Matcha (10g), Daily Detox Tea (5 bags), Ashwagandha Calm (5 bags), Turmeric Golden Latte (20g), Moringa Powder (20g)", brewingInstructions: "Each product includes individual brewing instructions. See the included wellness guide.", wellnessBenefits: ["Discover your favorites","Complete wellness ritual","Perfect for gifting","Premium packaging"], weight: "Gift Box", servings: "25+ servings total", origin: "Various", certifications: ["USDA Organic","Non-GMO"], featured: true, bestseller: true, averageRating: "4.9", reviewCount: 89 },
  { name: "Sencha Supreme", slug: "sencha-supreme", description: "First-flush sencha from Shizuoka, Japan's premier tea-growing region. This premium green tea offers a perfect balance of vegetal sweetness and refreshing astringency.", shortDescription: "First-flush Japanese sencha, smooth & refreshing", price: "26.00", compareAtPrice: null, categorySlug: "green-teas", tags: ["sencha","green-tea","japanese","daily"], ingredients: "100% Organic First-Flush Sencha Green Tea", brewingInstructions: "Steep 1 tsp in 200ml water at 75°C for 60-90 seconds. Can be re-steeped 2-3 times.", wellnessBenefits: ["Rich in vitamin C","Supports cardiovascular health","Gentle caffeine boost","High in catechins"], weight: "80g loose leaf", servings: "40 servings", origin: "Shizuoka, Japan", certifications: ["JAS Organic","Non-GMO"], featured: false, bestseller: false, averageRating: "4.6", reviewCount: 112 },
  { name: "Gut Restore Probiotic Tea", slug: "gut-restore-probiotic-tea", description: "A unique fermented tea blend combining pu-erh tea with prebiotic fibers, slippery elm bark, and marshmallow root. Supports gut lining integrity and promotes a healthy microbiome.", shortDescription: "Fermented blend for gut health & microbiome", price: "31.00", compareAtPrice: null, categorySlug: "detox-blends", tags: ["gut-health","probiotic","digestive","fermented"], ingredients: "Aged Pu-erh Tea, Slippery Elm Bark, Marshmallow Root, Prebiotic Inulin, Licorice Root, Fennel Seeds", brewingInstructions: "Steep 1 tea bag in 250ml boiling water for 4-5 minutes. Enjoy after meals.", wellnessBenefits: ["Supports gut lining","Promotes healthy microbiome","Soothes digestive discomfort","Prebiotic fiber support"], weight: "40g (20 tea bags)", servings: "20 servings", origin: "Yunnan, China & USA", certifications: ["Organic","Non-GMO","Vegan"], featured: false, bestseller: false, averageRating: "4.7", reviewCount: 76 },
];

async function seed() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log("Seeding categories...");
  for (const cat of categories) {
    await conn.execute(
      `INSERT INTO categories (name, slug, description, sortOrder) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE description=VALUES(description), sortOrder=VALUES(sortOrder)`,
      [cat.name, cat.slug, cat.description, cat.sortOrder]
    );
  }

  console.log("Fetching category IDs...");
  const [catRows] = await conn.execute("SELECT id, slug FROM categories");
  const catMap = {};
  for (const row of catRows) {
    catMap[row.slug] = row.id;
  }

  console.log("Seeding products...");
  for (const p of products) {
    const categoryId = catMap[p.categorySlug] || null;
    await conn.execute(
      `INSERT INTO products (name, slug, description, shortDescription, price, compareAtPrice, categoryId, tags, ingredients, brewingInstructions, wellnessBenefits, weight, servings, origin, certifications, featured, bestseller, averageRating, reviewCount, inStock, stockQuantity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 100)
       ON DUPLICATE KEY UPDATE description=VALUES(description), price=VALUES(price), averageRating=VALUES(averageRating), reviewCount=VALUES(reviewCount)`,
      [p.name, p.slug, p.description, p.shortDescription, p.price, p.compareAtPrice, categoryId, JSON.stringify(p.tags), p.ingredients, p.brewingInstructions, JSON.stringify(p.wellnessBenefits), p.weight, p.servings, p.origin, JSON.stringify(p.certifications), p.featured ? 1 : 0, p.bestseller ? 1 : 0, p.averageRating, p.reviewCount]
    );
  }

  console.log("Fetching product IDs...");
  const [productRows] = await conn.execute("SELECT id, slug FROM products");
  const productMap = {};
  for (const row of productRows) {
    productMap[row.slug] = row.id;
  }

  console.log("Seeding variants...");
  const variants = [
    { productSlug: "ceremonial-grade-matcha", variants: [
      { name: "30g Tin", option1: "30g", price: "42.00", sku: "MATCHA-30" },
      { name: "50g Tin", option1: "50g", price: "65.00", sku: "MATCHA-50" },
      { name: "100g Pouch", option1: "100g", price: "115.00", sku: "MATCHA-100" },
    ]},
    { productSlug: "collagen-beauty-blend", variants: [
      { name: "200g (20 servings)", option1: "200g", price: "48.00", sku: "COLL-200" },
      { name: "400g (40 servings)", option1: "400g", price: "85.00", sku: "COLL-400" },
    ]},
    { productSlug: "turmeric-golden-latte", variants: [
      { name: "100g Pouch", option1: "100g", price: "32.00", sku: "TURM-100" },
      { name: "250g Jar", option1: "250g", price: "68.00", sku: "TURM-250" },
    ]},
  ];

  for (const v of variants) {
    const productId = productMap[v.productSlug];
    if (!productId) continue;
    for (const variant of v.variants) {
      await conn.execute(
        `INSERT INTO product_variants (productId, name, sku, price, option1, inStock, stockQuantity) VALUES (?, ?, ?, ?, ?, 1, 50) ON DUPLICATE KEY UPDATE price=VALUES(price)`,
        [productId, variant.name, variant.sku, variant.price, variant.option1]
      );
    }
  }

  console.log("Seed complete!");
  await conn.end();
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
