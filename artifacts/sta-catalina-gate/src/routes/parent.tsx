import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ClientReady } from "@/components/client-ready";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { todayISO } from "@/lib/school/rules";
import { useSchool } from "@/lib/school/store";

export const Route = createFileRoute("/parent")({ component: ParentPage });

function ParentPage() {
  return (
    <AppShell title="Parent desk" kicker="Your child’s day">
      <ClientReady>
        <ParentBody />
      </ClientReady>
    </AppShell>
  );
}

function ParentBody() {
  const session = useSchool((s) => s.session);
  const parents = useSchool((s) => s.parents);
  const students = useSchool((s) => s.students);
  const attendance = useSchool((s) => s.attendance);
  const alerts = useSchool((s) => s.alerts);
  const signOut = useSchool((s) => s.signOut);

  if (session.role !== "parent") {
    return (
      <p className="text-muted">
        Sign in with the email the office gave you on the{" "}
        <Link to="/" className="text-primary underline">
          home page
        </Link>
        .
      </p>
    );
  }

  const parent = parents.find((p) => p.id === session.parentId);
  if (!parent) {
    return (
      <p className="text-muted">
        This parent account is no longer on the roster.{" "}
        <button className="text-primary underline" onClick={signOut}>
          Sign out
        </button>
      </p>
    );
  }

  const kids = students.filter((s) => s.parentId === parent.id);
  const day = todayISO();

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">Signed in as {parent.name}</p>
        <Button variant="ghost" className="min-h-10 text-xs" onClick={signOut}>
          Sign out
        </Button>
      </div>
      {kids.length === 0 ? (
        <p className="rounded-3xl bg-paper p-5 text-sm text-muted shadow-border">
          No students are linked to this account yet. Ask the office to connect your child.
        </p>
      ) : (
        kids.map((kid) => {
          const today = attendance.filter((a) => a.studentId === kid.id && a.date === day);
          const history = attendance.filter((a) => a.studentId === kid.id).slice(0, 12);
          const notes = alerts.filter((a) => a.studentId === kid.id && a.parentId === parent.id).slice(0, 8);
          return (
            <article key={kid.id} className="rounded-3xl bg-paper p-5 shadow-border">
              <h2 className="font-display text-2xl font-semibold">{kid.name}</h2>
              <p className="text-sm text-muted">
                Grade {kid.grade} · {kid.section} · {kid.code}
              </p>
              <h3 className="mt-4 text-xs uppercase tracking-wider text-muted">Today</h3>
              {today.length === 0 ? (
                <p className="mt-2 text-sm text-muted">No gate event yet today.</p>
              ) : (
                <ul className="mt-2 grid gap-2">
                  {today.map((e) => (
                    <li key={e.id} className="flex flex-wrap items-center gap-2 text-sm">
                      <StatusBadge status={e.status} />
                      <span className="tabular-nums text-muted">
                        {new Date(e.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <h3 className="mt-5 text-xs uppercase tracking-wider text-muted">Recent</h3>
              {history.length === 0 ? (
                <p className="mt-2 text-sm text-muted">Nothing recorded yet.</p>
              ) : (
                <ul className="mt-2 divide-y divide-line text-sm">
                  {history.map((e) => (
                    <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                      <span className="text-muted">
                        {new Date(e.createdAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <StatusBadge status={e.status} />
                    </li>
                  ))}
                </ul>
              )}
              <h3 className="mt-5 text-xs uppercase tracking-wider text-muted">Alerts</h3>
              {notes.length === 0 ? (
                <p className="mt-2 text-sm text-muted">No alerts yet.</p>
              ) : (
                <ul className="mt-2 grid gap-2">
                  {notes.map((n) => (
                    <li key={n.id} className="rounded-2xl bg-canvas px-3 py-3 text-sm">
                      {n.text}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })
      )}
    </div>
  );
}
