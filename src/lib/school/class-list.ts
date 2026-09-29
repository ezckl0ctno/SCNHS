import type { ClassRow } from "./types";

export const CLASS_TEMPLATE = `student_name,grade,section,pin,parent_name,parent_email,parent_phone
Ana Dela Cruz,7,Rizal,1701,Rosa Dela Cruz,rosa.delacruz@email.com,09171234501
Carlo Mendoza,7,Bonifacio,1702,Ramon Mendoza,ramon.mendoza@email.com,09171234502
Jasmine Reyes,8,Mabini,1801,Elena Reyes,elena.reyes@email.com,09171234503
Miguel Santos,10,Rizal,1001,Teresa Santos,teresa.santos@email.com,09171234504
Sofia Ramirez,11,STEM,1101,Andres Ramirez,andres.ramirez@email.com,09171234505
Diego Villanueva,12,ABM,1201,Lorna Villanueva,lorna.villanueva@email.com,09171234506
`;

type DemoRow = [string, string, string, string];

const DEMO: DemoRow[] = [
  ["Ana Dela Cruz", "7", "Rizal", "Rosa Dela Cruz"],
  ["Paolo Gutierrez", "7", "Rizal", "Marites Gutierrez"],
  ["Carlo Mendoza", "7", "Bonifacio", "Ramon Mendoza"],
  ["Hannah Cruz", "7", "Bonifacio", "Roberto Cruz"],
  ["Jasmine Reyes", "7", "Mabini", "Elena Reyes"],
  ["Rafael Bautista", "8", "Rizal", "Cecilia Bautista"],
  ["Camille Flores", "8", "Bonifacio", "Antonio Flores"],
  ["Enzo Magno", "8", "Mabini", "Gloria Magno"],
  ["Bianca Torres", "8", "Luna", "Manuel Torres"],
  ["Luis Fernandez", "9", "Rizal", "Alicia Fernandez"],
  ["Andrea Lim", "9", "Bonifacio", "Francis Lim"],
  ["Marco Castillo", "9", "Mabini", "Imelda Castillo"],
  ["Miguel Santos", "10", "Rizal", "Teresa Santos"],
  ["Sofia Ramirez", "10", "Rizal", "Andres Ramirez"],
  ["Diego Villanueva", "10", "Bonifacio", "Lorna Villanueva"],
  ["Liza Navarro", "10", "Luna", "Pedro Navarro"],
  ["Patricia Gomez", "11", "STEM", "Ricardo Gomez"],
  ["Nico Salazar", "11", "ABM", "Josefa Salazar"],
  ["Katrina Tan", "11", "HUMSS", "Eduardo Tan"],
  ["Joshua Morales", "12", "STEM", "Lydia Morales"],
  ["Lara Villanueva", "12", "ABM", "Cora Villanueva"],
  ["Ian Mercado", "12", "HUMSS", "Helen Mercado"],
];

export function starterClass(): ClassRow[] {
  return DEMO.map(([name, grade, section, parentName], i) => {
    const n = 1001 + i;
    return {
      name,
      grade,
      section,
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
