import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { recipes } from "../data/recipes";
import { Heart, Search, Filter } from "lucide-react";
import { isRecipeSaved, saveRecipe, unsaveRecipe } from "../lib/storage";

function RecipeCard({ recipe, index }: { recipe: typeof recipes[0]; index: number }) {
  const [saved, setSaved] = useState(false);

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
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer flex flex-col"
    >
      <Link href={`/recipe/${recipe.slug}`}>
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 mb-4">
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10" />
          <img 
            src={recipe.thumbImage} 
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <button 
            onClick={toggleSave}
            data-testid={`button-save-${recipe.slug}`}
            className="absolute top-4 right-4 z-20 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:text-primary transition-colors"
          >
            <Heart className={`w-5 h-5 transition-colors ${saved ? "fill-primary text-primary" : ""}`} />
          </button>

          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
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
          <h3 className="font-display text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const categoryFilter = searchParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState(categoryFilter || 'All');

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
      className="min-h-screen py-12 px-6 md:px-12 max-w-7xl mx-auto w-full"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="font-display text-5xl md:text-6xl mb-4">The Collection</h1>
          <p className="text-muted-foreground tracking-widest uppercase text-sm">
            Curated recipes for the ambitious home cook.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full border text-xs tracking-widest uppercase transition-colors ${
                activeCategory === cat 
                  ? 'border-primary bg-primary text-primary-foreground' 
                  : 'border-white/10 text-muted-foreground hover:border-primary/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        <AnimatePresence mode="popLayout">
          {filtered.map((recipe, i) => (
            <RecipeCard key={recipe.slug} recipe={recipe} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-24 text-center text-muted-foreground">
          <p className="font-display text-2xl">No recipes found for this category.</p>
        </div>
      )}
    </motion.div>
  );
}
