import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as sectionLabel, d as todayISO, f as useSchool, n as Button, r as ClientReady, t as AppShell, u as studentsInSection } from "./app-shell-bktvxgIj.mjs";
import { t as SectionPicker } from "./section-picker-Cypgp8Or.mjs";
import { t as Field } from "./field-BOpMDRwx.mjs";
import { t as StatusBadge } from "./status-badge-BMeD2YOM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student-BLimZMAh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StudentPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Student desk",
		kicker: "Sign in to your section",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientReady, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentBody, {}) })
	});
}
function StudentBody() {
	const session = useSchool((s) => s.session);
	if (session.role !== "student") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentDesk, { studentId: session.studentId });
}
function StudentSignIn() {
	const sections = useSchool((s) => s.sections);
	const signInStudent = useSchool((s) => s.signInStudent);
	const [sectionId, setSectionId] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	async function onSubmit(e) {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const result = await signInStudent(sectionId, String(data.get("code") || ""), String(data.get("pin") || ""));
		if (!result.ok) setError(result.error);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "max-w-md rounded-3xl bg-paper p-5 shadow-border",
		onSubmit,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl font-semibold",
				children: "Your section only"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Choose the grade and section on your class list. A PIN from another section will not open this desk."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs uppercase tracking-wider text-muted",
						children: ["Section", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionPicker, {
							sections,
							value: sectionId,
							onChange: setSectionId
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						name: "code",
						label: "Student code",
						placeholder: "STU-1001",
						required: true,
						autoComplete: "username"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						name: "pin",
						label: "PIN",
						required: true,
						autoComplete: "current-password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Sign in"
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-rose",
						children: error
					}) : null
				]
			})
		]
	});
}
function StudentDesk({ studentId }) {
	const students = useSchool((s) => s.students);
	const sections = useSchool((s) => s.sections);
	const attendance = useSchool((s) => s.attendance);
	const signOut = useSchool((s) => s.signOut);
	const student = students.find((s) => s.id === studentId);
	if (!student) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-muted",
		children: [
			"This student is no longer on the roster.",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "text-primary underline",
				onClick: signOut,
				children: "Sign out"
			})
		]
	});
	const section = sections.find((s) => s.id === student.sectionId);
	const classmates = studentsInSection(students, student.sectionId).filter((s) => s.id !== student.id).sort((a, b) => a.name.localeCompare(b.name));
	const day = todayISO();
	const today = attendance.filter((a) => a.studentId === student.id && a.date === day);
	const history = attendance.filter((a) => a.studentId === student.id).slice(0, 16);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"Signed in as ",
						student.name,
						section ? ` · ${sectionLabel(section)}` : ""
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "min-h-10 text-xs",
					onClick: signOut,
					children: "Sign out"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-3xl bg-paper p-5 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold",
						children: student.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							section ? sectionLabel(section) : `Grade ${student.grade} ${student.section}`,
							" · ",
							student.code
						]
					}),
					section?.adviser ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: ["Adviser: ", section.adviser]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-5 text-xs uppercase tracking-wider text-muted",
						children: "Today"
					}),
					today.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "No gate event yet today. Check in at the gate kiosk."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 grid gap-2",
						children: today.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: e.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-muted",
								children: new Date(e.createdAt).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit"
								})
							})]
						}, e.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-5 text-xs uppercase tracking-wider text-muted",
						children: "Recent"
					}),
					history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Nothing recorded yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 divide-y divide-line text-sm",
						children: history.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-center justify-between gap-2 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: new Date(e.createdAt).toLocaleString([], {
									month: "short",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: e.status })]
						}, e.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-3xl bg-paper p-5 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: "Classmates in this section"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Names only. You cannot open another section from here."
					}),
					classmates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "You are the only student listed in this section so far."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-line text-sm",
						children: classmates.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "py-2",
							children: c.name
						}, c.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Gate check-in is on the",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/gate",
						className: "text-primary underline",
						children: "Gate"
					}),
					" ",
					"page. Parents use a separate sign-in."
				]
			})
		]
	});
}
//#endregion
export { StudentPage as component };
