import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Layout } from "@/components/Layout";
import { RecipeCard } from "@/components/RecipeCard";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";
import { allRecipesForCalendar } from "@/data/calendar";

const all = allRecipesForCalendar();

export function SearchPage() {
  const { locale } = useUser();
  const t = dict[locale];
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return all.slice(0, 24);
    return all.filter((r) => {
      const text = [
        r.title[locale], r.subtitle[locale], r.origin[locale], r.story[locale],
        r.tags[locale].join(" "),
        r.ingredients.map((i) => i.name[locale]).join(" "),
      ].join(" ").toLowerCase();
      return text.includes(term);
    });
  }, [q, locale]);

  return (
    <Layout section={t.nav.search} showBack>
      <section className="page-pad pt-5">
        <div className="card-surface px-3 py-2.5 flex items-center gap-2">
          <Search size={16} className="text-[var(--color-ink-muted)]" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
            placeholder={t.search.placeholder}
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
        </div>
      </section>

      <section className="page-pad pt-3 text-xs text-[var(--color-ink-muted)]">
        {q ? t.search.results(results.length) : null}
      </section>

      <section className="page-pad pt-3 pb-6 grid grid-cols-2 gap-3">
        {results.length === 0 ? (
          <p className="col-span-full text-center text-sm italic text-[var(--color-ink-muted)] py-10">
            {t.search.empty}
          </p>
        ) : results.map((r) => <RecipeCard key={r.slug} recipe={r} />)}
      </section>
    </Layout>
  );
}
