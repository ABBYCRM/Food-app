import { useState } from "react";
import { ChefHat, ExternalLink, Mail, Users, Calendar } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";

/** Build deep-links into real chef-marketplace search results. */
function buildLinks(query: string, zip: string) {
  const q = encodeURIComponent(query);
  const z = encodeURIComponent(zip);
  return [
    { key: "takeAChef", url: `https://www.takeachef.com/en/search?cuisine=${q}${zip ? `&zip_code=${z}` : ""}` },
    { key: "cozyMeal", url: `https://www.cozymeal.com/private-chefs?search=${q}${zip ? `&zip=${z}` : ""}` },
    { key: "hireAChef", url: `https://hireachef.com/find-a-chef${zip ? `?zip=${z}` : ""}` },
    { key: "yelpCatering", url: `https://www.yelp.com/search?find_desc=${q}+catering${zip ? `&find_loc=${z}` : ""}` },
  ] as const;
}

function buildMailto(args: {
  dish: string;
  zip: string;
  partySize: number;
  whenStr: string;
}) {
  const subject = `Chef booking request: ${args.dish}`;
  const body =
    `Hi,\n\nI'd like a private chef to cook a Mestizo Umami dish in my home.\n\n` +
    `Dish: ${args.dish}\n` +
    `Where: ZIP ${args.zip || "(unspecified)"}\n` +
    `Party size: ${args.partySize}\n` +
    `When: ${args.whenStr || "(flexible)"}\n\n` +
    `Please share availability and quote.\n\nThanks.`;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ChefPanel({ dishLabel }: { dishLabel: string }) {
  const { locale, zip, setZip } = useUser();
  const t = dict[locale];
  const [partySize, setPartySize] = useState(4);
  const [whenStr, setWhenStr] = useState("");
  const links = buildLinks(dishLabel, zip);

  function openMail() {
    const url = buildMailto({ dish: dishLabel, zip, partySize, whenStr });
    window.location.href = url;
  }

  return (
    <section className="card-surface px-4 py-4 space-y-4">
      <div>
        <div className="eyebrow flex items-center gap-2">
          <ChefHat size={12} /> {t.chef.eyebrow}
        </div>
        <h3 className="display-md mt-1">{t.chef.title}</h3>
        <p className="mt-2 text-sm text-ink-soft leading-relaxed">
          {t.chef.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <label className="text-xs">
          <span className="eyebrow block mb-1.5">{t.chef.deliverTo}</span>
          <input
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/[^0-9A-Za-z-]/g, "").slice(0, 8))}
            placeholder="—"
            className="input !text-sm"
          />
        </label>
        <label className="text-xs">
          <span className="eyebrow block mb-1.5 flex items-center gap-1"><Users size={11} /> {t.chef.partySize}</span>
          <input
            type="number"
            min={1}
            max={200}
            value={partySize}
            onChange={(e) => setPartySize(Math.max(1, Math.min(200, Number(e.target.value) || 1)))}
            className="input !text-sm"
          />
        </label>
        <label className="text-xs">
          <span className="eyebrow block mb-1.5 flex items-center gap-1"><Calendar size={11} /> {t.chef.when}</span>
          <input
            type="date"
            value={whenStr}
            onChange={(e) => setWhenStr(e.target.value)}
            className="input !text-sm"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {links.map((l) => (
          <a
            key={l.key}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-surface px-4 py-3 text-sm font-semibold flex items-center justify-between gap-2 hover:-translate-y-0.5 hover:shadow-card-hover transition-all"
          >
            <span>{t.chef[l.key as "takeAChef" | "cozyMeal" | "hireAChef" | "yelpCatering"]}</span>
            <ExternalLink size={14} className="text-chili" />
          </a>
        ))}
      </div>

      <button type="button" onClick={openMail} className="btn btn-primary btn-block">
        <Mail size={15} /> {t.chef.requestQuote}
      </button>

      <p className="text-[10.5px] text-ink-muted leading-snug">{t.chef.note}</p>
    </section>
  );
}
