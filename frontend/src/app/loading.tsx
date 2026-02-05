import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SimpleToggle from "@/components/theme-toggle";
import { Search } from "lucide-react";

export default function Loading() {
  const PRODUCTS_PER_PAGE = 16;
  return (
    <div className="bg-background min-h-screen">
      {/* Minimalist Container */}
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <header className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              ShopUp
            </h1>
            <div className="flex items-center gap-3 sm:gap-4 flex-1 sm:max-w-md lg:max-w-2xl sm:justify-end">
              <form className="w-full sm:max-w-xs lg:max-w-md" action="/">
                <div className="relative">
                  <Input
                    type="search"
                    name="q"
                    placeholder="Search products..."
                    className="pl-9 sm:pl-10 h-9 sm:h-10 text-sm bg-secondary/50 border-0 focus-visible:ring-1 rounded-full"
                    aria-label="Search for products"
                    disabled
                  />
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Button
                    type="submit"
                    className="hidden"
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                </div>
              </form>
              <div className="shrink-0">
                <SimpleToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
              <div key={i} className="rounded-2xl sm:rounded-3xl bg-card shadow-md p-3 sm:p-4">
                {/* Image Container */}
                <div className="relative bg-muted/40 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 aspect-square">
                  <Skeleton className="w-full h-full rounded-xl sm:rounded-2xl" />
                </div>
                {/* Content */}
                <div className="space-y-1.5 sm:space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="pt-1.5 sm:pt-2">
                    <Skeleton className="h-3 w-12 mb-1" />
                    <Skeleton className="h-6 sm:h-7 w-20 sm:w-24" />
                  </div>
                  <Skeleton className="h-10 sm:h-12 w-full rounded-full mt-2 sm:mt-3" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
