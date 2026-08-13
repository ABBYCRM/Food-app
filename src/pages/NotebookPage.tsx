import { useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Plus, Trash2, Share2, Download, Upload, GitFork, Edit2, X } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PaywallModal } from "@/components/PaywallModal";
import { useUser, type UserRecipe } from "@/context/UserContext";
import { useTrial } from "@/context/TrialContext";
import { dict } from "@/i18n";
import { exportAll, importAll } from "@/lib/storage";
import { cn } from "@/lib/cn";

type Tab = "notes" | "forks" | "mine";

export function NotebookPage() {
  const { locale, notesByRecipe, userRecipes, deleteUserRecipe, addUserRecipe, updateUserRecipe } = useUser();
  const { canWrite } = useTrial();
  const [, navigate] = useLocation();
  const t = dict[locale];
  const [tab, setTab] = useState<Tab>("mine");
  const [editing, setEditing] = useState<UserRecipe | null>(null);
  const [creating, setCreating] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  const forks = useMemo(() => userRecipes.filter((u) => u.forkedFrom), [userRecipes]);
  const owns = useMemo(() => userRecipes.filter((u) => !u.forkedFrom), [userRecipes]);

  function doExport() {
    const json = exportAll();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mestizo-umami-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onImportFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        if (importAll(reader.result)) window.location.reload();
      }
    };
    reader.readAsText(file);
  }

  async function shareRecipe(r: UserRecipe) {
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify(r))));
    const url = `${window.location.origin}/recipe-shared#${payload}`;
    if (navigator.share) {
      try { await navigator.share({ title: r.title, url }); return; } catch { /* */ }
    }
    try { await navigator.clipboard.writeText(url); alert(t.notebook.shareCopied); } catch { /* */ }
  }

  const requireWrite = (action: () => void) => {
    if (!canWrite) {
      setPaywallOpen(true);
      return;
    }
    action();
  };

  return (
    <Layout section={t.nav.notebook}>
      {!canWrite ? (
        <section className="page-pad pt-5">
          <div className="card-surface px-4 py-4 flex items-start gap-3 border-l-4 !border-l-corn">
            <GitFork size={16} className="text-corn mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
                🔒 Subscribe to write
              </div>
              <p className="text-xs text-ink-muted leading-snug mt-0.5">
                The notebook (forks, personal recipes, and notes) is a Pro feature. You can still browse every recipe and the planner.
              </p>
              <button
                type="button"
                onClick={() => setPaywallOpen(true)}
                className="btn btn-primary btn-sm mt-2.5"
              >
                Unlock notebook
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="page-pad pt-5">
        <h1 className="display-lg">{t.notebook.title}</h1>
        <p className="mt-2 text-sm text-ink-soft leading-relaxed">{t.notebook.subtitle}</p>
      </section>

      <section className="page-pad pt-4 flex items-center gap-1.5 flex-wrap">
        {([
          { key: "mine", label: t.notebook.tabsMine, count: owns.length },
          { key: "forks", label: t.notebook.tabsForks, count: forks.length },
          { key: "notes", label: t.notebook.tabsNotes, count: Object.keys(notesByRecipe).length },
        ] as const).map((tt) => (
          <button
            key={tt.key}
            type="button"
            onClick={() => setTab(tt.key)}
            aria-pressed={tab === tt.key}
            className={cn(
              "chip",
              tab === tt.key
                ? "bg-chili text-bone-50 border-chili"
                : "bg-ink/[0.06] text-ink border-transparent"
            )}
          >
            {tt.label} <span className="opacity-70">({tt.count})</span>
          </button>
        ))}
      </section>

      <section className="page-pad pt-4 flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => requireWrite(() => setCreating(true))}
          className="btn btn-primary !py-2 !px-3.5 !text-sm"
        >
          <Plus size={14} /> {t.notebook.newRecipe}
        </button>
        <button
          type="button"
          onClick={() => requireWrite(doExport)}
          className="btn btn-ghost !py-2 !px-3.5 !text-xs"
        >
          <Download size={13} /> {t.notebook.export}
        </button>
        <button
          type="button"
          onClick={() => requireWrite(() => importRef.current?.click())}
          className="btn btn-ghost !py-2 !px-3.5 !text-xs"
        >
          <Upload size={13} /> {t.notebook.import}
        </button>
        <input
          ref={importRef}
          type="file"
          accept="application/json"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onImportFile(f); }}
          className="hidden"
        />
      </section>

      <section className="page-pad pt-5 space-y-3">
        {tab === "mine" ? (
          owns.length === 0 ? (
            <Empty text={t.notebook.emptyMine} />
          ) : owns.map((r) => (
            <UserRecipeCard
              key={r.id}
              r={r}
              onEdit={() => requireWrite(() => setEditing(r))}
              onDelete={() => requireWrite(() => { if (window.confirm(t.notebook.deleteConfirm)) deleteUserRecipe(r.id); })}
              onShare={() => shareRecipe(r)}
              t={t}
            />
          ))
        ) : null}

        {tab === "forks" ? (
          forks.length === 0 ? (
            <Empty text={t.notebook.empty} />
          ) : forks.map((r) => (
            <UserRecipeCard
              key={r.id}
              r={r}
              onEdit={() => requireWrite(() => setEditing(r))}
              onDelete={() => requireWrite(() => { if (window.confirm(t.notebook.deleteConfirm)) deleteUserRecipe(r.id); })}
              onShare={() => shareRecipe(r)}
              t={t}
              showFork
              onOpenSource={r.forkedFrom ? () => navigate(`/recipe/${r.forkedFrom}`) : undefined}
            />
          ))
        ) : null}

        {tab === "notes" ? (
          Object.keys(notesByRecipe).length === 0 ? (
            <Empty text={t.notebook.empty} />
          ) : (
            Object.entries(notesByRecipe).map(([slug, n]) => (
              <button
                key={slug}
                type="button"
                onClick={() => navigate(`/recipe/${slug}`)}
                className="card-surface w-full text-left px-4 py-3 hover:-translate-y-0.5 transition-transform"
              >
                <div className="eyebrow">{slug.replace(/-/g, " ").slice(0, 60)}</div>
                <p className="text-sm mt-1 leading-snug whitespace-pre-line text-ink-soft">{n}</p>
              </button>
            ))
          )
        ) : null}
      </section>

      <section className="py-6" />

      {(editing || creating) ? (
        <RecipeEditor
          initial={editing ?? undefined}
          onCancel={() => { setEditing(null); setCreating(false); }}
          onSave={(data) => {
            if (editing) updateUserRecipe(editing.id, data);
            else addUserRecipe(data as Omit<UserRecipe, "id" | "createdAt">);
            setEditing(null);
            setCreating(false);
          }}
          t={t}
          locale={locale}
        />
      ) : null}

      {paywallOpen ? <PaywallModal force onClose={() => setPaywallOpen(false)} /> : null}
    </Layout>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="text-center text-sm italic text-ink-muted py-10 card-surface px-5">
      {text}
    </div>
  );
}

