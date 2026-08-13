import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";
import { cn } from "@/lib/cn";

export function ServingsScaler({
  baseServes,
  servings,
  setServings,
}: {
  baseServes: number;
  servings: number;
  setServings: (n: number) => void;
}) {
  const { locale } = useUser();
  const t = dict[locale];
  const presets = [baseServes, baseServes * 2, baseServes * 4];
  return (
    <div className="card-surface px-4 py-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <span className="eyebrow">{t.recipe.scaleLabel}</span>
        <span className="text-xs font-semibold text-chili">
          {servings} {t.recipe.servings.toLowerCase()}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {presets.map((n, i) => {
          const active = servings === n;
          return (
            <button
              key={n + "-" + i}
              type="button"
              onClick={() => setServings(n)}
              aria-pressed={active}
              className={cn("chip", active && "bg-ink text-bone-50 border-ink")}
            >
              {[t.scale.x1, t.scale.x2, t.scale.x4][i]}
            </button>
          );
        })}
        <label className="ml-auto flex items-center gap-2 text-xs text-ink-muted">
          <span>{t.scale.customLabel}</span>
          <input
            type="number"
            min={1}
            max={50}
            value={servings}
            onChange={(e) => setServings(Math.max(1, Math.min(50, Number(e.target.value) || baseServes)))}
            className="input input-xs !w-14 text-center font-semibold"
            aria-label={t.scale.customLabel}
          />
        </label>
      </div>
    </div>
  );
}
