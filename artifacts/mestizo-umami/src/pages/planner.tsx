import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  getMealPlan, setMealPlanSlot, saveMealPlan, addToHistory,
  getRecentSlugs, MealPlan,
} from "../lib/storage";
import { recipes } from "../data/recipes";
import {
  Calendar, Plus, X, Search, Wand2, Printer, Sun,
  UtensilsCrossed, Moon, Apple, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
type Day = typeof DAYS[number];

const SLOTS = ["breakfast", "lunch", "dinner", "snack"] as const;
type Slot = typeof SLOTS[number];

const SLOT_CONFIG: Record<Slot, { label: string; icon: React.ReactNode; color: string; mealTypes: string[] }> = {
  breakfast: { label: "Breakfast", icon: <Sun className="w-3.5 h-3.5" />, color: "text-amber-400",   mealTypes: ["breakfast", "brunch"] },
  lunch:     { label: "Lunch",     icon: <UtensilsCrossed className="w-3.5 h-3.5" />, color: "text-teal-400",  mealTypes: ["lunch"] },
  dinner:    { label: "Dinner",    icon: <Moon className="w-3.5 h-3.5" />, color: "text-orange-400", mealTypes: ["dinner"] },
  snack:     { label: "Snack",     icon: <Apple className="w-3.5 h-3.5" />, color: "text-purple-400", mealTypes: ["snack", "dessert", "side"] },
};

// ─── Fraction helpers ─────────────────────────────────────────────────────────

function parseQty(qty: string): number {
  const trimmed = qty.trim();
  const parts = trimmed.split(" ");
  if (parts.length === 2 && parts[1].includes("/")) {
    const whole = parseFloat(parts[0]);
    const [n, d] = parts[1].split("/").map(Number);
    return whole + n / d;
  }
  if (trimmed.includes("/")) {
    const [n, d] = trimmed.split("/").map(Number);
    return n / d;
  }
  return parseFloat(trimmed) || 0;
}

function formatQty(n: number): string {
  if (n <= 0) return "";
  const FRACS: [number, string][] = [
    [0.125, "⅛"], [0.25, "¼"], [0.333, "⅓"], [0.5, "½"],
    [0.667, "⅔"], [0.75, "¾"], [0.875, "⅞"],
  ];
  const whole = Math.floor(n);
  const frac = n - whole;
  const best = FRACS.reduce((a, b) => Math.abs(b[0] - frac) < Math.abs(a[0] - frac) ? b : a);
  if (Math.abs(best[0] - frac) < 0.07) {
    return whole > 0 ? `${whole} ${best[1]}` : best[1];
  }
  if (n % 1 === 0) return String(n);
  return n.toFixed(1).replace(/\.0$/, "");
}

function scaleQty(qty: string, base: number, target: number): string {
  const n = parseQty(qty);
  if (n === 0) return qty;
  return formatQty(n * (target / base));
}

// ─── SlotCell ─────────────────────────────────────────────────────────────────

function SlotCell({
  day, slot, recipe, onAdd, onRemove,
}: {
  day: string; slot: Slot;
  recipe: typeof recipes[0] | null;
  onAdd: () => void;
  onRemove: (e: React.MouseEvent) => void;
}) {
  const cfg = SLOT_CONFIG[slot];
  if (recipe) {
    return (
      <div className="relative rounded-lg border border-white/10 overflow-hidden group bg-card hover:border-primary/40 transition-colors h-28">
        <Link
          href={`/recipe/${recipe.slug}`}
          data-testid={`link-planner-${day}-${slot}`}
          className="block w-full h-full"
        >
          <img
            src={recipe.thumbImage}
            alt={recipe.title}
            className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-55 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
          <div className="absolute inset-0 p-2 flex flex-col justify-end">
            <span className={`text-[8px] uppercase tracking-widest mb-0.5 flex items-center gap-1 ${cfg.color}`}>
              {cfg.icon}{cfg.label}
            </span>
            <h4 className="font-display text-[11px] leading-tight line-clamp-2">{recipe.title}</h4>
          </div>
        </Link>
        <button
          onClick={onRemove}
          data-testid={`button-remove-${day}-${slot}`}
          aria-label={`Remove ${slot}`}
          className="absolute top-1.5 right-1.5 p-1 bg-black/60 rounded-full text-white/40 hover:text-destructive hover:bg-destructive/20 transition-colors z-10"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={onAdd}
      data-testid={`button-add-${day}-${slot}`}
      className="w-full h-28 rounded-lg border border-white/8 hover:border-primary/30 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center text-muted-foreground/50 hover:text-primary gap-1.5 cursor-pointer"
    >
      <Plus className="w-4 h-4" />
      <span className={`text-[9px] uppercase tracking-widest flex items-center gap-1 ${cfg.color} opacity-60`}>
        {cfg.icon}{cfg.label}
      </span>
    </button>
  );
}

// ─── PrintView ────────────────────────────────────────────────────────────────

function PrintView({ plan, onClose }: { plan: MealPlan; onClose: () => void }) {
  const [servingsMap, setServingsMap] = useState<Record<string, number>>({});

  // Build ordered list of filled slots
  const meals: { day: Day; slot: Slot; recipe: typeof recipes[0] }[] = [];
  for (const day of DAYS) {
    for (const slot of SLOTS) {
      const slug = plan[day]?.[slot as string];
      if (slug) {
        const r = recipes.find(r => r.slug === slug);
        if (r) meals.push({ day, slot, recipe: r });
      }
    }
  }

  const getServings = (r: typeof recipes[0]) =>
    servingsMap[r.slug] ?? r.servings;

  const handlePrint = () => window.print();

  if (meals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Calendar className="w-10 h-10 mb-4 opacity-30" />
        <p className="font-display text-xl">No meals planned yet.</p>
        <p className="text-sm mt-1">Fill some slots on the calendar first.</p>
        <button onClick={onClose} className="mt-6 text-primary text-sm underline">Go back</button>
      </div>
    );
  }

  return (
    <div>
      {/* Screen-only header */}
      <div className="print:hidden flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl text-primary">Weekly Shopping List</h2>
          <p className="text-xs text-muted-foreground mt-1">Adjust servings, then print.</p>
        </div>
        <button
          onClick={handlePrint}
          data-testid="button-print"
          className="flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Printer className="w-4 h-4" /> Print List
        </button>
      </div>

      {/* Print header (print-only) */}
      <div className="hidden print:block mb-8">
        <h1 className="text-3xl font-bold">Mestizo Umami — Weekly Shopping List</h1>
        <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}</p>
        <hr className="mt-4" />
      </div>

      <div className="space-y-8 print:space-y-6">
        {meals.map(({ day, slot, recipe }) => {
          const cfg = SLOT_CONFIG[slot];
          const target = getServings(recipe);
          const base = recipe.servings;
          return (
            <div key={`${day}-${slot}`} className="break-inside-avoid">
              {/* Meal header */}
              <div className="flex items-center justify-between mb-3 print:mb-2">
                <div>
                  <span className={`text-[10px] uppercase tracking-widest ${cfg.color} flex items-center gap-1 print:text-gray-500`}>
                    {cfg.icon}{day} · {cfg.label}
                  </span>
                  <h3 className="font-display text-lg leading-tight mt-0.5">{recipe.title}</h3>
                </div>
                {/* Servings control — screen only */}
                <div className="print:hidden flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">Servings</span>
                  <div className="flex items-center border border-white/20 rounded-full overflow-hidden">
                    <button
                      onClick={() => setServingsMap(m => ({ ...m, [recipe.slug]: Math.max(1, (m[recipe.slug] ?? base) - 1) }))}
                      className="px-2.5 py-1 text-muted-foreground hover:text-primary transition-colors text-sm"
                      data-testid={`button-serving-down-${recipe.slug}`}
                    >−</button>
                    <span className="px-2 text-sm font-medium min-w-[2ch] text-center" data-testid={`span-servings-${recipe.slug}`}>{target}</span>
                    <button
                      onClick={() => setServingsMap(m => ({ ...m, [recipe.slug]: (m[recipe.slug] ?? base) + 1 }))}
                      className="px-2.5 py-1 text-muted-foreground hover:text-primary transition-colors text-sm"
                      data-testid={`button-serving-up-${recipe.slug}`}
                    >+</button>
                  </div>
                </div>
                {/* Print-only servings */}
                <span className="hidden print:inline text-sm text-gray-600">Serves {target}</span>
              </div>

              {/* Ingredient list */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 print:grid-cols-2 print:gap-0.5">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-baseline gap-1.5 text-sm print:text-xs border-b border-white/5 print:border-gray-100 pb-1">
                    <span className="font-medium tabular-nums shrink-0 text-primary print:text-black">
                      {scaleQty(ing.qty, base, target)} {ing.unit}
                    </span>
                    <span className="text-foreground/80 print:text-gray-800">{ing.item}</span>
                    {ing.note && <span className="text-muted-foreground text-[10px] print:text-gray-500">({ing.note})</span>}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Planner ──────────────────────────────────────────────────────────────

export function Planner() {
  const [plan, setPlan] = useState<MealPlan>({});
  const [activeSelect, setActiveSelect] = useState<{ day: string; slot: Slot } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set([DAYS[0]]));
  const { toast } = useToast();

  useEffect(() => {
    setPlan(getMealPlan());
    const handleStorage = () => setPlan(getMealPlan());
    window.addEventListener("storage-update", handleStorage);
    return () => window.removeEventListener("storage-update", handleStorage);
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

  const handleAutoPlan = useCallback(() => {
    const recentSlugs = getRecentSlugs(90);
    const usedThisWeek = new Set<string>();
    const newPlan: MealPlan = {};

    for (const day of DAYS) {
      newPlan[day] = {};
      for (const slot of SLOTS) {
        const slotTypes = SLOT_CONFIG[slot].mealTypes;
        // Priority 1: not used in 90 days, not used this week
        let candidates = recipes.filter(r =>
          r.mealSlots.some((ms: string) => slotTypes.includes(ms)) &&
          !recentSlugs.has(r.slug) &&
          !usedThisWeek.has(r.slug)
        );
        // Fallback: allow recently used but not this week
        if (candidates.length === 0) {
          candidates = recipes.filter(r =>
            r.mealSlots.some((ms: string) => slotTypes.includes(ms)) &&
            !usedThisWeek.has(r.slug)
          );
        }
        if (candidates.length > 0) {
          const pick = candidates[Math.floor(Math.random() * candidates.length)];
          (newPlan[day] as Record<string, string>)[slot] = pick.slug;
          usedThisWeek.add(pick.slug);
          recentSlugs.add(pick.slug);
        }
      }
    }

    saveMealPlan(newPlan);
    const allSlugs = Object.values(newPlan).flatMap(d => Object.values(d as Record<string, string>));
    addToHistory(allSlugs);
    toast({
      title: "Week planned!",
      description: `${allSlugs.length} unique recipes chosen — none repeated from the past 3 months.`,
    });
  }, [toast]);

  // Filter recipes for the picker — by slot type and search term
  const filteredRecipes = (() => {
    const base = activeSelect
      ? recipes.filter(r => r.mealSlots.some((ms: string) => SLOT_CONFIG[activeSelect.slot].mealTypes.includes(ms)))
      : recipes;
    if (!searchTerm.trim()) return base;
    const q = searchTerm.toLowerCase();
    return base.filter(r =>
      r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
    );
  })();

  const filledCount = DAYS.reduce((acc, day) =>
    acc + SLOTS.filter(slot => plan[day]?.[slot as string]).length, 0
  );

  const toggleDay = (day: string) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen py-10 md:py-12 px-4 md:px-10 max-w-[1400px] mx-auto w-full"
    >
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-2 text-primary">The Weekly Canvas</h1>
          <p className="text-muted-foreground tracking-widest uppercase text-xs flex items-center gap-2">
            <Calendar className="w-4 h-4 shrink-0" />
            Plan your week of extraordinary meals
            {filledCount > 0 && (
              <span className="ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px]">
                {filledCount}/{DAYS.length * SLOTS.length} filled
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleAutoPlan}
            data-testid="button-auto-plan"
            className="flex items-center gap-2 bg-primary text-background px-4 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
          >
            <Wand2 className="w-4 h-4" />
            Auto Plan My Week
          </button>
          <button
            onClick={() => setPrintOpen(true)}
            data-testid="button-open-print"
            className="flex items-center gap-2 border border-white/20 text-muted-foreground hover:text-primary hover:border-primary/40 px-4 py-2.5 rounded-full text-sm transition-colors shrink-0"
          >
            <Printer className="w-4 h-4" />
            Print List
          </button>
        </div>
      </div>

      {/* ── Desktop Calendar (lg+): rows = slots, columns = days ── */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Day headers */}
          <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-2 mb-2">
            <div />
            {DAYS.map(day => (
              <div key={day} className="text-center font-display text-base text-primary/80 py-2 border-b border-primary/15">
                <span className="hidden xl:inline">{day}</span>
                <span className="xl:hidden">{day.slice(0, 3)}</span>
              </div>
            ))}
          </div>

          {/* Slot rows */}
          {SLOTS.map(slot => {
            const cfg = SLOT_CONFIG[slot];
            return (
              <div key={slot} className="grid grid-cols-[80px_repeat(7,1fr)] gap-2 mb-2">
                {/* Slot label */}
                <div className={`flex flex-col items-center justify-center gap-1 py-2 ${cfg.color}`}>
                  {cfg.icon}
                  <span className="text-[9px] uppercase tracking-widest opacity-70">{cfg.label}</span>
                </div>
                {/* Cells */}
                {DAYS.map(day => {
                  const slug = plan[day]?.[slot as string];
                  const recipe = slug ? recipes.find(r => r.slug === slug) ?? null : null;
                  return (
                    <SlotCell
                      key={day}
                      day={day}
                      slot={slot}
                      recipe={recipe}
                      onAdd={() => openPicker(day, slot)}
                      onRemove={(e) => handleRemove(e, day, slot)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Tablet Grid (sm–lg): 3-column day grid ── */}
      <div className="hidden sm:grid lg:hidden grid-cols-2 md:grid-cols-3 gap-4">
        {DAYS.map(day => (
          <div key={day} className="flex flex-col gap-2 border border-white/8 rounded-xl p-3">
            <div className="font-display text-base text-primary border-b border-primary/15 pb-2 mb-1">{day}</div>
            {SLOTS.map(slot => {
              const slug = plan[day]?.[slot as string];
              const recipe = slug ? recipes.find(r => r.slug === slug) ?? null : null;
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

      {/* ── Mobile Accordion ── */}
      <div className="flex flex-col gap-3 sm:hidden">
        {DAYS.map(day => {
          const expanded = expandedDays.has(day);
          const dayFilled = SLOTS.filter(slot => plan[day]?.[slot as string]).length;
          return (
            <div key={day} className="border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleDay(day)}
                data-testid={`button-toggle-day-${day}`}
                className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-card/80 transition-colors"
              >
                <span className="font-display text-lg text-primary">{day}</span>
                <div className="flex items-center gap-2">
                  {dayFilled > 0 && (
                    <span className="text-[10px] text-muted-foreground">
                      {dayFilled}/{SLOTS.length}
                    </span>
                  )}
                  {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </button>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-2 p-3">
                      {SLOTS.map(slot => {
                        const slug = plan[day]?.[slot as string];
                        const recipe = slug ? recipes.find(r => r.slug === slug) ?? null : null;
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* ── Recipe Picker Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) setActiveSelect(null);
      }}>
        <DialogTrigger className="hidden" />
        <DialogContent className="bg-background border border-white/10 max-w-2xl w-[90vw] max-h-[85vh] flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl md:text-2xl text-primary text-center capitalize">
              {activeSelect
                ? `${activeSelect.day} — ${SLOT_CONFIG[activeSelect.slot].label}`
                : "Select a recipe"}
            </DialogTitle>
          </DialogHeader>

          <div className="relative my-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search recipes…"
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
                  className="w-16 h-16 object-cover rounded-lg shrink-0"
                />
                <div className="flex flex-col justify-center min-w-0">
                  <div className="text-[9px] uppercase tracking-widest text-primary mb-1">{r.category}</div>
                  <h5 className="font-display text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
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

      {/* ── Print Shopping List Dialog ── */}
      <Dialog open={printOpen} onOpenChange={setPrintOpen}>
        <DialogTrigger className="hidden" />
        <DialogContent className="bg-background border border-white/10 max-w-3xl w-[95vw] max-h-[90vh] flex flex-col p-6 print:hidden">
          <div className="flex-1 overflow-y-auto">
            <PrintView plan={plan} onClose={() => setPrintOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Print-only full-page shopping list ── */}
      <div className="hidden print:block">
        <PrintView plan={plan} onClose={() => {}} />
      </div>
    </motion.div>
  );
}
