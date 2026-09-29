import { useSyncExternalStore, type ReactNode } from "react";

function subscribe() {
  return () => {};
}

export function ClientReady({ children }: { children: ReactNode }) {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  if (!ready) {
    return (
      <div className="rounded-2xl bg-paper px-5 py-8 text-muted shadow-border">
        Opening the gate desk…
      </div>
    );
  }
  return children;
}
