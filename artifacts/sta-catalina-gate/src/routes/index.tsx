import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, DoorOpen, Landmark } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ClientReady } from "@/components/client-ready";
import { Field } from "@/components/field";
import { Button } from "@/components/ui/button";
import { useSchool } from "@/lib/school/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const name = "Sta Catalina National High School";
  return (
    <AppShell title="School gate desk" kicker={name}>
      <ClientReady>
        <HomeBody />
      </ClientReady>
    </AppShell>
  );
}

function HomeBody() {
  const school = useSchool((s) => s.school);
  const ready = Boolean(useSchool((s) => s.officePasswordHash));
  const session = useSchool((s) => s.session);

  return (
    <div className="grid gap-5">
      <p className="max-w-2xl text-muted">
        This computer is the school gate. Students check in by face or PIN. The office
        keeps the class list. When a student arrives, leaves early, or is missing, the
        office sends email and SMS to the parent automatically.
      </p>

      {!ready ? <SetupOffice /> : session.role === "none" ? <SignInRow /> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <RoleCard to="/gate" icon={DoorOpen} title="Gate" body="Face or PIN. Check in and out." />
        <RoleCard to="/office" icon={Landmark} title="Office" body="Class list, hours, and parent alerts." />
        <RoleCard to="/parent" icon={Bell} title="Parents" body="Sign in to see your child." />
      </div>

      <section className="rounded-3xl bg-paper p-5 shadow-border sm:p-6">
        <h2 className="font-display text-xl font-semibold">School day</h2>
        <ol className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <Step n="1" title="Arrival">
            {school.arrivalStart}–{school.arrivalEnd} is on time. After that is late.
          </Step>
          <Step n="2" title="No arrival">
            After {school.absentCutoff}, the office marks students with no check-in.
          </Step>
          <Step n="3" title="Dismissal">
            Checkout before {school.dismissStart} is left early.
          </Step>
          <Step n="4" title="Parents">
            Linked parents get SMS and email at the same moment as the gate scan.
          </Step>
        </ol>
      </section>
    </div>
  );
}

function SetupOffice() {
  const setupOffice = useSchool((s) => s.setupOffice);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") || "");
    const result = await setupOffice(password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    void navigate({ to: "/office" });
  }

  return (
    <section className="rounded-3xl bg-paper p-5 shadow-border">
      <h2 className="font-display text-xl font-semibold">Create the office password</h2>
      <p className="mt-1 text-sm text-muted">
        Do this once. Only the office should know it. You will need it each time you open
        the roster.
      </p>
      <form className="mt-4 grid max-w-sm gap-3" onSubmit={onSubmit}>
        <Field name="password" label="Office password" type="password" required autoComplete="new-password" />
        <Button type="submit">Save and open office</Button>
        {error ? <p className="text-sm text-rose">{error}</p> : null}
      </form>
    </section>
  );
}

function SignInRow() {
  const signInOffice = useSchool((s) => s.signInOffice);
  const signInParent = useSchool((s) => s.signInParent);
  const navigate = useNavigate();
  const [officeError, setOfficeError] = useState("");
  const [parentError, setParentError] = useState("");

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form
        className="rounded-3xl bg-paper p-5 shadow-border"
        onSubmit={async (e) => {
          e.preventDefault();
          const password = String(new FormData(e.currentTarget).get("office") || "");
          const result = await signInOffice(password);
          if (!result.ok) {
            setOfficeError(result.error);
            return;
          }
          void navigate({ to: "/office" });
        }}
      >
        <h2 className="font-display text-xl font-semibold">Office sign-in</h2>
        <div className="mt-4 grid gap-3">
          <Field name="office" label="Password" type="password" required autoComplete="current-password" />
          <Button type="submit">Open office</Button>
          {officeError ? <p className="text-sm text-rose">{officeError}</p> : null}
        </div>
      </form>
      <form
        className="rounded-3xl bg-paper p-5 shadow-border"
        onSubmit={async (e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const result = await signInParent(String(data.get("email") || ""), String(data.get("password") || ""));
          if (!result.ok) {
            setParentError(result.error);
            return;
          }
          void navigate({ to: "/parent" });
        }}
      >
        <h2 className="font-display text-xl font-semibold">Parent sign-in</h2>
        <div className="mt-4 grid gap-3">
          <Field name="email" label="Email" type="email" required autoComplete="username" />
          <Field name="password" label="Password" type="password" required autoComplete="current-password" />
          <Button type="submit" variant="outline">
            Open parent desk
          </Button>
          {parentError ? <p className="text-sm text-rose">{parentError}</p> : null}
        </div>
      </form>
    </div>
  );
}

function RoleCard({
  to,
  icon: Icon,
  title,
  body,
}: {
  to: "/gate" | "/office" | "/parent";
  icon: typeof DoorOpen;
  title: string;
  body: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-3xl bg-paper p-5 shadow-border transition-[box-shadow] duration-150 hover:shadow-border-hover"
    >
      <span className="grid size-11 place-items-center rounded-2xl bg-leaf text-primary">
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <h2 className="mt-4 font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </Link>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-3 rounded-2xl bg-canvas/80 p-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-fg">
        {n}
      </span>
      <span>
        <span className="block font-medium">{title}</span>
        <span className="text-muted">{children}</span>
      </span>
    </li>
  );
}
