import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as sectionLabel, d as todayISO, f as useSchool, i as STATUS_LABEL, l as sortSections, n as Button, r as ClientReady, t as AppShell, u as studentsInSection } from "./app-shell-bktvxgIj.mjs";
import { t as FaceCapture } from "./face-capture-CVUwv37R.mjs";
import { t as SectionPicker } from "./section-picker-Cypgp8Or.mjs";
import { t as Field } from "./field-BOpMDRwx.mjs";
import { t as StatusBadge } from "./status-badge-BMeD2YOM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/office-9c5W0Lbq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function downloadText(filename, text, type) {
	const blob = new Blob([text], { type });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function attendanceCsv(state) {
	const header = [
		"Date",
		"Time",
		"Student",
		"Code",
		"Grade",
		"Section",
		"Direction",
		"Method",
		"Result"
	];
	const rows = state.attendance.map((row) => {
		const student = state.students.find((s) => s.id === row.studentId);
		const when = new Date(row.createdAt);
		return [
			row.date,
			when.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			}),
			student?.name ?? "",
			student?.code ?? "",
			student?.grade ?? "",
			student?.section ?? "",
			row.direction,
			row.method,
			STATUS_LABEL[row.status]
		].map((cell) => `"${String(cell).replaceAll("\"", "\"\"")}"`).join(",");
	});
	return [header.join(","), ...rows].join("\n");
}
function backupPayload(state) {
	return {
		school: state.school,
		officePasswordHash: state.officePasswordHash,
		sections: state.sections,
		students: state.students,
		parents: state.parents,
		attendance: state.attendance,
		alerts: state.alerts
	};
}
var CLASS_TEMPLATE = `student_name,grade,section,pin,parent_name,parent_email,parent_phone
Ana Dela Cruz,7,Rizal,1701,Rosa Dela Cruz,rosa.delacruz@email.com,09171234501
Carlo Mendoza,7,Bonifacio,1702,Ramon Mendoza,ramon.mendoza@email.com,09171234502
Jasmine Reyes,8,Mabini,1801,Elena Reyes,elena.reyes@email.com,09171234503
Miguel Santos,10,Rizal,1001,Teresa Santos,teresa.santos@email.com,09171234504
Sofia Ramirez,11,STEM,1101,Andres Ramirez,andres.ramirez@email.com,09171234505
Diego Villanueva,12,ABM,1201,Lorna Villanueva,lorna.villanueva@email.com,09171234506
`;
var DEMO = [
	[
		"Ana Dela Cruz",
		"7",
		"Rizal",
		"Rosa Dela Cruz"
	],
	[
		"Paolo Gutierrez",
		"7",
		"Rizal",
		"Marites Gutierrez"
	],
	[
		"Carlo Mendoza",
		"7",
		"Bonifacio",
		"Ramon Mendoza"
	],
	[
		"Hannah Cruz",
		"7",
		"Bonifacio",
		"Roberto Cruz"
	],
	[
		"Jasmine Reyes",
		"7",
		"Mabini",
		"Elena Reyes"
	],
	[
		"Rafael Bautista",
		"8",
		"Rizal",
		"Cecilia Bautista"
	],
	[
		"Camille Flores",
		"8",
		"Bonifacio",
		"Antonio Flores"
	],
	[
		"Enzo Magno",
		"8",
		"Mabini",
		"Gloria Magno"
	],
	[
		"Bianca Torres",
		"8",
		"Luna",
		"Manuel Torres"
	],
	[
		"Luis Fernandez",
		"9",
		"Rizal",
		"Alicia Fernandez"
	],
	[
		"Andrea Lim",
		"9",
		"Bonifacio",
		"Francis Lim"
	],
	[
		"Marco Castillo",
		"9",
		"Mabini",
		"Imelda Castillo"
	],
	[
		"Miguel Santos",
		"10",
		"Rizal",
		"Teresa Santos"
	],
	[
		"Sofia Ramirez",
		"10",
		"Rizal",
		"Andres Ramirez"
	],
	[
		"Diego Villanueva",
		"10",
		"Bonifacio",
		"Lorna Villanueva"
	],
	[
		"Liza Navarro",
		"10",
		"Luna",
		"Pedro Navarro"
	],
	[
		"Patricia Gomez",
		"11",
		"STEM",
		"Ricardo Gomez"
	],
	[
		"Nico Salazar",
		"11",
		"ABM",
		"Josefa Salazar"
	],
	[
		"Katrina Tan",
		"11",
		"HUMSS",
		"Eduardo Tan"
	],
	[
		"Joshua Morales",
		"12",
		"STEM",
		"Lydia Morales"
	],
	[
		"Lara Villanueva",
		"12",
		"ABM",
		"Cora Villanueva"
	],
	[
		"Ian Mercado",
		"12",
		"HUMSS",
		"Helen Mercado"
	]
];
function starterClass() {
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
			parentPassword: `scn${n}`
		};
	});
}
function splitCsvLine(line) {
	const out = [];
	let cur = "";
	let quoted = false;
	for (const ch of line) {
		if (ch === "\"") {
			quoted = !quoted;
			continue;
		}
		if ((ch === "," || ch === "	") && !quoted) {
			out.push(cur.trim());
			cur = "";
			continue;
		}
		cur += ch;
	}
	out.push(cur.trim());
	return out;
}
function parseClassCsv(text) {
	const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
	if (lines.length === 0) return { error: "The file is empty." };
	const rows = [];
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
			parentPassword: cols[7] || ""
		});
	}
	if (rows.length === 0) return { error: "No student rows found." };
	return rows;
}
function OfficePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Office Dashboard",
		kicker: "Sections, roster, and today’s gate",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientReady, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfficeGate, {}) })
	});
}
function OfficeGate() {
	const session = useSchool((s) => s.session);
	if (!Boolean(useSchool((s) => s.officePasswordHash))) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-muted",
		children: [
			"Create the office password on the ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "text-primary underline",
				children: "home page"
			}),
			" first."
		]
	});
	if (session.role !== "office") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-muted",
		children: [
			"Sign in as office on the ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "text-primary underline",
				children: "home page"
			}),
			"."
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfficeBody, {});
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
	const [notice, setNotice] = (0, import_react.useState)("");
	const [enrollId, setEnrollId] = (0, import_react.useState)(null);
	const [logDate, setLogDate] = (0, import_react.useState)(todayISO());
	const [filterSection, setFilterSection] = (0, import_react.useState)("");
	const [addSectionId, setAddSectionId] = (0, import_react.useState)(sections[0]?.id ?? "");
	const fileRef = (0, import_react.useRef)(null);
	const classFileRef = (0, import_react.useRef)(null);
	const day = logDate;
	const today = attendance.filter((a) => a.date === day);
	const visibleStudents = filterSection ? studentsInSection(students, filterSection) : students;
	const visibleToday = filterSection ? today.filter((a) => {
		return students.find((s) => s.id === a.studentId)?.sectionId === filterSection;
	}) : today;
	const stats = (0, import_react.useMemo)(() => ({
		events: visibleToday.length,
		onTime: visibleToday.filter((a) => a.status === "on_time").length,
		late: visibleToday.filter((a) => a.status === "late").length,
		absent: visibleToday.filter((a) => a.status === "absent").length
	}), [visibleToday]);
	function onAddStudent(e) {
		e.preventDefault();
		const form = e.currentTarget;
		const data = new FormData(form);
		const result = addStudent({
			name: String(data.get("name") || ""),
			sectionId: addSectionId,
			pin: String(data.get("pin") || ""),
			parentId: String(data.get("parentId") || "") || null
		});
		if ("error" in result) {
			setNotice(result.error);
			return;
		}
		setNotice(`${result.name} saved in Grade ${result.grade} — ${result.section}. Code ${result.code}. PIN ${result.pin}.`);
		form.reset();
	}
	async function onAddParent(e) {
		e.preventDefault();
		const form = e.currentTarget;
		const data = new FormData(form);
		const result = await addParent({
			name: String(data.get("pname") || ""),
			email: String(data.get("email") || ""),
			phone: String(data.get("phone") || ""),
			password: String(data.get("ppass") || "")
		});
		if ("error" in result) {
			setNotice(result.error);
			return;
		}
		setNotice(`${result.name} can be reached at ${result.email || result.phone}. Give them their password in person.`);
		form.reset();
	}
	function onAddSection(e) {
		e.preventDefault();
		const form = e.currentTarget;
		const data = new FormData(form);
		const result = addSection({
			grade: String(data.get("sgrade") || ""),
			name: String(data.get("sname") || ""),
			adviser: String(data.get("sadviser") || "")
		});
		if ("error" in result) {
			setNotice(result.error);
			return;
		}
		setNotice(`${sectionLabel(result)} is open.`);
		setAddSectionId(result.id);
		form.reset();
	}
	function onHours(e) {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		updateHours({
			name: String(data.get("schoolName") || school.name).trim() || school.name,
			campus: String(data.get("campus") || school.campus).trim(),
			arrivalStart: String(data.get("arrivalStart") || school.arrivalStart),
			arrivalEnd: String(data.get("arrivalEnd") || school.arrivalEnd),
			absentCutoff: String(data.get("absentCutoff") || school.absentCutoff),
			dismissStart: String(data.get("dismissStart") || school.dismissStart)
		});
		setNotice("School hours and name saved.");
	}
	function exportLog() {
		downloadText(`scn-attendance-${logDate}.csv`, attendanceCsv(useSchool.getState()), "text/csv;charset=utf-8");
		setNotice("Attendance CSV downloaded.");
	}
	function exportBackup() {
		downloadText(`scn-gate-backup-${todayISO()}.json`, JSON.stringify(backupPayload(useSchool.getState()), null, 2), "application/json");
		setNotice("Backup saved. Keep that file on this laptop.");
	}
	async function onImportFile(file) {
		if (!file) return;
		try {
			const raw = JSON.parse(await file.text());
			const result = importBackup(raw);
			setNotice("ok" in result ? "Backup restored on this laptop." : result.error);
		} catch {
			setNotice("That file could not be read.");
		}
	}
	async function loadRows(rows) {
		const result = await importClass(rows);
		if ("error" in result) {
			setNotice(result.error);
			return;
		}
		setNotice(`Loaded ${result.added} student${result.added === 1 ? "" : "s"} across ${result.sections} new section${result.sections === 1 ? "" : "s"} and ${result.parents} parent contact${result.parents === 1 ? "" : "s"}.`);
	}
	async function onClassFile(file) {
		if (!file) return;
		const parsed = parseClassCsv(await file.text());
		if ("error" in parsed) {
			setNotice(parsed.error);
			return;
		}
		await loadRows(parsed);
	}
	function onNotify(e) {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		updateNotify({
			emailUser: String(data.get("emailUser") || "").trim(),
			emailPass: String(data.get("emailPass") || school.notify.emailPass),
			emailHost: String(data.get("emailHost") || "smtp.gmail.com").trim(),
			smsKey: String(data.get("smsKey") || school.notify.smsKey),
			smsSender: String(data.get("smsSender") || "SCNGATE").trim()
		});
		setNotice("Alert settings saved. The next gate scan will email and/or text the parent.");
	}
	const orderedSections = sortSections(sections);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs uppercase tracking-wider text-muted",
					children: ["View section", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionPicker, {
						includeAll: true,
						sections,
						value: filterSection,
						onChange: setFilterSection
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						sections.length,
						" sections · ",
						students.length,
						" students"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "This date",
						value: stats.events
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "On time",
						value: stats.onTime
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Late",
						value: stats.late
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "No arrival",
						value: stats.absent
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "gold",
						onClick: () => {
							(async () => {
								const n = await markAbsences(filterSection || void 0);
								const scope = filterSection ? sections.find((s) => s.id === filterSection) : null;
								setNotice(n ? `Recorded ${n} missing arrival${n === 1 ? "" : "s"}${scope ? ` in ${sectionLabel(scope)}` : ""}.` : "Every student in this view already has a check-in or an absence today.");
							})();
						},
						children: "Mark missing arrivals"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: exportLog,
						children: "Download CSV"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: exportBackup,
						children: "Save backup"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => fileRef.current?.click(),
						children: "Restore backup"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => {
							if (confirm("Clear students, parents, and attendance on this laptop? The office password stays.")) {
								clearRecords();
								setNotice("Records cleared.");
							}
						},
						children: "Clear records"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "application/json",
						className: "hidden",
						onChange: (e) => {
							onImportFile(e.target.files?.[0]);
							e.currentTarget.value = "";
						}
					})
				]
			}),
			notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl bg-ok-soft px-3 py-3 text-sm text-ok",
				children: notice
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-paper p-5 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: "Sections"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "The school can run many sections at once. Students may only sign in and check in under the section they belong to. Add extra strands or rooms as needed."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 grid gap-3 sm:grid-cols-4",
						onSubmit: onAddSection,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "sgrade",
								label: "Grade",
								placeholder: "12",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "sname",
								label: "Section name",
								placeholder: "Add your Section",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "sadviser",
								label: "Adviser",
								placeholder: "Optional"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "w-full",
									children: "Add section"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 grid gap-2 sm:grid-cols-2",
						children: orderedSections.map((sec) => {
							const count = studentsInSection(students, sec.id).length;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-2 rounded-2xl bg-canvas/80 px-4 py-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: sectionLabel(sec)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-xs text-muted",
									children: [
										count,
										" student",
										count === 1 ? "" : "s",
										sec.adviser ? ` · ${sec.adviser}` : ""
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									className: "min-h-10 text-xs",
									onClick: () => {
										const result = removeSection(sec.id);
										setNotice("error" in result ? result.error : `${sectionLabel(sec)} removed.`);
									},
									children: "Remove"
								})]
							}, sec.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-paper p-5 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: "Class list"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "CSV columns include grade and section, so one file can load the whole school. Download the template, replace the sample rows, then import it."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => downloadText("scn-class-template.csv", CLASS_TEMPLATE, "text/csv;charset=utf-8"),
								children: "Download template"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => classFileRef.current?.click(),
								children: "Import CSV"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => {
									if (students.length && !confirm("Add the multi-section starter roster to the current list?")) return;
									loadRows(starterClass());
								},
								children: "Load sample school"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: classFileRef,
								type: "file",
								accept: ".csv,text/csv",
								className: "hidden",
								onChange: (e) => {
									onClassFile(e.target.files?.[0]);
									e.currentTarget.value = "";
								}
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-paper p-5 shadow-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: "Gate log"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs uppercase tracking-wider text-muted",
						children: ["Date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: logDate,
							onChange: (e) => setLogDate(e.target.value),
							className: "mt-1 min-h-11 rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2"
						})]
					})]
				}), visibleToday.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "No check-ins on this date in this view."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[32rem] text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-xs uppercase tracking-wider text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-medium",
									children: "Time"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-medium",
									children: "Student"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-medium",
									children: "Section"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-medium",
									children: "In/Out"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-medium",
									children: "How"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-medium",
									children: "Result"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: visibleToday.map((row) => {
							const student = students.find((s) => s.id === row.studentId);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-line",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 tabular-nums",
										children: new Date(row.createdAt).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5",
										children: student?.name ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5",
										children: student ? `G${student.grade} ${student.section}` : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 capitalize",
										children: row.direction
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5",
										children: row.method
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: row.status })
									})
								]
							}, row.id);
						}) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl bg-paper p-5 shadow-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: "Add student"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 grid gap-3",
						onSubmit: onAddStudent,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "name",
								label: "Name",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs uppercase tracking-wider text-muted",
								children: ["Section", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionPicker, {
									sections,
									value: addSectionId,
									onChange: setAddSectionId
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "pin",
								label: "PIN",
								placeholder: "Leave blank to auto-assign"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs uppercase tracking-wider text-muted",
								children: ["Parent", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									name: "parentId",
									className: "mt-1 min-h-11 w-full rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "None yet"
									}), parents.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: p.id,
										children: [
											p.name,
											" (",
											p.email,
											")"
										]
									}, p.id))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Save student"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl bg-paper p-5 shadow-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: "Add parent"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 grid gap-3",
						onSubmit: onAddParent,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "pname",
								label: "Name",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "email",
								label: "Email",
								type: "email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "phone",
								label: "Mobile",
								placeholder: "0917…"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "ppass",
								label: "Password",
								type: "password",
								placeholder: "At least 6 characters, or leave blank"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "outline",
								children: "Save parent"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-paper p-5 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: "Roster"
					}),
					visibleStudents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "No students in this view yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-line",
						children: visibleStudents.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "grid gap-3 py-3 sm:grid-cols-[1fr_auto] sm:items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: s.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-xs text-muted",
								children: [
									"Grade ",
									s.grade,
									" ",
									s.section,
									" · ",
									s.code,
									" · PIN ",
									s.pin,
									" · faces ",
									s.descriptors.length,
									" ·",
									" ",
									parents.find((p) => p.id === s.parentId)?.name ?? "no parent",
									parents.find((p) => p.id === s.parentId)?.phone ? ` · ${parents.find((p) => p.id === s.parentId)?.phone}` : ""
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: "min-h-10 rounded-xl bg-canvas px-2 text-xs text-ink",
										value: s.sectionId,
										onChange: (e) => {
											const result = moveStudent(s.id, e.target.value);
											if ("error" in result) setNotice(result.error);
										},
										"aria-label": `Section for ${s.name}`,
										children: orderedSections.map((sec) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: sec.id,
											children: sectionLabel(sec)
										}, sec.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "min-h-10 rounded-xl bg-canvas px-2 text-xs text-ink",
										value: s.parentId ?? "",
										onChange: (e) => linkParent(s.id, e.target.value || null),
										"aria-label": `Parent for ${s.name}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "No parent"
										}), parents.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: p.id,
											children: p.name
										}, p.id))]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										className: "min-h-10 text-xs",
										onClick: () => setEnrollId(s.id),
										children: "Enroll face"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										className: "min-h-10 text-xs",
										onClick: () => removeStudent(s.id),
										children: "Remove"
									})
								]
							})]
						}, s.id))
					}),
					enrollId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 max-w-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-sm text-muted",
								children: "Capture 3–5 samples in different light. Written permission first."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaceCapture, {
								variant: "paper",
								onCapture: (descriptor) => {
									const result = enrollFace(enrollId, descriptor);
									if ("error" in result) setNotice(result.error);
									else setNotice(`Saved face sample (${result.count} total).`);
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "mt-2",
								onClick: () => setEnrollId(null),
								children: "Close camera"
							})
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-paper p-5 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: "Automatic parent alerts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "On every check-in, check-out, or missing-arrival mark, the office sends email through the school Gmail and SMS through Semaphore. Leave a field blank to skip that channel."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 grid gap-3 sm:grid-cols-2",
						onSubmit: onNotify,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "emailUser",
								label: "School Gmail",
								type: "email",
								defaultValue: school.notify?.emailUser,
								placeholder: "school@gmail.com"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "emailPass",
								label: "Gmail app password",
								type: "password",
								placeholder: school.notify?.emailPass ? "Saved on this laptop" : "16-character app password"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "emailHost",
								label: "Mail server",
								defaultValue: school.notify?.emailHost || "smtp.gmail.com"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "smsKey",
								label: "Semaphore SMS key",
								type: "password",
								placeholder: school.notify?.smsKey ? "Saved on this laptop" : "API key from semaphore.co"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								name: "smsSender",
								label: "SMS sender name",
								defaultValue: school.notify?.smsSender || "SCNGATE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									children: "Save alert settings"
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-paper p-5 shadow-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold",
					children: "Hours"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 grid gap-3 sm:grid-cols-2",
					onSubmit: onHours,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "schoolName",
							label: "School name",
							defaultValue: school.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "campus",
							label: "Campus",
							defaultValue: school.campus
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "arrivalStart",
							label: "Arrival start",
							type: "time",
							defaultValue: school.arrivalStart
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "arrivalEnd",
							label: "Arrival end",
							type: "time",
							defaultValue: school.arrivalEnd
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "absentCutoff",
							label: "No-arrival cutoff",
							type: "time",
							defaultValue: school.absentCutoff
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "dismissStart",
							label: "Dismissal",
							type: "time",
							defaultValue: school.dismissStart
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "outline",
								children: "Save hours"
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-paper p-5 shadow-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold",
					children: "Alerts sent to parents"
				}), alerts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "Alerts appear after a gate scan or a missing-arrival mark."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 grid gap-3",
					children: alerts.slice(0, 12).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl bg-canvas px-4 py-3 text-sm",
						children: [
							a.text,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-xs text-muted",
								children: new Date(a.createdAt).toLocaleString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block text-xs text-muted",
								children: [
									"Email: ",
									a.emailStatus,
									a.emailDetail ? ` — ${a.emailDetail}` : "",
									" · SMS: ",
									a.smsStatus,
									a.smsDetail ? ` — ${a.smsDetail}` : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-2 text-xs font-medium text-primary",
								onClick: () => void pushNotice(a.id),
								children: "Send again"
							})
						]
					}, a.id))
				})]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl bg-paper px-4 py-4 shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-wider text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-3xl font-semibold tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { OfficePage as component };
