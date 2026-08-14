import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { getMealPlan, setMealPlanSlot, MealPlan } from "../lib/storage";
import { recipes } from "../data/recipes";
import { Calendar, Plus, X, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SLOTS = ["breakfast", "lunch", "dinner"] as const;

type Slot = typeof SLOTS[number];

function SlotCell({
  day,
  slot,
  recipe,
  onAdd,
  onRemove,
}: {
  day: string;
  slot: Slot;
  recipe: typeof recipes[0] | null;
  onAdd: () => void;
  onRemove: (e: React.MouseEvent) => void;
}) {
  if (recipe) {
    return (
      <div className="relative rounded-xl border border-white/10 overflow-hidden group bg-card hover:border-primary/40 transition-colors h-28 md:h-36">
        <Link href={`/recipe/${recipe.slug}`} data-testid={`link-planner-${day}-${slot}`} className="block w-full h-full">
          <img
            src={recipe.thumbImage}
            alt={recipe.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
          <div className="absolute inset-0 p-3 flex flex-col justify-end">
            <span className="text-[9px] uppercase tracking-widest text-primary mb-0.5">{slot}</span>
            <h4 className="font-display text-sm leading-tight line-clamp-2">{recipe.title}</h4>
          </div>
        </Link>
        <button
          onClick={onRemove}
          data-testid={`button-remove-${day}-${slot}`}
          aria-label={`Remove ${slot}`}
          className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white/50 hover:text-destructive hover:bg-destructive/20 transition-colors z-10"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onAdd}
      data-testid={`button-add-${day}-${slot}`}
      className="w-full h-28 md:h-36 rounded-xl border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center text-muted-foreground hover:text-primary gap-2 cursor-pointer"
    >
      <Plus className="w-5 h-5" />
      <span className="text-[10px] uppercase tracking-widest">{slot}</span>
    </button>
  );
}

export function Planner() {
  const [plan, setPlan] = useState<MealPlan>({});
  const [activeSelect, setActiveSelect] = useState<{ day: string; slot: Slot } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setPlan(getMealPlan());
    const handleStorage = () => setPlan(getMealPlan());
    window.addEventListener('storage-update', handleStorage);
    return () => window.removeEventListener('storage-update', handleStorage);
  }, []);

  const openPicker = (day: string, slot: Slot) => {
    setActiveSelect({ day, slot });
    setSearchTerm("");
    setDialogOpen(true);
  };

  const handleSelect = (recipeSlug: string) => {
    if (activeSelect) {
      setMealPlanSlot(activeSelect.day, activeSelect.slot, recipeSlug);
      setDialogOpen(false);
      setActiveSelect(null);
    }
  };

  const handleRemove = (e: React.MouseEvent, day: string, slot: string) => {
    e.preventDefault();
    e.stopPropagation();
    setMealPlanSlot(day, slot, null);
  };

  const filteredRecipes = recipes.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-10 md:py-12 px-5 md:px-12 max-w-7xl mx-auto w-full"
    >
      <div className="mb-10 md:mb-12">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-3 text-primary">The Weekly Canvas</h1>
        <p className="text-muted-foreground tracking-widest uppercase text-xs sm:text-sm flex items-center gap-2">
          <Calendar className="w-4 h-4 shrink-0" /> Plan your week of extraordinary meals.
        </p>
      </div>

      {/* Desktop/Tablet: 7-column grid — Mobile: stacked day accordion */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4 md:gap-5">
        {DAYS.map(day => (
          <div key={day} className="flex flex-col gap-3">
            <div className="text-center font-display text-lg py-2 border-b border-primary/20 text-primary">
              {day.slice(0, 3)}
              <span className="hidden xl:inline">{day.slice(3)}</span>
            </div>
            {SLOTS.map(slot => {
              const recipeSlug = plan[day]?.[slot];
              const recipe = recipeSlug ? recipes.find(r => r.slug === recipeSlug) ?? null : null;
              return (
                <SlotCell
                  key={slot}
                  day={day}
                  slot={slot}
                  recipe={recipe}
                  onAdd={() => openPicker(day, slot)}
                  onRemove={(e) => handleRemove(e, day, slot)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Mobile: stacked list */}
      <div className="flex flex-col gap-6 sm:hidden">
        {DAYS.map(day => (
          <div key={day}>
            <div className="font-display text-xl text-primary border-b border-primary/20 pb-2 mb-3">
              {day}
            </div>
            <div className="flex flex-col gap-3">
              {SLOTS.map(slot => {
                const recipeSlug = plan[day]?.[slot];
                const recipe = recipeSlug ? recipes.find(r => r.slug === recipeSlug) ?? null : null;
                return (
                  <SlotCell
                    key={slot}
                    day={day}
                    slot={slot}
                    recipe={recipe}
                    onAdd={() => openPicker(day, slot)}
                    onRemove={(e) => handleRemove(e, day, slot)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Picker Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) setActiveSelect(null);
      }}>
        <DialogTrigger className="hidden" />
        <DialogContent className="bg-background border border-white/10 max-w-2xl w-[90vw] max-h-[85vh] flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl md:text-2xl text-primary text-center capitalize">
              {activeSelect
                ? `${activeSelect.day} — ${activeSelect.slot}`
                : 'Select a recipe'}
            </DialogTitle>
          </DialogHeader>

          <div className="relative my-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              data-testid="input-planner-search"
              className="w-full bg-secondary border border-white/10 rounded-full py-2.5 pl-10 pr-5 text-sm focus:outline-none focus:border-primary text-foreground"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredRecipes.map(r => (
              <button
                key={r.slug}
                onClick={() => handleSelect(r.slug)}
                data-testid={`button-pick-recipe-${r.slug}`}
                className="flex gap-3 p-3 rounded-xl border border-white/5 bg-secondary hover:border-primary cursor-pointer transition-colors group text-left"
              >
                <img
                  src={r.thumbImage}
                  alt={r.title}
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg shrink-0"
                />
                <div className="flex flex-col justify-center min-w-0">
                  <div className="text-[9px] uppercase tracking-widest text-primary mb-1">{r.category}</div>
                  <h5 className="font-display text-base md:text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {r.title}
                  </h5>
                </div>
              </button>
            ))}
            {filteredRecipes.length === 0 && (
              <div className="col-span-2 py-12 text-center text-muted-foreground">
                <p className="font-display text-xl">No recipes found.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
