import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Plus, X, ShoppingCart, ExternalLink, Coffee, Sun, Moon, Cookie } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PaywallModal } from "@/components/PaywallModal";
import { SafeImage } from "@/components/SafeImage";
import { useUser, type MealSlot, MEAL_SLOTS } from "@/context/UserContext";
import { useTrial } from "@/context/TrialContext";
import { dict } from "@/i18n";
import { allRecipesForCalendar } from "@/data/calendar";
import { consolidateForWeek, instacartShoppingListUrl, openMany, retailerUrl, type Retailer } from "@/lib/shopping";
import { cn } from "@/lib/cn";
import { localDateKey } from "@/lib/date";

const ALL = allRecipesForCalendar();

const SLOT_ICON: Record<MealSlot, typeof Coffee> = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Cookie,
};

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
  const { locale, getSlot, planSlot, zip } = useUser();
  const { canWrite } = useTrial();
  const [, navigate] = useLocation();
  const t = dict[locale];
  const [picking, setPicking] = useState<{ dayKey: string; slot: MealSlot } | null>(null);
  const [query, setQuery] = useState("");
  const [paywallOpen, setPaywallOpen] = useState(false);

  const week = useMemo(() => {
    const start = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return { date: d, key: localDateKey(d) };
    });
  }, []);

  const dayNames = [t.planner.day.mon, t.planner.day.tue, t.planner.day.wed, t.planner.day.thu, t.planner.day.fri, t.planner.day.sat, t.planner.day.sun];

  /** Flatten all planned slugs across all days × slots for the consolidated list. */
  const plannedRecipes = useMemo(() => {
    const all: { slug: string; count: number }[] = [];
    for (const d of week) {
      for (const slot of MEAL_SLOTS) {
        const slug = getSlot(d.key, slot);
        if (!slug) continue;
        const existing = all.find((p) => p.slug === slug);
        if (existing) existing.count += 1;
        else all.push({ slug, count: 1 });
      }
    }
    return all
      .map((p) => ({ slug: p.slug, count: p.count, r: ALL.find((x) => x.slug === p.slug)! }))
      .filter((p) => p.r)
      .flatMap((p) => Array(p.count).fill(p.r));
  }, [week, getSlot]);

  const consolidated = useMemo(() => consolidateForWeek(plannedRecipes, locale), [plannedRecipes, locale]);

  const filteredPicker = useMemo(() => {
    if (!query) return ALL.slice(0, 36);
    const q = query.toLowerCase();
    return ALL.filter((r) => r.title[locale].toLowerCase().includes(q) || r.subtitle[locale].toLowerCase().includes(q)).slice(0, 36);
  }, [query, locale]);

  function openConsolidated(retailer: Retailer) {
    /* Instacart gets the Shopping List deep-link so the user lands on a
       single tab with every ingredient pre-added. Opening 11 separate
       Instacart tabs triggers Chrome's popup blocker. */
    if (retailer === "instacart") {
      const url = instacartShoppingListUrl(
        consolidated.map((c) => c.query),
        zip
      );
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
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

      {/* Day cards, each with 4 meal slots */}
      <section className="page-pad pt-5 space-y-3">
        {week.map((d, i) => {
          return (
            <article key={d.key} className="card-surface px-3 py-3 sm:px-4 sm:py-3.5">
              {/* Day header */}
              <div className="flex items-center gap-3 mb-2.5">
                <div className="text-center w-10 shrink-0">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">{dayNames[i]}</div>
                  <div className="font-display text-xl leading-none mt-0.5 tabular">{d.date.getDate()}</div>
                </div>
                <div className="flex-1 flex flex-wrap items-center gap-1.5">
                  {MEAL_SLOTS.map((slot) => {
                    const slug = getSlot(d.key, slot);
                    return (
                      <span
                        key={slot}
                        className={cn(
                          "inline-flex items-center justify-center gap-1 px-2 py-1 rounded-pill text-[10px] leading-tight text-center font-semibold uppercase tracking-[0.08em] whitespace-normal",
                          slug
                            ? slot === "breakfast" ? "bg-corn/20 text-corn-600"
                            : slot === "lunch" ? "bg-jade/15 text-jade-600"
                            : slot === "dinner" ? "bg-chili/15 text-chili-600"
                            : "bg-teal/15 text-teal-600"
                            : "bg-ink/[0.04] text-ink-muted"
                        )}
                      >
                        {t.planner.slotShort[slot]}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Slots grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MEAL_SLOTS.map((slot) => {
                  const slug = getSlot(d.key, slot);
                  const r = slug ? ALL.find((x) => x.slug === slug) : null;
                  const Icon = SLOT_ICON[slot];
                  return (
                    <div
                      key={slot}
                      className={cn(
                        "flex items-center gap-2.5 rounded-input px-2.5 py-2",
                        r ? "bg-ink/[0.04]" : "border border-dashed border-line"
                      )}
                    >
                      <span
                        className={cn(
                          "w-7 h-7 grid place-items-center rounded-pill shrink-0",
                          slot === "breakfast" ? "bg-corn/20 text-corn-600"
                          : slot === "lunch" ? "bg-jade/15 text-jade-600"
                          : slot === "dinner" ? "bg-chili/15 text-chili-600"
                          : "bg-teal/15 text-teal-600"
                        )}
                        aria-hidden="true"
                      >
                        <Icon size={13} />
                      </span>
                      {r ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/recipe/${r.slug}`)}
                          className="flex-1 min-w-0 flex items-center gap-2.5 text-left rounded-md hover:text-chili"
                          aria-label={`${t.planner.slot[slot]}: ${r.title[locale]}`}
                        >
                          <span className="flex-1 min-w-0">
                            <span className="block text-[10px] uppercase tracking-[0.1em] text-ink-muted font-semibold">
                              {t.planner.slot[slot]}
                            </span>
                            <span className="block text-sm font-medium leading-snug break-words">
                              {r.title[locale]}
                            </span>
                          </span>
                          <SafeImage
                            src={r.thumb}
                            recipeSlug={r.slug}
                            fallbackSize="thumb"
                            alt={r.title[locale]}
                            className="w-11 h-11 rounded-md object-cover shrink-0"
                          />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => requireWrite(() => setPicking({ dayKey: d.key, slot }))}
                          className="flex-1 min-w-0 text-left hover:text-chili"
                        >
                          <span className="block text-[10px] uppercase tracking-[0.1em] text-ink-muted font-semibold">
                            {t.planner.slot[slot]}
                          </span>
                          <span className="block text-xs italic text-ink-muted leading-snug">
                            {t.planner.emptySlot.replace("{slot}", t.planner.slot[slot].toLowerCase())}
                          </span>
                        </button>
                      )}
                      {r ? (
                        <button
                          type="button"
                          onClick={() => requireWrite(() => planSlot(d.key, slot, null))}
                          aria-label={t.planner.clearSlot.replace("{slot}", t.planner.slot[slot].toLowerCase())}
                          className="p-1 rounded-pill hover:bg-ink/[0.08] text-ink-muted shrink-0"
                        >
                          <X size={13} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => requireWrite(() => setPicking({ dayKey: d.key, slot }))}
                          aria-label={t.planner.addMeal.replace("{slot}", t.planner.slot[slot].toLowerCase())}
                          className="p-1 rounded-pill bg-chili text-white shrink-0"
                        >
                          <Plus size={13} />
                        </button>
                      )}
                    </div>
                  );
                })}
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
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => openConsolidated("instacart")} className="btn btn-primary btn-sm">
                    {t.shopping.openOnInstacart} <ExternalLink size={13} />
                  </button>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-chili/80 text-center">
                    ✨ {t.shopping.instacartComingSoon}
                  </span>
                </div>
                <button type="button" onClick={() => openConsolidated("amazonFresh")} className="btn btn-teal btn-sm">
                  {t.shopping.openOnAmazon} <ExternalLink size={13} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Picker modal — slot-aware */}
      {picking !== null ? (
        <div className="fixed inset-0 z-modal bg-ink/55 backdrop-blur-sm grid place-items-center px-4" role="dialog" aria-modal="true" aria-label={t.planner.pickerFor.replace("{slot}", t.planner.slot[picking.slot].toLowerCase())}>
          <div className="max-w-[420px] w-full bg-bone-50 rounded-card-lg overflow-hidden flex flex-col max-h-[80vh] card-surface">
            <div className="px-4 py-3 border-b border-line-soft flex items-center justify-between">
              <div className="font-display text-lg">
                {t.planner.pickerFor.replace("{slot}", t.planner.slot[picking.slot].toLowerCase())}
              </div>
              <button type="button" onClick={() => setPicking(null)} className="p-1 rounded-pill hover:bg-ink/[0.06]" aria-label={t.common.cancel}>
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
                className="input input-sm"
              />
            </div>
            <ul className="flex-1 overflow-auto px-2 py-2">
              {filteredPicker.map((r) => (
                <li key={r.slug}>
                  <button
                    type="button"
                    onClick={() => { planSlot(picking.dayKey, picking.slot, r.slug); setPicking(null); setQuery(""); }}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-input hover:bg-ink/[0.05] text-left"
                  >
                    <SafeImage
                      src={r.thumb}
                      recipeSlug={r.slug}
                      fallbackSize="thumb"
                      alt={r.title[locale]}
                      className="w-10 h-10 rounded-md object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium leading-snug break-words">{r.title[locale]}</div>
                      <div className="text-[11px] text-ink-muted leading-snug break-words">{r.origin[locale]}</div>
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
