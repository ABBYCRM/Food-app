import { useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Plus, Trash2, Share2, Download, Upload, GitFork, Edit2, X } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useUser, type UserRecipe } from "@/context/UserContext";
import { dict } from "@/i18n";
import { cn } from "@/lib/cn";
import { encodeSharedRecipe } from "@/lib/sharedRecipe";

type Tab = "notes" | "forks" | "mine";

export function NotebookPage() {
  const {
    locale, notesByRecipe, userRecipes, deleteUserRecipe, addUserRecipe,
    updateUserRecipe, exportData, importData, syncError,
  } = useUser();
  const [, navigate] = useLocation();
  const t = dict[locale];
  const [tab, setTab] = useState<Tab>("mine");
  const [editing, setEditing] = useState<UserRecipe | null>(null);
  const [creating, setCreating] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const forks = useMemo(() => userRecipes.filter((u) => u.forkedFrom), [userRecipes]);
  const owns = useMemo(() => userRecipes.filter((u) => !u.forkedFrom), [userRecipes]);

  async function doExport() {
    const json = await exportData();
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
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        const confirmed = window.confirm("Importing replaces the recipes and workspace currently saved to this account. Continue?");
        if (confirmed && await importData(reader.result)) window.location.reload();
      }
    };
    reader.readAsText(file);
  }

  async function shareRecipe(r: UserRecipe) {
    setShareError(null);
    try {
      const payload = encodeSharedRecipe(r);
      const url = `${window.location.origin}/recipe-shared#${payload}`;
      if (navigator.share) {
        try { await navigator.share({ title: r.title, url }); return; } catch { /* fall back to copy */ }
      }
      await navigator.clipboard.writeText(url);
      alert(t.notebook.shareCopied);
    } catch {
      setShareError(t.notebook.shareError);
    }
  }

  return (
    <Layout section={t.nav.notebook}>
      <section className="page-pad pt-5">
        <h1 className="display-lg">{t.notebook.title}</h1>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">{t.notebook.subtitle}</p>
      </section>

      <section className="page-pad pt-4 flex items-center gap-1.5">
        {([
          { key: "mine", label: t.notebook.tabsMine, count: owns.length },
          { key: "forks", label: t.notebook.tabsForks, count: forks.length },
          { key: "notes", label: t.notebook.tabsNotes, count: Object.keys(notesByRecipe).length },
        ] as const).map((tt) => (
          <button
            key={tt.key}
            type="button"
            onClick={() => setTab(tt.key)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors",
              tab === tt.key ? "bg-[var(--color-chili)] text-[var(--color-bone-50)]" : "bg-[rgba(28,20,14,0.06)] text-[var(--color-ink)]"
            )}
          >
            {tt.label} <span className="opacity-70">({tt.count})</span>
          </button>
        ))}
      </section>

      <section className="page-pad pt-4 flex items-center gap-2">
        <button type="button" onClick={() => setCreating(true)} className="btn-primary !py-2 !px-3.5 !text-sm">
          <Plus size={14} /> {t.notebook.newRecipe}
        </button>
        <button type="button" onClick={() => void doExport()} className="btn-ghost !py-2 !px-3.5 !text-xs">
          <Download size={13} /> {t.notebook.export}
        </button>
        <button type="button" onClick={() => importRef.current?.click()} className="btn-ghost !py-2 !px-3.5 !text-xs">
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

      {syncError ? (
        <section className="page-pad pt-3">
          <p role="alert" className="text-xs text-[var(--color-chili)]">{syncError}</p>
        </section>
      ) : null}
      {shareError ? (
        <section className="page-pad pt-3">
          <p role="alert" className="text-xs text-[var(--color-chili)]">{shareError}</p>
        </section>
      ) : null}

      <section className="page-pad pt-5 space-y-3">
        {tab === "mine" ? (
          owns.length === 0 ? (
            <Empty text={t.notebook.emptyMine} />
          ) : owns.map((r) => (
            <UserRecipeCard
              key={r.id}
              r={r}
              onEdit={() => setEditing(r)}
              onDelete={() => { if (window.confirm(t.notebook.deleteConfirm)) deleteUserRecipe(r.id); }}
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
              onEdit={() => setEditing(r)}
              onDelete={() => { if (window.confirm(t.notebook.deleteConfirm)) deleteUserRecipe(r.id); }}
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
                className="card-surface w-full text-left px-4 py-3"
              >
                <div className="eyebrow">{slug.replace(/-/g, " ").slice(0, 60)}</div>
                <p className="text-sm mt-1 leading-snug whitespace-pre-line">{n}</p>
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
    </Layout>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="text-center text-sm italic text-[var(--color-ink-muted)] py-10 card-surface px-5">
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
        {showFork ? <GitFork size={14} className="mt-1 text-[var(--color-ink-muted)] shrink-0" /> : null}
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg leading-tight">{r.title}</h3>
          <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">{r.subtitle}</p>
        </div>
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={onShare} className="p-1.5 rounded-full hover:bg-[rgba(28,20,14,0.06)] text-[var(--color-ink-muted)]" aria-label={t.notebook.share}>
            <Share2 size={14} />
          </button>
          <button type="button" onClick={onEdit} className="p-1.5 rounded-full hover:bg-[rgba(28,20,14,0.06)] text-[var(--color-ink-muted)]" aria-label={t.common.edit}>
            <Edit2 size={14} />
          </button>
          <button type="button" onClick={onDelete} className="p-1.5 rounded-full hover:bg-[rgba(28,20,14,0.06)] text-[var(--color-chili)]" aria-label={t.common.delete}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {r.story ? <p className="text-xs italic text-[var(--color-ink-soft)] mt-2 leading-snug">{r.story}</p> : null}
      <div className="mt-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
        <span>{r.serves} {t.recipe.servings.toLowerCase()}</span>
        <span>· {r.minutes} {t.recipes.minutes}</span>
        {onOpenSource ? (
          <button type="button" onClick={onOpenSource} className="ml-auto text-[var(--color-chili)] tracking-wide">
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
    <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm grid place-items-center px-3">
      <form onSubmit={submit} className="max-w-[440px] w-full bg-[var(--color-bone-50)] rounded-[1.4rem] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-4 py-3 border-b border-[rgba(28,20,14,0.08)] flex items-center justify-between">
          <div className="font-display text-lg">{initial ? t.common.edit : t.notebook.newRecipe}</div>
          <button type="button" onClick={onCancel} className="p-1 rounded-full hover:bg-[rgba(28,20,14,0.06)]"><X size={16} /></button>
        </div>
        <div className="flex-1 overflow-auto px-4 py-3 space-y-3 text-sm">
          <Field label={t.notebook.fields.title}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="field" required />
          </Field>
          <Field label={t.notebook.fields.subtitle}>
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="field" />
          </Field>
          <Field label={t.notebook.fields.story}>
            <textarea value={story} onChange={(e) => setStory(e.target.value)} rows={3} className="field" />
          </Field>
          <Field label={t.notebook.fields.ingredients}>
            <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} rows={6} className="field font-mono text-xs" />
          </Field>
          <Field label={t.notebook.fields.method}>
            <textarea value={method} onChange={(e) => setMethod(e.target.value)} rows={6} className="field" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t.notebook.fields.serves}>
              <input type="number" min={1} max={50} value={serves} onChange={(e) => setServes(Number(e.target.value))} className="field" />
            </Field>
            <Field label={t.notebook.fields.minutes}>
              <input type="number" min={1} max={2000} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="field" />
            </Field>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-[rgba(28,20,14,0.08)] flex items-center gap-2">
          <button type="button" onClick={onCancel} className="btn-ghost flex-1 justify-center">{t.common.cancel}</button>
          <button type="submit" className="btn-primary flex-1 justify-center">{t.notebook.fields.save}</button>
        </div>
      </form>
      <style>{`.field{width:100%;padding:0.55rem 0.75rem;border-radius:0.5rem;border:1px solid rgba(28,20,14,0.15);background:white;font-size:0.85rem;line-height:1.45}.field:focus{outline:none;border-color:var(--color-chili)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-1.5">{label}</span>
      {children}
    </label>
  );
}
