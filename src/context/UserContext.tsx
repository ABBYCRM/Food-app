import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "@/i18n";
import type { Allergen, Dietary } from "@/data/recipes";
import { clearLegacyUserStorage, loadLocale, saveLocale } from "@/lib/storage";
import { useAuth } from "./AuthContext";

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

type Workspace = {
  locale: Locale;
  zip: string;
  favorites: string[];
  notesByRecipe: Record<string, string>;
  planner: Record<string, string>;
  avoiding: Allergen[];
  dietary: Dietary[];
};

type State = Workspace & {
  userRecipes: UserRecipe[];
  syncError: string | null;
};

type Actions = {
  setLocale: (locale: Locale) => void;
  setZip: (zip: string) => void;
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  setNote: (slug: string, note: string) => void;
  getNote: (slug: string) => string;
  addUserRecipe: (recipe: Omit<UserRecipe, "id" | "createdAt">) => UserRecipe;
  updateUserRecipe: (id: string, recipe: Partial<UserRecipe>) => void;
  deleteUserRecipe: (id: string) => void;
  planDay: (dayKey: string, slug: string | null) => void;
  toggleAvoiding: (allergen: Allergen) => void;
  toggleDietary: (dietary: Dietary) => void;
  resetFilters: () => void;
  exportData: () => Promise<string>;
  importData: (json: string) => Promise<boolean>;
};

const Context = createContext<(State & Actions) | null>(null);

function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const code = (navigator.language || "en").slice(0, 2).toLowerCase();
  return code === "es" || code === "pt" ? code : "en";
}

const initialWorkspace: Workspace = {
  locale: "en",
  zip: "",
  favorites: [],
  notesByRecipe: {},
  planner: {},
  avoiding: [],
  dietary: [],
};

async function responseError(response: Response) {
  const body = await response.json().catch(() => null) as { error?: unknown } | null;
  return typeof body?.error === "string" ? body.error : `Request failed (${response.status})`;
}

