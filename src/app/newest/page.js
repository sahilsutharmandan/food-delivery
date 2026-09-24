"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useTrendingStore } from "@/store/trendingStore";
import RecipeCard from "@/components/recipe/RecipeCard";

export default function NewestPage() {
  const { trending, getTrending } = useTrendingStore();

  useEffect(() => {
    getTrending();
  }, [getTrending]);

  // Newest section recipes from data (indexes 16-32)
  const newestRecipes = trending?.length > 0 ? trending.slice(16, 32) : [];

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
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-dark sm:text-5xl">
              Newest <strong className="text-pink">Recipes</strong>
            </h1>
            <p className="mt-2 text-base opacity-75">
              Fresh culinary creations and the newest additions to our menu.
            </p>
          </div>
          <span className="self-start px-3 py-1 text-sm font-semibold rounded-full bg-pink/10 text-pink md:self-auto">
            {newestRecipes.length} dishes available
          </span>
        </div>
      </div>

      {/* Recipes Grid */}
      {newestRecipes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {newestRecipes.map(({ recipe }) => (
            <RecipeCard
              key={recipe?.uri || recipe?.label}
              recipe={recipe}
              badge="New"
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-20 text-stone-500">
          <p>Loading newest recipes...</p>
        </div>
      )}
    </div>
  );
}
