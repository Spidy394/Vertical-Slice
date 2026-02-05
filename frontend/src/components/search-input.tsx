"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const normalizedQuery = searchQuery.trim().replace(/\s+/g, " ");
      const normalizedInitial = initialQuery.trim().replace(/\s+/g, " ");

      if (normalizedQuery !== normalizedInitial) {
        const params = new URLSearchParams();
        if (normalizedQuery) {
          params.set("q", normalizedQuery);
        }
        router.push(normalizedQuery ? `/?${params.toString()}` : "/");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, router, initialQuery]);

  return (
    <div className="relative">
      <Input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products..."
        className="pl-9 sm:pl-10 h-9 sm:h-10 text-sm bg-secondary/50 border-0 focus-visible:ring-1 rounded-full"
        aria-label="Search for products"
      />
      <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