function UserRecipeCard({
  r, onEdit, onDelete, onShare, onOpenSource, showFork, t,
}: {
  r: UserRecipe;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
  onOpenSource?: () => void;
  showFork?: boolean;
  t: typeof dict.en;
}) {
  return (
    <article className="card-surface px-4 py-3.5">
      <div className="flex items-start gap-2.5">
        {showFork ? <GitFork size={14} className="mt-1 text-ink-muted shrink-0" /> : null}
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg leading-tight">{r.title}</h3>
          <p className="text-xs text-ink-muted mt-0.5">{r.subtitle}</p>
        </div>
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={onShare} className="p-1.5 rounded-pill hover:bg-ink/[0.06] text-ink-muted" aria-label={t.notebook.share}>
            <Share2 size={14} />
          </button>
          <button type="button" onClick={onEdit} className="p-1.5 rounded-pill hover:bg-ink/[0.06] text-ink-muted" aria-label={t.common.edit}>
            <Edit2 size={14} />
          </button>
          <button type="button" onClick={onDelete} className="p-1.5 rounded-pill hover:bg-ink/[0.06] text-chili" aria-label={t.common.delete}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {r.story ? <p className="text-xs italic text-ink-soft mt-2 leading-snug">{r.story}</p> : null}
      <div className="mt-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-ink-muted">
        <span>{r.serves} {t.recipe.servings.toLowerCase()}</span>
        <span>· {r.minutes} {t.recipes.minutes}</span>
        {onOpenSource ? (
          <button type="button" onClick={onOpenSource} className="ml-auto text-chili tracking-wide">
            {t.recipe.related.toUpperCase()}
          </button>
        ) : null}
      </div>
    </article>
  );
}

