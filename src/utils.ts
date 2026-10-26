import { Product } from "./types";

/**
 * Calculates current price tailored to chosen size variant.
 */
export function getProductSizePrice(product: Product, size: string): number {
  if (!product) return 0;
  if (product.sizePrices && product.sizePrices[size] !== undefined) {
    return product.sizePrices[size];
  }
  if (!product.sizeVariants) return product.price || 0;
  const index = product.sizeVariants.indexOf(size);
  if (index <= 0) return product.price;
  return Math.round(product.price + (index * 100));
}

/**
 * Calculates original price (before discount) tailored to chosen size variant.
 */
export function getProductOriginalSizePrice(product: Product, size: string): number {
  if (!product) return 0;
  if (product.sizeOriginalPrices && product.sizeOriginalPrices[size] !== undefined) {
    return product.sizeOriginalPrices[size];
  }
  if (!product.sizeVariants) return product.originalPrice || product.price || 0;
  const index = product.sizeVariants.indexOf(size);
  if (index <= 0) return product.originalPrice;
  return Math.round(product.originalPrice + (index * 100));
}
