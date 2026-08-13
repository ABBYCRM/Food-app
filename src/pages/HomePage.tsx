import { useLocation } from "wouter";
import { ArrowRight, CalendarDays, NotebookPen, ShieldAlert, MapPin, ChefHat, Sunrise, Sun, Moon, Leaf } from "lucide-react";
import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { RecipeCard } from "@/components/RecipeCard";
import { InstallButton } from "@/components/InstallButton";
import { TrialBanner } from "@/components/TrialBanner";
import { PaywallModal } from "@/components/PaywallModal";
import { useUser } from "@/context/UserContext";
import { dict, type Locale } from "@/i18n";
import { allRecipesForCalendar, recipeForDate } from "@/data/calendar";
import { recipes, type Recipe } from "@/data/recipes";

export function HomePage() {
  const { locale, setLocale } = useUser();
  const [, navigate] = useLocation();
  const t = dict[locale];
  const today = recipeForDate();
  const [paywallOpen, setPaywallOpen] = useState(false);

  const heroFeature = recipes[0];

  return (
    <Layout hideHeader>
      <div className="relative px-5 pt-3 pb-2 flex items-center justify-between bg-[var(--color-chili)] text-[var(--color-bone-50)] sticky top-0 z-20">
        <span className="font-display font-semibold tracking-tight">{t.brand}</span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.22em] opacity-80 hidden sm:inline">{t.tagline}</span>
          <InstallButton className="bg-white/10 text-bone-50 border border-white/20 hover:bg-white/20" />
        </div>
      </div>

      <TrialBanner />

      {/* Hero with editorial image */}
      <section className="px-5 sm:px-8 lg:px-12 pt-5">
        <div className="relative aspect-[4/5] sm:aspect-[3/2] lg:aspect-[16/9] lg:max-h-[420px] rounded-[1.4rem] overflow-hidden">
          <img src={heroFeature.hero} alt="" className="absolute inset-0 w-full h-full object-cover object-center" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/0" />
          <span className="absolute top-4 left-4 pill bg-[var(--color-chili)] text-[var(--color-bone-50)]">
            {t.home.eyebrow}
          </span>
        </div>
      </section>

      {/* Welcome */}
      <section className="px-5 pt-7">
        <h1 className="display-xl text-[var(--color-chili)]">{t.home.title}</h1>
        <p className="mt-4 text-base text-[var(--color-ink-soft)] leading-relaxed">
          {t.home.subtitle}
        </p>
      </section>

      {/* Trilingual CTAs (per the mockup) */}
      <section className="px-5 pt-6 space-y-3">
        <CtaButton label={t.home.ctaEn} variant="chili" onClick={() => { setLocale("en"); navigate("/recipes"); }} />
        <CtaButton label={t.home.ctaEs} variant="teal" onClick={() => { setLocale("es"); navigate("/recipes"); }} />
        <CtaButton label={t.home.ctaPt} variant="ghost" onClick={() => { setLocale("pt"); navigate("/recipes"); }} />
      </section>

      {/* Today's recipe — anchored to day of year */}
      <section className="px-5 pt-8">
        <div className="eyebrow flex items-center gap-2">
          <CalendarDays size={12} /> {t.home.todayEyebrow}
        </div>
        <button
          type="button"
          onClick={() => navigate(`/recipe/${today.slug}`)}
          className="mt-3 w-full card-surface overflow-hidden text-left group"
        >
          <div className="relative aspect-[16/10] lg:aspect-[2/1] lg:max-h-[320px]">
            <img src={today.hero} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/0" />
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <span className="text-[10px] uppercase tracking-[0.22em] opacity-85">{today.origin[locale]}</span>
              <h3
                className="font-display text-[1.6rem] sm:text-2xl leading-[1.15] mt-1 drop-shadow-md"
                style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
              >
                {today.title[locale]}
              </h3>
            </div>
          </div>
          <div
            className="px-4 py-3 text-sm text-[var(--color-ink-soft)] leading-relaxed"
            style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
          >
            {today.subtitle[locale]}
          </div>
        </button>
      </section>

      {/* Meal rows — 4 across breakfast/lunch/dinner/healthy */}
      <MealRow eyebrow={t.home.breakfastRow} icon={<Sunrise size={14} />} ctaLabel={t.home.seeBreakfast} onSee={() => navigate("/recipes?meal=breakfast")} filter={(r) => r.meals.includes("breakfast")} locale={locale} />
      <MealRow eyebrow={t.home.lunchRow} icon={<Sun size={14} />} ctaLabel={t.home.seeLunch} onSee={() => navigate("/recipes?meal=lunch")} filter={(r) => r.meals.includes("lunch")} locale={locale} />
      <MealRow eyebrow={t.home.dinnerRow} icon={<Moon size={14} />} ctaLabel={t.home.seeDinner} onSee={() => navigate("/recipes?meal=dinner")} filter={(r) => r.meals.includes("dinner")} locale={locale} />
      <MealRow eyebrow={t.home.healthyRow} icon={<Leaf size={14} />} ctaLabel={t.home.seeHealthy} onSee={() => navigate("/recipes?healthy=1")} filter={(r) => r.healthy} locale={locale} accent="jade" />

      {/* Quick links */}
      <section className="page-pad pt-8">
        <div className="eyebrow">{t.home.quickLinks}</div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <QuickTile icon={<CalendarDays size={16} />} label={t.home.planThisWeek} onClick={() => navigate("/planner")} />
          <QuickTile icon={<NotebookPen size={16} />} label={t.home.openNotebook} onClick={() => navigate("/notebook")} />
          <QuickTile icon={<ShieldAlert size={16} />} label={t.home.findSafe} onClick={() => navigate("/allergy")} />
          <QuickTile icon={<MapPin size={16} />} label={t.home.nearMe} onClick={() => navigate("/vendor")} />
          <QuickTile icon={<ChefHat size={16} />} label={t.home.bookChef} onClick={() => navigate("/chefs")} accent="chili" />
        </div>
      </section>

      {/* Footer */}
      <section className="px-5 pt-9 pb-3">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-muted)] text-center">
          {t.home.footerNote}
        </p>
      </section>
    </Layout>
  );
}

