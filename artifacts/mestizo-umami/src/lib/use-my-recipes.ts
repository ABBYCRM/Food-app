import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "./auth-context";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export interface MyIngredient {
  amount: string;
  ingredient: string;
  note?: string;
}

export interface MyStep {
  step: string;
}

export interface MyRecipe {
  id: string;
  title: string;
  subtitle: string;
  story: string;
  ingredients: MyIngredient[];
  method: MyStep[];
  serves: number;
  minutes: number;
  forkedFrom?: string;
  createdAt: number;
}

export type MyRecipeInput = Omit<MyRecipe, "id" | "createdAt">;

export function useMyRecipes() {
  const { authenticated, authFetch } = useAuthContext();
  const [recipes, setRecipes] = useState<MyRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!authenticated) return;
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${BASE}/api/recipes`);
      if (!res.ok) throw new Error("Failed to load.");
      const data = await res.json();
      setRecipes((data.recipes ?? []) as MyRecipe[]);
    } catch {
      setError("Couldn't load your recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [authenticated, authFetch]);

  useEffect(() => { load(); }, [load]);

  const create = useCallback(async (input: MyRecipeInput): Promise<MyRecipe> => {
    const res = await authFetch(`${BASE}/api/recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Failed to create recipe.");
    const recipe = data.recipe as MyRecipe;
    setRecipes(prev => [recipe, ...prev]);
    return recipe;
  }, [authFetch]);

  const update = useCallback(async (id: string, input: Partial<MyRecipeInput>): Promise<MyRecipe> => {
    const res = await authFetch(`${BASE}/api/recipes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Failed to update recipe.");
    const recipe = data.recipe as MyRecipe;
    setRecipes(prev => prev.map(r => r.id === id ? recipe : r));
    return recipe;
  }, [authFetch]);

  const remove = useCallback(async (id: string): Promise<void> => {
    const res = await authFetch(`${BASE}/api/recipes/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Failed to delete recipe.");
    }
    setRecipes(prev => prev.filter(r => r.id !== id));
  }, [authFetch]);

  return { recipes, loading, error, reload: load, create, update, remove };
}
