import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Locale } from "@/i18n";
import type { Allergen, Dietary } from "@/data/recipes";
import { load, save } from "@/lib/storage";

export type UserRecipe = {
  id: string;
  title: string;
  subtitle: string;
  story: string;
  ingredients: string[];
  method: string[];
  serves: number;
  minutes: number;
  createdAt: number;
  forkedFrom?: string;
};

export type PlannerEntry = { dayKey: string; recipeSlug: string };

/** Meal slot for the daily planner. Each day has 4 slots. */
export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";
export const MEAL_SLOTS: MealSlot[] = ["breakfast", "lunch", "dinner", "snack"];

/** New shape: plannerSlots[dayKey][slot] = recipeSlug | undefined. */
export type PlannerDaySlots = Partial<Record<MealSlot, string>>;

type State = {
  locale: Locale;
  zip: string;
  favorites: string[];
  notesByRecipe: Record<string, string>;
  userRecipes: UserRecipe[];
  /** Legacy single-slot per day. Kept for migration; new code uses plannerSlots. */
  planner: Record<string, string>;
  /** Multi-slot per day. Each day has up to 4 slots (breakfast/lunch/dinner/snack). */
  plannerSlots: Record<string, PlannerDaySlots>;
  avoiding: Allergen[];
  dietary: Dietary[];
};

type Actions = {
  setLocale: (l: Locale) => void;
  setZip: (z: string) => void;
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  setNote: (slug: string, note: string) => void;
  getNote: (slug: string) => string;
  addUserRecipe: (r: Omit<UserRecipe, "id" | "createdAt">) => UserRecipe;
  updateUserRecipe: (id: string, r: Partial<UserRecipe>) => void;
  deleteUserRecipe: (id: string) => void;
  /** Legacy single-slot setter. Maps to plannerSlots[dayKey].dinner for back-compat. */
  planDay: (dayKey: string, slug: string | null) => void;
  /** New multi-slot setter. */
  planSlot: (dayKey: string, slot: MealSlot, slug: string | null) => void;
  getSlot: (dayKey: string, slot: MealSlot) => string | null;
  toggleAvoiding: (a: Allergen) => void;
  toggleDietary: (d: Dietary) => void;
  resetFilters: () => void;
};

const Ctx = createContext<(State & Actions) | null>(null);

function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const code = (navigator.language || "en").slice(0, 2).toLowerCase();
  if (code === "es") return "es";
  if (code === "pt") return "pt";
  return "en";
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => load("locale", detectLocale()));
  const [zip, setZip] = useState<string>(() => load("zip", ""));
  const [favorites, setFavorites] = useState<string[]>(() => load("favorites", []));
  const [notesByRecipe, setNotesByRecipe] = useState<Record<string, string>>(() => load("notes", {}));
  const [userRecipes, setUserRecipes] = useState<UserRecipe[]>(() => load("userRecipes", []));
  const [planner, setPlanner] = useState<Record<string, string>>(() => load("planner", {}));
  const [plannerSlots, setPlannerSlots] = useState<Record<string, PlannerDaySlots>>(() => load("plannerSlots", {}));
  const [avoiding, setAvoiding] = useState<Allergen[]>(() => load("avoiding", []));
  const [dietary, setDietary] = useState<Dietary[]>(() => load("dietary", []));

  useEffect(() => { save("locale", locale); document.documentElement.lang = locale; }, [locale]);
  useEffect(() => { save("zip", zip); }, [zip]);
  useEffect(() => { save("favorites", favorites); }, [favorites]);
  useEffect(() => { save("notes", notesByRecipe); }, [notesByRecipe]);
  useEffect(() => { save("userRecipes", userRecipes); }, [userRecipes]);
  useEffect(() => { save("planner", planner); }, [planner]);
  useEffect(() => { save("plannerSlots", plannerSlots); }, [plannerSlots]);
  useEffect(() => { save("avoiding", avoiding); }, [avoiding]);
  useEffect(() => { save("dietary", dietary); }, [dietary]);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);
  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  const setNote = useCallback((slug: string, note: string) => {
    setNotesByRecipe((prev) => {
      const next = { ...prev };
      if (!note.trim()) delete next[slug];
      else next[slug] = note;
      return next;
    });
  }, []);

  const getNote = useCallback((slug: string) => notesByRecipe[slug] ?? "", [notesByRecipe]);

  const addUserRecipe = useCallback((r: Omit<UserRecipe, "id" | "createdAt">) => {
    const created: UserRecipe = { ...r, id: crypto.randomUUID(), createdAt: Date.now() };
    setUserRecipes((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateUserRecipe = useCallback((id: string, r: Partial<UserRecipe>) => {
    setUserRecipes((prev) => prev.map((u) => (u.id === id ? { ...u, ...r } : u)));
  }, []);

  const deleteUserRecipe = useCallback((id: string) => {
    setUserRecipes((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const planDay = useCallback((dayKey: string, slug: string | null) => {
    setPlanner((prev) => {
      const next = { ...prev };
      if (slug === null) delete next[dayKey];
      else next[dayKey] = slug;
      return next;
    });
    // Also write to the new multi-slot map under "dinner" so the new
    // planner UI sees the value.
    setPlannerSlots((prev) => {
      const next = { ...prev };
      const day = { ...(next[dayKey] ?? {}) };
      if (slug === null) {
        delete day.dinner;
      } else {
        day.dinner = slug;
      }
      if (Object.keys(day).length === 0) delete next[dayKey];
      else next[dayKey] = day;
      return next;
    });
  }, []);

  const planSlot = useCallback((dayKey: string, slot: MealSlot, slug: string | null) => {
    setPlannerSlots((prev) => {
      const next = { ...prev };
      const day = { ...(next[dayKey] ?? {}) };
      if (slug === null) {
        delete day[slot];
      } else {
        day[slot] = slug;
      }
      if (Object.keys(day).length === 0) delete next[dayKey];
      else next[dayKey] = day;
      return next;
    });
  }, []);

  const getSlot = useCallback((dayKey: string, slot: MealSlot): string | null => {
    // Prefer the new multi-slot map; fall back to the legacy single-slot
    // map (which we always mirror into "dinner" via planDay).
    return plannerSlots[dayKey]?.[slot] ?? (slot === "dinner" ? planner[dayKey] ?? null : null);
  }, [plannerSlots, planner]);

  const toggleAvoiding = useCallback((a: Allergen) => {
    setAvoiding((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }, []);
  const toggleDietary = useCallback((d: Dietary) => {
    setDietary((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }, []);
  const resetFilters = useCallback(() => {
    setAvoiding([]);
    setDietary([]);
  }, []);

  const value = useMemo(
    () => ({
      locale, zip, favorites, notesByRecipe, userRecipes, planner, plannerSlots, avoiding, dietary,
      setLocale, setZip, toggleFavorite, isFavorite,
      setNote, getNote,
      addUserRecipe, updateUserRecipe, deleteUserRecipe,
      planDay, planSlot, getSlot, toggleAvoiding, toggleDietary, resetFilters,
    }),
    [locale, zip, favorites, notesByRecipe, userRecipes, planner, plannerSlots, avoiding, dietary,
     toggleFavorite, isFavorite, setNote, getNote, addUserRecipe, updateUserRecipe, deleteUserRecipe,
     planDay, planSlot, getSlot, toggleAvoiding, toggleDietary, resetFilters],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUser() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useUser must be used within UserProvider");
  return v;
}

export function useT() {
  const { locale } = useUser();
  return locale;
}
