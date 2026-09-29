import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ClientReady } from "@/components/client-ready";
import { FaceCapture } from "@/components/face-capture";
import { SectionPicker } from "@/components/section-picker";
import { Button } from "@/components/ui/button";
import { STATUS_LABEL } from "@/lib/school/rules";
import { sectionLabel, studentsInSection } from "@/lib/school/sections";
import { useSchool } from "@/lib/school/store";
import type { AttendanceEvent, Student } from "@/lib/school/types";

export const Route = createFileRoute("/gate")({ component: GatePage });

function GatePage() {
  return (
    <AppShell title="School Facial Recognition" kicker="Check in / check out by section">
      <ClientReady>
        <GateBody />
      </ClientReady>
    </AppShell>
  );
}

function GateBody() {
  const checkPin = useSchool((s) => s.checkPin);
  const checkFace = useSchool((s) => s.checkFace);
  const students = useSchool((s) => s.students);
  const sections = useSchool((s) => s.sections);
  const [sectionId, setSectionId] = useState("");
  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");
  const [pendingFace, setPendingFace] = useState<number[] | null>(null);
  const [error, setError] = useState("");
  const [last, setLast] = useState<{ student: Student; event: AttendanceEvent } | null>(null);

  const section = sections.find((s) => s.id === sectionId) ?? null;
  const cohort = useMemo(
    () => (sectionId ? studentsInSection(students, sectionId) : []),
    [students, sectionId],
  );

  function finish(
    result:
      | { ok: true; student: Student; event: AttendanceEvent }
      | { ok: false; error: string },
  ) {
    if (!result.ok) {
      setLast(null);
      setError(result.error);
      return;
    }
    setError("");
    setLast({ student: result.student, event: result.event });
    setPendingFace(null);
    setPin("");
  }

  function submit(direction: "in" | "out") {
    if (!sectionId) {
      setError("Choose the student’s section first.");
      return;
    }
    if (pendingFace) {
      finish(checkFace(sectionId, pendingFace, direction));
      return;
    }
    finish(checkPin(sectionId, code, pin, direction));
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl bg-ink p-5 text-paper shadow-border sm:p-7">
        <p className="text-xs uppercase tracking-[0.16em] text-gold">Kiosk</p>
        <h2 className="mt-1 font-display text-3xl font-semibold">Section first. Then face or PIN.</h2>
        {students.length === 0 ? (
          <p className="mt-6 text-sm text-leaf">The office has not added students yet.</p>
        ) : (
          <>
            <label className="mt-6 block text-xs uppercase tracking-wider text-leaf">
              Section at this gate
              <SectionPicker
                dark
                sections={sections}
                value={sectionId}
                onChange={(id) => {
                  setSectionId(id);
                  setError("");
                  setLast(null);
                  setPendingFace(null);
                }}
              />
            </label>
            {section ? (
              <p className="mt-2 text-sm text-leaf">
                {cohort.length} student{cohort.length === 1 ? "" : "s"} in {sectionLabel(section)}.
                Only they can check in here.
              </p>
            ) : (
              <p className="mt-2 text-sm text-leaf">Open the section before scanning anyone.</p>
            )}
            <div className="mt-6">
              <FaceCapture
                onCapture={(descriptor) => {
                  setPendingFace(descriptor);
                  setError("");
                }}
              />
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.16em] text-gold">PIN fallback</p>
            <label className="mt-3 block text-xs uppercase tracking-wider text-leaf">
              Student code
              <input
                className="mt-2 min-h-12 w-full rounded-xl border-0 bg-primary-dark px-3 text-paper outline-none ring-gold focus:ring-2"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoComplete="off"
              />
            </label>
            <label className="mt-4 block text-xs uppercase tracking-wider text-leaf">
              PIN
              <input
                className="mt-2 min-h-12 w-full rounded-xl border-0 bg-primary-dark px-3 text-paper outline-none ring-gold focus:ring-2"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                inputMode="numeric"
                autoComplete="off"
              />
            </label>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button variant="gold" className="min-h-12" onClick={() => submit("in")}>
                <LogIn className="size-4" /> Check in
              </Button>
              <Button variant="outline" className="min-h-12 bg-transparent text-paper" onClick={() => submit("out")}>
                <LogOut className="size-4" /> Check out
              </Button>
            </div>
            {pendingFace ? (
              <p className="mt-3 text-sm text-gold">Face ready. Tap Check in or Check out.</p>
            ) : null}
            {error ? <p className="mt-4 rounded-xl bg-rose-soft px-3 py-3 text-sm text-rose">{error}</p> : null}
            {last ? (
              <p className="mt-4 rounded-xl bg-ok-soft px-3 py-3 text-sm text-ok">
                {last.student.name} · Grade {last.student.grade} {last.student.section}:{" "}
                {STATUS_LABEL[last.event.status]}
              </p>
            ) : null}
          </>
        )}
      </section>
      <aside className="rounded-3xl bg-paper p-5 shadow-border">
        <h3 className="font-display text-xl font-semibold">How to use the gate</h3>
        <ol className="mt-3 grid gap-3 text-sm text-muted">
          <li>1. Guard opens the section on duty (example: Grade 12 — Chromium).</li>
          <li>2. Only students of that section can check in — face or PIN.</li>
          <li>3. A student from another section is turned away until the correct section is open.</li>
          <li>4. Linked parents see the alert on the Parents desk.</li>
        </ol>
        {section && cohort.length > 0 ? (
          <div className="mt-6">
            <h4 className="text-xs uppercase tracking-wider text-muted">This section</h4>
            <ul className="mt-2 divide-y divide-line text-sm">
              {cohort.slice(0, 12).map((s) => (
                <li key={s.id} className="flex justify-between gap-2 py-2">
                  <span>{s.name}</span>
                  <span className="tabular-nums text-muted">{s.code}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
