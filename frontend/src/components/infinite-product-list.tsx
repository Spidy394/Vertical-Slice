"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { Product } from "@/lib/types";
import { loadMoreProducts } from "@/app/actions";
import { ProductCard } from "./product-card";
import { Loader2 } from "lucide-react";

export function InfiniteProductList({
  initialProducts,
  query,
}: {
  initialProducts: Product[];
  query?: string;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProducts(initialProducts);
    setPage(1);
    setHasMore(true); 
  }, [initialProducts]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    const nextPage = page + 1;
    try {
      const { products: newProducts, totalPages } = await loadMoreProducts({
        page: nextPage,
        query,
      });

      if (newProducts.length > 0) {
        setProducts((prev) => [...prev, ...newProducts]);
        setPage(nextPage);
        setHasMore(nextPage < totalPages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, query]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 },
    );

    const loaderElement = loaderRef.current;
    if (loaderElement) {
      observer.observe(loaderElement);
    }

    return () => {
      if (loaderElement) {
        observer.unobserve(loaderElement);
      }
    };
  }, [loadMore]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div
          ref={loaderRef}
          className="flex justify-center items-center mt-8 sm:mt-10 lg:mt-12 py-6 sm:py-8"
        >
          <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 animate-spin text-muted-foreground" />
        </div>
      )}
    </>
  );
}
