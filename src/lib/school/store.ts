import { create } from "zustand";
import { persist } from "zustand/middleware";
import { hashSecret } from "./crypto";
import { matchFace } from "./face";
import { dispatchNotice } from "./notify";
import { emptyNotify, seedState } from "./seed";
import { findSection, sectionKey, sortSections } from "./sections";
import {
  classifyIn,
  classifyOut,
  parentMessage,
  todayISO,
} from "./rules";
import type {
  Alert,
  AttendanceEvent,
  ClassRow,
  Direction,
  NotifySettings,
  ParentAccount,
  SchoolSection,
  SchoolSettings,
  SchoolState,
  Student,
} from "./types";

function uid() {
  return crypto.randomUUID();
}

function nextStudentNumber(students: Student[]) {
  const nums = students.map((s) => Number(s.code.replace(/\D/g, ""))).filter((n) => !Number.isNaN(n));
  return (nums.length ? Math.max(...nums) : 1000) + 1;
}

function blankAlert(): Pick<Alert, "emailStatus" | "smsStatus" | "emailDetail" | "smsDetail"> {
  return { emailStatus: "idle", smsStatus: "idle", emailDetail: "", smsDetail: "" };
}

function hydrateStudent(raw: Partial<Student>, sections: SchoolSection[]): Student {
  const grade = String(raw.grade ?? "").trim() || "10";
  const sectionName = String(raw.section ?? "").trim() || "Rizal";
  const matched =
    (raw.sectionId && sections.find((s) => s.id === raw.sectionId)) ||
    findSection(sections, grade, sectionName);
  return {
    id: raw.id || uid(),
    name: raw.name || "",
    grade: matched?.grade ?? grade,
    section: matched?.name ?? sectionName,
    sectionId: matched?.id ?? "",
    code: raw.code || "",
    pin: raw.pin || "",
    parentId: raw.parentId ?? null,
    descriptors: Array.isArray(raw.descriptors) ? raw.descriptors : [],
  };
}

function hydrateSections(
  saved: SchoolSection[] | undefined,
  students: Array<Partial<Student>>,
): SchoolSection[] {
  const map = new Map<string, SchoolSection>();
  for (const s of saved ?? []) {
    if (!s?.grade || !s?.name) continue;
    map.set(sectionKey(s.grade, s.name), {
      id: s.id || uid(),
      grade: String(s.grade).trim(),
      name: String(s.name).trim(),
      adviser: s.adviser ?? "",
    });
  }
  for (const student of students) {
    const grade = String(student.grade ?? "").trim();
    const name = String(student.section ?? "").trim();
    if (!grade || !name) continue;
    const key = sectionKey(grade, name);
    if (!map.has(key)) {
      map.set(key, { id: uid(), grade, name, adviser: "" });
    }
  }
  return sortSections([...map.values()]);
}

function recordEvent(
  state: SchoolState,
  student: Student,
  direction: Exclude<Direction, "none"> | "none",
  status: AttendanceEvent["status"],
  method: AttendanceEvent["method"],
  when: Date,
) {
  const event: AttendanceEvent = {
    id: uid(),
    studentId: student.id,
    date: todayISO(when),
    direction,
    status,
    method,
    createdAt: when.toISOString(),
  };
  const alerts: Alert[] = [...state.alerts];
  let alert: Alert | null = null;
  if (student.parentId) {
    alert = {
      id: uid(),
      studentId: student.id,
      parentId: student.parentId,
      status,
      text: parentMessage(state.school, student.name, status, when),
      createdAt: when.toISOString(),
      ...blankAlert(),
    };
    alerts.unshift(alert);
  }
  return { event, alert, attendance: [event, ...state.attendance], alerts };
}

