import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ClientReady } from "@/components/client-ready";
import { FaceCapture } from "@/components/face-capture";
import { Button } from "@/components/ui/button";
import { STATUS_LABEL } from "@/lib/school/rules";
import { useSchool } from "@/lib/school/store";
import type { AttendanceEvent, Student } from "@/lib/school/types";

export const Route = createFileRoute("/gate")({ component: GatePage });

function GatePage() {
  return (
    <AppShell title="School gate" kicker="Check in / check out">
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
  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");
  const [pendingFace, setPendingFace] = useState<number[] | null>(null);
  const [error, setError] = useState("");
  const [last, setLast] = useState<{ student: Student; event: AttendanceEvent } | null>(null);

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
    if (pendingFace) {
      finish(checkFace(pendingFace, direction));
      return;
    }
    finish(checkPin(code, pin, direction));
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl bg-ink p-5 text-paper shadow-border sm:p-7">
        <p className="text-xs uppercase tracking-[0.16em] text-gold">Kiosk</p>
        <h2 className="mt-1 font-display text-3xl font-semibold">Face first. PIN if needed.</h2>
        {students.length === 0 ? (
          <p className="mt-6 text-sm text-leaf">The office has not added students yet.</p>
        ) : (
          <>
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
                {last.student.name}: {STATUS_LABEL[last.event.status]}
              </p>
            ) : null}
          </>
        )}
      </section>
      <aside className="rounded-3xl bg-paper p-5 shadow-border">
        <h3 className="font-display text-xl font-semibold">How to use the gate</h3>
        <ol className="mt-3 grid gap-3 text-sm text-muted">
          <li>1. Office enrolls the student’s face and gives them a PIN.</li>
          <li>2. Student stands at this laptop, captures a face, then taps Check in.</li>
          <li>3. If the camera fails, they type their code and PIN instead.</li>
          <li>4. Linked parents see the alert on the Parents desk.</li>
        </ol>
      </aside>
    </div>
  );
}
