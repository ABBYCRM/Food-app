import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { renderIllustration } from "@/components/plating-illustrations";
import { extractPlatingSteps, type RecipeMethodStep } from "@/lib/plating-matcher";
import { useLocale } from "@/lib/locale";

const SECTION_LABELS: Record<"en" | "es" | "pt", { title: string; subtitle: string; step: string }> = {
  en: {
    title: "Plating Guide",
    subtitle: "Follow these steps to plate and present like a chef.",
    step: "Step",
  },
  es: {
    title: "Guía de Emplatado",
    subtitle: "Sigue estos pasos para emplatar y presentar como un chef.",
    step: "Paso",
  },
  pt: {
    title: "Guia de Empratamento",
    subtitle: "Siga estes passos para empratar e apresentar como um chef.",
    step: "Passo",
  },
};

interface Props {
  method: RecipeMethodStep[];
  recipeName: string;
}

export function PlatingGuide({ method, recipeName }: Props) {
  const { locale } = useLocale();
  const labels = SECTION_LABELS[locale as "en" | "es" | "pt"] ?? SECTION_LABELS.en;
  const steps = extractPlatingSteps(method);
  const [active, setActive] = useState(0);

  if (steps.length === 0) return null;

  const currentStep = steps[active];

  function prev() { setActive((i) => Math.max(0, i - 1)); }
  function next() { setActive((i) => Math.min(steps.length - 1, i + 1)); }

  return (
    <div className="mt-16 md:mt-20">
      {/* Section header */}
      <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-white/5">
        <div>
          <h3 className="font-display text-2xl md:text-3xl text-primary">{labels.title}</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{labels.subtitle}</p>
        </div>
        {/* Step counter */}
        <span className="text-xs text-muted-foreground uppercase tracking-widest shrink-0 ml-4">
          {active + 1} / {steps.length}
        </span>
      </div>

      {/* Step pills row */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-semibold border transition-all ${
              i === active
                ? "bg-primary text-background border-primary"
                : "border-white/15 text-muted-foreground hover:text-primary hover:border-primary/40"
            }`}
          >
            {labels.step} {step.stepNum}
          </button>
        ))}
      </div>

      {/* Main card — illustration + text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-10 items-center p-6 md:p-10 rounded-2xl border border-primary/20 bg-primary/[0.03]"
        >
          {/* Illustration panel */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="flex items-center justify-center rounded-xl border border-white/8 bg-black/20 p-6"
              style={{ width: "100%", maxWidth: 200 }}
            >
              <div
                className="text-primary w-full"
                style={{ maxWidth: 120, margin: "0 auto" }}
              >
                {renderIllustration(currentStep.illustration, 120)}
              </div>
            </div>
            {/* Step label */}
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {labels.step} {currentStep.stepNum}
            </span>
          </div>

          {/* Text panel */}
          <div className="flex flex-col gap-4">
            {/* Short caption — large and clear */}
            <p className="font-display text-xl md:text-2xl text-foreground leading-snug">
              {currentStep.caption}
            </p>
            {/* Full instructional text */}
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {currentStep.fullText}
            </p>

            {/* Nav buttons */}
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={prev}
                disabled={active === 0}
                className="p-2 rounded-full border border-white/15 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {/* Progress dots */}
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === active ? "bg-primary w-4" : "bg-white/25 hover:bg-white/50"
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                disabled={active === steps.length - 1}
                className="p-2 rounded-full border border-white/15 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Next step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* All steps strip — small thumbnail row for quick nav */}
      <div className="mt-6 grid gap-3" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
              i === active
                ? "border-primary/40 bg-primary/5"
                : "border-white/5 hover:border-white/15"
            }`}
          >
            {/* Mini illustration */}
            <div className={`transition-colors ${i === active ? "text-primary" : "text-white/30 group-hover:text-white/50"}`}>
              {renderIllustration(step.illustration, 40)}
            </div>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
              {step.stepNum}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
