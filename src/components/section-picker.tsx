import { sortSections, sectionLabel } from "@/lib/school/sections";
import type { SchoolSection } from "@/lib/school/types";

export function SectionPicker({
  sections,
  value,
  onChange,
  name,
  id,
  includeAll,
  dark,
}: {
  sections: SchoolSection[];
  value: string;
  onChange: (sectionId: string) => void;
  name?: string;
  id?: string;
  includeAll?: boolean;
  dark?: boolean;
}) {
  const ordered = sortSections(sections);
  const grades = [...new Set(ordered.map((s) => s.grade))];
  const cls = dark
    ? "min-h-12 w-full rounded-xl border-0 bg-primary-dark px-3 text-paper outline-none ring-gold focus:ring-2"
    : "mt-1 min-h-11 w-full rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2";

  return (
    <select
      name={name}
      id={id}
      className={cls}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{includeAll ? "All sections" : "Choose a section"}</option>
      {grades.map((grade) => (
        <optgroup key={grade} label={`Grade ${grade}`}>
          {ordered
            .filter((s) => s.grade === grade)
            .map((s) => (
              <option key={s.id} value={s.id}>
                {sectionLabel(s)}
              </option>
            ))}
        </optgroup>
      ))}
    </select>
  );
}
