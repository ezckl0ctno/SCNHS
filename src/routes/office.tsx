import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { AppShell } from "@/components/app-shell";
import { ClientReady } from "@/components/client-ready";
import { FaceCapture } from "@/components/face-capture";
import { Field } from "@/components/field";
import { SectionPicker } from "@/components/section-picker";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { attendanceCsv, backupPayload, downloadText } from "@/lib/school/export";
import { CLASS_TEMPLATE, parseClassCsv, starterClass } from "@/lib/school/class-list";
import { todayISO } from "@/lib/school/rules";
import { sectionLabel, sortSections, studentsInSection } from "@/lib/school/sections";
import { useSchool } from "@/lib/school/store";

export const Route = createFileRoute("/office")({ component: OfficePage });

function OfficePage() {
  return (
    <AppShell title="Office Dashboard" kicker="Sections, roster, and today’s gate">
      <ClientReady>
        <OfficeGate />
      </ClientReady>
    </AppShell>
  );
}

function OfficeGate() {
  const session = useSchool((s) => s.session);
  const ready = Boolean(useSchool((s) => s.officePasswordHash));
  if (!ready) {
    return (
      <p className="text-muted">
        Create the office password on the <Link to="/" className="text-primary underline">home page</Link> first.
      </p>
    );
  }
  if (session.role !== "office") {
    return (
      <p className="text-muted">
        Sign in as office on the <Link to="/" className="text-primary underline">home page</Link>.
      </p>
    );
  }
  return <OfficeBody />;
}

