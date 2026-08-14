import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRoute, Link } from "wouter";
import { getRecipeBySlug, recipes } from "../data/recipes";
import { isRecipeSaved, saveRecipe, unsaveRecipe } from "../lib/storage";
import { Bookmark, Clock, Flame, Utensils, Droplets, Minus, Plus, ChevronLeft, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RecipeDetail() {
  const [match, params] = useRoute("/recipe/:slug");
  const slug = params?.slug;
  const recipe = slug ? getRecipeBySlug(slug) : undefined;
  
  const [saved, setSaved] = useState(false);
  const [scaler, setScaler] = useState(1);

  useEffect(() => {
    if (recipe) {
      setSaved(isRecipeSaved(recipe.slug));
      window.scrollTo(0, 0);
    }
  }, [recipe]);

  if (!match) return null;
  
  if (!recipe) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-display text-4xl mb-4">Recipe Not Found</h1>
        <Link href="/recipes" className="text-primary hover:underline">Return to collection</Link>
      </div>
    );
  }

  const toggleSave = () => {
    if (saved) {
      unsaveRecipe(recipe.slug);
      setSaved(false);
    } else {
      saveRecipe(recipe.slug);
      setSaved(true);
    }
  };

  const currentServings = Math.max(1, recipe.servings * scaler);

  const formatQty = (qtyStr: string) => {
    const num = parseFloat(qtyStr);
    if (isNaN(num)) return qtyStr;
    const scaled = num * scaler;
    // Format to 1 decimal place max if needed
    return Number.isInteger(scaled) ? scaled.toString() : scaled.toFixed(1);
  };

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pb-24 w-full"
    >
      {/* Hero */}
      <section className="relative w-full h-[60vh] md:h-[80vh] flex items-end">
        <Link href="/recipes" className="absolute top-6 left-6 z-30 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:text-primary transition-colors flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-xs uppercase tracking-widest hidden md:inline">Back</span>
        </Link>

        <div className="absolute inset-0 z-0">
          <img 
            src={recipe.heroImage} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="relative z-10 px-6 md:px-12 pb-12 w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex gap-3 mb-6 flex-wrap">
              <span className="text-xs uppercase tracking-widest px-3 py-1 border border-primary text-primary rounded-full bg-black/50">
                {recipe.category}
              </span>
              {recipe.tags.map(tag => (
                <span key={tag} className="text-xs uppercase tracking-widest px-3 py-1 border border-white/20 text-white rounded-full bg-black/50">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-none text-white mb-4">
              {recipe.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 font-light italic font-display">
              {recipe.origin}
            </p>
          </div>
          
          <Button 
            onClick={toggleSave}
            data-testid="button-save-detail"
            size="lg" 
            variant="outline" 
            className={`border-white/20 bg-black/40 backdrop-blur-md h-14 px-8 tracking-widest uppercase transition-all ${
              saved ? 'text-primary border-primary bg-primary/10' : 'text-white hover:text-primary'
            }`}
          >
            <Bookmark className={`w-5 h-5 mr-3 ${saved ? 'fill-primary' : ''}`} />
            {saved ? 'Saved to Notebook' : 'Save Recipe'}
          </Button>
        </div>
      </section>

      {/* Meta Bar */}
      <section className="border-y border-white/5 bg-background/50 backdrop-blur-sm sticky top-[4rem] md:top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex flex-wrap md:flex-nowrap justify-between gap-6 md:gap-12 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3 shrink-0">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Prep / Cook</div>
              <div className="text-sm font-medium">{recipe.prepTime} / {recipe.cookTime}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Utensils className="w-5 h-5 text-primary" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Difficulty</div>
              <div className="text-sm font-medium">{recipe.difficulty}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Flame className="w-5 h-5 text-primary" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Spice Level</div>
              <div className="text-sm font-medium flex gap-1">
                {[1,2,3].map(level => (
                  <span key={level} className={level <= recipe.spiceLevel ? "text-red-500" : "text-white/20"}>🌶</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Droplets className="w-5 h-5 text-primary" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Umami Index</div>
              <div className="text-sm font-medium flex gap-1">
                {[1,2,3].map(level => (
                  <span key={level} className={level <= recipe.umamiLevel ? "text-amber-500" : "text-white/20"}>●</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        
        {/* Sidebar: Story & Ingredients */}
        <div className="lg:col-span-4 flex flex-col gap-12">
          <div>
            <h3 className="font-display text-3xl mb-4 text-primary">The Story</h3>
            <p className="text-muted-foreground leading-relaxed">
              {recipe.story}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <h3 className="font-display text-3xl text-primary">Ingredients</h3>
              <div className="flex items-center gap-3 bg-secondary rounded-full p-1 border border-white/5">
                <button onClick={() => setScaler(Math.max(0.5, scaler - 0.5))} className="p-2 rounded-full hover:bg-white/10 text-muted-foreground">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-sm w-16 text-center font-medium">{currentServings} SRV</span>
                <button onClick={() => setScaler(scaler + 0.5)} className="p-2 rounded-full hover:bg-white/10 text-muted-foreground">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <ul className="flex flex-col gap-4">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex gap-4 items-start text-sm">
                  <span className="text-primary font-medium w-16 shrink-0 text-right">
                    {formatQty(ing.qty)} {ing.unit}
                  </span>
                  <span className="text-foreground">
                    {ing.item} {ing.note && <span className="text-muted-foreground italic">({ing.note})</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main: Method */}
        <div className="lg:col-span-8">
          <h3 className="font-display text-4xl mb-10 text-primary border-b border-white/5 pb-4">Method</h3>
          <div className="flex flex-col gap-12">
            {recipe.method.map((step) => (
              <div key={step.step} className="flex gap-6 md:gap-8">
                <div className="font-display text-5xl md:text-6xl text-white/10 select-none shrink-0 w-12">
                  0{step.step}
                </div>
                <div className="pt-2 md:pt-4 text-lg text-muted-foreground leading-relaxed">
                  {step.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chef Notes & Pairing */}
          <div className="mt-20 p-8 md:p-12 border border-primary/20 bg-primary/5 rounded-2xl">
            <h4 className="font-display text-2xl text-primary mb-6 flex items-center gap-3">
              <ChefHat className="w-6 h-6" />
              Chef's Notes
            </h4>
            <p className="text-muted-foreground leading-relaxed mb-8 font-serif italic text-lg">
              "{recipe.chefNotes}"
            </p>
            
            <div className="pt-8 border-t border-primary/10">
              <div className="text-xs uppercase tracking-widest text-primary mb-2">Suggested Pairing</div>
              <p className="text-foreground text-lg">{recipe.pairing}</p>
            </div>
          </div>
        </div>

      </section>
    </motion.article>
  );
}
