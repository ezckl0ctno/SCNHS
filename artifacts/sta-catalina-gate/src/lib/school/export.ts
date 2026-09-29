import { STATUS_LABEL } from "./rules";
import type { SchoolState } from "./types";

export function downloadText(filename: string, text: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function attendanceCsv(state: SchoolState) {
  const header = ["Date", "Time", "Student", "Code", "Direction", "Method", "Result"];
  const rows = state.attendance.map((row) => {
    const student = state.students.find((s) => s.id === row.studentId);
    const when = new Date(row.createdAt);
    return [
      row.date,
      when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      student?.name ?? "",
      student?.code ?? "",
      row.direction,
      row.method,
      STATUS_LABEL[row.status],
    ]
      .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
      .join(",");
  });
  return [header.join(","), ...rows].join("\n");
}

export function backupPayload(state: SchoolState) {
  return {
    school: state.school,
    officePasswordHash: state.officePasswordHash,
    students: state.students,
    parents: state.parents,
    attendance: state.attendance,
    alerts: state.alerts,
  };
}