function OfficeBody() {
  const school = useSchool((s) => s.school);
  const sections = useSchool((s) => s.sections);
  const students = useSchool((s) => s.students);
  const parents = useSchool((s) => s.parents);
  const attendance = useSchool((s) => s.attendance);
  const alerts = useSchool((s) => s.alerts);
  const addStudent = useSchool((s) => s.addStudent);
  const addParent = useSchool((s) => s.addParent);
  const addSection = useSchool((s) => s.addSection);
  const removeSection = useSchool((s) => s.removeSection);
  const removeStudent = useSchool((s) => s.removeStudent);
  const moveStudent = useSchool((s) => s.moveStudent);
  const linkParent = useSchool((s) => s.linkParent);
  const markAbsences = useSchool((s) => s.markAbsences);
  const updateHours = useSchool((s) => s.updateHours);
  const enrollFace = useSchool((s) => s.enrollFace);
  const clearRecords = useSchool((s) => s.clearRecords);
  const importBackup = useSchool((s) => s.importBackup);
  const importClass = useSchool((s) => s.importClass);
  const updateNotify = useSchool((s) => s.updateNotify);
  const pushNotice = useSchool((s) => s.pushNotice);
  const [notice, setNotice] = useState("");
  const [enrollId, setEnrollId] = useState<string | null>(null);
  const [logDate, setLogDate] = useState(todayISO());
  const [filterSection, setFilterSection] = useState("");
  const [addSectionId, setAddSectionId] = useState(sections[0]?.id ?? "");
  const fileRef = useRef<HTMLInputElement>(null);
  const classFileRef = useRef<HTMLInputElement>(null);

  const day = logDate;
  const today = attendance.filter((a) => a.date === day);
  const visibleStudents = filterSection
    ? studentsInSection(students, filterSection)
    : students;
  const visibleToday = filterSection
    ? today.filter((a) => {
        const st = students.find((s) => s.id === a.studentId);
        return st?.sectionId === filterSection;
      })
    : today;

  const stats = useMemo(
    () => ({
      events: visibleToday.length,
      onTime: visibleToday.filter((a) => a.status === "on_time").length,
      late: visibleToday.filter((a) => a.status === "late").length,
      absent: visibleToday.filter((a) => a.status === "absent").length,
    }),
    [visibleToday],
  );

  function onAddStudent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const result = addStudent({
      name: String(data.get("name") || ""),
      sectionId: addSectionId,
      pin: String(data.get("pin") || ""),
      parentId: String(data.get("parentId") || "") || null,
    });
    if ("error" in result) {
      setNotice(result.error);
      return;
    }
    setNotice(`${result.name} saved in Grade ${result.grade} — ${result.section}. Code ${result.code}. PIN ${result.pin}.`);
    form.reset();
  }

  async function onAddParent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const result = await addParent({
      name: String(data.get("pname") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      password: String(data.get("ppass") || ""),
    });
    if ("error" in result) {
      setNotice(result.error);
      return;
    }
    setNotice(`${result.name} can be reached at ${result.email || result.phone}. Give them their password in person.`);
    form.reset();
  }

  function onAddSection(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const result = addSection({
      grade: String(data.get("sgrade") || ""),
      name: String(data.get("sname") || ""),
      adviser: String(data.get("sadviser") || ""),
    });
    if ("error" in result) {
      setNotice(result.error);
      return;
    }
    setNotice(`${sectionLabel(result)} is open.`);
    setAddSectionId(result.id);
    form.reset();
  }

  function onHours(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    updateHours({
      name: String(data.get("schoolName") || school.name).trim() || school.name,
      campus: String(data.get("campus") || school.campus).trim(),
      arrivalStart: String(data.get("arrivalStart") || school.arrivalStart),
      arrivalEnd: String(data.get("arrivalEnd") || school.arrivalEnd),
      absentCutoff: String(data.get("absentCutoff") || school.absentCutoff),
      dismissStart: String(data.get("dismissStart") || school.dismissStart),
    });
    setNotice("School hours and name saved.");
  }

  function exportLog() {
    downloadText(`scn-attendance-${logDate}.csv`, attendanceCsv(useSchool.getState()), "text/csv;charset=utf-8");
    setNotice("Attendance CSV downloaded.");
  }

  function exportBackup() {
    downloadText(
      `scn-gate-backup-${todayISO()}.json`,
      JSON.stringify(backupPayload(useSchool.getState()), null, 2),
      "application/json",
    );
    setNotice("Backup saved. Keep that file on this laptop.");
  }

  async function onImportFile(file: File | undefined) {
    if (!file) return;
    try {
      const raw = JSON.parse(await file.text()) as unknown;
      const result = importBackup(raw);
      setNotice("ok" in result ? "Backup restored on this laptop." : result.error);
    } catch {
      setNotice("That file could not be read.");
    }
  }

  async function loadRows(rows: ReturnType<typeof starterClass>) {
    const result = await importClass(rows);
    if ("error" in result) {
      setNotice(result.error);
      return;
    }
    setNotice(
      `Loaded ${result.added} student${result.added === 1 ? "" : "s"} across ${result.sections} new section${result.sections === 1 ? "" : "s"} and ${result.parents} parent contact${result.parents === 1 ? "" : "s"}.`,
    );
  }

  async function onClassFile(file: File | undefined) {
    if (!file) return;
    const parsed = parseClassCsv(await file.text());
    if ("error" in parsed) {
      setNotice(parsed.error);
      return;
    }
    await loadRows(parsed);
  }

  function onNotify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    updateNotify({
      emailUser: String(data.get("emailUser") || "").trim(),
      emailPass: String(data.get("emailPass") || school.notify.emailPass),
      emailHost: String(data.get("emailHost") || "smtp.gmail.com").trim(),
      smsKey: String(data.get("smsKey") || school.notify.smsKey),
      smsSender: String(data.get("smsSender") || "SCNGATE").trim(),
    });
    setNotice("Alert settings saved. The next gate scan will email and/or text the parent.");
  }

  const orderedSections = sortSections(sections);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label className="text-xs uppercase tracking-wider text-muted">
          View section
          <SectionPicker
            includeAll
            sections={sections}
            value={filterSection}
            onChange={setFilterSection}
          />
        </label>
        <p className="text-sm text-muted">
          {sections.length} sections · {students.length} students
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="This date" value={stats.events} />
        <Stat label="On time" value={stats.onTime} />
        <Stat label="Late" value={stats.late} />
        <Stat label="No arrival" value={stats.absent} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="gold"
          onClick={() => {
            void (async () => {
              const n = await markAbsences(filterSection || undefined);
              const scope = filterSection
                ? sections.find((s) => s.id === filterSection)
                : null;
              setNotice(
                n
                  ? `Recorded ${n} missing arrival${n === 1 ? "" : "s"}${scope ? ` in ${sectionLabel(scope)}` : ""}.`
                  : "Every student in this view already has a check-in or an absence today.",
              );
            })();
          }}
        >
          Mark missing arrivals
        </Button>
        <Button variant="outline" onClick={exportLog}>
          Download CSV
        </Button>
        <Button variant="outline" onClick={exportBackup}>
          Save backup
        </Button>
        <Button variant="ghost" onClick={() => fileRef.current?.click()}>
          Restore backup
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            if (confirm("Clear students, parents, and attendance on this laptop? The office password stays.")) {
              clearRecords();
              setNotice("Records cleared.");
            }
          }}
        >
          Clear records
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            void onImportFile(e.target.files?.[0]);
            e.currentTarget.value = "";
          }}
        />
      </div>
      {notice ? <p className="rounded-xl bg-ok-soft px-3 py-3 text-sm text-ok">{notice}</p> : null}

      <section className="rounded-3xl bg-paper p-5 shadow-border">
        <h2 className="font-display text-xl font-semibold">Sections</h2>
        <p className="mt-1 text-sm text-muted">
          The school can run many sections at once. Students may only sign in and check in
          under the section they belong to. Add extra strands or rooms as needed.
        </p>
        <form className="mt-4 grid gap-3 sm:grid-cols-4" onSubmit={onAddSection}>
          <Field name="sgrade" label="Grade" placeholder="12" required />
          <Field name="sname" label="Section name" placeholder="Add your Section" required />
          <Field name="sadviser" label="Adviser" placeholder="Optional" />
          <div className="flex items-end">
            <Button type="submit" className="w-full">
              Add section
            </Button>
          </div>
        </form>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {orderedSections.map((sec) => {
            const count = studentsInSection(students, sec.id).length;
            return (
              <li
                key={sec.id}
                className="flex items-center justify-between gap-2 rounded-2xl bg-canvas/80 px-4 py-3 text-sm"
              >
                <span>
                  <span className="font-medium">{sectionLabel(sec)}</span>
                  <span className="block text-xs text-muted">
                    {count} student{count === 1 ? "" : "s"}
                    {sec.adviser ? ` · ${sec.adviser}` : ""}
                  </span>
                </span>
                <Button
                  variant="ghost"
                  className="min-h-10 text-xs"
                  onClick={() => {
                    const result = removeSection(sec.id);
                    setNotice("error" in result ? result.error : `${sectionLabel(sec)} removed.`);
                  }}
                >
                  Remove
                </Button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-3xl bg-paper p-5 shadow-border">
        <h2 className="font-display text-xl font-semibold">Class list</h2>
        <p className="mt-1 text-sm text-muted">
          CSV columns include grade and section, so one file can load the whole school.
          Download the template, replace the sample rows, then import it.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => downloadText("scn-class-template.csv", CLASS_TEMPLATE, "text/csv;charset=utf-8")}
          >
            Download template
          </Button>
          <Button variant="outline" onClick={() => classFileRef.current?.click()}>
            Import CSV
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (students.length && !confirm("Add the multi-section starter roster to the current list?")) return;
              void loadRows(starterClass());
            }}
          >
            Load sample school
          </Button>
          <input
            ref={classFileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              void onClassFile(e.target.files?.[0]);
              e.currentTarget.value = "";
            }}
          />
        </div>
      </section>

      <section className="rounded-3xl bg-paper p-5 shadow-border">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-xl font-semibold">Gate log</h2>
          <label className="text-xs uppercase tracking-wider text-muted">
            Date
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="mt-1 min-h-11 rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2"
            />
          </label>
        </div>
        {visibleToday.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No check-ins on this date in this view.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="py-2 font-medium">Time</th>
                  <th className="py-2 font-medium">Student</th>
                  <th className="py-2 font-medium">Section</th>
                  <th className="py-2 font-medium">In/Out</th>
                  <th className="py-2 font-medium">How</th>
                  <th className="py-2 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {visibleToday.map((row) => {
                  const student = students.find((s) => s.id === row.studentId);
                  return (
                    <tr key={row.id} className="border-t border-line">
                      <td className="py-2.5 tabular-nums">
                        {new Date(row.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-2.5">{student?.name ?? "—"}</td>
                      <td className="py-2.5">
                        {student ? `G${student.grade} ${student.section}` : "—"}
                      </td>
                      <td className="py-2.5 capitalize">{row.direction}</td>
                      <td className="py-2.5">{row.method}</td>
                      <td className="py-2.5">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-3xl bg-paper p-5 shadow-border">
          <h2 className="font-display text-xl font-semibold">Add student</h2>
          <form className="mt-4 grid gap-3" onSubmit={onAddStudent}>
            <Field name="name" label="Name" required />
            <label className="text-xs uppercase tracking-wider text-muted">
              Section
              <SectionPicker sections={sections} value={addSectionId} onChange={setAddSectionId} />
            </label>
            <Field name="pin" label="PIN" placeholder="Leave blank to auto-assign" />
            <label className="text-xs uppercase tracking-wider text-muted">
              Parent
              <select
                name="parentId"
                className="mt-1 min-h-11 w-full rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2"
              >
                <option value="">None yet</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.email})
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit">Save student</Button>
          </form>
        </section>

        <section className="rounded-3xl bg-paper p-5 shadow-border">
          <h2 className="font-display text-xl font-semibold">Add parent</h2>
          <form className="mt-4 grid gap-3" onSubmit={onAddParent}>
            <Field name="pname" label="Name" required />
            <Field name="email" label="Email" type="email" />
            <Field name="phone" label="Mobile" placeholder="0917…" />
            <Field name="ppass" label="Password" type="password" placeholder="At least 6 characters, or leave blank" />
            <Button type="submit" variant="outline">
              Save parent
            </Button>
          </form>
        </section>
      </div>

      <section className="rounded-3xl bg-paper p-5 shadow-border">
        <h2 className="font-display text-xl font-semibold">Roster</h2>
        {visibleStudents.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No students in this view yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line">
            {visibleStudents.map((s) => (
              <li key={s.id} className="grid gap-3 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <span>
                  <span className="font-medium">{s.name}</span>
                  <span className="block text-xs text-muted">
                    Grade {s.grade} {s.section} · {s.code} · PIN {s.pin} · faces {s.descriptors.length} ·{" "}
                    {parents.find((p) => p.id === s.parentId)?.name ?? "no parent"}
                    {parents.find((p) => p.id === s.parentId)?.phone
                      ? ` · ${parents.find((p) => p.id === s.parentId)?.phone}`
                      : ""}
                  </span>
                </span>
                <span className="flex flex-wrap items-center gap-2">
                  <select
                    className="min-h-10 rounded-xl bg-canvas px-2 text-xs text-ink"
                    value={s.sectionId}
                    onChange={(e) => {
                      const result = moveStudent(s.id, e.target.value);
                      if ("error" in result) setNotice(result.error);
                    }}
                    aria-label={`Section for ${s.name}`}
                  >
                    {orderedSections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sectionLabel(sec)}
                      </option>
                    ))}
                  </select>
                  <select
                    className="min-h-10 rounded-xl bg-canvas px-2 text-xs text-ink"
                    value={s.parentId ?? ""}
                    onChange={(e) => linkParent(s.id, e.target.value || null)}
                    aria-label={`Parent for ${s.name}`}
                  >
                    <option value="">No parent</option>
                    {parents.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <Button variant="outline" className="min-h-10 text-xs" onClick={() => setEnrollId(s.id)}>
                    Enroll face
                  </Button>
                  <Button variant="ghost" className="min-h-10 text-xs" onClick={() => removeStudent(s.id)}>
                    Remove
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        )}
        {enrollId ? (
          <div className="mt-4 max-w-sm">
            <p className="mb-2 text-sm text-muted">
              Capture 3–5 samples in different light. Written permission first.
            </p>
            <FaceCapture
              variant="paper"
              onCapture={(descriptor) => {
                const result = enrollFace(enrollId, descriptor);
                if ("error" in result) setNotice(result.error);
                else setNotice(`Saved face sample (${result.count} total).`);
              }}
            />
            <Button variant="ghost" className="mt-2" onClick={() => setEnrollId(null)}>
              Close camera
            </Button>
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl bg-paper p-5 shadow-border">
        <h2 className="font-display text-xl font-semibold">Automatic parent alerts</h2>
        <p className="mt-1 text-sm text-muted">
          On every check-in, check-out, or missing-arrival mark, the office sends email through the
          school Gmail and SMS through Semaphore. Leave a field blank to skip that channel.
        </p>
        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={onNotify}>
          <Field name="emailUser" label="School Gmail" type="email" defaultValue={school.notify?.emailUser} placeholder="school@gmail.com" />
          <Field
            name="emailPass"
            label="Gmail app password"
            type="password"
            placeholder={school.notify?.emailPass ? "Saved on this laptop" : "16-character app password"}
          />
          <Field name="emailHost" label="Mail server" defaultValue={school.notify?.emailHost || "smtp.gmail.com"} />
          <Field
            name="smsKey"
            label="Semaphore SMS key"
            type="password"
            placeholder={school.notify?.smsKey ? "Saved on this laptop" : "API key from semaphore.co"}
          />
          <Field name="smsSender" label="SMS sender name" defaultValue={school.notify?.smsSender || "SCNGATE"} />
          <div className="sm:col-span-2">
            <Button type="submit">Save alert settings</Button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl bg-paper p-5 shadow-border">
        <h2 className="font-display text-xl font-semibold">Hours</h2>
        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={onHours}>
          <Field name="schoolName" label="School name" defaultValue={school.name} />
          <Field name="campus" label="Campus" defaultValue={school.campus} />
          <Field name="arrivalStart" label="Arrival start" type="time" defaultValue={school.arrivalStart} />
          <Field name="arrivalEnd" label="Arrival end" type="time" defaultValue={school.arrivalEnd} />
          <Field name="absentCutoff" label="No-arrival cutoff" type="time" defaultValue={school.absentCutoff} />
          <Field name="dismissStart" label="Dismissal" type="time" defaultValue={school.dismissStart} />
          <div className="sm:col-span-2">
            <Button type="submit" variant="outline">
              Save hours
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl bg-paper p-5 shadow-border">
        <h2 className="font-display text-xl font-semibold">Alerts sent to parents</h2>
        {alerts.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Alerts appear after a gate scan or a missing-arrival mark.</p>
        ) : (
          <ul className="mt-3 grid gap-3">
            {alerts.slice(0, 12).map((a) => (
              <li key={a.id} className="rounded-2xl bg-canvas px-4 py-3 text-sm">
                {a.text}
                <span className="mt-1 block text-xs text-muted">{new Date(a.createdAt).toLocaleString()}</span>
                <span className="mt-1 block text-xs text-muted">
                  Email: {a.emailStatus}
                  {a.emailDetail ? ` — ${a.emailDetail}` : ""} · SMS: {a.smsStatus}
                  {a.smsDetail ? ` — ${a.smsDetail}` : ""}
                </span>
                <button
                  type="button"
                  className="mt-2 text-xs font-medium text-primary"
                  onClick={() => void pushNotice(a.id)}
                >
                  Send again
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl bg-paper px-4 py-4 shadow-border">
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
