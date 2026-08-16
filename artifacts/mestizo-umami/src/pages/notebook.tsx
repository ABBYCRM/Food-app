import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { getSavedRecipes, unsaveRecipe } from "../lib/storage";
import { recipes as collectionRecipes } from "../data/recipes";
import { HeartCrack, BookOpen, PenLine, BookText, Clock, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/locale";
import { useAuthContext } from "@/lib/auth-context";
import { useMyRecipes, type MyRecipeInput } from "@/lib/use-my-recipes";
import { RecipeForm } from "@/components/recipe-form";

// ─────────────────────────────────────────────────────────────────────────────

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

// ── Saved tab ─────────────────────────────────────────────────────────────────

function SavedTab() {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const { locale } = useLocale();
  const { authenticated, login } = useAuthContext();

  useEffect(() => {
    setSavedSlugs(getSavedRecipes());
    const handleStorage = () => setSavedSlugs(getSavedRecipes());
    window.addEventListener("storage-update", handleStorage);
    return () => window.removeEventListener("storage-update", handleStorage);
  }, []);

  const savedRecipes = collectionRecipes.filter(r => savedSlugs.includes(r.slug));

  if (!authenticated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 mb-6 rounded-full border border-white/10 flex items-center justify-center bg-secondary">
          <BookOpen className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl mb-3">Sign in to save recipes</h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm leading-relaxed">
          Create a free account and heart any recipe to keep it here.
        </p>
        <Button
          onClick={() => login("/notebook")}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest px-8 h-12"
        >
          Sign in
        </Button>
      </div>
    );
  }

  if (savedRecipes.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 mb-6 rounded-full border border-white/10 flex items-center justify-center bg-secondary">
          <BookOpen className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl mb-3">Your notebook is empty.</h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm leading-relaxed">
          Browse the collection and save the recipes that inspire you to cook something extraordinary.
        </p>
        <Link href="/recipes">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest px-8 h-12"
          >
            Explore Recipes
          </Button>
        </Link>
      </div>
    );
  }

  const removeRecipe = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    unsaveRecipe(slug);
  };

  return (
    <>
      <p className="text-xs tracking-widest uppercase text-muted-foreground mb-8">
        {savedRecipes.length} {savedRecipes.length === 1 ? "recipe" : "recipes"} saved
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
              <Link href={`/recipe/${recipe.slug}`}>
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 mb-4">
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10" />
                  <img
                    src={recipe.thumbImage}
                    alt={recipe.locales?.[locale as "es" | "pt"]?.title ?? recipe.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <button
                    onClick={(e) => removeRecipe(e, recipe.slug)}
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
                      {recipe.locales?.[locale as "es" | "pt"]?.title ?? recipe.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

// ── My Recipes tab ────────────────────────────────────────────────────────────

function MyRecipesTab() {
  const { authenticated, login } = useAuthContext();
  const { recipes, loading, error, create, update } = useMyRecipes();
  const [formOpen, setFormOpen] = useState(false);

  if (!authenticated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 mb-6 rounded-full border border-white/10 flex items-center justify-center bg-secondary">
          <PenLine className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl mb-3">Sign in to write recipes</h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm leading-relaxed">
          Jot down your own creations, adapt a classic, or build something entirely new.
        </p>
        <Button
          onClick={() => login("/notebook")}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest px-8 h-12"
        >
          Sign in
        </Button>
      </div>
    );
  }

  const handleCreate = async (input: MyRecipeInput) => {
    await create(input);
  };

  return (
    <>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        {recipes.length > 0 && (
          <p className="text-xs tracking-widest uppercase text-muted-foreground">
            {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
          </p>
        )}
        <Button
          onClick={() => setFormOpen(true)}
          className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest px-5 h-9 text-xs gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          Write a Recipe
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex items-center justify-center py-24 text-muted-foreground text-sm">
          Loading…
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex-1 flex items-center justify-center py-24 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && recipes.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 mb-6 rounded-full border border-white/10 flex items-center justify-center bg-secondary">
            <BookText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl mb-3">Your recipes live here.</h2>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm leading-relaxed">
            Jot down your own creations, adapt a classic, or build something entirely new.
          </p>
          <Button
            onClick={() => setFormOpen(true)}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest px-8 h-12 gap-2"
          >
            <PenLine className="w-4 h-4" />
            Write Your First Recipe
          </Button>
        </div>
      )}

      {/* Grid */}
      {!loading && recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {recipes.map((recipe, i) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                layout
              >
                <Link href={`/my-recipe/${recipe.id}`}>
                  <div className="group cursor-pointer rounded-xl border border-white/8 bg-white/[0.025] hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300 overflow-hidden">
                    {/* Gradient header */}
                    <div className="h-36 relative bg-gradient-to-br from-amber-950/60 via-stone-900 to-black flex items-end p-5">
                      <div className="absolute top-4 right-4">
                        <PenLine className="w-4 h-4 text-primary/40 group-hover:text-primary/70 transition-colors" />
                      </div>
                      <div>
                        <p className="text-[9px] tracking-widest uppercase text-primary mb-1">My Recipe</p>
                        <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
                          {recipe.title}
                        </h3>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="px-5 py-4">
                      {recipe.subtitle && (
                        <p className="text-muted-foreground text-xs leading-snug mb-3 line-clamp-2">
                          {recipe.subtitle}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-[11px] text-white/35">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3 h-3" />
                          {recipe.serves}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {formatTime(recipe.minutes)}
                        </span>
                        <span className="flex items-center gap-1 ml-auto">
                          {recipe.ingredients.length} ingredients
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <RecipeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={handleCreate}
      />
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type Tab = "saved" | "mine";

export function Notebook() {
  const [tab, setTab] = useState<Tab>("saved");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-10 md:py-12 px-5 md:px-12 max-w-7xl mx-auto w-full flex flex-col"
    >
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-3 text-primary">
          Private Notebook
        </h1>
        <p className="text-muted-foreground tracking-widest uppercase text-xs sm:text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4 shrink-0" />
          Your personal collection of inspiration.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-1 mb-10 border-b border-white/10 pb-0">
        <button
          onClick={() => setTab("saved")}
          className={`flex items-center gap-2 px-4 py-3 text-xs tracking-widest uppercase transition-colors border-b-2 -mb-px ${
            tab === "saved"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Saved Collection
        </button>
        <button
          onClick={() => setTab("mine")}
          className={`flex items-center gap-2 px-4 py-3 text-xs tracking-widest uppercase transition-colors border-b-2 -mb-px ${
            tab === "mine"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <PenLine className="w-3.5 h-3.5" />
          My Recipes
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {tab === "saved" ? (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col"
            >
              <SavedTab />
            </motion.div>
          ) : (
            <motion.div
              key="mine"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col"
            >
              <MyRecipesTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
