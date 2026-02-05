"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const isAvailable = product.stockStatus.toLowerCase() === "available";
  const [isLiked, setIsLiked] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPreview(true);
  };

  const handleClosePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPreview(false);
  };

  return (
    <Card
      className={cn(
        "overflow-hidden flex flex-col h-full bg-card border-0",
        "shadow-md hover:shadow-xl transition-all duration-300",
        "rounded-2xl sm:rounded-3xl p-3 sm:p-4 group/card",
        className,
      )}
    >
      {/* Image */}
      <div
        className="aspect-square relative overflow-hidden bg-muted/40 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 cursor-pointer"
        onClick={handleImageClick}
      >
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 z-10 flex items-center justify-between">
          <div
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm",
              isAvailable
                ? "bg-emerald-500/95 text-white"
                : "bg-muted/95 text-muted-foreground",
            )}
          >
            {isAvailable ? "In Stock" : "Out of Stock"}
          </div>
          <button
            className={cn(
              "bg-card/95 backdrop-blur-sm p-2 rounded-full hover:bg-card transition-all duration-200",
              isLiked
                ? "opacity-100"
                : "opacity-0 group-hover/card:opacity-100",
            )}
            onClick={handleLikeClick}
            aria-label={isLiked ? "Unlike product" : "Like product"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-all duration-200",
                isLiked
                  ? "text-red-500 fill-red-500 scale-110"
                  : "text-muted-foreground hover:text-red-500",
              )}
              strokeWidth={2}
            />
          </button>
        </div>

        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover p-1.5 sm:p-2 transition-transform duration-300 group-hover/card:scale-105 rounded-xl sm:rounded-2xl"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
          unoptimized={process.env.NODE_ENV === "development"}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 sm:gap-3 flex-1">
        {/* Product Title */}
        <h3
          className="font-semibold text-base sm:text-lg leading-snug line-clamp-2 text-foreground"
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Price */}
        <div className="mt-auto">
          <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">
            Price
          </div>
          <div className="text-lg sm:text-xl font-bold text-primary">
            {product.price.toFixed(2)} AED
          </div>
        </div>

        {/* Buy Now Button */}
        {isAvailable ? (
          <Link
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 sm:mt-3"
          >
            <Button
              className="w-full h-10 sm:h-12 rounded-full font-medium text-sm sm:text-base bg-foreground text-background hover:bg-foreground/90 active:scale-95 transition-transform"
              size="lg"
            >
              Buy Now
            </Button>
          </Link>
        ) : (
          <Button
            disabled
            className="w-full h-10 sm:h-12 rounded-full font-medium text-sm sm:text-base mt-2 sm:mt-3"
            size="lg"
          >
            Out of Stock
          </Button>
        )}
      </div>

      {/* Image Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={handleClosePreview}
        >
          <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 95vw, 90vw"
              unoptimized={process.env.NODE_ENV === "development"}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
