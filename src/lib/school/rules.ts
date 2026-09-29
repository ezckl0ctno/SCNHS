import type { GateStatus, SchoolSettings } from "./types";

export function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function todayISO(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function minutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function classifyIn(school: SchoolSettings, date = new Date()): GateStatus {
  const t = date.getHours() * 60 + date.getMinutes();
  if (t <= minutes(school.arrivalEnd)) return "on_time";
  return "late";
}

export function classifyOut(school: SchoolSettings, date = new Date()): GateStatus {
  const t = date.getHours() * 60 + date.getMinutes();
  if (t < minutes(school.dismissStart)) return "early_exit";
  return "dismissed";
}

export const STATUS_LABEL: Record<GateStatus, string> = {
  on_time: "Arrived on time",
  late: "Arrived late",
  early_exit: "Left early",
  dismissed: "Dismissed",
  absent: "No arrival",
};

export function parentMessage(
  school: SchoolSettings,
  studentName: string,
  status: GateStatus,
  when: Date,
) {
  const time = when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = when.toLocaleDateString();
  switch (status) {
    case "on_time":
      return `${studentName} checked in at the school gate at ${time} on ${date}.`;
    case "late":
      return `${studentName} checked in late at the school gate at ${time} on ${date}.`;
    case "early_exit":
      return `${studentName} checked out before dismissal at ${time} on ${date}. Please confirm with the office if this was expected.`;
    case "dismissed":
      return `${studentName} checked out at ${time} on ${date}.`;
    case "absent":
      return `${studentName} had no gate check-in by ${school.absentCutoff} on ${date}. Please contact the school office.`;
  }
}