function RecipeEditor({
  initial,
  onCancel,
  onSave,
  t,
  locale,
}: {
  initial?: UserRecipe;
  onCancel: () => void;
  onSave: (r: Omit<UserRecipe, "id" | "createdAt">) => void;
  t: typeof dict.en;
  locale: string;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [story, setStory] = useState(initial?.story ?? "");
  const [ingredients, setIngredients] = useState(initial?.ingredients.join("\n") ?? "");
  const [method, setMethod] = useState(initial?.method.join("\n") ?? "");
  const [serves, setServes] = useState(initial?.serves ?? 4);
  const [minutes, setMinutes] = useState(initial?.minutes ?? 30);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      subtitle: subtitle.trim(),
      story: story.trim(),
      ingredients: ingredients.split("\n").map((s) => s.trim()).filter(Boolean),
      method: method.split("\n").map((s) => s.trim()).filter(Boolean),
      serves,
      minutes,
      forkedFrom: initial?.forkedFrom,
    });
  }

  return (
    <div className="fixed inset-0 z-modal bg-ink/55 backdrop-blur-sm grid place-items-center px-3" role="dialog" aria-modal="true">
      <form onSubmit={submit} className="max-w-[440px] w-full bg-bone-50 rounded-card-lg overflow-hidden flex flex-col max-h-[90vh] card-surface">
        <div className="px-4 py-3 border-b border-line-soft flex items-center justify-between">
          <div className="font-display text-lg">{initial ? t.common.edit : t.notebook.newRecipe}</div>
          <button type="button" onClick={onCancel} className="p-1 rounded-pill hover:bg-ink/[0.06]" aria-label={t.common.cancel}><X size={16} /></button>
        </div>
        <div className="flex-1 overflow-auto px-4 py-3 space-y-3 text-sm">
          <Field label={t.notebook.fields.title}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" required />
          </Field>
          <Field label={t.notebook.fields.subtitle}>
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="input" />
          </Field>
          <Field label={t.notebook.fields.story}>
            <textarea value={story} onChange={(e) => setStory(e.target.value)} rows={3} className="textarea" />
          </Field>
          <Field label={t.notebook.fields.ingredients}>
            <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} rows={6} className="textarea font-mono text-xs" />
          </Field>
          <Field label={t.notebook.fields.method}>
            <textarea value={method} onChange={(e) => setMethod(e.target.value)} rows={6} className="textarea" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t.notebook.fields.serves}>
              <input type="number" min={1} max={50} value={serves} onChange={(e) => setServes(Number(e.target.value))} className="input" />
            </Field>
            <Field label={t.notebook.fields.minutes}>
              <input type="number" min={1} max={2000} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="input" />
            </Field>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-line-soft flex items-center gap-2">
          <button type="button" onClick={onCancel} className="btn btn-ghost flex-1">{t.common.cancel}</button>
          <button type="submit" className="btn btn-primary flex-1">{t.notebook.fields.save}</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="field-label block mb-1.5">{label}</span>
      {children}
    </label>
  );
}
