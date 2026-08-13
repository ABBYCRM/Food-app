import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, ExternalLink, Check, LoaderCircle, AlertCircle } from "lucide-react";
import type { Ingredient, Recipe } from "@/data/recipes";
import {
  combinedSearchUrl, ingredientQuery, multiRetailerUrls, openInNewTab, openMany, retailerUrl, type Retailer,
} from "@/lib/shopping";
import {
  AMAZON_ASSOCIATE_DISCLOSURE,
  isAmazonAffiliateConfigured,
  recordAffiliateClick,
} from "@/lib/affiliate";
import {
  createInstacartRecipeLink,
  createInstacartShoppingListLink,
} from "@/lib/instacart";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { dict } from "@/i18n";
import { cn } from "@/lib/cn";

const retailers: { key: Retailer; label: keyof typeof dict.en.shopping; color: string }[] = [
  { key: "amazonFresh", label: "amazonFresh", color: "bg-[#146eb4] text-white" },
  { key: "wholeFoods", label: "wholeFoods", color: "bg-[#0a5f0a] text-white" },
  { key: "instacart", label: "instacart", color: "bg-[#0aad0a] text-white" },
  { key: "amazon", label: "amazon", color: "bg-[#ff9900] text-black" },
  { key: "walmart", label: "walmart", color: "bg-[#0071ce] text-white" },
];

