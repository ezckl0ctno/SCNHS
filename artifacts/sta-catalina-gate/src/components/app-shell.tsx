import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, DoorOpen, House, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientReady } from "@/components/client-ready";
import { Button } from "@/components/ui/button";
import { useSchool } from "@/lib/school/store";

const NAV = [
  { to: "/", label: "Home", icon: House },
  { to: "/gate", label: "Gate", icon: DoorOpen },
  { to: "/office", label: "Office", icon: Landmark },
  { to: "/parent", label: "Parents", icon: Bell },
] as const;

export function AppShell({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker?: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-svh bg-canvas text-ink">
      <header className="border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex min-h-11 items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-sm font-semibold tracking-widest text-primary-fg">
              SC
            </span>
            <span className="leading-tight">
              <span className="block font-display text-sm font-semibold text-balance">
                Sta Catalina NHS
              </span>
              <span className="block text-xs text-muted">Gate attendance</span>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-1 sm:flex">
            {NAV.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm",
                    active ? "bg-leaf text-primary-dark" : "text-muted hover:bg-leaf/50 hover:text-ink",
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.75} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ClientReady>
            <SessionChip />
          </ClientReady>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 pb-24 sm:pb-10">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{kicker}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
        <div className="mt-6">{children}</div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper sm:hidden">
        <div className="grid grid-cols-4">
          {NAV.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px]",
                  active ? "text-primary" : "text-muted",
                )}
              >
                <Icon className="size-5" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function SessionChip() {
  const session = useSchool((s) => s.session);
  const parents = useSchool((s) => s.parents);
  const signOut = useSchool((s) => s.signOut);
  if (session.role === "none") return null;
  const label =
    session.role === "office"
      ? "Office"
      : (parents.find((p) => p.id === session.parentId)?.name ?? "Parent");
  return (
    <span className="flex items-center gap-2">
      <span className="hidden text-xs text-muted sm:inline">{label}</span>
      <Button variant="ghost" className="min-h-9 px-3 text-xs" onClick={signOut}>
        Sign out
      </Button>
    </span>
  );
}
