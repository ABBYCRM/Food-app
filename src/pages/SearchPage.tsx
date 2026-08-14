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
          <Search size={16} className="text-ink-muted shrink-0" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
            placeholder={t.search.placeholder}
            aria-label={t.search.placeholder}
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-ink-muted"
          />
        </div>
      </section>

      <section className="page-pad pt-3 text-xs text-ink-muted tabular">
        {q ? t.search.results(results.length) : null}
      </section>

      <section className="page-pad pt-3 pb-6 grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {results.length === 0 ? (
          <p className="col-span-full text-center text-sm italic text-ink-muted py-10">
            {t.search.empty}
          </p>
        ) : results.map((r) => <RecipeCard key={r.slug} recipe={r} />)}
      </section>
    </Layout>
  );
}
