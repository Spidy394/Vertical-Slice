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
      <div className="max-w-350 mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex items-center justify-between gap-6">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
              ShopUp
            </h1>
            <div className="flex items-center gap-4 flex-1 max-w-2xl justify-end">
              <form className="w-full max-w-md" action="/">
                <div className="relative">
                  <Input
                    type="search"
                    name="q"
                    placeholder="Search for products..."
                    className="pl-10 h-10 text-sm bg-secondary/50 border-0 focus-visible:ring-1"
                    aria-label="Search for products"
                    disabled
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
              <SimpleToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
              <div key={i} className="rounded-3xl bg-card shadow-md p-4">
                {/* Image Container */}
                <div className="relative bg-muted/40 rounded-2xl mb-4 aspect-square">
                  <Skeleton className="w-full h-full rounded-2xl" />
                </div>
                {/* Content */}
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="pt-2">
                    <Skeleton className="h-3 w-12 mb-1" />
                    <Skeleton className="h-7 w-24" />
                  </div>
                  <Skeleton className="h-12 w-full rounded-full mt-3" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
