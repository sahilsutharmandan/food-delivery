import Link from "next/link";
import RecipeImage from "@/components/RecipeImage";
import { getRecipeById, getRecipeId, getRelatedRecipes, recipes } from "@/lib/recipes";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export function generateStaticParams() {
  return recipes.map((recipe) => ({
    id: getRecipeId(recipe),
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const recipe = getRecipeById(id);
  if (!recipe) {
    return { title: "Recipe Not Found - Food." };
  }
  return {
    title: `${recipe.label} | Food.`,
    description: `Discover how to make ${recipe.label}. ${recipe.ingredientLines.length} ingredients, ${Math.round(recipe.calories)} calories.`,
  };
}

export default async function RecipeDetailPage({ params }) {
  const { id } = await params;
  const recipe = getRecipeById(id);

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-md border border-neutral-100">
          <div className="size-16 mx-auto mb-4 rounded-full bg-pink/10 flex items-center justify-center text-pink">
            <RestaurantMenuIcon className="text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-dark">Recipe Not Found</h1>
          <p className="mt-2 text-sm text-gray-500">
            The recipe you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/recipe"
            className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 text-sm font-semibold text-white bg-pink rounded-2xl hover:opacity-90 transition-opacity"
          >
            <ArrowBackIcon className="text-base" />
            <span>Browse All Recipes</span>
          </Link>
        </div>
      </div>
    );
  }

  const recipeId = getRecipeId(recipe);
  const relatedRecipes = getRelatedRecipes(recipe, 3);
  const servings = recipe.yield || 4;
  const totalCalories = Math.round(recipe.calories);
  const caloriesPerServing = Math.round(totalCalories / servings);
  const cookTime = recipe.totalTime > 0 ? `${recipe.totalTime} mins` : "25-35 mins";

  // Macronutrient breakdown helpers
  const nutrients = recipe.totalNutrients || {};
  const protein = nutrients.PROCNT ? Math.round(nutrients.PROCNT.quantity) : null;
  const carbs = nutrients.CHOCDF ? Math.round(nutrients.CHOCDF.quantity) : null;
  const fat = nutrients.FAT ? Math.round(nutrients.FAT.quantity) : null;
  const fiber = nutrients.FIBTG ? Math.round(nutrients.FIBTG.quantity) : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Navigation Header & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link
          href="/recipe"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-dark bg-white rounded-2xl shadow-sm hover:text-pink hover:shadow transition-all border border-neutral-100"
        >
          <ArrowBackIcon className="text-base" />
          <span>Back to recipes</span>
        </Link>

        <nav aria-label="Breadcrumb" className="text-xs text-gray-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-pink transition-colors">Home</Link>
          <span>/</span>
          <Link href="/recipe" className="hover:text-pink transition-colors">Recipes</Link>
          <span>/</span>
          <span className="font-semibold text-dark truncate max-w-[200px] sm:max-w-xs">{recipe.label}</span>
        </nav>
      </div>

      {/* Main Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-neutral-100/90 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Hero Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-4/3 sm:aspect-square overflow-hidden rounded-3xl bg-neutral-100 shadow-inner">
              <RecipeImage
                src={recipe.image}
                alt={recipe.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {recipe.mealType?.map((m) => (
                <span
                  key={m}
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-pink/10 text-pink capitalize"
                >
                  {m}
                </span>
              ))}
              {recipe.cuisineType?.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-[#FCF8F3] text-dark border border-neutral-200 capitalize"
                >
                  {c} Cuisine
                </span>
              ))}
              {recipe.dishType?.map((d) => (
                <span
                  key={d}
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-neutral-100 text-gray-700 capitalize"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Recipe Info */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              <span>Source:</span>
              <span className="font-bold text-dark">{recipe.source}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark leading-tight">
              {recipe.label}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
              A mouth-watering, chef-curated recipe prepared with authentic ingredients. Perfect for family gatherings, dinner parties, or a cozy evening meal.
            </p>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-neutral-100 flex flex-col items-center text-center">
                <AccessTimeIcon className="text-pink text-xl mb-1" />
                <span className="text-[11px] text-gray-500 uppercase font-semibold">Prep Time</span>
                <span className="text-sm font-bold text-dark mt-0.5">{cookTime}</span>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-neutral-100 flex flex-col items-center text-center">
                <PeopleAltIcon className="text-pink text-xl mb-1" />
                <span className="text-[11px] text-gray-500 uppercase font-semibold">Servings</span>
                <span className="text-sm font-bold text-dark mt-0.5">{servings} people</span>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-neutral-100 flex flex-col items-center text-center">
                <LocalFireDepartmentIcon className="text-pink text-xl mb-1" />
                <span className="text-[11px] text-gray-500 uppercase font-semibold">Calories</span>
                <span className="text-sm font-bold text-dark mt-0.5">{caloriesPerServing} <span className="text-[11px] font-normal text-gray-400">/ serv</span></span>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-neutral-100 flex flex-col items-center text-center">
                <RestaurantMenuIcon className="text-pink text-xl mb-1" />
                <span className="text-[11px] text-gray-500 uppercase font-semibold">Ingredients</span>
                <span className="text-sm font-bold text-dark mt-0.5">{recipe.ingredientLines.length} items</span>
              </div>
            </div>

            {/* Action Bar (Delivery & External Source) */}
            <div className="mt-auto pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-pink">$12.99</span>
                <span className="text-xs text-gray-500">Fresh ingredients kit</span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={recipe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-gray-600 bg-neutral-100 hover:bg-neutral-200 rounded-2xl transition-colors"
                >
                  <span>Publisher source</span>
                  <OpenInNewIcon className="text-sm" />
                </a>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-pink hover:opacity-90 rounded-2xl shadow-sm transition-all active:scale-95"
                >
                  <ShoppingBagIcon className="text-base" />
                  <span>Order Kit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Details Section: Ingredients & Nutrition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Ingredients Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-neutral-100/90">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
            <h2 className="text-2xl font-bold text-dark flex items-center gap-2">
              <RestaurantMenuIcon className="text-pink" />
              <span>Ingredients</span>
            </h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF8F5] text-gray-600 border border-neutral-200">
              {recipe.ingredientLines.length} items
            </span>
          </div>

          <ul className="space-y-3.5">
            {recipe.ingredientLines.map((line, index) => (
              <li
                key={index}
                className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] transition-colors border border-neutral-100"
              >
                <CheckCircleIcon className="text-pink text-lg shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-800 leading-snug">{line}</span>
              </li>
            ))}
          </ul>

          {/* Visual Ingredient Thumbnails if available */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="mt-8 pt-6 border-t border-neutral-100">
              <h3 className="text-sm font-bold text-dark uppercase tracking-wider mb-4">
                Ingredient Breakdown
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {recipe.ingredients.slice(0, 6).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-neutral-100 shadow-xs"
                  >
                    {item.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.image}
                        alt={item.food}
                        className="size-10 rounded-lg object-cover bg-neutral-50 shrink-0"
                      />
                    ) : (
                      <div className="size-10 rounded-lg bg-pink/10 flex items-center justify-center text-pink font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-dark truncate capitalize">{item.food}</p>
                      <p className="text-[11px] text-gray-400 truncate">
                        {item.quantity && item.measure ? `${Math.round(item.quantity * 10) / 10} ${item.measure}` : item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Nutrition & Health Labels Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Nutrition Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-neutral-100/90">
            <h2 className="text-xl font-bold text-dark flex items-center gap-2 mb-4">
              <LocalFireDepartmentIcon className="text-pink" />
              <span>Nutrition Facts</span>
            </h2>
            <p className="text-xs text-gray-400 mb-6">Values per serving ({servings} servings total)</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-neutral-100">
                <span className="text-xs text-gray-500 block">Total Calories</span>
                <span className="text-lg font-bold text-dark mt-0.5 block">{caloriesPerServing} kcal</span>
              </div>
              {protein !== null && (
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-neutral-100">
                  <span className="text-xs text-gray-500 block">Protein</span>
                  <span className="text-lg font-bold text-dark mt-0.5 block">{Math.round(protein / servings)} g</span>
                </div>
              )}
              {carbs !== null && (
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-neutral-100">
                  <span className="text-xs text-gray-500 block">Carbohydrates</span>
                  <span className="text-lg font-bold text-dark mt-0.5 block">{Math.round(carbs / servings)} g</span>
                </div>
              )}
              {fat !== null && (
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-neutral-100">
                  <span className="text-xs text-gray-500 block">Fat</span>
                  <span className="text-lg font-bold text-dark mt-0.5 block">{Math.round(fat / servings)} g</span>
                </div>
              )}
            </div>

            {/* Diet Labels */}
            {recipe.dietLabels && recipe.dietLabels.length > 0 && (
              <div className="mt-6 pt-5 border-t border-neutral-100">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2.5">
                  Dietary Highlights
                </span>
                <div className="flex flex-wrap gap-2">
                  {recipe.dietLabels.map((diet) => (
                    <span
                      key={diet}
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      {diet}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cautions */}
            {recipe.cautions && recipe.cautions.length > 0 && (
              <div className="mt-5 pt-4 border-t border-neutral-100">
                <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider block mb-2">
                  Contains / Cautions
                </span>
                <div className="flex flex-wrap gap-2">
                  {recipe.cautions.map((caution) => (
                    <span
                      key={caution}
                      className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200"
                    >
                      {caution}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Health Labels Tag Cloud */}
          {recipe.healthLabels && recipe.healthLabels.length > 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-md border border-neutral-100/90">
              <h3 className="text-base font-bold text-dark mb-3">Health & Lifestyle Tags</h3>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {recipe.healthLabels.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-neutral-100 text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Recipes Section */}
      {relatedRecipes.length > 0 && (
        <section className="mt-14 pt-8 border-t border-neutral-200/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-dark">You May Also Like</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                More mouth-watering dishes to inspire your next home-cooked meal.
              </p>
            </div>
            <Link
              href="/recipe"
              className="text-sm font-semibold text-pink hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowForwardIcon className="text-sm" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedRecipes.map((rel) => {
              const relId = getRecipeId(rel);
              return (
                <Link
                  key={rel.uri}
                  href={`/recipe/${relId}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-neutral-100 flex flex-col"
                >
                  <div className="relative w-full h-44 overflow-hidden bg-neutral-100">
                    <RecipeImage
                      src={rel.image}
                      alt={rel.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {rel.mealType?.[0] && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-white/95 text-dark shadow-sm backdrop-blur-sm capitalize">
                        {rel.mealType[0]}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-dark group-hover:text-pink transition-colors line-clamp-1">
                      {rel.label}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{rel.ingredientLines.length} ingredients · {rel.source}</p>
                    <div className="mt-auto pt-3 flex items-center justify-between text-xs">
                      <span className="font-bold text-pink">{Math.round(rel.calories)} kcal</span>
                      <span className="font-semibold text-pink flex items-center gap-0.5">
                        View <ArrowForwardIcon className="text-xs" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
