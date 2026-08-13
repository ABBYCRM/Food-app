import { Layout } from "@/components/Layout";
import { VendorPanel } from "@/components/VendorPanel";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";

export function VendorPage() {
  const { locale } = useUser();
  const t = dict[locale];
  return (
    <Layout section={t.home.nearMe} showBack>
      <section className="page-pad pt-5">
        <h1 className="display-lg">{t.vendor.title}</h1>
        <p className="mt-2 text-sm text-ink-soft leading-relaxed">{t.vendor.subtitle}</p>
      </section>
      <section className="page-pad pt-5 pb-6">
        <VendorPanel />
      </section>
    </Layout>
  );
}
