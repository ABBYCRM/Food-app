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
        <span className="text-xs font-semibold text-[var(--color-chili)]">
          {servings} {t.recipe.servings.toLowerCase()}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {presets.map((n, i) => (
          <button
            key={n + "-" + i}
            type="button"
            onClick={() => setServings(n)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
              servings === n
                ? "bg-[var(--color-ink)] text-[var(--color-bone-50)]"
                : "bg-[rgba(28,20,14,0.06)] text-[var(--color-ink)] hover:bg-[rgba(28,20,14,0.12)]"
            )}
          >
            {[t.scale.x1, t.scale.x2, t.scale.x4][i]}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-xs text-[var(--color-ink-muted)]">
          <span>{t.scale.customLabel}</span>
          <input
            type="number"
            min={1}
            max={50}
            value={servings}
            onChange={(e) => setServings(Math.max(1, Math.min(50, Number(e.target.value) || baseServes)))}
            className="w-14 px-2 py-1 rounded-md border border-[rgba(28,20,14,0.15)] bg-white text-center text-sm font-semibold focus:outline-none focus:border-[var(--color-chili)]"
          />
        </label>
      </div>
    </div>
  );
}
