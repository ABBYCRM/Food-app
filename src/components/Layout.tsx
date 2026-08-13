import type { ReactNode } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

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
      <main className="flex-1 pb-2 fade-up">{children}</main>
      <BottomNav />
    </div>
  );
}
