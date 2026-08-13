import { useEffect, useMemo, useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";
import { vendorSearchesForLocation, type VendorSearchKind } from "@/lib/vendor";

export function VendorPanel() {
  const { locale, zip, setZip } = useUser();
  const t = dict[locale];
  const [draft, setDraft] = useState(zip);

  useEffect(() => setDraft(zip), [zip]);

  const searches = useMemo(() => vendorSearchesForLocation(zip), [zip]);
  const labels: Record<VendorSearchKind, string> = {
    asian: t.vendor.searchAsian,
    mexican: t.vendor.searchMexican,
    market: t.vendor.searchMarket,
    international: t.vendor.searchInternational,
  };

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
        onSubmit={(e) => {
          e.preventDefault();
          setZip(draft.trim().replace(/[^0-9A-Za-z -]/g, "").slice(0, 16));
        }}
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

      {searches.length > 0 ? (
        <>
          <ul className="grid sm:grid-cols-2 gap-2">
            {searches.map((search) => (
              <li key={search.kind}>
                <a href={search.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 px-3 py-3 rounded-lg bg-[rgba(28,20,14,0.04)] hover:bg-[rgba(28,20,14,0.08)] transition-colors">
                  <span className="text-sm font-semibold">{labels[search.kind]}</span>
                  <ExternalLink size={14} className="text-[var(--color-chili)] shrink-0" />
                </a>
              </li>
            ))}
          </ul>
          <p className="text-[10.5px] text-[var(--color-ink-muted)] leading-snug">{t.vendor.liveNote}</p>
        </>
      ) : null}

      <p className="text-[10.5px] text-[var(--color-ink-muted)] leading-snug border-t border-[rgba(28,20,14,0.06)] pt-2.5">
        {t.vendor.deliveryServices}
      </p>
    </section>
  );
}
