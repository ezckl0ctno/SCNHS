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

export function sortSections(sections: SchoolSection[]) {
  return [...sections].sort((a, b) => {
    const ga = Number(a.grade);
    const gb = Number(b.grade);
    if (!Number.isNaN(ga) && !Number.isNaN(gb) && ga !== gb) return ga - gb;
    if (a.grade !== b.grade) return a.grade.localeCompare(b.grade);
    return a.name.localeCompare(b.name);
  });
}
