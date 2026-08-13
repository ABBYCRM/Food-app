import { Layout } from "@/components/Layout";
import { ChefPanel } from "@/components/ChefPanel";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";

/**
 * Chefs page — the chef-booking integration is paused. The ChefPanel
 * component renders a single "coming soon" card with no functional
 * inputs (no ZIP lookup, no form, no marketplace deep-links, no mailto).
 * The page itself is kept as a route so the bottom-nav / quick-tile
 * entry points still resolve to a coherent surface.
 */
export function ChefsPage() {
  const { locale } = useUser();
  const t = dict[locale];
  return (
    <Layout section={t.nav.chefs} showBack>
      <section className="page-pad pt-5 prose-rail">
        <div className="eyebrow">{t.chef.eyebrow}</div>
        <h1 className="display-lg mt-2">{t.chef.title}</h1>
        <p className="mt-2 text-sm text-ink-soft leading-relaxed">{t.chef.subtitle}</p>
      </section>
      <section className="page-pad pt-5 pb-6 prose-rail">
        <ChefPanel dishLabel="Mestizo Umami fusion dinner" />
      </section>
    </Layout>
  );
}
