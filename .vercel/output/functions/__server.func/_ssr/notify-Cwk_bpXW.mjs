import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { i as string, r as object } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notify-Cwk_bpXW.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var Input = object({
	fromName: string(),
	emailHost: string(),
	emailUser: string(),
	emailPass: string(),
	toEmail: string(),
	subject: string(),
	text: string(),
	smsKey: string(),
	smsSender: string(),
	toPhone: string()
});
var windowMs = 6e4;
var maxPerWindow = 24;
var stamps = [];
function rateOk() {
	const now = Date.now();
	while (stamps.length && now - stamps[0] > windowMs) stamps.shift();
	if (stamps.length >= maxPerWindow) return false;
	stamps.push(now);
	return true;
}
var dispatchNotice_createServerFn_handler = createServerRpc({
	id: "a3023c896c3aa5153cee240050c270493fbb3d851073861eae92f7d0ef849630",
	name: "dispatchNotice",
	filename: "src/lib/school/notify.ts"
}, (opts) => dispatchNotice.__executeServer(opts));
var dispatchNotice = createServerFn({ method: "POST" }).validator((input) => Input.parse(input)).handler(dispatchNotice_createServerFn_handler, async ({ data }) => {
	if (!rateOk()) return {
		email: {
			status: "failed",
			detail: "Too many alerts in one minute. Try again shortly."
		},
		sms: {
			status: "failed",
			detail: "Too many alerts in one minute. Try again shortly."
		}
	};
	const { sendEmail, sendSms } = await import("./notify-send.server-CWcDouKw.mjs");
	const text = data.text.slice(0, 500);
	const email = data.toEmail.includes("@") && data.emailUser.trim() && data.emailPass ? await sendEmail({
		host: data.emailHost,
		user: data.emailUser,
		pass: data.emailPass,
		fromName: data.fromName || "Sta Catalina Gate",
		to: data.toEmail,
		subject: data.subject,
		text
	}) : {
		ok: false,
		detail: !data.toEmail.includes("@") ? "No parent email on file." : "Add the school Gmail in Office → Alerts.",
		skip: true
	};
	const sms = data.toPhone.trim() && data.smsKey.trim() ? await sendSms({
		apiKey: data.smsKey,
		number: data.toPhone,
		message: text,
		sender: data.smsSender
	}) : {
		ok: false,
		detail: !data.toPhone.trim() ? "No parent mobile on file." : "Add a Semaphore SMS key in Office → Alerts.",
		skip: true
	};
	return {
		email: {
			status: "skip" in email && email.skip ? "skipped" : email.ok ? "sent" : "failed",
			detail: email.detail
		},
		sms: {
			status: "skip" in sms && sms.skip ? "skipped" : sms.ok ? "sent" : "failed",
			detail: sms.detail
		}
	};
});
//#endregion
export { dispatchNotice_createServerFn_handler };
