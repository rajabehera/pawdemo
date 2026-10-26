import { Product } from "./types";

export interface PackageItem {
  name: string;
  size: string;
  description: string;
  icon?: string;
}

export interface ProductConfig {
  id: string;
  slug: string;
  route: string;
  name: string;
  displayedSize: string;
  sizeVariants: string[];
  sizePrices?: Record<string, number>;
  sizeOriginalPrices?: Record<string, number>;
  packageContents?: PackageItem[];
  packageContents?: string[];
}

export const CANONICAL_PRODUCT_CONFIGS: Record<string, ProductConfig> = {
  "furlush-serum": {
    id: "furlush-serum",
    slug: "furlush-serum",
    route: "/products/furlush-serum",
    name: "Furlush Serum",
    displayedSize: "100 ml",
    sizeVariants: ["100 ml"],
  },
  "squeakear-earwash": {
    id: "squeakear-earwash",
    slug: "squeakear-earwash",
    route: "/products/squeakear-earwash",
    name: "Squeakear Earwash",
    displayedSize: "100 ml",
    sizeVariants: ["100 ml"],
  },
  "furbreeze-heat-cooling-powder": {
    id: "furbreeze-cooling-powder",
    slug: "furbreeze-heat-cooling-powder",
    route: "/products/furbreeze-heat-cooling-powder",
    name: "Furbreeze",
    displayedSize: "150 g",
    sizeVariants: ["150 g"],
  },
  "coffee-wood-chew": {
    id: "coffee-wood-chew",
    slug: "coffee-wood-chew",
    route: "/products/coffee-wood-chew",
    name: "Coffee Wood Chew",
    displayedSize: "Small, Medium, Large",
    sizeVariants: ["Small", "Medium", "Large"],
    sizePrices: { Small: 499, Medium: 599, Large: 699 },
    sizeOriginalPrices: { Small: 599, Medium: 699, Large: 799 },
  },
  "complete-grooming-pack": {
    id: "complete-grooming-pack",
    slug: "complete-grooming-pack",
    route: "/products/complete-grooming-pack",
    name: "Complete Grooming Pack",
    displayedSize: "Complete Grooming Pack (150 g + 100 ml + 100 ml)",
    sizeVariants: ["Complete Kit (150 g + 100 ml + 100 ml)"],
    packageContents: [
      {
        name: "Furbreeze Heat Cooling Powder",
        size: "150 g",
        description: "100% talc-free Ayurvedic cooling powder with Vetiver & Neem for instant prickly heat relief and tick defense.",
      },
      {
        name: "Squeakear Earwash",
        size: "100 ml",
        description: "pH-balanced gentle ear cleanser with antiseptic Tea Tree & Aloe to dissolve stubborn wax and prevent yeast.",
      },
      {
        name: "Furlush Serum",
        size: "100 ml",
        description: "Luxury Moroccan Argan & Bhringraj leave-in coat serum to detangle, curb hairfall, and boost brilliant shine.",
      },
    ],
  },
};

/**
 * Returns canonical slug for a product
 */
export function getProductSlug(productOrIdOrName: Product | string): string {
  if (!productOrIdOrName) return "";
  const str = typeof productOrIdOrName === "string" 
    ? productOrIdOrName.toLowerCase() 
    : (productOrIdOrName.id || productOrIdOrName.name || "").toLowerCase();

  if (str.includes("furlush") || str === "furlush-serum") {
    return "furlush-serum";
  }
  if (str.includes("squeakear") || str === "squeakear-earwash") {
    return "squeakear-earwash";
  }
  if (str.includes("furbreeze") || str.includes("cooling-powder") || str.includes("coolingpowder")) {
    return "furbreeze-heat-cooling-powder";
  }
  if (str.includes("coffee") || str.includes("wood-chew") || str === "coffee-wood-chew") {
    return "coffee-wood-chew";
  }
  if (str.includes("grooming-pack") || str.includes("grooming kit") || str === "complete-grooming-pack") {
    return "complete-grooming-pack";
  }

  return str.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/**
 * Returns canonical URL route for a product
 */
export function getProductRoute(productOrIdOrName: Product | string): string {
  const slug = getProductSlug(productOrIdOrName);
  return `/products/${slug}`;
}

/**
 * Finds a product by its canonical route slug or internal ID
 */
export function findProductBySlugOrId(slugOrId: string, products: Product[]): Product | undefined {
  if (!slugOrId || !products || products.length === 0) return undefined;
  const clean = slugOrId.toLowerCase().trim();

  // Direct match by ID
  const directId = products.find(p => p.id?.toLowerCase() === clean);
  if (directId) return directId;

  // Canonical slug match
  const targetCanonical = getProductSlug(clean);
  const canonicalMatch = products.find(p => getProductSlug(p) === targetCanonical);
  if (canonicalMatch) return canonicalMatch;

  // Fallback slug match on name
  return products.find(p => {
    const slug = (p.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return slug === clean;
  });
}

/**
 * Normalizes product size specifications according to exact requirements:
 * - Furlush Serum: 100 ml
 * - Squeakear Earwash: 100 ml
 * - Furbreeze Heat Cooling Powder: 150 g
 * - Coffee Wood Chew: Small, Medium, Large (dimensions not shown)
 * - Complete Grooming Pack: Contents and individual sizes stated clearly
 */
export function normalizeProductDetails(product: Product): Product {
  const slug = getProductSlug(product);
  const cfg = CANONICAL_PRODUCT_CONFIGS[slug];

  if (!cfg) return product;

  return {
    ...product,
    name: cfg.name,
    sizeVariants: cfg.sizeVariants,
    sizePrices: cfg.sizePrices || product.sizePrices,
    sizeOriginalPrices: cfg.sizeOriginalPrices || product.sizeOriginalPrices,
    packageContents: cfg.packageContents || (product as any).packageContents,
  };
}
