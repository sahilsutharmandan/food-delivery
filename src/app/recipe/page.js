"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useTrendingStore } from "@/store/trendingStore";
import RecipeCard from "@/components/recipe/RecipeCard";

export default function RecipePage() {
  return (
    <Suspense
      fallback={
        <div className="container px-4 py-8 mx-auto text-center sm:px-6 lg:px-8 text-stone-500">
          Loading recipes...
        </div>
      }
    >
      <RecipePageContent />
    </Suspense>
  );
}

function RecipePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get("search") || "";
  const initialCategory = searchParams?.get("category") || "all";

  const { trending, getTrending } = useTrendingStore();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    getTrending();
  }, [getTrending]);

  useEffect(() => {
    if (searchParams?.get("category")) {
      setSelectedCategory(searchParams.get("category"));
    }
  }, [searchParams]);

  // Filter recipes based on search query or category
  const filteredRecipes = useMemo(() => {
    if (!trending || trending.length === 0) return [];

    let list = trending;

    // Apply search filter if query is present
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      return list.filter(({ recipe }) => {
        const titleMatch = recipe?.label?.toLowerCase().includes(q);
        const mealMatch = recipe?.mealType?.some((m) =>
          m.toLowerCase().includes(q)
        );
        const dishMatch = recipe?.dishType?.some((d) =>
          d.toLowerCase().includes(q)
        );
        const cuisineMatch = recipe?.cuisineType?.some((c) =>
          c.toLowerCase().includes(q)
        );
        const ingredientMatch = recipe?.ingredientLines?.some((i) =>
          i.toLowerCase().includes(q)
        );
        return titleMatch || mealMatch || dishMatch || cuisineMatch || ingredientMatch;
      });
    }

    // Apply category filter when not searching
    if (selectedCategory === "trending") {
      return list.slice(0, 16);
    } else if (selectedCategory === "newest") {
      return list.slice(16, 32);
    } else if (selectedCategory === "popular") {
      return list.slice(24, 40);
    }

    return list;
  }, [trending, query, selectedCategory]);

  const handleClearSearch = () => {
    router.push("/recipe");
  };

  const handleQuickSearch = (term) => {
    router.push(`/recipe?search=${encodeURIComponent(term)}`);
  };

  const categories = [
    { id: "all", label: "All Recipes" },
    { id: "trending", label: "Trending" },
    { id: "newest", label: "Newest" },
    { id: "popular", label: "Popular" },
  ];

  return (
    <div className="container px-4 py-8 mx-auto space-y-8 sm:px-6 lg:px-8">
      {/* Header and Breadcrumbs */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1 mb-4 text-sm font-semibold transition-colors text-pink hover:underline"
        >
          <KeyboardArrowLeftIcon /> Back to Home
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            {query.trim() ? (
              <>
                <h1 className="text-3xl font-bold text-dark sm:text-4xl">
                  Search Results for: <span className="text-pink">&ldquo;{query}&rdquo;</span>
                </h1>
                <p className="mt-2 text-base opacity-75">
                  Showing recipes matching your search criteria.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-dark sm:text-5xl">
                  Explore <strong className="text-pink">Recipes</strong>
                </h1>
                <p className="mt-2 text-base opacity-75">
                  Browse our complete collection of delicious gourmet meals.
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {query.trim() && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full bg-stone-200 hover:bg-stone-300 text-dark transition-colors"
              >
                <CloseIcon className="!text-sm" /> Clear Search
              </button>
            )}
            <span className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full bg-pink/10 text-pink">
              {filteredRecipes.length} recipes found
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills (shown when not actively searching) */}
      {!query.trim() && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-pink text-white shadow-md shadow-pink/20 scale-105"
                  : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Recipes Grid or Empty State */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredRecipes.map(({ recipe }) => (
            <RecipeCard
              key={recipe?.uri || recipe?.label}
              recipe={recipe}
              badge={
                query.trim()
                  ? null
                  : selectedCategory === "trending"
                  ? "Trending"
                  : selectedCategory === "newest"
                  ? "New"
                  : selectedCategory === "popular"
                  ? "Popular"
                  : null
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl shadow-sm border border-stone-200/60 max-w-xl mx-auto my-8">
          <div className="p-4 mb-4 rounded-full bg-pink/10 text-pink">
            <SearchIcon className="!text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-dark">No Recipes Found</h2>
          <p className="mt-2 text-sm text-stone-500 max-w-md">
            We couldn&apos;t find any recipes matching &ldquo;{query}&rdquo;. Try another search or explore these popular options:
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {["Pizza", "Salad", "Breakfast", "Italian", "Cheese"].map((term) => (
              <button
                key={term}
                onClick={() => handleQuickSearch(term)}
                className="px-3 py-1.5 text-xs font-semibold rounded-full bg-stone-100 hover:bg-pink/10 hover:text-pink transition-colors text-stone-700"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
