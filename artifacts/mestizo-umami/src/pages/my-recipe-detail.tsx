import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Users, Pencil, Trash2, BookText } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useMyRecipes, type MyRecipe, type MyRecipeInput } from "@/lib/use-my-recipes";
import { RecipeForm } from "@/components/recipe-form";
import { useAuthContext } from "@/lib/auth-context";

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function MyRecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { recipes, update, remove } = useMyRecipes();
  const { authenticated, login } = useAuthContext();

  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const recipe = recipes.find(r => r.id === id);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
        <BookText className="w-10 h-10 text-muted-foreground mb-4" />
        <h2 className="font-display text-2xl mb-2">Sign in to view this recipe</h2>
        <Button onClick={() => login("/notebook")} className="mt-4 bg-primary text-primary-foreground">
          Sign in
        </Button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="font-display text-2xl mb-2">Recipe not found.</h2>
        <p className="text-muted-foreground text-sm mb-6">It may have been deleted.</p>
        <Link href="/notebook">
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to Notebook
          </Button>
        </Link>
      </div>
    );
  }

  const handleUpdate = async (input: MyRecipeInput) => {
    await update(recipe.id, input);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    setDeleting(true);
    try {
      await remove(recipe.id);
      navigate("/notebook");
    } catch {
      setDeleting(false);
      setDeleteConfirm(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen max-w-3xl mx-auto px-5 md:px-10 py-10 md:py-16"
      >
        {/* Back */}
        <Link href="/notebook">
          <button className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-widest flex items-center gap-2 mb-10 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Notebook
          </button>
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-[10px] tracking-widest uppercase text-primary mb-2">My Recipe</p>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight">
                {recipe.title}
              </h1>
              {recipe.subtitle && (
                <p className="text-muted-foreground text-base mt-2">{recipe.subtitle}</p>
              )}
            </div>
            {/* Actions */}
            <div className="flex gap-2 shrink-0 pt-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditOpen(true)}
                className="text-muted-foreground hover:text-foreground gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={deleting}
                onClick={handleDelete}
                className={`gap-1.5 transition-colors ${
                  deleteConfirm
                    ? "text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/30"
                    : "text-muted-foreground hover:text-destructive"
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {deleteConfirm ? "Confirm delete?" : "Delete"}
                </span>
              </Button>
              {deleteConfirm && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDeleteConfirm(false)}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>

          {/* Meta strip */}
          <div className="flex items-center gap-6 mt-5 pt-5 border-t border-white/10">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Users className="w-4 h-4" />
              <span>Serves {recipe.serves}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="w-4 h-4" />
              <span>{formatTime(recipe.minutes)}</span>
            </div>
            <div className="text-muted-foreground text-xs ml-auto">
              {new Date(recipe.createdAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric"
              })}
            </div>
          </div>
        </div>

        {/* Story */}
        {recipe.story && (
          <div className="mb-10 p-6 rounded-xl border border-white/8 bg-white/[0.02]">
            <p className="text-[10px] tracking-widest uppercase text-primary mb-3">Story & Notes</p>
            <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-wrap">{recipe.story}</p>
          </div>
        )}

        {/* Two-column layout: ingredients + method */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-12">

          {/* Ingredients */}
          <div>
            <h2 className="text-[10px] tracking-widest uppercase text-primary mb-6">Ingredients</h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex gap-3 text-sm leading-snug border-b border-white/5 pb-3 last:border-0">
                  {ing.amount && (
                    <span className="text-primary font-medium shrink-0 w-14 text-right">{ing.amount}</span>
                  )}
                  <span className="text-foreground flex-1">{ing.ingredient}
                    {ing.note && <span className="text-muted-foreground text-xs ml-1">— {ing.note}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Method */}
          <div>
            <h2 className="text-[10px] tracking-widest uppercase text-primary mb-6">Method</h2>
            <ol className="space-y-6">
              {recipe.method.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full border border-primary/40 flex items-center justify-center text-primary text-xs font-medium shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90 flex-1">{step.step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </motion.div>

      <RecipeForm
        open={editOpen}
        onOpenChange={setEditOpen}
        recipe={recipe}
        onSave={handleUpdate}
      />
    </>
  );
}
