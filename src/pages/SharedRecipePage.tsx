import { useMemo, useState } from "react";
import { ArrowLeft, Clock, NotebookPen, TriangleAlert, Users } from "lucide-react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";
import { decodeSharedRecipe } from "@/lib/sharedRecipe";

export function SharedRecipePage() {
  const { locale, addUserRecipe } = useUser();
  const t = dict[locale];
  const [, navigate] = useLocation();
  const [saved, setSaved] = useState(false);
  const recipe = useMemo(() => decodeSharedRecipe(window.location.hash.slice(1)), []);

  if (!recipe) {
    return (
      <Layout showBack section={t.shared.eyebrow}>
        <section className="page-pad py-12 text-center">
          <TriangleAlert size={28} className="mx-auto text-[var(--color-chili)]" />
          <h1 className="display-lg mt-4">{t.shared.invalidTitle}</h1>
          <p className="mt-3 text-sm text-[var(--color-ink-muted)]">{t.shared.invalidBody}</p>
          <button type="button" onClick={() => navigate("/recipes")} className="btn-ghost mt-6 mx-auto">
            <ArrowLeft size={14} /> {t.recipe.backToRecipes}
          </button>
        </section>
      </Layout>
    );
  }

  function save() {
    if (!recipe || saved) return;
    addUserRecipe(recipe);
    setSaved(true);
  }

  return (
    <Layout showBack section={t.shared.eyebrow}>
      <article className="page-pad py-6">
        <p className="eyebrow">{t.shared.eyebrow}</p>
        <h1 className="display-xl mt-2 text-[var(--color-chili)]">{recipe.title}</h1>
        {recipe.subtitle ? <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{recipe.subtitle}</p> : null}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--color-ink-muted)]">
          <span className="inline-flex items-center gap-1.5"><Users size={13} /> {recipe.serves} {t.recipe.servings.toLowerCase()}</span>
          <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {recipe.minutes} {t.recipes.minutes}</span>
        </div>

        {recipe.story ? <p className="mt-5 text-sm leading-relaxed text-[var(--color-ink-soft)]">{recipe.story}</p> : null}

        <section className="mt-6">
          <h2 className="display-md mb-3">{t.recipe.ingredients}</h2>
          <ul className="card-surface px-4 py-2 divide-y divide-black/5">
            {recipe.ingredients.map((ingredient, index) => <li key={index} className="py-2.5 text-sm">{ingredient}</li>)}
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="display-md mb-3">{t.recipe.method}</h2>
          <ol className="space-y-3">
            {recipe.method.map((step, index) => (
              <li key={index} className="card-surface px-4 py-3 flex items-start gap-3">
                <span className="font-display text-xl text-[var(--color-chili)]">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-sm leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <button type="button" onClick={save} disabled={saved} className="btn-primary mt-6 w-full justify-center disabled:opacity-70">
          <NotebookPen size={15} /> {saved ? t.shared.saved : t.shared.save}
        </button>
        {saved ? (
          <button type="button" onClick={() => navigate("/notebook")} className="btn-ghost mt-3 w-full justify-center">
            {t.shared.openNotebook}
          </button>
        ) : null}
      </article>
    </Layout>
  );
}
