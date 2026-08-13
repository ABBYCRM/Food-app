import type { ReactNode } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { TopNav } from "./TopNav";

export function Layout({
  children,
  section,
  showBack,
  hideHeader,
}: {
  children: ReactNode;
  section?: string;
  showBack?: boolean;
  hideHeader?: boolean;
}) {
  return (
    <div className="app-shell">
      {hideHeader ? null : <Header section={section} showBack={showBack} />}
      {/* TopNav is lg-only, BottomNav is hidden at lg — exactly one is ever visible. */}
      <TopNav />
      <main className="flex-1 pb-2 fade-up">{children}</main>
      <BottomNav />
    </div>
  );
}
