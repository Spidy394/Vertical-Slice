import SimpleToggle from "@/components/theme-toggle";
import { getProducts } from "@/lib/products";
import { InfiniteProductList } from "@/components/infinite-product-list";
import { SearchInput } from "@/components/search-input";

export const revalidate = 0;

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams.q === "string" ? searchParams.q : undefined;

  const { products } = await getProducts({
    query,
    page: 1, 
    limit: 12, 
  });

  return (
    <div className="bg-background min-h-screen">
      {/* Minimalist Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <header className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              ShopUp
            </h1>
            <div className="flex items-center gap-3 sm:gap-4 flex-1 sm:max-w-md lg:max-w-2xl sm:justify-end">
              <div className="w-full sm:max-w-xs lg:max-w-md">
                <SearchInput />
              </div>
              <div className="shrink-0">
                <SimpleToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {products.length > 0 ? (
            <InfiniteProductList initialProducts={products} query={query} />
          ) : (
            <div className="text-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">No Products Found</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                {query ? (
                  <>
                    Your search for &ldquo;{query}&rdquo; did not match any
                    products. Please try a different keyword.
                  </>
                ) : (
                  <>No products available at the moment.</>
                )}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
