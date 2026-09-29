import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as sectionLabel, l as sortSections } from "./app-shell-bktvxgIj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/section-picker-Cypgp8Or.js
var import_jsx_runtime = require_jsx_runtime();
function SectionPicker({ sections, value, onChange, name, id, includeAll, dark }) {
	const ordered = sortSections(sections);
	const grades = [...new Set(ordered.map((s) => s.grade))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		name,
		id,
		className: dark ? "min-h-12 w-full rounded-xl border-0 bg-primary-dark px-3 text-paper outline-none ring-gold focus:ring-2" : "mt-1 min-h-11 w-full rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2",
		value,
		onChange: (e) => onChange(e.target.value),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: "",
			children: includeAll ? "All sections" : "Choose a section"
		}), grades.map((grade) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
			label: `Grade ${grade}`,
			children: ordered.filter((s) => s.grade === grade).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: s.id,
				children: sectionLabel(s)
			}, s.id))
		}, grade))]
	});
}
//#endregion
export { SectionPicker as t };
