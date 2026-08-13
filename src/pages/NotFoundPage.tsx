import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";

export function NotFoundPage() {
  const { locale } = useUser();
  const [, navigate] = useLocation();
  const t = dict[locale];
  return (
    <Layout showBack>
      <section className="page-pad py-16 text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-xl mt-2 text-[var(--color-chili)]">{t.notFound.title}</h1>
        <p className="mt-4 text-sm text-[var(--color-ink-muted)]">{t.notFound.body}</p>
        <button type="button" onClick={() => navigate("/")} className="btn-primary mt-7 mx-auto">
          <ArrowLeft size={15} /> {t.notFound.action}
        </button>
      </section>
    </Layout>
  );
}