export function ShoppingPanel({
  recipe,
  scaledIngredients,
  servings,
}: {
  recipe: Recipe;
  scaledIngredients: Ingredient[];
  servings: number;
}) {
  const { locale, zip, setZip } = useUser();
  const { session } = useAuth();
  const t = dict[locale];
  const [selected, setSelected] = useState<Retailer>("instacart");
  const [instacartLoading, setInstacartLoading] = useState(false);
  const [shoppingError, setShoppingError] = useState<string | null>(null);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [picked, setPicked] = useState<Set<number>>(
    () => new Set(scaledIngredients.map((_, i) => i)),
  );

  useEffect(() => {
    setPicked(new Set(scaledIngredients.map((_, index) => index)));
    setShoppingError(null);
    setPopupBlocked(false);
  }, [recipe.slug, scaledIngredients]);

  const togglePicked = (idx: number) =>
    setPicked((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });

  const activeIngredients = useMemo(
    () => scaledIngredients.filter((_, i) => picked.has(i)),
    [scaledIngredients, picked],
  );

  const openInstacart = async (createLink: () => Promise<string>) => {
    if (instacartLoading) return;
    setInstacartLoading(true);
    setShoppingError(null);
    setPopupBlocked(false);

    const pendingTab = window.open("about:blank", "_blank");
    if (pendingTab) {
      pendingTab.opener = null;
      pendingTab.document.title = t.shopping.creatingCart;
      pendingTab.document.body.textContent = t.shopping.creatingCart;
    }

    try {
      const url = await createLink();
      if (pendingTab && !pendingTab.closed) pendingTab.location.replace(url);
      else window.location.assign(url);
    } catch {
      pendingTab?.close();
      setShoppingError(t.shopping.cartError);
    } finally {
      setInstacartLoading(false);
    }
  };

  const openAll = () => {
    if (selected === "instacart") {
      void openInstacart(() =>
        createInstacartRecipeLink({
          recipe,
          ingredients: activeIngredients,
          locale,
          servings,
          partnerLinkbackUrl: window.location.href,
          csrfToken: session?.csrfToken ?? "",
        }),
      );
      return;
    }

    setShoppingError(null);
    setPopupBlocked(false);
    const urls = multiRetailerUrls(selected, activeIngredients, zip);
    recordAffiliateClick(selected, urls.length, session?.csrfToken ?? "");
    const result = openMany(urls);
    if (result.blocked > 0) setPopupBlocked(true);
  };

  const openCombined = () => {
    setPopupBlocked(false);
    recordAffiliateClick(selected, 1, session?.csrfToken ?? "");
    openInNewTab(combinedSearchUrl(selected, activeIngredients, zip));
  };

  const openOne = (ingredient: Ingredient) => {
    if (selected !== "instacart") {
      recordAffiliateClick(selected, 1, session?.csrfToken ?? "");
      openInNewTab(retailerUrl(selected, ingredientQuery(ingredient), zip));
      return;
    }

    void openInstacart(() =>
      createInstacartShoppingListLink({
        title: ingredient.name[locale],
        ingredients: [
          {
            name: ingredientQuery(ingredient),
            displayText: ingredient.name[locale],
          },
        ],
        partnerLinkbackUrl: window.location.href,
        csrfToken: session?.csrfToken ?? "",
      }),
    );
  };

  return (
    <section className="card-surface px-4 py-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="eyebrow flex items-center gap-2">
            <ShoppingCart size={12} /> {t.shopping.title}
          </div>
          <p className="text-sm text-[var(--color-ink-muted)] mt-1 leading-snug">
            {t.shopping.subtitle}
          </p>
        </div>
        <div className="text-xs font-semibold text-[var(--color-chili)]">
          {t.shopping.items(activeIngredients.length)}
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs">
        <span className="text-[var(--color-ink-muted)] uppercase tracking-[0.14em] font-medium">
          {t.shopping.deliverTo}
        </span>
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/[^0-9A-Za-z-]/g, "").slice(0, 8))}
          placeholder={t.shopping.zipPlaceholder}
          className="flex-1 px-3 py-1.5 rounded-md border border-[rgba(28,20,14,0.15)] bg-white text-sm focus:outline-none focus:border-[var(--color-chili)]"
        />
      </label>

      <div className="flex flex-wrap gap-1.5">
        {retailers.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setSelected(r.key)}
            aria-pressed={selected === r.key}
            className={cn(
              "px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all border",
              selected === r.key
                ? `${r.color} border-transparent`
                : "bg-white text-[var(--color-ink)] border-[rgba(28,20,14,0.12)] hover:border-[var(--color-ink)]"
            )}
          >
            {t.shopping[r.label as keyof typeof t.shopping] as string}
          </button>
        ))}
      </div>

      <ul className="space-y-1.5">
        {scaledIngredients.map((ing, idx) => {
          const inList = picked.has(idx);
          return (
            <li
              key={idx}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                inList ? "bg-[rgba(184,54,44,0.06)]" : "bg-[rgba(28,20,14,0.03)]"
              )}
            >
              <button
                type="button"
                onClick={() => togglePicked(idx)}
                aria-label={inList ? t.shopping.inList : t.shopping.addToList}
                className={cn(
                  "w-5 h-5 rounded-md grid place-items-center transition-colors",
                  inList ? "bg-[var(--color-chili)] text-white" : "border border-[rgba(28,20,14,0.25)]"
                )}
              >
                {inList ? <Check size={12} /> : null}
              </button>
              <span className="flex-1 text-sm">{ing.name[locale]}</span>
              <button
                type="button"
                onClick={() => openOne(ing)}
                disabled={instacartLoading}
                className="text-xs font-semibold inline-flex items-center gap-1 text-[var(--color-chili)] hover:underline"
              >
                {t.recipe.shopOne} <ExternalLink size={11} />
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={openAll}
        className="btn-primary w-full justify-center"
        disabled={activeIngredients.length === 0 || instacartLoading}
      >
        {instacartLoading ? (
          <><LoaderCircle size={14} className="animate-spin" /> {t.shopping.creatingCart}</>
        ) : selected === "amazon" || selected === "amazonFresh"
          ? t.shopping.openOnAmazon
          : selected === "instacart"
          ? t.shopping.shopOnInstacart
          : selected === "wholeFoods"
          ? t.shopping.openOnWholeFoods
          : `${t.shopping.shopWith} ${t.shopping[retailers.find((r) => r.key === selected)!.label as keyof typeof t.shopping] as string}`}
      </button>

      {popupBlocked ? (
        <button
          type="button"
          onClick={openCombined}
          className="w-full text-xs font-semibold text-[var(--color-chili)] underline underline-offset-2 py-1"
        >
          ↗ {t.shopping.popupBlocked}
        </button>
      ) : null}

      {shoppingError ? (
        <p role="alert" className="text-xs text-[var(--color-chili)] flex items-start gap-1.5">
          <AlertCircle size={13} className="mt-0.5 shrink-0" /> {shoppingError}
        </p>
      ) : null}

      <p className="text-[10.5px] text-[var(--color-ink-muted)] leading-snug">{t.shopping.note}</p>
      <div className="text-[10.5px] text-[var(--color-ink-muted)] leading-snug border-t border-[rgba(28,20,14,0.08)] pt-2 space-y-1">
        <p>{t.shopping.affiliateDisclosure}</p>
        {isAmazonAffiliateConfigured() ? <p>{AMAZON_ASSOCIATE_DISCLOSURE}</p> : null}
      </div>
    </section>
  );
}
