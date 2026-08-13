import { useMemo, useState } from "react";
import { ShoppingCart, ExternalLink, Check } from "lucide-react";
import type { Ingredient, Recipe } from "@/data/recipes";
import {
  combinedSearchUrl, ingredientQuery, multiRetailerUrls, openInNewTab, openMany, retailerUrl, type Retailer,
} from "@/lib/shopping";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";
import { cn } from "@/lib/cn";

/* Retailer brand colors — kept as the official brand swatches so the chips
   look like the actual retailer's product. These are intentionally
   NOT design tokens; they're brand identifiers. */
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
}: {
  recipe: Recipe;
  scaledIngredients: Ingredient[];
}) {
  const { locale, zip, setZip } = useUser();
  const t = dict[locale];
  const [selected, setSelected] = useState<Retailer>("instacart");
  const [picked, setPicked] = useState<Set<number>>(
    () => new Set(scaledIngredients.map((_, i) => i)),
  );

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

  const [popupBlocked, setPopupBlocked] = useState(false);

  const openAll = () => {
    setPopupBlocked(false);
    const urls = multiRetailerUrls(selected, activeIngredients, zip);
    const result = openMany(urls);
    /* If browser blocked the popups, we wait a tick and surface a single
       consolidated-search fallback link the user can click. */
    setTimeout(() => {
      if (result.opened === 0 || (urls.length > 1 && result.blocked >= urls.length - 1)) {
        setPopupBlocked(true);
      }
    }, urls.length * 240 + 200);
  };

  const openCombined = () => {
    setPopupBlocked(false);
    openInNewTab(combinedSearchUrl(selected, activeIngredients, zip));
  };

  return (
    <section className="card-surface px-4 py-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="eyebrow flex items-center gap-2">
            <ShoppingCart size={12} /> {t.shopping.title}
          </div>
          <p className="text-sm text-ink-muted mt-1 leading-snug">
            {t.shopping.subtitle}
          </p>
        </div>
        <div className="text-xs font-semibold text-chili">
          {t.shopping.items(activeIngredients.length)}
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs">
        <span className="text-ink-muted uppercase tracking-[0.14em] font-medium">
          {t.shopping.deliverTo}
        </span>
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/[^0-9A-Za-z-]/g, "").slice(0, 8))}
          placeholder={t.shopping.zipPlaceholder}
          className="input flex-1 !text-sm !py-1.5 !min-h-0"
        />
      </label>

      <div className="flex flex-wrap gap-1.5">
        {retailers.map((r) => {
          const isSelected = selected === r.key;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => setSelected(r.key)}
              aria-pressed={isSelected}
              className={cn(
                "chip",
                isSelected
                  ? `${r.color} border-transparent`
                  : "bg-white text-ink border-line hover:border-ink"
              )}
            >
              {t.shopping[r.label as keyof typeof t.shopping] as string}
            </button>
          );
        })}
      </div>

      <ul className="space-y-1.5">
        {scaledIngredients.map((ing, idx) => {
          const url = retailerUrl(selected, ingredientQuery(ing), zip);
          const inList = picked.has(idx);
          return (
            <li
              key={idx}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-input transition-colors",
                inList ? "bg-chili/[0.06]" : "bg-ink/[0.03]"
              )}
            >
              <button
                type="button"
                onClick={() => togglePicked(idx)}
                aria-label={inList ? t.shopping.inList : t.shopping.addToList}
                aria-pressed={inList}
                className={cn(
                  "w-5 h-5 rounded-md grid place-items-center transition-colors",
                  inList ? "bg-chili text-white" : "border border-line-strong"
                )}
              >
                {inList ? <Check size={12} /> : null}
              </button>
              <span className="flex-1 text-sm">{ing.name[locale]}</span>
              <button
                type="button"
                onClick={() => openInNewTab(url)}
                className="text-xs font-semibold inline-flex items-center gap-1 text-chili hover:underline"
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
        className="btn btn-primary btn-block"
        disabled={activeIngredients.length === 0}
      >
        {selected === "amazon" || selected === "amazonFresh"
          ? t.shopping.openOnAmazon
          : selected === "instacart"
          ? t.shopping.openOnInstacart
          : selected === "wholeFoods"
          ? t.shopping.openOnWholeFoods
          : `${t.shopping.shopWith} ${t.shopping[retailers.find((r) => r.key === selected)!.label as keyof typeof t.shopping] as string}`}
      </button>

      {popupBlocked ? (
        <button
          type="button"
          onClick={openCombined}
          className="w-full text-xs font-semibold text-chili underline underline-offset-2 py-1"
        >
          ↗ Browser blocked multiple tabs — open one combined search instead
        </button>
      ) : null}

      <p className="text-[10.5px] text-ink-muted leading-snug">{t.shopping.note}</p>
    </section>
  );
}
