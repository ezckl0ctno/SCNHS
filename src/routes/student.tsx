import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/app-shell";
import { ClientReady } from "@/components/client-ready";
import { Field } from "@/components/field";
import { SectionPicker } from "@/components/section-picker";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { todayISO } from "@/lib/school/rules";
import { sectionLabel, studentsInSection } from "@/lib/school/sections";
import { useSchool } from "@/lib/school/store";

export const Route = createFileRoute("/student")({ component: StudentPage });

function StudentPage() {
  return (
    <AppShell title="Student desk" kicker="Sign in to your section">
      <ClientReady>
        <StudentBody />
      </ClientReady>
    </AppShell>
  );
}

function StudentBody() {
  const session = useSchool((s) => s.session);
  if (session.role !== "student") return <StudentSignIn />;
  return <StudentDesk studentId={session.studentId} />;
}

function StudentSignIn() {
  const sections = useSchool((s) => s.sections);
  const signInStudent = useSchool((s) => s.signInStudent);
  const [sectionId, setSectionId] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const result = await signInStudent(
      sectionId,
      String(data.get("code") || ""),
      String(data.get("pin") || ""),
    );
    if (!result.ok) setError(result.error);
  }

  return (
    <form className="max-w-md rounded-3xl bg-paper p-5 shadow-border" onSubmit={onSubmit}>
      <h2 className="font-display text-xl font-semibold">Your section only</h2>
      <p className="mt-1 text-sm text-muted">
        Choose the grade and section on your class list. A PIN from another section will not
        open this desk.
      </p>
      <div className="mt-4 grid gap-3">
        <label className="text-xs uppercase tracking-wider text-muted">
          Section
          <SectionPicker sections={sections} value={sectionId} onChange={setSectionId} />
        </label>
        <Field name="code" label="Student code" placeholder="STU-1001" required autoComplete="username" />
        <Field name="pin" label="PIN" required autoComplete="current-password" />
        <Button type="submit">Sign in</Button>
        {error ? <p className="text-sm text-rose">{error}</p> : null}
      </div>
    </form>
  );
}

function StudentDesk({ studentId }: { studentId: string }) {
  const students = useSchool((s) => s.students);
  const sections = useSchool((s) => s.sections);
  const attendance = useSchool((s) => s.attendance);
  const signOut = useSchool((s) => s.signOut);
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return (
      <p className="text-muted">
        This student is no longer on the roster.{" "}
        <button className="text-primary underline" onClick={signOut}>
          Sign out
        </button>
      </p>
    );
  }

  const section = sections.find((s) => s.id === student.sectionId);
  const classmates = studentsInSection(students, student.sectionId)
    .filter((s) => s.id !== student.id)
    .sort((a, b) => a.name.localeCompare(b.name));
  const day = todayISO();
  const today = attendance.filter((a) => a.studentId === student.id && a.date === day);
  const history = attendance.filter((a) => a.studentId === student.id).slice(0, 16);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">
          Signed in as {student.name}
          {section ? ` · ${sectionLabel(section)}` : ""}
        </p>
        <Button variant="ghost" className="min-h-10 text-xs" onClick={signOut}>
          Sign out
        </Button>
      </div>

      <article className="rounded-3xl bg-paper p-5 shadow-border">
        <h2 className="font-display text-2xl font-semibold">{student.name}</h2>
        <p className="text-sm text-muted">
          {section ? sectionLabel(section) : `Grade ${student.grade} ${student.section}`} · {student.code}
        </p>
        {section?.adviser ? <p className="mt-1 text-sm text-muted">Adviser: {section.adviser}</p> : null}

        <h3 className="mt-5 text-xs uppercase tracking-wider text-muted">Today</h3>
        {today.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No gate event yet today. Check in at the gate kiosk.</p>
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
      </article>

      <article className="rounded-3xl bg-paper p-5 shadow-border">
        <h2 className="font-display text-xl font-semibold">Classmates in this section</h2>
        <p className="mt-1 text-sm text-muted">Names only. You cannot open another section from here.</p>
        {classmates.length === 0 ? (
          <p className="mt-3 text-sm text-muted">You are the only student listed in this section so far.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line text-sm">
            {classmates.map((c) => (
              <li key={c.id} className="py-2">
                {c.name}
              </li>
            ))}
          </ul>
        )}
      </article>

      <p className="text-sm text-muted">
        Gate check-in is on the{" "}
        <Link to="/gate" className="text-primary underline">
          Gate
        </Link>{" "}
        page. Parents use a separate sign-in.
      </p>
    </div>
  );
}
