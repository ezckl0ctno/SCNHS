import type { SchoolSection, Student } from "./types";

export function sectionKey(grade: string, name: string) {
  return `${grade.trim().toLowerCase()}::${name.trim().toLowerCase()}`;
}

export function sectionLabel(section: Pick<SchoolSection, "grade" | "name">) {
  return `Grade ${section.grade} — ${section.name}`;
}

export function findSection(
  sections: SchoolSection[],
  grade: string,
  name: string,
) {
  const key = sectionKey(grade, name);
  return sections.find((s) => sectionKey(s.grade, s.name) === key) ?? null;
}

export function studentsInSection(students: Student[], sectionId: string) {
  return students.filter((s) => s.sectionId === sectionId);
}

export const DEFAULT_SECTION_PLAN: Array<{ grade: string; name: string }> = [
  { grade: "7", name: "Rizal" },
  { grade: "7", name: "Bonifacio" },
  { grade: "7", name: "Mabini" },
  { grade: "7", name: "Luna" },
  { grade: "8", name: "Rizal" },
  { grade: "8", name: "Bonifacio" },
  { grade: "8", name: "Mabini" },
  { grade: "8", name: "Luna" },
  { grade: "9", name: "Rizal" },
  { grade: "9", name: "Bonifacio" },
  { grade: "9", name: "Mabini" },
  { grade: "9", name: "Luna" },
  { grade: "10", name: "Rizal" },
  { grade: "10", name: "Bonifacio" },
  { grade: "10", name: "Mabini" },
  { grade: "10", name: "Luna" },
  { grade: "11", name: "STEM" },
  { grade: "11", name: "ABM" },
  { grade: "11", name: "HUMSS" },
  { grade: "12", name: "STEM" },
  { grade: "12", name: "ABM" },
  { grade: "12", name: "HUMSS" },
];

export function makeDefaultSections(uid: () => string): SchoolSection[] {
  return DEFAULT_SECTION_PLAN.map((row) => ({
    id: uid(),
    grade: row.grade,
    name: row.name,
    adviser: "",
  }));
}

export function sortSections(sections: SchoolSection[]) {
  return [...sections].sort((a, b) => {
    const ga = Number(a.grade);
    const gb = Number(b.grade);
    if (!Number.isNaN(ga) && !Number.isNaN(gb) && ga !== gb) return ga - gb;
    if (a.grade !== b.grade) return a.grade.localeCompare(b.grade);
    return a.name.localeCompare(b.name);
  });
}
