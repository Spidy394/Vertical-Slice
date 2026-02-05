"use server";

import { getProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export async function loadMoreProducts({
  page,
  query,
}: {
  page: number;
  query?: string;
}): Promise<{ products: Product[]; totalPages: number }> {
  const { products, totalPages } = await getProducts({
    query,
    page,
  });

  return { products, totalPages };
}
