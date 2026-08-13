import { useMemo, useState } from "react";
import { MapPin, Phone, ExternalLink } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";
import { vendorsForZip } from "@/lib/vendor";

export function VendorPanel() {
  const { locale, zip, setZip } = useUser();
  const t = dict[locale];
  const [draft, setDraft] = useState(zip);

  const vendors = useMemo(() => vendorsForZip(zip), [zip]);

  return (
    <section className="card-surface px-4 py-4 space-y-3">
      <div>
        <div className="eyebrow flex items-center gap-2">
          <MapPin size={12} /> {t.vendor.title}
        </div>
        <p className="text-sm text-[var(--color-ink-muted)] mt-1 leading-snug">
          {t.vendor.subtitle}
        </p>
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); setZip(draft.trim()); }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t.shopping.zipPlaceholder}
          className="flex-1 px-3 py-2 rounded-lg border border-[rgba(28,20,14,0.15)] bg-white text-sm focus:outline-none focus:border-[var(--color-chili)]"
        />
        <button type="submit" className="btn-primary !py-2 !px-4 !text-sm">
          {t.vendor.findButton}
        </button>
      </form>

      {vendors.length > 0 ? (
        <ul className="space-y-2">
          {vendors.map((v) => (
            <li key={v.name} className="flex items-start justify-between gap-3 px-3 py-2.5 rounded-lg bg-[rgba(28,20,14,0.04)]">
              <div>
                <div className="text-sm font-semibold">{v.name}</div>
                <div className="text-xs text-[var(--color-ink-muted)]">
                  {v.city}, {v.state} · {t.vendor.distance(v.miles)} · {v.kind}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {v.phone ? (
                  <a href={`tel:${v.phone}`} className="text-[var(--color-chili)]" aria-label={t.vendor.callToOrder}>
                    <Phone size={14} />
                  </a>
                ) : null}
                {v.url ? (
                  <a href={v.url} target="_blank" rel="noreferrer" className="text-[var(--color-chili)]">
                    <ExternalLink size={14} />
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : zip ? (
        <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">{t.vendor.none}</p>
      ) : null}

      <p className="text-[10.5px] text-[var(--color-ink-muted)] leading-snug border-t border-[rgba(28,20,14,0.06)] pt-2.5">
        {t.vendor.deliveryServices}
      </p>
    </section>
  );
}