function CtaButton({
  label,
  variant,
  onClick,
}: {
  label: string;
  variant: "chili" | "teal" | "ghost";
  onClick: () => void;
}) {
  const cls =
    variant === "chili"
      ? "btn-primary"
      : variant === "teal"
      ? "btn-teal"
      : "btn-ghost";
  return (
    <button type="button" onClick={onClick} className={`${cls} w-full`}>
      <span>{label}</span>
      <ArrowRight size={16} strokeWidth={2.2} />
    </button>
  );
}

function QuickTile({ icon, label, onClick, accent = "default" }: { icon: React.ReactNode; label: string; onClick: () => void; accent?: "default" | "chili" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        accent === "chili"
          ? "px-3.5 py-3 text-left flex items-start gap-2.5 rounded-[var(--radius-card)] bg-[var(--color-chili)] text-[var(--color-bone-50)] hover:-translate-y-0.5 transition-transform"
          : "card-surface px-3.5 py-3 text-left flex items-start gap-2.5 hover:-translate-y-0.5 transition-transform"
      }
    >
      <span className={accent === "chili"
        ? "w-7 h-7 grid place-items-center rounded-full bg-white/15 text-white shrink-0"
        : "w-7 h-7 grid place-items-center rounded-full bg-[var(--color-chili)]/10 text-[var(--color-chili)] shrink-0"}>
        {icon}
      </span>
      <span className="text-sm font-medium leading-snug">{label}</span>
    </button>
  );
}

function MealRow({
  eyebrow,
  icon,
  ctaLabel,
  onSee,
  filter,
  locale,
  accent = "chili",
}: {
  eyebrow: string;
  icon: React.ReactNode;
  ctaLabel: string;
  onSee: () => void;
  filter: (r: Recipe) => boolean;
  locale: Locale;
  accent?: "chili" | "jade";
}) {
  const items = useMemo(() => allRecipesForCalendar().filter(filter).slice(0, 6), [filter]);
  if (items.length === 0) return null;
  return (
    <section className="page-pad pt-8">
      <div className="flex items-end justify-between">
        <div className={"eyebrow flex items-center gap-1.5 " + (accent === "jade" ? "text-[var(--color-jade)]" : "")}>
          <span className={accent === "jade" ? "text-[var(--color-jade)]" : "text-[var(--color-chili)]"}>{icon}</span>
          {eyebrow}
        </div>
        <button type="button" onClick={onSee} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-chili)] hover:underline underline-offset-4">
          {ctaLabel} →
        </button>
      </div>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {items.map((r) => (
          <RecipeCard key={r.slug} recipe={r} />
        ))}
      </div>
    </section>
  );
}
