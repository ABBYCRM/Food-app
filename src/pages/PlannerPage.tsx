import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Plus, X, ShoppingCart, ExternalLink } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PaywallModal } from "@/components/PaywallModal";
import { useUser } from "@/context/UserContext";
import { useTrial } from "@/context/TrialContext";
import { dict } from "@/i18n";
import { allRecipesForCalendar } from "@/data/calendar";
import { consolidateForWeek, openMany, retailerUrl, type Retailer } from "@/lib/shopping";
import { SafeImage } from "@/components/SafeImage";

const ALL = allRecipesForCalendar();

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = x.getDay() || 7; // Monday=1, Sunday=7
  if (day !== 1) x.setDate(x.getDate() - (day - 1));
  x.setHours(0, 0, 0, 0);
  return x;
}

function fmtMD(d: Date, locale: string) {
  return d.toLocaleDateString(locale === "pt" ? "pt-BR" : locale === "es" ? "es-MX" : "en-US", {
    month: "short", day: "numeric",
  });
}

export function PlannerPage() {
  const { locale, planner, planDay, zip } = useUser();
  const { canWrite } = useTrial();
  const [, navigate] = useLocation();
  const t = dict[locale];
  const [pickingDay, setPickingDay] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [paywallOpen, setPaywallOpen] = useState(false);

  const week = useMemo(() => {
    const start = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return { date: d, key: d.toISOString().slice(0, 10) };
    });
  }, []);

  const dayNames = [t.planner.day.mon, t.planner.day.tue, t.planner.day.wed, t.planner.day.thu, t.planner.day.fri, t.planner.day.sat, t.planner.day.sun];

  const plannedRecipes = useMemo(() => {
    return week
      .map((d) => planner[d.key])
      .filter(Boolean)
      .map((slug) => ALL.find((r) => r.slug === slug)!)
      .filter(Boolean);
  }, [week, planner]);

  const consolidated = useMemo(() => consolidateForWeek(plannedRecipes, locale), [plannedRecipes, locale]);

  const filteredPicker = useMemo(() => {
    if (!query) return ALL.slice(0, 36);
    const q = query.toLowerCase();
    return ALL.filter((r) => r.title[locale].toLowerCase().includes(q) || r.subtitle[locale].toLowerCase().includes(q)).slice(0, 36);
  }, [query, locale]);

  function openConsolidated(retailer: Retailer) {
    const urls = consolidated.map((c) => retailerUrl(retailer, c.query, zip));
    openMany(urls);
  }

  const requireWrite = (action: () => void) => {
    if (!canWrite) {
      setPaywallOpen(true);
      return;
    }
    action();
  };

  return (
    <Layout section={t.nav.planner}>
      {!canWrite ? (
        <section className="page-pad pt-5">
          <div className="card-surface px-4 py-4 flex items-start gap-3 border-l-4 !border-l-corn">
            <ShoppingCart size={16} className="text-corn mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
                🔒 Subscribe to plan
              </div>
              <p className="text-xs text-ink-muted leading-snug mt-0.5">
                The weekly planner, consolidated shopping list, and bookmarking are part of the Pro plan.
                You can still browse all recipes — pick one from a meal row on the home page.
              </p>
              <button
                type="button"
                onClick={() => setPaywallOpen(true)}
                className="btn btn-primary btn-sm mt-2.5"
              >
                Unlock planner
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="page-pad pt-5">
        <div className="eyebrow">{t.planner.week} {fmtMD(week[0].date, locale)} – {fmtMD(week[6].date, locale)}</div>
        <h1 className="display-lg mt-2">{t.planner.title}</h1>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed">{t.planner.subtitle}</p>
      </section>

      <section className="page-pad pt-5 space-y-2">
        {week.map((d, i) => {
          const slug = planner[d.key];
          const r = slug ? ALL.find((x) => x.slug === slug) : null;
          return (
            <article key={d.key} className="card-surface px-4 py-3 flex items-center gap-3">
              <div className="text-center w-12 shrink-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">{dayNames[i]}</div>
                <div className="font-display text-xl leading-none mt-1 tabular">{d.date.getDate()}</div>
              </div>
              {r ? (
                <button type="button" onClick={() => navigate(`/recipe/${r.slug}`)} className="flex-1 text-left flex items-center gap-3 min-w-0">
                  <SafeImage
                    src={r.thumb}
                    recipeSlug={r.slug}
                    fallbackSize="thumb"
                    preferArt
                    alt=""
                    className="w-12 h-12 rounded-input object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold leading-tight truncate">{r.title[locale]}</div>
                    <div className="text-[11px] text-ink-muted truncate">{r.origin[locale]}</div>
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => requireWrite(() => setPickingDay(d.key))}
                  className="flex-1 text-left text-sm text-ink-muted italic"
                >
                  {t.planner.empty}
                </button>
              )}
              <div className="flex items-center gap-1">
                {r ? (
                  <button
                    type="button"
                    onClick={() => requireWrite(() => planDay(d.key, null))}
                    aria-label={t.planner.clearDay}
                    className="p-1.5 rounded-pill hover:bg-ink/[0.06] text-ink-muted"
                  >
                    <X size={15} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => requireWrite(() => setPickingDay(d.key))}
                    aria-label={t.planner.addRecipe}
                    className="p-1.5 rounded-pill bg-chili text-white"
                  >
                    <Plus size={15} />
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {/* Consolidated shopping */}
      <section className="page-pad pt-6">
        <div className="card-surface px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="eyebrow flex items-center gap-2"><ShoppingCart size={12} /> {t.shopping.consolidated}</div>
              <p className="text-xs text-ink-muted mt-1">{t.shopping.items(consolidated.length)}</p>
            </div>
          </div>
          {consolidated.length === 0 ? (
            <p className="text-sm text-ink-muted italic">{t.planner.empty}</p>
          ) : (
            <>
              <ul className="space-y-1 max-h-64 overflow-auto pr-1">
                {consolidated.map((c) => (
                  <li key={c.query} className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-input bg-ink/[0.04]">
                    <span className="text-sm">{c.display}</span>
                    <span className="text-[10px] text-ink-muted tabular">×{c.sources.length}</span>
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => openConsolidated("instacart")} className="btn btn-primary !py-2.5 !text-sm">
                  {t.shopping.openOnInstacart} <ExternalLink size={13} />
                </button>
                <button type="button" onClick={() => openConsolidated("amazonFresh")} className="btn btn-teal !py-2.5 !text-sm">
                  {t.shopping.openOnAmazon} <ExternalLink size={13} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Picker modal */}
      {pickingDay !== null ? (
        <div className="fixed inset-0 z-modal bg-ink/55 backdrop-blur-sm grid place-items-center px-4" role="dialog" aria-modal="true" aria-label={t.planner.picker}>
          <div className="max-w-[420px] w-full bg-bone-50 rounded-card-lg overflow-hidden flex flex-col max-h-[80vh] card-surface">
            <div className="px-4 py-3 border-b border-line-soft flex items-center justify-between">
              <div className="font-display text-lg">{t.planner.picker}</div>
              <button type="button" onClick={() => setPickingDay(null)} className="p-1 rounded-pill hover:bg-ink/[0.06]" aria-label={t.common.cancel}>
                <X size={16} />
              </button>
            </div>
            <div className="p-3 border-b border-line-soft">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                placeholder={t.search.placeholder}
                className="input !text-sm"
              />
            </div>
            <ul className="flex-1 overflow-auto px-2 py-2">
              {filteredPicker.map((r) => (
                <li key={r.slug}>
                  <button
                    type="button"
                    onClick={() => { planDay(pickingDay, r.slug); setPickingDay(null); setQuery(""); }}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-input hover:bg-ink/[0.05] text-left"
                  >
                    <SafeImage
                      src={r.thumb}
                      recipeSlug={r.slug}
                      fallbackSize="thumb"
                      preferArt
                      alt=""
                      className="w-10 h-10 rounded-md object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{r.title[locale]}</div>
                      <div className="text-[11px] text-ink-muted truncate">{r.origin[locale]}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <section className="py-6" />
      {paywallOpen ? <PaywallModal force onClose={() => setPaywallOpen(false)} /> : null}
    </Layout>
  );
}
