import { useLocation } from "wouter";
import { ArrowRight, CalendarDays, NotebookPen, ShieldAlert, MapPin, ChefHat, Sunrise, Sun, Moon, Leaf } from "lucide-react";
import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { RecipeCard } from "@/components/RecipeCard";
import { TrialBanner } from "@/components/TrialBanner";
import { PaywallModal } from "@/components/PaywallModal";
import { SafeImage } from "@/components/SafeImage";
import { useUser } from "@/context/UserContext";
import { useTrial } from "@/context/TrialContext";
import { dict, type Locale } from "@/i18n";
import { allRecipesForCalendar, recipeForDate } from "@/data/calendar";
import { recipes, type Recipe } from "@/data/recipes";
import { cn } from "@/lib/cn";

export function HomePage() {
  const { locale, setLocale } = useUser();
  const { canWrite, status } = useTrial();
  const [, navigate] = useLocation();
  const t = dict[locale];
  const today = recipeForDate();
  const [paywallOpen, setPaywallOpen] = useState(false);

  const heroFeature = recipes[0];
  const trialExpired = status === "expired";

  return (
    // Home used to hand-roll its own brand bar, which put it *below* the
    // desktop nav and gave it a different shape (no search) from every other
    // page. It now uses the shared Header like the rest of the app, with the
    // tagline passed through as the section label.
    <Layout section={t.tagline}>
      <TrialBanner />

      {/* Hero with editorial image */}
      <section className="px-5 sm:px-8 lg:px-12 pt-5">
        {/* Height is capped at lg via an explicit height rather than aspect + max-h:
            pairing `aspect-*` with `max-h-*` makes CSS resolve the height first and
            then derive the width from the ratio, which shrinks the hero to 747px
            inside a 1180px shell instead of filling it. */}
        <div className="relative aspect-[4/5] sm:aspect-[3/2] lg:aspect-auto lg:h-[420px] rounded-card-lg overflow-hidden">
          <SafeImage
            src={heroFeature.hero}
            recipeSlug={heroFeature.slug}
            fallbackSize="hero"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/0" />
          <span className="absolute top-4 left-4 pill bg-chili text-bone-50">
            {t.home.eyebrow}
          </span>
        </div>
      </section>

      {/* Welcome */}
      <section className="px-5 pt-7">
        <h1 className="display-xl text-chili">{t.home.title}</h1>
        <p className="mt-4 text-base text-ink-soft leading-relaxed">
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
          <div className="relative aspect-[16/10] lg:aspect-auto lg:h-[320px]">
            <SafeImage
              src={today.hero}
              recipeSlug={today.slug}
              fallbackSize="hero"
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/0" />
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <span className="text-[10px] uppercase tracking-[0.22em] opacity-85">{today.origin[locale]}</span>
              <h3 className="font-display text-[1.6rem] sm:text-2xl leading-[1.15] mt-1 drop-shadow-md clamp-2">
                {today.title[locale]}
              </h3>
            </div>
          </div>
          <div className="px-4 py-3 text-sm text-ink-soft leading-relaxed clamp-2">
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
          <QuickTile icon={<CalendarDays size={16} />} label={t.home.planThisWeek} onClick={() => navigate("/planner")} locked={!canWrite} onLocked={() => setPaywallOpen(true)} />
          <QuickTile icon={<NotebookPen size={16} />} label={t.home.openNotebook} onClick={() => navigate("/notebook")} locked={!canWrite} onLocked={() => setPaywallOpen(true)} />
          <QuickTile icon={<ShieldAlert size={16} />} label={t.home.findSafe} onClick={() => navigate("/allergy")} />
          <QuickTile icon={<MapPin size={16} />} label={t.home.nearMe} onClick={() => navigate("/vendor")} />
          <QuickTile icon={<ChefHat size={16} />} label={t.home.bookChef} onClick={() => navigate("/chefs")} accent="chili" />
        </div>
      </section>

      {/* Trial expired — soft reminder */}
      {trialExpired ? (
        <section className="page-pad pt-6">
          <button
            type="button"
            onClick={() => setPaywallOpen(true)}
            className="card-surface w-full px-4 py-3 text-left flex items-center gap-3 border-l-4 !border-l-corn hover:shadow-card-hover transition-shadow"
          >
            <span className="w-8 h-8 grid place-items-center rounded-pill bg-corn/20 text-corn-600 shrink-0 text-lg">🔓</span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">{t.trial.paywallTitle}</span>
              <span className="block text-xs text-ink-muted">{t.trial.paywallPrice} · {t.trial.paywallSub}</span>
            </span>
            <ArrowRight size={16} className="text-corn-600 shrink-0" />
          </button>
        </section>
      ) : null}

      {/* Footer */}
      <section className="px-5 pt-9 pb-3">
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted text-center">
          {t.home.footerNote}
        </p>
      </section>

      {paywallOpen ? <PaywallModal force onClose={() => setPaywallOpen(false)} /> : null}
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
  const cls = variant === "chili" ? "btn btn-primary" : variant === "teal" ? "btn btn-teal" : "btn btn-ghost";
  return (
    <button type="button" onClick={onClick} className={cn(cls, "btn-block")}>
      <span>{label}</span>
      <ArrowRight size={16} strokeWidth={2.2} />
    </button>
  );
}

function QuickTile({
  icon, label, onClick, accent = "default", locked, onLocked,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  accent?: "default" | "chili";
  locked?: boolean;
  onLocked?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={locked && onLocked ? onLocked : onClick}
      className={cn(
        "px-3.5 py-3 text-left flex items-start gap-2.5 rounded-card transition-transform hover:-translate-y-0.5",
        accent === "chili"
          ? "bg-chili text-bone-50"
          : "card-surface"
      )}
    >
      <span className={cn(
        "w-7 h-7 grid place-items-center rounded-pill shrink-0",
        accent === "chili" ? "bg-white/15 text-white" : "bg-chili/10 text-chili"
      )}>
        {icon}
      </span>
      <span className="text-sm font-medium leading-snug flex-1">{label}</span>
      {locked ? <span className="text-[10px] uppercase tracking-[0.14em] opacity-60 mt-1 self-end">🔒</span> : null}
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
        <div className={cn(
          "eyebrow flex items-center gap-1.5",
          accent === "jade" && "text-jade"
        )}>
          <span className={accent === "jade" ? "text-jade" : "text-chili"}>{icon}</span>
          {eyebrow}
        </div>
        <button
          type="button"
          onClick={onSee}
          className="text-[11px] font-semibold uppercase tracking-[0.16em] text-chili hover:underline underline-offset-4"
        >
          {ctaLabel} →
        </button>
      </div>
      {/* 6 items, so the column count stays a divisor of 6 (2 or 3) and every
          breakpoint lands on full rows instead of a ragged trailing one. The
          old xl:grid-cols-6 squeezed cards to ~170px, which truncated the meta
          stats ("Profou…"); wider cards on desktop read better than more of
          them, and each row already has a "see all" CTA for depth. */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((r) => (
          <RecipeCard key={r.slug} recipe={r} />
        ))}
      </div>
    </section>
  );
}