type Actions = {
  setupOffice: (password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  signInOffice: (password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  signInParent: (
    email: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  signInStudent: (
    sectionId: string,
    code: string,
    pin: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  signOut: () => void;
  updateHours: (hours: Partial<SchoolSettings>) => void;
  updateNotify: (notify: Partial<NotifySettings>) => void;
  addSection: (input: { grade: string; name: string; adviser: string }) =>
    | SchoolSection
    | { error: string };
  updateSection: (id: string, patch: Partial<Pick<SchoolSection, "grade" | "name" | "adviser">>) =>
    | { ok: true }
    | { error: string };
  removeSection: (id: string) => { ok: true } | { error: string };
  checkPin: (
    sectionId: string,
    code: string,
    pin: string,
    direction: Exclude<Direction, "none">,
  ) => { ok: true; student: Student; event: AttendanceEvent } | { ok: false; error: string };
  checkFace: (
    descriptor: number[],
    direction: Exclude<Direction, "none">,
  ) => { ok: true; student: Student; event: AttendanceEvent } | { ok: false; error: string };
  markAbsences: (sectionId?: string) => Promise<number>;
  addStudent: (input: {
    name: string;
    sectionId: string;
    pin: string;
    parentId: string | null;
  }) => Student | { error: string };
  removeStudent: (id: string) => void;
  moveStudent: (studentId: string, sectionId: string) => { ok: true } | { error: string };
  linkParent: (studentId: string, parentId: string | null) => void;
  addParent: (input: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<ParentAccount | { error: string }>;
  enrollFace: (studentId: string, descriptor: number[]) => { ok: true; count: number } | { error: string };
  importClass: (rows: ClassRow[]) => Promise<{ added: number; parents: number; sections: number } | { error: string }>;
  pushNotice: (alertId: string) => Promise<void>;
  clearRecords: () => void;
  importBackup: (raw: unknown) => { ok: true } | { error: string };
};

export const useSchool = create<SchoolState & Actions>()(
  persist(
    (set, get) => ({
      ...seedState(),

      setupOffice: async (password) => {
        if (password.trim().length < 6) {
          return { ok: false, error: "Use at least 6 characters for the office password." };
        }
        if (get().officePasswordHash) {
          return { ok: false, error: "Office password is already set. Sign in instead." };
        }
        const officePasswordHash = await hashSecret(password.trim());
        set({ officePasswordHash, session: { role: "office" } });
        return { ok: true };
      },

      signInOffice: async (password) => {
        const hash = get().officePasswordHash;
        if (!hash) return { ok: false, error: "Create the office password first." };
        if ((await hashSecret(password.trim())) !== hash) {
          return { ok: false, error: "That office password is not correct." };
        }
        set({ session: { role: "office" } });
        return { ok: true };
      },

      signInParent: async (email, password) => {
        const parent = get().parents.find(
          (p) => p.email.toLowerCase() === email.trim().toLowerCase(),
        );
        if (!parent || !parent.email) return { ok: false, error: "No parent account uses that email." };
        if ((await hashSecret(password)) !== parent.passwordHash) {
          return { ok: false, error: "Email or password is not correct." };
        }
        set({ session: { role: "parent", parentId: parent.id } });
        return { ok: true };
      },

      signInStudent: async (sectionId, code, pin) => {
        const state = get();
        const section = state.sections.find((s) => s.id === sectionId);
        if (!section) return { ok: false, error: "Choose your section first." };
        const needle = code.trim().toUpperCase();
        const pinTrim = pin.trim();
        const byCode = state.students.find((s) => s.code.toUpperCase() === needle);
        if (!byCode) return { ok: false, error: "Student code or PIN did not match." };
        if (byCode.pin !== pinTrim) return { ok: false, error: "Student code or PIN did not match." };
        if (byCode.sectionId !== section.id) {
          return {
            ok: false,
            error: `${byCode.name} is enrolled in Grade ${byCode.grade} — ${byCode.section}. Choose that section to sign in.`,
          };
        }
        set({ session: { role: "student", studentId: byCode.id } });
        return { ok: true };
      },

      signOut: () => set({ session: { role: "none" } }),

      updateHours: (hours) => {
        set({ school: { ...get().school, ...hours } });
      },

      updateNotify: (notify) => {
        set({ school: { ...get().school, notify: { ...get().school.notify, ...notify } } });
      },

      addSection: ({ grade, name, adviser }) => {
        const g = grade.trim();
        const n = name.trim();
        if (!g || !n) return { error: "Grade and section name are required." };
        const state = get();
        if (findSection(state.sections, g, n)) {
          return { error: `Grade ${g} — ${n} already exists.` };
        }
        const section: SchoolSection = { id: uid(), grade: g, name: n, adviser: adviser.trim() };
        set({ sections: sortSections([...state.sections, section]) });
        return section;
      },

      updateSection: (id, patch) => {
        const state = get();
        const current = state.sections.find((s) => s.id === id);
        if (!current) return { error: "Section not found." };
        const next: SchoolSection = {
          ...current,
          grade: (patch.grade ?? current.grade).trim(),
          name: (patch.name ?? current.name).trim(),
          adviser: (patch.adviser ?? current.adviser).trim(),
        };
        if (!next.grade || !next.name) return { error: "Grade and section name are required." };
        const clash = findSection(state.sections, next.grade, next.name);
        if (clash && clash.id !== id) return { error: `Grade ${next.grade} — ${next.name} already exists.` };
        set({
          sections: sortSections(state.sections.map((s) => (s.id === id ? next : s))),
          students: state.students.map((s) =>
            s.sectionId === id ? { ...s, grade: next.grade, section: next.name } : s,
          ),
        });
        return { ok: true };
      },

      removeSection: (id) => {
        const enrolled = get().students.filter((s) => s.sectionId === id).length;
        if (enrolled) {
          return { error: `Move or remove ${enrolled} student${enrolled === 1 ? "" : "s"} first.` };
        }
        set({ sections: get().sections.filter((s) => s.id !== id) });
        return { ok: true };
      },

      checkPin: (sectionId, code, pin, direction) => {
        const state = get();
        const section = state.sections.find((s) => s.id === sectionId);
        if (!section) return { ok: false, error: "Choose the student’s section first." };
        const student = state.students.find(
          (s) => s.code.toUpperCase() === code.trim().toUpperCase() && s.pin === pin.trim(),
        );
        if (!student) return { ok: false, error: "Student code or PIN did not match." };
        if (student.sectionId !== section.id) {
          return {
            ok: false,
            error: `${student.name} belongs to Grade ${student.grade} — ${student.section}. Open that section at the gate.`,
          };
        }
        const when = new Date();
        const status = direction === "in" ? classifyIn(state.school, when) : classifyOut(state.school, when);
        const recorded = recordEvent(state, student, direction, status, "pin", when);
        set({ attendance: recorded.attendance, alerts: recorded.alerts });
        if (recorded.alert) void get().pushNotice(recorded.alert.id);
        return { ok: true, student, event: recorded.event };
      },

      checkFace: (descriptor, direction) => {
        const state = get();
        const hit = matchFace(state.students, descriptor);
        if (!hit) {
          return {
            ok: false,
            error: "No enrolled face matched. Ask the office to enroll the student’s face, then try again.",
          };
        }
        const when = new Date();
        const status = direction === "in" ? classifyIn(state.school, when) : classifyOut(state.school, when);
        const recorded = recordEvent(state, hit.student, direction, status, "face", when);
        set({ attendance: recorded.attendance, alerts: recorded.alerts });
        if (recorded.alert) void get().pushNotice(recorded.alert.id);
        return { ok: true, student: hit.student, event: recorded.event };
      },

      markAbsences: async (sectionId) => {
        const state = get();
        const day = todayISO();
        const when = new Date();
        let next = state;
        const queued: string[] = [];
        let created = 0;
        const pool = sectionId
          ? state.students.filter((s) => s.sectionId === sectionId)
          : state.students;
        for (const student of pool) {
          const hasIn = next.attendance.some(
            (a) => a.studentId === student.id && a.date === day && a.direction === "in",
          );
          const already = next.attendance.some(
            (a) => a.studentId === student.id && a.date === day && a.status === "absent",
          );
          if (hasIn || already) continue;
          const recorded = recordEvent(next, student, "none", "absent", "sweep", when);
          next = { ...next, attendance: recorded.attendance, alerts: recorded.alerts };
          if (recorded.alert) queued.push(recorded.alert.id);
          created += 1;
        }
        set({ attendance: next.attendance, alerts: next.alerts });
        for (const id of queued) await get().pushNotice(id);
        return created;
      },

      addStudent: ({ name, sectionId, pin, parentId }) => {
        const state = get();
        if (!name.trim()) return { error: "Student name is required." };
        const section = state.sections.find((s) => s.id === sectionId);
        if (!section) return { error: "Choose a section for this student." };
        const n = nextStudentNumber(state.students);
        const code = `STU-${n}`;
        const student: Student = {
          id: uid(),
          name: name.trim(),
          grade: section.grade,
          section: section.name,
          sectionId: section.id,
          code,
          pin: pin.trim() || String(n),
          parentId: parentId || null,
          descriptors: [],
        };
        set({ students: [...state.students, student] });
        return student;
      },

      removeStudent: (id) => {
        const session = get().session;
        set({
          students: get().students.filter((s) => s.id !== id),
          session: session.role === "student" && session.studentId === id ? { role: "none" } : session,
        });
      },

      moveStudent: (studentId, sectionId) => {
        const section = get().sections.find((s) => s.id === sectionId);
        if (!section) return { error: "That section does not exist." };
        set({
          students: get().students.map((s) =>
            s.id === studentId
              ? { ...s, sectionId: section.id, grade: section.grade, section: section.name }
              : s,
          ),
        });
        return { ok: true };
      },

      linkParent: (studentId, parentId) => {
        set({
          students: get().students.map((s) => (s.id === studentId ? { ...s, parentId } : s)),
        });
      },

      addParent: async ({ name, email, phone, password }) => {
        if (!name.trim()) return { error: "Parent name is required." };
        if (!email.trim() && !phone.trim()) return { error: "Add an email or a mobile number." };
        const pass = password.trim() || `scn${Math.floor(1000 + Math.random() * 9000)}`;
        if (pass.length < 6) return { error: "Parent password needs at least 6 characters." };
        const state = get();
        const emailKey = email.trim().toLowerCase();
        if (emailKey && state.parents.some((p) => p.email && p.email.toLowerCase() === emailKey)) {
          return { error: "That email is already in use." };
        }
        const parent: ParentAccount = {
          id: uid(),
          name: name.trim(),
          email: emailKey,
          phone: phone.trim(),
          passwordHash: await hashSecret(pass),
        };
        set({ parents: [...state.parents, parent] });
        return parent;
      },

      enrollFace: (studentId, descriptor) => {
        const students = get().students.map((s) => {
          if (s.id !== studentId) return s;
          const descriptors = [...s.descriptors, descriptor].slice(-8);
          return { ...s, descriptors };
        });
        const student = students.find((s) => s.id === studentId);
        if (!student) return { error: "Student not found." };
        set({ students });
        return { ok: true, count: student.descriptors.length };
      },

      importClass: async (rows) => {
        if (rows.length === 0) return { error: "No students to import." };
        let added = 0;
        let parentsCreated = 0;
        let sectionsCreated = 0;
        for (const row of rows) {
          if (!row.name.trim()) continue;
          const grade = row.grade.trim() || "10";
          const name = row.section.trim() || "Rizal";
          let section = findSection(get().sections, grade, name);
          if (!section) {
            const created = get().addSection({ grade, name, adviser: "" });
            if ("error" in created) return created;
            section = created;
            sectionsCreated += 1;
          }
          let parentId: string | null = null;
          if (row.parentName.trim() && (row.parentEmail.trim() || row.parentPhone.trim())) {
            const emailKey = row.parentEmail.trim().toLowerCase();
            const existing = get().parents.find(
              (p) =>
                (emailKey && p.email === emailKey) ||
                (row.parentPhone.trim() && p.phone === row.parentPhone.trim()),
            );
            if (existing) parentId = existing.id;
            else {
              const created = await get().addParent({
                name: row.parentName,
                email: row.parentEmail,
                phone: row.parentPhone,
                password: row.parentPassword,
              });
              if ("error" in created) return created;
              parentId = created.id;
              parentsCreated += 1;
            }
          }
          const student = get().addStudent({
            name: row.name,
            sectionId: section.id,
            pin: row.pin,
            parentId,
          });
          if ("error" in student) return student;
          added += 1;
        }
        return { added, parents: parentsCreated, sections: sectionsCreated };
      },

      pushNotice: async (alertId) => {
        const state = get();
        const alert = state.alerts.find((a) => a.id === alertId);
        if (!alert) return;
        const parent = state.parents.find((p) => p.id === alert.parentId);
        const notify = state.school.notify ?? emptyNotify();
        const patch = (
          emailStatus: Alert["emailStatus"],
          smsStatus: Alert["smsStatus"],
          emailDetail: string,
          smsDetail: string,
        ) => {
          set({
            alerts: get().alerts.map((a) =>
              a.id === alertId ? { ...a, emailStatus, smsStatus, emailDetail, smsDetail } : a,
            ),
          });
        };
        if (!parent) {
          patch("skipped", "skipped", "No parent linked.", "No parent linked.");
          return;
        }
        patch("sending", "sending", "Sending…", "Sending…");
        try {
          const result = await dispatchNotice({
            data: {
              fromName: state.school.name,
              emailHost: notify.emailHost,
              emailUser: notify.emailUser,
              emailPass: notify.emailPass,
              toEmail: parent.email,
              subject: `${state.school.name}: attendance`,
              text: alert.text,
              smsKey: notify.smsKey,
              smsSender: notify.smsSender,
              toPhone: parent.phone,
            },
          });
          patch(result.email.status, result.sms.status, result.email.detail, result.sms.detail);
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Send failed.";
          patch("failed", "failed", msg, msg);
        }
      },

      clearRecords: () => {
        const hash = get().officePasswordHash;
        const notify = get().school.notify;
        set({
          ...seedState(),
          officePasswordHash: hash,
          session: { role: "office" },
          school: { ...seedState().school, notify },
        });
      },

      importBackup: (raw) => {
        if (!raw || typeof raw !== "object") return { error: "That file is not a gate backup." };
        const data = raw as Partial<SchoolState>;
        if (!data.school || !Array.isArray(data.students) || !Array.isArray(data.parents)) {
          return { error: "That file is missing school, students, or parents." };
        }
        const base = seedState();
        const sections = hydrateSections(data.sections, data.students);
        set({
          school: {
            ...base.school,
            ...data.school,
            notify: { ...emptyNotify(), ...data.school.notify },
          },
          officePasswordHash: data.officePasswordHash ?? get().officePasswordHash,
          sections,
          students: data.students.map((s) => hydrateStudent(s, sections)),
          parents: data.parents.map((p) => ({ ...p, phone: p.phone ?? "" })),
          attendance: Array.isArray(data.attendance) ? data.attendance : [],
          alerts: Array.isArray(data.alerts)
            ? data.alerts.map((a) => ({
                ...a,
                emailStatus: a.emailStatus ?? "skipped",
                smsStatus: a.smsStatus ?? "skipped",
                emailDetail: a.emailDetail ?? "",
                smsDetail: a.smsDetail ?? "",
              }))
            : [],
          session: { role: "office" },
        });
        return { ok: true };
      },
    }),
    {
      name: "scn-gate-v3",
      partialize: (s) => ({
        school: s.school,
        officePasswordHash: s.officePasswordHash,
        sections: s.sections,
        students: s.students,
        parents: s.parents,
        attendance: s.attendance,
        alerts: s.alerts,
        session: s.session,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<SchoolState> | undefined;
        if (!p) return current;
        const sections = hydrateSections(p.sections, p.students ?? current.students);
        return {
          ...current,
          ...p,
          school: {
            ...current.school,
            ...p.school,
            notify: { ...emptyNotify(), ...p.school?.notify },
          },
          sections,
          students: (p.students ?? current.students).map((s) => hydrateStudent(s, sections)),
          parents: (p.parents ?? current.parents).map((parent) => ({ ...parent, phone: parent.phone ?? "" })),
          alerts: (p.alerts ?? current.alerts).map((a) => ({
            ...a,
            emailStatus: a.emailStatus ?? "idle",
            smsStatus: a.smsStatus ?? "idle",
            emailDetail: a.emailDetail ?? "",
            smsDetail: a.smsDetail ?? "",
          })),
        };
      },
    },
  ),
);
