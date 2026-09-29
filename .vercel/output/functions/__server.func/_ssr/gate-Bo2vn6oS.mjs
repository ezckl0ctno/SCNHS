import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as LogOut, r as LogIn } from "../_libs/lucide-react.mjs";
import { c as sectionLabel, f as useSchool, i as STATUS_LABEL, n as Button, r as ClientReady, t as AppShell, u as studentsInSection } from "./app-shell-bktvxgIj.mjs";
import { t as FaceCapture } from "./face-capture-CVUwv37R.mjs";
import { t as SectionPicker } from "./section-picker-Cypgp8Or.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gate-Bo2vn6oS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GatePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "School Facial Recognition",
		kicker: "Check in / check out by section",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientReady, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GateBody, {}) })
	});
}
function GateBody() {
	const checkPin = useSchool((s) => s.checkPin);
	const checkFace = useSchool((s) => s.checkFace);
	const students = useSchool((s) => s.students);
	const sections = useSchool((s) => s.sections);
	const [sectionId, setSectionId] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [pin, setPin] = (0, import_react.useState)("");
	const [pendingFace, setPendingFace] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [last, setLast] = (0, import_react.useState)(null);
	const section = sections.find((s) => s.id === sectionId) ?? null;
	const cohort = (0, import_react.useMemo)(() => sectionId ? studentsInSection(students, sectionId) : [], [students, sectionId]);
	function finish(result) {
		if (!result.ok) {
			setLast(null);
			setError(result.error);
			return;
		}
		setError("");
		setLast({
			student: result.student,
			event: result.event
		});
		setPendingFace(null);
		setPin("");
	}
	function submit(direction) {
		if (!sectionId) {
			setError("Choose the student’s section first.");
			return;
		}
		if (pendingFace) {
			finish(checkFace(sectionId, pendingFace, direction));
			return;
		}
		finish(checkPin(sectionId, code, pin, direction));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 lg:grid-cols-[1.1fr_0.9fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-3xl bg-ink p-5 text-paper shadow-border sm:p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.16em] text-gold",
					children: "Kiosk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-3xl font-semibold",
					children: "Section first. Then face or PIN."
				}),
				students.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm text-leaf",
					children: "The office has not added students yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-6 block text-xs uppercase tracking-wider text-leaf",
						children: ["Section at this gate", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionPicker, {
							dark: true,
							sections,
							value: sectionId,
							onChange: (id) => {
								setSectionId(id);
								setError("");
								setLast(null);
								setPendingFace(null);
							}
						})]
					}),
					section ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-leaf",
						children: [
							cohort.length,
							" student",
							cohort.length === 1 ? "" : "s",
							" in ",
							sectionLabel(section),
							". Only they can check in here."
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-leaf",
						children: "Open the section before scanning anyone."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaceCapture, { onCapture: (descriptor) => {
							setPendingFace(descriptor);
							setError("");
						} })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-xs uppercase tracking-[0.16em] text-gold",
						children: "PIN fallback"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 block text-xs uppercase tracking-wider text-leaf",
						children: ["Student code", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "mt-2 min-h-12 w-full rounded-xl border-0 bg-primary-dark px-3 text-paper outline-none ring-gold focus:ring-2",
							value: code,
							onChange: (e) => setCode(e.target.value),
							autoComplete: "off"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 block text-xs uppercase tracking-wider text-leaf",
						children: ["PIN", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "mt-2 min-h-12 w-full rounded-xl border-0 bg-primary-dark px-3 text-paper outline-none ring-gold focus:ring-2",
							value: pin,
							onChange: (e) => setPin(e.target.value),
							inputMode: "numeric",
							autoComplete: "off"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "gold",
							className: "min-h-12",
							onClick: () => submit("in"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" }), " Check in"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "min-h-12 bg-transparent text-paper",
							onClick: () => submit("out"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), " Check out"]
						})]
					}),
					pendingFace ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-gold",
						children: "Face ready. Tap Check in or Check out."
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 rounded-xl bg-rose-soft px-3 py-3 text-sm text-rose",
						children: error
					}) : null,
					last ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 rounded-xl bg-ok-soft px-3 py-3 text-sm text-ok",
						children: [
							last.student.name,
							" · Grade ",
							last.student.grade,
							" ",
							last.student.section,
							":",
							" ",
							STATUS_LABEL[last.event.status]
						]
					}) : null
				] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "rounded-3xl bg-paper p-5 shadow-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl font-semibold",
					children: "How to use the gate"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mt-3 grid gap-3 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "1. Guard opens the section on duty (example: Grade 12 — Chromium)." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "2. Only students of that section can check in — face or PIN." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "3. A student from another section is turned away until the correct section is open." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "4. Linked parents see the alert on the Parents desk." })
					]
				}),
				section && cohort.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-xs uppercase tracking-wider text-muted",
						children: "This section"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 divide-y divide-line text-sm",
						children: cohort.slice(0, 12).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-2 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-muted",
								children: s.code
							})]
						}, s.id))
					})]
				}) : null
			]
		})]
	});
}
//#endregion
export { GatePage as component };
