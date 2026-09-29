import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/field-BOpMDRwx.js
var import_jsx_runtime = require_jsx_runtime();
function Field({ name, label, placeholder, required, type = "text", defaultValue, autoComplete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "text-xs uppercase tracking-wider text-muted",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			name,
			id: name,
			type,
			required,
			placeholder,
			defaultValue,
			autoComplete,
			className: "mt-1 min-h-11 w-full rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2"
		})]
	});
}
//#endregion
export { Field as t };
