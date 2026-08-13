import { useLocation } from "wouter";
import { Clock, Flame, Sparkles, Bookmark } from "lucide-react";
import { useState } from "react";
import type { Recipe } from "@/data/recipes";
import { useUser } from "@/context/UserContext";
import { useTrial } from "@/context/TrialContext";
import { dict } from "@/i18n";
import { cn } from "@/lib/cn";
import { SafeImage } from "./SafeImage";
import { PaywallModal } from "./PaywallModal";

export function RecipeCard({ recipe, big = false }: { recipe: Recipe; big?: boolean }) {
  const { locale, isFavorite, toggleFavorite } = useUser();
  const { canWrite } = useTrial();
  const [, navigate] = useLocation();
  const t = dict[locale];
  const fav = isFavorite(recipe.slug);
  const [paywallOpen, setPaywallOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => navigate(`/recipe/${recipe.slug}`)}
      className={cn(
        "group card-surface overflow-hidden text-left w-full transition-all",
        "hover:shadow-card-hover hover:-translate-y-0.5"
      )}
    >
      <div className={cn("relative w-full overflow-hidden bg-bone-200", big ? "aspect-[4/5]" : "aspect-[5/4]")}>
        <SafeImage
          src={recipe.hero}
          recipeSlug={recipe.slug}
          fallbackSize={big ? "phone" : "thumb"}
          alt={recipe.title[locale]}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {/* Two-stop gradient: top is faint, bottom 60% darkens for title legibility regardless of photo brightness. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/0" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="pill bg-chili/95 text-bone-50">
            {recipe.origin[locale]}
          </span>
        </div>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            // Trial gate: favoriting is a write action, so we route through
            // canWrite. If expired we open the paywall instead of saving.
            if (!canWrite) {
              setPaywallOpen(true);
              return;
            }
            toggleFavorite(recipe.slug);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              (e.currentTarget as HTMLElement).click();
            }
          }}
          aria-label={fav ? t.recipe.saved : t.recipe.save}
          aria-pressed={fav}
          className={cn(
            "absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-pill transition-all cursor-pointer",
            fav ? "bg-chili text-white" : "bg-white/85 text-ink hover:bg-white"
          )}
        >
          <Bookmark size={16} fill={fav ? "currentColor" : "none"} />
        </span>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3
            className={cn(
              "font-display drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] break-words text-white",
              big
                ? "text-2xl leading-[1.1]"
                : "text-[1.05rem] sm:text-[1.18rem] leading-[1.22] tracking-[-0.005em] font-semibold"
            )}
            style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
          >
            {recipe.title[locale]}
          </h3>
        </div>
      </div>
      <div className="px-4 py-3 flex items-center justify-between gap-3 text-xs text-ink-muted">
        <span className="flex items-center gap-1.5">
          <Clock size={13} /> {recipe.prepMinutes + recipe.cookMinutes} {t.recipes.minutes}
        </span>
        <span className="flex items-center gap-1.5">
          <Flame size={13} /> {t.meta.spice[recipe.spice - 1]}
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles size={13} /> {t.meta.umami[recipe.umami - 1]}
        </span>
      </div>
      {paywallOpen ? <PaywallModal force onClose={() => setPaywallOpen(false)} /> : null}
    </button>
  );
}