function recipePayload(recipe: Omit<UserRecipe, "id" | "createdAt"> | Partial<UserRecipe>) {
  return {
    ...(recipe.title !== undefined ? { title: recipe.title } : {}),
    ...(recipe.subtitle !== undefined ? { subtitle: recipe.subtitle } : {}),
    ...(recipe.story !== undefined ? { story: recipe.story } : {}),
    ...(recipe.ingredients !== undefined ? { ingredients: recipe.ingredients } : {}),
    ...(recipe.method !== undefined ? { method: recipe.method } : {}),
    ...(recipe.serves !== undefined ? { serves: recipe.serves } : {}),
    ...(recipe.minutes !== undefined ? { minutes: recipe.minutes } : {}),
    ...(recipe.forkedFrom !== undefined ? { forkedFrom: recipe.forkedFrom } : {}),
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const { apiFetch } = useAuth();
  const localLocale = loadLocale(detectLocale());
  const [locale, setLocale] = useState<Locale>(localLocale);
  const [zip, setZip] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notesByRecipe, setNotesByRecipe] = useState<Record<string, string>>({});
  const [userRecipes, setUserRecipes] = useState<UserRecipe[]>([]);
  const [planner, setPlanner] = useState<Record<string, string>>({});
  const [avoiding, setAvoiding] = useState<Allergen[]>([]);
  const [dietary, setDietary] = useState<Dietary[]>([]);
  const [hydration, setHydration] = useState<"loading" | "ready" | "error">("loading");
  const [syncError, setSyncError] = useState<string | null>(null);
  const workspaceRef = useRef<Workspace>({ ...initialWorkspace, locale: localLocale });

  const applyWorkspace = useCallback((workspace: Workspace) => {
    setLocale(workspace.locale);
    setZip(workspace.zip);
    setFavorites(workspace.favorites);
    setNotesByRecipe(workspace.notesByRecipe);
    setPlanner(workspace.planner);
    setAvoiding(workspace.avoiding);
    setDietary(workspace.dietary);
  }, []);

  const hydrate = useCallback(async () => {
    setHydration("loading");
    setSyncError(null);
    try {
      const [workspaceResponse, recipesResponse] = await Promise.all([
        apiFetch("/api/workspace"),
        apiFetch("/api/recipes"),
      ]);
      if (!workspaceResponse.ok) throw new Error(await responseError(workspaceResponse));
      if (!recipesResponse.ok) throw new Error(await responseError(recipesResponse));
      const workspaceBody = await workspaceResponse.json() as { document: Workspace };
      const recipesBody = await recipesResponse.json() as { recipes: UserRecipe[] };
      applyWorkspace(workspaceBody.document);
      setUserRecipes(recipesBody.recipes);
      clearLegacyUserStorage();
      setHydration("ready");
    } catch (reason) {
      setSyncError(reason instanceof Error ? reason.message : "Your account data could not be loaded");
      setHydration("error");
    }
  }, [apiFetch, applyWorkspace]);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    saveLocale(locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const workspace = useMemo<Workspace>(() => ({
    locale, zip, favorites, notesByRecipe, planner, avoiding, dietary,
  }), [locale, zip, favorites, notesByRecipe, planner, avoiding, dietary]);
  workspaceRef.current = workspace;

  useEffect(() => {
    if (hydration !== "ready") return;
    const timeout = window.setTimeout(() => {
      void apiFetch("/api/workspace", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workspace),
      }).then(async (response) => {
        if (!response.ok) throw new Error(await responseError(response));
        setSyncError(null);
      }).catch((reason) => {
        setSyncError(reason instanceof Error ? reason.message : "Changes could not be saved");
      });
    }, 450);
    return () => window.clearTimeout(timeout);
  }, [apiFetch, hydration, workspace]);

  useEffect(() => {
    if (hydration !== "ready") return;
    const flush = () => {
      void apiFetch("/api/workspace", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workspaceRef.current),
        keepalive: true,
      });
    };
    window.addEventListener("pagehide", flush);
    return () => window.removeEventListener("pagehide", flush);
  }, [apiFetch, hydration]);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((previous) => previous.includes(slug)
      ? previous.filter((value) => value !== slug)
      : [...previous, slug]);
  }, []);
  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  const setNote = useCallback((slug: string, note: string) => {
    setNotesByRecipe((previous) => {
      const next = { ...previous };
      if (!note.trim()) delete next[slug];
      else next[slug] = note;
      return next;
    });
  }, []);
  const getNote = useCallback((slug: string) => notesByRecipe[slug] ?? "", [notesByRecipe]);

  const addUserRecipe = useCallback((recipe: Omit<UserRecipe, "id" | "createdAt">) => {
    const optimistic: UserRecipe = { ...recipe, id: crypto.randomUUID(), createdAt: Date.now() };
    setUserRecipes((previous) => [optimistic, ...previous]);
    void apiFetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipePayload(recipe)),
    }).then(async (response) => {
      if (!response.ok) throw new Error(await responseError(response));
      const body = await response.json() as { recipe: UserRecipe };
      setUserRecipes((previous) => previous.map((item) => item.id === optimistic.id ? body.recipe : item));
      setSyncError(null);
    }).catch((reason) => {
      setUserRecipes((previous) => previous.filter((item) => item.id !== optimistic.id));
      setSyncError(reason instanceof Error ? reason.message : "Recipe could not be saved");
    });
    return optimistic;
  }, [apiFetch]);

  const updateUserRecipe = useCallback((id: string, changes: Partial<UserRecipe>) => {
    let original: UserRecipe | undefined;
    setUserRecipes((previous) => previous.map((item) => {
      if (item.id !== id) return item;
      original = item;
      return { ...item, ...changes, id: item.id, createdAt: item.createdAt };
    }));
    void apiFetch(`/api/recipes/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipePayload(changes)),
    }).then(async (response) => {
      if (!response.ok) throw new Error(await responseError(response));
      const body = await response.json() as { recipe: UserRecipe };
      setUserRecipes((previous) => previous.map((item) => item.id === id ? body.recipe : item));
      setSyncError(null);
    }).catch((reason) => {
      if (original) setUserRecipes((previous) => previous.map((item) => item.id === id ? original! : item));
      setSyncError(reason instanceof Error ? reason.message : "Recipe changes could not be saved");
    });
  }, [apiFetch]);

  const deleteUserRecipe = useCallback((id: string) => {
    let original: UserRecipe | undefined;
    setUserRecipes((previous) => {
      original = previous.find((item) => item.id === id);
      return previous.filter((item) => item.id !== id);
    });
    void apiFetch(`/api/recipes/${encodeURIComponent(id)}`, { method: "DELETE" })
      .then(async (response) => {
        if (!response.ok) throw new Error(await responseError(response));
        setSyncError(null);
      })
      .catch((reason) => {
        if (original) setUserRecipes((previous) => [original!, ...previous]);
        setSyncError(reason instanceof Error ? reason.message : "Recipe could not be deleted");
      });
  }, [apiFetch]);

  const planDay = useCallback((dayKey: string, slug: string | null) => {
    setPlanner((previous) => {
      const next = { ...previous };
      if (slug === null) delete next[dayKey];
      else next[dayKey] = slug;
      return next;
    });
  }, []);
  const toggleAvoiding = useCallback((allergen: Allergen) => {
    setAvoiding((previous) => previous.includes(allergen)
      ? previous.filter((value) => value !== allergen)
      : [...previous, allergen]);
  }, []);
  const toggleDietary = useCallback((value: Dietary) => {
    setDietary((previous) => previous.includes(value)
      ? previous.filter((item) => item !== value)
      : [...previous, value]);
  }, []);
  const resetFilters = useCallback(() => {
    setAvoiding([]);
    setDietary([]);
  }, []);

  const exportData = useCallback(async () => {
    const response = await apiFetch("/api/data/export");
    if (!response.ok) throw new Error(await responseError(response));
    return JSON.stringify(await response.json(), null, 2);
  }, [apiFetch]);

  const importData = useCallback(async (json: string) => {
    let parsed: unknown;
    try { parsed = JSON.parse(json); }
    catch { return false; }
    const response = await apiFetch("/api/data/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });
    if (!response.ok) {
      setSyncError(await responseError(response));
      return false;
    }
    await hydrate();
    return true;
  }, [apiFetch, hydrate]);

  const value = useMemo(() => ({
    locale, zip, favorites, notesByRecipe, userRecipes, planner, avoiding, dietary, syncError,
    setLocale, setZip, toggleFavorite, isFavorite, setNote, getNote,
    addUserRecipe, updateUserRecipe, deleteUserRecipe, planDay,
    toggleAvoiding, toggleDietary, resetFilters, exportData, importData,
  }), [
    locale, zip, favorites, notesByRecipe, userRecipes, planner, avoiding, dietary, syncError,
    toggleFavorite, isFavorite, setNote, getNote, addUserRecipe, updateUserRecipe,
    deleteUserRecipe, planDay, toggleAvoiding, toggleDietary, resetFilters, exportData, importData,
  ]);

  if (hydration === "loading") {
    return <div className="gate-page"><div className="gate-card"><p className="eyebrow">Mestizo Umami</p><p className="mt-3 text-sm">Loading your private kitchen…</p></div></div>;
  }
  if (hydration === "error") {
    return (
      <div className="gate-page">
        <div className="gate-card">
          <p className="eyebrow">Account data</p>
          <h1 className="display-lg mt-2">Your kitchen data could not load.</h1>
          <p role="alert" className="gate-copy">{syncError}</p>
          <button type="button" onClick={() => void hydrate()} className="btn-primary mt-6 mx-auto">Try again</button>
        </div>
      </div>
    );
  }

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useUser() {
  const value = useContext(Context);
  if (!value) throw new Error("useUser must be used within UserProvider");
  return value;
}

export function useT() {
  return useUser().locale;
}
