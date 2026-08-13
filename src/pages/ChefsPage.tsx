import { Layout } from "@/components/Layout";
import { ChefPanel } from "@/components/ChefPanel";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";

export function ChefsPage() {
  const { locale } = useUser();
  const t = dict[locale];
  return (
    <Layout section={t.nav.chefs} showBack>
      <section className="page-pad pt-5 prose-rail">
        <div className="eyebrow">{t.chef.eyebrow}</div>
        <h1 className="display-lg mt-2">{t.chef.title}</h1>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">{t.chef.subtitle}</p>
      </section>
      <section className="page-pad pt-5 pb-6 prose-rail">
        <ChefPanel dishLabel="Mestizo Umami fusion dinner" />
      </section>
    </Layout>
  );
}
