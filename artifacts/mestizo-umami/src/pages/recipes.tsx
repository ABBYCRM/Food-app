import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { recipes } from "../data/recipes";
import { Heart } from "lucide-react";
import { isRecipeSaved, saveRecipe, unsaveRecipe } from "../lib/storage";
import { useEffect } from "react";
import { useLocale } from "@/lib/locale";

function RecipeCard({ recipe, index }: { recipe: typeof recipes[0]; index: number }) {
  const [saved, setSaved] = useState(false);
  const { locale } = useLocale();
  const loc = recipe.locales?.[locale as "es" | "pt"];
  const title = loc?.title ?? recipe.title;

  useEffect(() => {
    setSaved(isRecipeSaved(recipe.slug));
    const handleStorage = () => setSaved(isRecipeSaved(recipe.slug));
    window.addEventListener('storage-update', handleStorage);
    return () => window.removeEventListener('storage-update', handleStorage);
  }, [recipe.slug]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved) unsaveRecipe(recipe.slug);
    else saveRecipe(recipe.slug);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.07 }}
      className="group cursor-pointer flex flex-col"
      layout
    >
      <Link href={`/recipe/${recipe.slug}`} data-testid={`link-recipe-card-${recipe.slug}`}>
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 mb-4">
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10" />
          <img
            src={recipe.thumbImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <button
            onClick={toggleSave}
            data-testid={`button-save-${recipe.slug}`}
            aria-label={saved ? "Unsave recipe" : "Save recipe"}
            className="absolute top-4 right-4 z-20 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:text-primary transition-colors"
          >
            <Heart className={`w-5 h-5 transition-colors ${saved ? "fill-primary text-primary" : ""}`} />
          </button>

          {/* Tags on hover */}
          <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent z-20 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="flex gap-2 flex-wrap">
              {recipe.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] uppercase tracking-widest px-2 py-1 border border-primary/50 text-primary rounded-sm bg-black/50">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs tracking-widest text-primary uppercase mb-2">
            {recipe.category} • {recipe.origin}
          </div>
          <h3 className="font-display text-xl md:text-2xl text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
            {title}
          </h3>
          <div className="flex items-center gap-3 md:gap-4 text-sm text-muted-foreground flex-wrap">
            <span>{recipe.prepTime} Prep</span>
            <span>{recipe.cookTime} Cook</span>
            <span>{recipe.difficulty}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function RecipesGallery() {
  const searchParams = new URLSearchParams(window.location.search);
  const categoryFromUrl = searchParams.get('category');

  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || 'All');

  const categories = ["All", ...Array.from(new Set(recipes.map(r => r.category)))];

  const filtered = activeCategory === 'All'
    ? recipes
    : recipes.filter(r => r.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-10 md:py-12 px-5 md:px-12 max-w-7xl mx-auto w-full"
    >
      {/* Header */}
      <div className="mb-10 md:mb-12">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-4">The Collection</h1>
        <p className="text-muted-foreground tracking-widest uppercase text-xs sm:text-sm">
          Curated recipes for the ambitious home cook.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-10 md:mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            data-testid={`button-filter-${cat.toLowerCase().replace(/\s/g, '-')}`}
            className={`px-4 py-2 rounded-full border text-xs tracking-widest uppercase transition-colors cursor-pointer ${
              activeCategory === cat
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-white/10 text-muted-foreground hover:border-primary/50 hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
        <AnimatePresence mode="popLayout">
          {filtered.map((recipe, i) => (
            <RecipeCard key={recipe.slug} recipe={recipe} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-24 text-center text-muted-foreground">
          <p className="font-display text-2xl">No recipes found for this category.</p>
          <button
            onClick={() => setActiveCategory('All')}
            className="mt-6 text-primary hover:underline text-sm tracking-widest uppercase"
          >
            Show all recipes
          </button>
        </div>
      )}
    </motion.div>
  );
}
