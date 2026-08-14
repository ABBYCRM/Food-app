import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { getMealPlan, setMealPlanSlot, MealPlan } from "../lib/storage";
import { recipes } from "../data/recipes";
import { Calendar, Plus, X, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SLOTS = ["breakfast", "lunch", "dinner"] as const;

export function Planner() {
  const [plan, setPlan] = useState<MealPlan>({});
  const [activeSelect, setActiveSelect] = useState<{ day: string, slot: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setPlan(getMealPlan());
    const handleStorage = () => setPlan(getMealPlan());
    window.addEventListener('storage-update', handleStorage);
    return () => window.removeEventListener('storage-update', handleStorage);
  }, []);

  const handleSelect = (slug: string) => {
    if (activeSelect) {
      setMealPlanSlot(activeSelect.day, activeSelect.slot, slug);
      setIsOpen(false);
      setActiveSelect(null);
      setSearchTerm("");
    }
  };

  const handleRemove = (e: React.MouseEvent, day: string, slot: string) => {
    e.stopPropagation();
    setMealPlanSlot(day, slot, null);
  };

  const filteredRecipes = recipes.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isPlanEmpty = Object.values(plan).every(day => 
    !day.breakfast && !day.lunch && !day.dinner
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 px-4 md:px-12 max-w-7xl mx-auto w-full"
    >
      <div className="mb-12">
        <h1 className="font-display text-5xl md:text-6xl mb-4 text-primary">The Weekly Canvas</h1>
        <p className="text-muted-foreground tracking-widest uppercase text-sm flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Plan your week of extraordinary meals.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-7 gap-4 md:gap-6">
        {DAYS.map(day => (
          <div key={day} className="flex flex-col gap-4">
            <div className="text-center font-display text-2xl py-2 border-b border-primary/20 text-primary">
              {day.slice(0, 3)}
              <span className="hidden xl:inline">{day.slice(3)}</span>
            </div>
            
            <div className="flex xl:flex-col gap-4 overflow-x-auto xl:overflow-x-visible pb-4 xl:pb-0">
              {SLOTS.map(slot => {
                const recipeSlug = plan[day]?.[slot];
                const recipe = recipeSlug ? recipes.find(r => r.slug === recipeSlug) : null;

                return (
                  <div key={slot} className="shrink-0 w-64 xl:w-auto h-32 md:h-40 xl:h-48 rounded-xl border border-white/10 relative overflow-hidden group bg-card transition-colors hover:border-primary/50">
                    
                    {recipe ? (
                      <Link href={`/recipe/${recipe.slug}`} className="block w-full h-full relative cursor-pointer">
                        <img src={recipe.thumbImage} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                        
                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                          <span className="text-[10px] uppercase tracking-widest text-primary mb-1">{slot}</span>
                          <h4 className="font-display text-lg leading-tight line-clamp-2">{recipe.title}</h4>
                        </div>

                        <button 
                          onClick={(e) => handleRemove(e, day, slot)}
                          className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white/50 hover:text-destructive hover:bg-destructive/20 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </Link>
                    ) : (
                      <Dialog open={isOpen && activeSelect?.day === day && activeSelect?.slot === slot} onOpenChange={(open) => {
                        setIsOpen(open);
                        if(open) setActiveSelect({ day, slot });
                        else setActiveSelect(null);
                      }}>
                        <DialogTrigger asChild>
                          <button className="w-full h-full flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors hover:bg-primary/5">
                            <Plus className="w-6 h-6 mb-2" />
                            <span className="text-xs uppercase tracking-widest">{slot}</span>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="bg-background border border-white/10 max-w-3xl h-[80vh] flex flex-col">
                          <DialogHeader>
                            <DialogTitle className="font-display text-2xl text-primary text-center">
                              Select for {day} {slot}
                            </DialogTitle>
                          </DialogHeader>
                          
                          <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <input 
                              type="text" 
                              placeholder="Search recipes..."
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                              className="w-full bg-secondary border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-primary text-foreground"
                            />
                          </div>

                          <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredRecipes.map(r => (
                              <div 
                                key={r.slug}
                                onClick={() => handleSelect(r.slug)}
                                className="flex gap-4 p-3 rounded-xl border border-white/5 bg-secondary hover:border-primary cursor-pointer transition-colors group"
                              >
                                <img src={r.thumbImage} className="w-20 h-20 object-cover rounded-lg" />
                                <div className="flex flex-col justify-center">
                                  <div className="text-[10px] uppercase tracking-widest text-primary mb-1">{r.category}</div>
                                  <h5 className="font-display text-lg leading-tight group-hover:text-primary transition-colors">{r.title}</h5>
                                </div>
                              </div>
                            ))}
                            {filteredRecipes.length === 0 && (
                              <div className="col-span-2 py-12 text-center text-muted-foreground">
                                No recipes found.
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </motion.div>
  );
}
