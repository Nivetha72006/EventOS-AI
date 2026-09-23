import { VendorCategory } from "@prisma/client";

const validCategories = Object.values(VendorCategory);

export function validateMarketplaceFilters(filters: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  if (filters.category && !validCategories.includes(filters.category as VendorCategory)) {
    throw new Error(`Invalid vendor category: ${filters.category}`);
  }

  if (
    filters.minPrice !== undefined &&
    (Number.isNaN(filters.minPrice) || filters.minPrice < 0)
  ) {
    throw new Error("minPrice must be a valid positive number");
  }

  if (
    filters.maxPrice !== undefined &&
    (Number.isNaN(filters.maxPrice) || filters.maxPrice < 0)
  ) {
    throw new Error("maxPrice must be a valid positive number");
  }

  if (
    filters.minPrice !== undefined &&
    filters.maxPrice !== undefined &&
    filters.minPrice > filters.maxPrice
  ) {
    throw new Error("minPrice cannot be greater than maxPrice");
  }
}