import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Plus, X, ShoppingCart, ExternalLink, LoaderCircle, AlertCircle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { SafeImage } from "@/components/SafeImage";
import { dict } from "@/i18n";
import { allRecipesForCalendar } from "@/data/calendar";
import { consolidateForWeek, openMany, retailerUrl, type Retailer } from "@/lib/shopping";
import { createInstacartShoppingListLink } from "@/lib/instacart";
import {
  AMAZON_ASSOCIATE_DISCLOSURE,
  isAmazonAffiliateConfigured,
  recordAffiliateClick,
} from "@/lib/affiliate";
import { cn } from "@/lib/cn";
import { localDateKey } from "@/lib/date";

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
  const { session } = useAuth();
  const [, navigate] = useLocation();
  const t = dict[locale];
  const [pickingDay, setPickingDay] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [shoppingLoading, setShoppingLoading] = useState(false);
  const [shoppingError, setShoppingError] = useState<string | null>(null);

  const week = useMemo(() => {
    const start = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return { date: d, key: localDateKey(d) };
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

  async function openConsolidated(retailer: Retailer) {
    setShoppingError(null);
    if (retailer === "instacart") {
      if (shoppingLoading) return;
      setShoppingLoading(true);
      const pendingTab = window.open("about:blank", "_blank");
      if (pendingTab) {
        pendingTab.opener = null;
        pendingTab.document.title = t.shopping.creatingCart;
        pendingTab.document.body.textContent = t.shopping.creatingCart;
      }

      try {
        const url = await createInstacartShoppingListLink({
          title: `${t.shopping.consolidated} · ${fmtMD(week[0].date, locale)}–${fmtMD(week[6].date, locale)}`,
          ingredients: consolidated.map((item) => ({
            name: item.query,
            displayText: item.display,
          })),
          partnerLinkbackUrl: window.location.href,
          csrfToken: session?.csrfToken ?? "",
        });
        if (pendingTab && !pendingTab.closed) pendingTab.location.replace(url);
        else window.location.assign(url);
      } catch {
        pendingTab?.close();
        setShoppingError(t.shopping.cartError);
      } finally {
        setShoppingLoading(false);
      }
      return;
    }

    const urls = consolidated.map((c) => retailerUrl(retailer, c.query, zip));
    recordAffiliateClick(retailer, urls.length, session?.csrfToken ?? "");
    openMany(urls);
  }

  return (
    <Layout section={t.nav.planner}>
      <section className="page-pad pt-5">
        <div className="eyebrow">{t.planner.week} {fmtMD(week[0].date, locale)} – {fmtMD(week[6].date, locale)}</div>
        <h1 className="display-lg mt-2">{t.planner.title}</h1>
        <p className="mt-3 text-sm text-[var(--color-ink-soft)] leading-relaxed">{t.planner.subtitle}</p>
      </section>

      <section className="page-pad pt-5 space-y-2">
        {week.map((d, i) => {
          const slug = planner[d.key];
          const r = slug ? ALL.find((x) => x.slug === slug) : null;
          return (
            <article key={d.key} className="card-surface px-4 py-3 flex items-center gap-3">
              <div className="text-center w-12 shrink-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">{dayNames[i]}</div>
                <div className="font-display text-xl leading-none mt-1">{d.date.getDate()}</div>
              </div>
              {r ? (
                <button type="button" onClick={() => navigate(`/recipe/${r.slug}`)} className="flex-1 text-left flex items-center gap-3">
                  <SafeImage src={r.thumb} alt={r.title[locale]} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold leading-tight truncate">{r.title[locale]}</div>
                    <div className="text-[11px] text-[var(--color-ink-muted)] truncate">{r.origin[locale]}</div>
                  </div>
                </button>
              ) : (
                <button type="button" onClick={() => setPickingDay(d.key)} className="flex-1 text-left text-sm text-[var(--color-ink-muted)] italic">
                  {t.planner.empty}
                </button>
              )}
              <div className="flex items-center gap-1">
                {r ? (
                  <button type="button" onClick={() => planDay(d.key, null)} aria-label={t.planner.clearDay} className="p-1.5 rounded-full hover:bg-[rgba(28,20,14,0.06)] text-[var(--color-ink-muted)]">
                    <X size={15} />
                  </button>
                ) : (
                  <button type="button" onClick={() => setPickingDay(d.key)} aria-label={t.planner.addRecipe} className="p-1.5 rounded-full bg-[var(--color-chili)] text-white">
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
              <p className="text-xs text-[var(--color-ink-muted)] mt-1">{t.shopping.items(consolidated.length)}</p>
            </div>
          </div>
          {consolidated.length === 0 ? (
            <p className="text-sm text-[var(--color-ink-muted)] italic">{t.planner.empty}</p>
          ) : (
            <>
              <ul className="space-y-1 max-h-64 overflow-auto pr-1">
                {consolidated.map((c) => (
                  <li key={c.query} className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-md bg-[rgba(28,20,14,0.04)]">
                    <span className="text-sm">{c.display}</span>
                    <span className="text-[10px] text-[var(--color-ink-muted)]">×{c.sources.length}</span>
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => void openConsolidated("instacart")} disabled={shoppingLoading} className="btn-primary justify-center !py-2.5 !text-sm">
                  {shoppingLoading ? <LoaderCircle size={13} className="animate-spin" /> : <ExternalLink size={13} />}
                  {shoppingLoading ? t.shopping.creatingCart : t.shopping.shopOnInstacart}
                </button>
                <button type="button" onClick={() => void openConsolidated("amazonFresh")} className="btn-teal justify-center !py-2.5 !text-sm">
                  {t.shopping.openOnAmazon} <ExternalLink size={13} />
                </button>
              </div>
              {shoppingError ? (
                <p role="alert" className="text-xs text-[var(--color-chili)] flex items-start gap-1.5">
                  <AlertCircle size={13} className="mt-0.5 shrink-0" /> {shoppingError}
                </p>
              ) : null}
              <div className="text-[10.5px] text-[var(--color-ink-muted)] leading-snug border-t border-[rgba(28,20,14,0.08)] pt-2 space-y-1">
                <p>{t.shopping.affiliateDisclosure}</p>
                {isAmazonAffiliateConfigured() ? <p>{AMAZON_ASSOCIATE_DISCLOSURE}</p> : null}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Picker modal */}
      {pickingDay !== null ? (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm grid place-items-center px-4">
          <div className="max-w-[420px] w-full bg-[var(--color-bone-50)] rounded-[1.4rem] overflow-hidden flex flex-col max-h-[80vh]">
            <div className="px-4 py-3 border-b border-[rgba(28,20,14,0.08)] flex items-center justify-between">
              <div className="font-display text-lg">{t.planner.picker}</div>
              <button type="button" onClick={() => setPickingDay(null)} className="p-1 rounded-full hover:bg-[rgba(28,20,14,0.06)]">
                <X size={16} />
              </button>
            </div>
            <div className="p-3 border-b border-[rgba(28,20,14,0.06)]">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                placeholder={t.search.placeholder}
                className="w-full px-3 py-2 rounded-md border border-[rgba(28,20,14,0.12)] text-sm focus:outline-none focus:border-[var(--color-chili)]"
              />
            </div>
            <ul className="flex-1 overflow-auto px-2 py-2">
              {filteredPicker.map((r) => (
                <li key={r.slug}>
                  <button
                    type="button"
                    onClick={() => { planDay(pickingDay, r.slug); setPickingDay(null); setQuery(""); }}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[rgba(28,20,14,0.05)] text-left"
                  >
                    <SafeImage src={r.thumb} alt={r.title[locale]} className="w-10 h-10 rounded-md object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{r.title[locale]}</div>
                      <div className="text-[11px] text-[var(--color-ink-muted)] truncate">{r.origin[locale]}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <section className="py-6" />
    </Layout>
  );
}
