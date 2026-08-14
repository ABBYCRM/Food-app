import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { getSavedRecipes, unsaveRecipe } from "../lib/storage";
import { recipes } from "../data/recipes";
import { HeartCrack, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Notebook() {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSavedSlugs(getSavedRecipes());
    const handleStorage = () => setSavedSlugs(getSavedRecipes());
    window.addEventListener('storage-update', handleStorage);
    return () => window.removeEventListener('storage-update', handleStorage);
  }, []);

  const savedRecipes = recipes.filter(r => savedSlugs.includes(r.slug));

  const removeRecipe = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    unsaveRecipe(slug);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-10 md:py-12 px-5 md:px-12 max-w-7xl mx-auto w-full flex flex-col"
    >
      <div className="mb-10 md:mb-12 text-center md:text-left">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-3 text-primary">Private Notebook</h1>
        <p className="text-muted-foreground tracking-widest uppercase text-xs sm:text-sm flex items-center justify-center md:justify-start gap-2">
          <BookOpen className="w-4 h-4 shrink-0" /> Your personal collection of inspiration.
        </p>
      </div>

      {savedRecipes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 mb-6 rounded-full border border-white/10 flex items-center justify-center bg-secondary">
            <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl mb-4">Your notebook is empty.</h2>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm md:text-base leading-relaxed">
            Browse the collection and save the recipes that inspire you to cook something extraordinary.
          </p>
          <Link href="/recipes" data-testid="link-notebook-explore">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest px-8 h-12 md:h-14"
            >
              Explore Recipes
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-8">
            {savedRecipes.length} {savedRecipes.length === 1 ? 'recipe' : 'recipes'} saved
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            <AnimatePresence mode="popLayout">
              {savedRecipes.map((recipe, i) => (
                <motion.div
                  key={recipe.slug}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group cursor-pointer flex flex-col"
                  layout
                >
                  <Link href={`/recipe/${recipe.slug}`} data-testid={`link-notebook-${recipe.slug}`}>
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 mb-4">
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10" />
                      <img
                        src={recipe.thumbImage}
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />

                      {/* Remove button — always visible on touch, hover-reveal on desktop */}
                      <button
                        onClick={(e) => removeRecipe(e, recipe.slug)}
                        data-testid={`button-unsave-${recipe.slug}`}
                        aria-label="Remove from notebook"
                        className="absolute top-4 right-4 z-20 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/60 hover:text-destructive hover:bg-destructive/20 transition-colors md:opacity-0 md:group-hover:opacity-100"
                      >
                        <HeartCrack className="w-4 h-4 md:w-5 md:h-5" />
                      </button>

                      <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
                        <div className="text-[10px] tracking-widest text-primary uppercase mb-2">
                          {recipe.category}
                        </div>
                        <h3 className="font-display text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors leading-tight">
                          {recipe.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </motion.div>
  );
}
