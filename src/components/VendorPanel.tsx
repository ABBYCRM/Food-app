import { useEffect, useState } from "react";
import { MapPin, Phone, ExternalLink, Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";
import { searchVendorsByZip, type LocalVendor, type VendorsResult } from "@/lib/vendor";

export function VendorPanel() {
  const { locale, zip, setZip } = useUser();
  const t = dict[locale];
  const [draft, setDraft] = useState(zip);
  const [result, setResult] = useState<VendorsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Re-fetch when the saved ZIP changes. */
  useEffect(() => {
    if (!zip) { setResult(null); return; }
    let cancelled = false;
    setLoading(true);
    setError(null);
    searchVendorsByZip(zip)
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) setError(String(e?.message ?? e)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [zip]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setZip(draft.trim());
  };

  const vendors = result?.vendors ?? [];

  return (
    <section className="card-surface px-4 py-4 space-y-3">
      <div>
        <div className="eyebrow flex items-center gap-2">
          <MapPin size={12} /> {t.vendor.title}
        </div>
        <p className="text-sm text-ink-muted mt-1 leading-snug">
          {t.vendor.subtitle}
        </p>
      </div>
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t.shopping.zipPlaceholder}
          className="input input-sm flex-1"
          inputMode="numeric"
        />
        <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
          {loading ? <Loader2 size={13} className="animate-spin" /> : t.vendor.findButton}
        </button>
      </form>

      {loading ? (
        <p className="text-xs text-ink-muted italic">{t.vendor.searching}</p>
      ) : error ? (
        <p className="text-xs text-chili">{error}</p>
      ) : vendors.length > 0 ? (
        <>
          {result ? (
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-chili/80 text-center">
              ~ {t.vendor.resultsNear(vendors.length, result.city, result.state)}
            </p>
          ) : null}
          <ul className="space-y-2">
            {vendors.map((v: LocalVendor) => (
              <li key={`${v.name}-${v.lat}-${v.lon}`} className="flex items-start justify-between gap-3 px-3 py-2.5 rounded-input bg-ink/[0.04]">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold truncate">
                    {v.name}
                    {v.brand && v.brand !== v.name ? (
                      <span className="text-[10px] uppercase tracking-wide text-ink-muted ml-1.5 font-medium">· {v.brand}</span>
                    ) : null}
                  </div>
                  <div className="text-xs text-ink-muted truncate">
                    {v.address ? `${v.address} · ` : ""}{v.city}, {v.state} · {t.vendor.distance(v.miles)} · {v.kind}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {v.phone ? (
                    <a href={`tel:${v.phone}`} className="text-chili p-1.5" aria-label={t.vendor.callToOrder}>
                      <Phone size={14} />
                    </a>
                  ) : null}
                  {v.url ? (
                    <a href={v.url} target="_blank" rel="noreferrer" className="text-chili p-1.5" aria-label={t.vendor.visitWebsite}>
                      <ExternalLink size={14} />
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : zip ? (
        <p className="text-xs text-ink-muted leading-relaxed">{t.vendor.none}</p>
      ) : null}

      <p className="text-[10.5px] text-ink-muted leading-snug border-t border-line-soft pt-2.5">
        {t.vendor.deliveryServices}
      </p>
    </section>
  );
}
