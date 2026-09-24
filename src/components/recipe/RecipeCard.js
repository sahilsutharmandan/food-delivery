"use client";

import React from "react";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

export default function RecipeCard({ recipe, badge }) {
  if (!recipe) return null;

  const mealType =
    recipe.mealType?.[0] || recipe.dishType?.[0] || "Lunch/Dinner";
  const price = "$11.22";

  return (
    <div className="relative flex flex-col justify-between p-5 bg-white shadow-md hover:shadow-xl transition-all duration-200 rounded-3xl group border border-stone-200/50">
      <div>
        <div className="relative w-full h-48 mb-4 overflow-hidden rounded-2xl bg-stone-100">
          <img
            src={recipe.image}
            alt={recipe.label}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/banner-bg-img.png";
            }}
          />
          {badge && (
            <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white bg-pink rounded-full shadow">
              {badge}
            </span>
          )}
          <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold text-dark bg-white/90 backdrop-blur rounded-full shadow-sm">
            {price}
          </span>
        </div>

        <p className="text-xs font-medium uppercase tracking-wider text-pink mb-1">
          {mealType}
        </p>
        <h3
          className="font-semibold text-lg text-dark line-clamp-1 group-hover:text-pink transition-colors"
          title={recipe.label}
        >
          {recipe.label}
        </h3>

        <div className="flex items-center gap-1.5 mt-2 mb-4 text-sm text-stone-600">
          <span className="font-semibold">4.6</span>
          <div className="flex items-center text-yellow-500">
            <StarIcon className="!text-base" />
            <StarIcon className="!text-base" />
            <StarIcon className="!text-base" />
            <StarHalfIcon className="!text-base" />
            <StarOutlineIcon className="!text-base" />
          </div>
          <span className="text-xs text-stone-400 ml-1">
            ({recipe.yield ? Math.round(recipe.yield * 12) : 48})
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 mt-auto border-t border-stone-100">
        <button className="px-4 py-2 text-xs font-semibold text-white transition-all bg-pink rounded-full hover:opacity-90 active:scale-95 shadow-sm">
          Order Now
        </button>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Add to favorites"
            className="p-2 transition-colors rounded-full hover:bg-pink/10 text-stone-600 hover:text-pink"
          >
            <FavoriteBorderIcon className="!text-lg" />
          </button>
          <button
            type="button"
            aria-label="Add to cart"
            className="p-2 transition-colors rounded-full hover:bg-pink/10 text-stone-600 hover:text-pink"
          >
            <AddShoppingCartIcon className="!text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
