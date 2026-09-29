import type { ClassRow } from "./types";

export const CLASS_TEMPLATE = `student_name,grade,section,pin,parent_name,parent_email,parent_phone
Ana Dela Cruz,10,Rizal,1001,Rosa Dela Cruz,rosa.delacruz@email.com,09171234501
Carlo Mendoza,10,Rizal,1002,Ramon Mendoza,ramon.mendoza@email.com,09171234502
Jasmine Reyes,10,Rizal,1003,Elena Reyes,elena.reyes@email.com,09171234503
`;

const STARTER: Array<[string, string]> = [
  ["Ana Dela Cruz", "Rosa Dela Cruz"],
  ["Carlo Mendoza", "Ramon Mendoza"],
  ["Jasmine Reyes", "Elena Reyes"],
  ["Miguel Santos", "Teresa Santos"],
  ["Sofia Ramirez", "Andres Ramirez"],
  ["Diego Villanueva", "Lorna Villanueva"],
  ["Liza Navarro", "Pedro Navarro"],
  ["Paolo Gutierrez", "Marites Gutierrez"],
  ["Hannah Cruz", "Roberto Cruz"],
  ["Rafael Bautista", "Cecilia Bautista"],
  ["Camille Flores", "Antonio Flores"],
  ["Enzo Magno", "Gloria Magno"],
  ["Bianca Torres", "Manuel Torres"],
  ["Luis Fernandez", "Alicia Fernandez"],
  ["Andrea Lim", "Francis Lim"],
  ["Marco Castillo", "Imelda Castillo"],
  ["Patricia Gomez", "Ricardo Gomez"],
  ["Nico Salazar", "Josefa Salazar"],
  ["Katrina Tan", "Eduardo Tan"],
  ["Joshua Morales", "Lydia Morales"],
];

export function starterClass(): ClassRow[] {
  return STARTER.map(([name, parentName], i) => {
    const n = 1001 + i;
    return {
      name,
      grade: "10",
      section: "Rizal",
      pin: String(n),
      parentName,
      parentEmail: "",
      parentPhone: "",
      parentPassword: `scn${n}`,
    };
  });
}

function splitCsvLine(line: string) {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') {
      quoted = !quoted;
      continue;
    }
    if ((ch === "," || ch === "\t") && !quoted) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

export function parseClassCsv(text: string): ClassRow[] | { error: string } {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return { error: "The file is empty." };
  const rows: ClassRow[] = [];
  for (const line of lines) {
    const cols = splitCsvLine(line);
    const first = (cols[0] ?? "").toLowerCase();
    if (first === "student_name" || first === "name") continue;
    const name = cols[0] ?? "";
    if (!name) continue;
    rows.push({
      name,
      grade: cols[1] || "10",
      section: cols[2] || "Rizal",
      pin: cols[3] || "",
      parentName: cols[4] || "",
      parentEmail: cols[5] || "",
      parentPhone: cols[6] || "",
      parentPassword: cols[7] || "",
    });
  }
  if (rows.length === 0) return { error: "No student rows found." };
  return rows;
}
