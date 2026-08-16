import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical, Clock, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { MyRecipe, MyRecipeInput, MyIngredient, MyStep } from "@/lib/use-my-recipes";

interface RecipeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe?: MyRecipe | null;
  onSave: (input: MyRecipeInput) => Promise<void>;
}

function emptyIngredient(): MyIngredient {
  return { amount: "", ingredient: "", note: "" };
}
function emptyStep(): MyStep {
  return { step: "" };
}

export function RecipeForm({ open, onOpenChange, recipe, onSave }: RecipeFormProps) {
  const isEdit = Boolean(recipe);

  // ── Form state ────────────────────────────────────────────────────────────
  const [title, setTitle]       = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [story, setStory]       = useState("");
  const [serves, setServes]     = useState(2);
  const [minutes, setMinutes]   = useState(30);
  const [ingredients, setIngredients] = useState<MyIngredient[]>([emptyIngredient()]);
  const [steps, setSteps]       = useState<MyStep[]>([emptyStep()]);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);

  // Populate when editing
  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title);
      setSubtitle(recipe.subtitle ?? "");
      setStory(recipe.story ?? "");
      setServes(recipe.serves);
      setMinutes(recipe.minutes);
      setIngredients(recipe.ingredients.length ? recipe.ingredients : [emptyIngredient()]);
      setSteps(recipe.method.length ? recipe.method : [emptyStep()]);
    } else {
      setTitle(""); setSubtitle(""); setStory("");
      setServes(2); setMinutes(30);
      setIngredients([emptyIngredient()]);
      setSteps([emptyStep()]);
    }
    setError(null);
  }, [recipe, open]);

  // ── Ingredient helpers ────────────────────────────────────────────────────
  const setIngredient = (i: number, field: keyof MyIngredient, val: string) =>
    setIngredients(prev => prev.map((row, idx) => idx === i ? { ...row, [field]: val } : row));
  const addIngredient    = () => setIngredients(prev => [...prev, emptyIngredient()]);
  const removeIngredient = (i: number) =>
    setIngredients(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);

  const moveIngredient = (i: number, dir: -1 | 1) => {
    setIngredients(prev => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  // ── Step helpers ──────────────────────────────────────────────────────────
  const setStep = (i: number, val: string) =>
    setSteps(prev => prev.map((row, idx) => idx === i ? { step: val } : row));
  const addStep    = () => setSteps(prev => [...prev, emptyStep()]);
  const removeStep = (i: number) =>
    setSteps(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);
  const moveStep = (i: number, dir: -1 | 1) => {
    setSteps(prev => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validIngredients = ingredients.filter(r => r.ingredient.trim());
    const validSteps       = steps.filter(s => s.step.trim());

    if (!title.trim()) { setError("Recipe name is required."); return; }
    if (validIngredients.length === 0) { setError("Add at least one ingredient."); return; }
    if (validSteps.length === 0) { setError("Add at least one method step."); return; }

    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        subtitle: subtitle.trim(),
        story: story.trim(),
        serves,
        minutes,
        ingredients: validIngredients,
        method: validSteps,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl bg-[#111] border-l border-white/10 overflow-y-auto p-0 flex flex-col"
      >
        <SheetHeader className="sticky top-0 bg-[#111] z-10 px-6 pt-6 pb-4 border-b border-white/10">
          <SheetTitle className="font-display text-2xl text-foreground">
            {isEdit ? "Edit Recipe" : "Write a Recipe"}
          </SheetTitle>
          <p className="text-xs tracking-widest uppercase text-muted-foreground">
            {isEdit ? "Update your personal recipe" : "Your recipe — your rules"}
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

            {/* ── The Dish ── */}
            <section>
              <h3 className="text-[10px] tracking-widest uppercase text-primary mb-4">The Dish</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Name *</label>
                  <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Miso Short Rib Tacos"
                    className="bg-white/5 border-white/10 text-foreground placeholder:text-white/25 focus:border-primary"
                    maxLength={200}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Tagline</label>
                  <Input
                    value={subtitle}
                    onChange={e => setSubtitle(e.target.value)}
                    placeholder="A one-liner that sells it"
                    className="bg-white/5 border-white/10 text-foreground placeholder:text-white/25 focus:border-primary"
                    maxLength={300}
                  />
                </div>
              </div>
            </section>

            {/* ── Serves + Time ── */}
            <section>
              <h3 className="text-[10px] tracking-widest uppercase text-primary mb-4">Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3 h-3" /> Serves
                  </label>
                  <Input
                    type="number" min={1} max={50}
                    value={serves}
                    onChange={e => setServes(Math.max(1, parseInt(e.target.value) || 1))}
                    className="bg-white/5 border-white/10 text-foreground focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Minutes
                  </label>
                  <Input
                    type="number" min={1} max={2000}
                    value={minutes}
                    onChange={e => setMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                    className="bg-white/5 border-white/10 text-foreground focus:border-primary"
                  />
                </div>
              </div>
            </section>

            {/* ── Story ── */}
            <section>
              <h3 className="text-[10px] tracking-widest uppercase text-primary mb-4">Story & Notes</h3>
              <Textarea
                value={story}
                onChange={e => setStory(e.target.value)}
                placeholder="Where did this come from? What makes it special? Tips for next time..."
                className="bg-white/5 border-white/10 text-foreground placeholder:text-white/25 focus:border-primary min-h-[100px] resize-none"
                maxLength={5000}
              />
            </section>

            {/* ── Ingredients ── */}
            <section>
              <h3 className="text-[10px] tracking-widest uppercase text-primary mb-4">
                Ingredients
                <span className="text-white/30 normal-case ml-2 font-sans text-[10px]">
                  ({ingredients.filter(r => r.ingredient.trim()).length} added)
                </span>
              </h3>
              <div className="space-y-2">
                {ingredients.map((row, i) => (
                  <div key={i} className="flex items-start gap-2 group">
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5 pt-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveIngredient(i, -1)}
                        disabled={i === 0}
                        className="text-white/20 hover:text-white/60 disabled:opacity-0 transition-colors"
                        aria-label="Move up"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveIngredient(i, 1)}
                        disabled={i === ingredients.length - 1}
                        className="text-white/20 hover:text-white/60 disabled:opacity-0 transition-colors"
                        aria-label="Move down"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                    <Input
                      value={row.amount}
                      onChange={e => setIngredient(i, "amount", e.target.value)}
                      placeholder="2 tbsp"
                      className="bg-white/5 border-white/10 text-foreground placeholder:text-white/20 focus:border-primary w-24 shrink-0 text-sm"
                    />
                    <Input
                      value={row.ingredient}
                      onChange={e => setIngredient(i, "ingredient", e.target.value)}
                      placeholder="white miso"
                      className="bg-white/5 border-white/10 text-foreground placeholder:text-white/20 focus:border-primary flex-1 text-sm"
                    />
                    <Input
                      value={row.note ?? ""}
                      onChange={e => setIngredient(i, "note", e.target.value)}
                      placeholder="note"
                      className="bg-white/5 border-white/10 text-foreground placeholder:text-white/20 focus:border-primary w-28 shrink-0 text-sm hidden sm:block"
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(i)}
                      className="p-2 text-white/20 hover:text-destructive transition-colors shrink-0 mt-0.5"
                      aria-label="Remove ingredient"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addIngredient}
                className="mt-3 text-primary hover:text-primary/80 hover:bg-primary/10 gap-1.5 pl-0 text-xs uppercase tracking-widest"
              >
                <Plus className="w-3.5 h-3.5" /> Add Ingredient
              </Button>
            </section>

            {/* ── Method ── */}
            <section>
              <h3 className="text-[10px] tracking-widest uppercase text-primary mb-4">
                Method
                <span className="text-white/30 normal-case ml-2 font-sans text-[10px]">
                  ({steps.filter(s => s.step.trim()).length} steps)
                </span>
              </h3>
              <div className="space-y-3">
                {steps.map((row, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="flex flex-col gap-0.5 pt-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveStep(i, -1)}
                        disabled={i === 0}
                        className="text-white/20 hover:text-white/60 disabled:opacity-0 transition-colors"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStep(i, 1)}
                        disabled={i === steps.length - 1}
                        className="text-white/20 hover:text-white/60 disabled:opacity-0 transition-colors"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-[10px] text-muted-foreground shrink-0 mt-3">
                      {i + 1}
                    </div>
                    <Textarea
                      value={row.step}
                      onChange={e => setStep(i, e.target.value)}
                      placeholder={`Step ${i + 1} — describe what to do, what it should look like, how long it takes…`}
                      className="bg-white/5 border-white/10 text-foreground placeholder:text-white/20 focus:border-primary flex-1 resize-none min-h-[72px] text-sm leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={() => removeStep(i)}
                      className="p-2 text-white/20 hover:text-destructive transition-colors shrink-0 mt-2.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addStep}
                className="mt-3 text-primary hover:text-primary/80 hover:bg-primary/10 gap-1.5 pl-0 text-xs uppercase tracking-widest"
              >
                <Plus className="w-3.5 h-3.5" /> Add Step
              </Button>
            </section>

          </div>

          {/* ── Footer ── */}
          <div className="sticky bottom-0 bg-[#111] border-t border-white/10 px-6 py-4 flex items-center gap-3">
            {error && (
              <p className="text-destructive text-xs flex-1">{error}</p>
            )}
            <div className="flex gap-3 ml-auto">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest px-6"
              >
                {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Recipe"}
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
