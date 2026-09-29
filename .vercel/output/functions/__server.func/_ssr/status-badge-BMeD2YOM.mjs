import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as cn, i as STATUS_LABEL } from "./app-shell-bktvxgIj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-BMeD2YOM.js
var import_jsx_runtime = require_jsx_runtime();
var tone = {
	on_time: "bg-ok-soft text-ok",
	late: "bg-gold-soft text-gold-dark",
	early_exit: "bg-rose-soft text-rose",
	dismissed: "bg-leaf text-primary-dark",
	absent: "bg-rose-soft text-rose"
};
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide", tone[status]),
		children: STATUS_LABEL[status]
	});
}
//#endregion
export { StatusBadge as t };
