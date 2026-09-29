import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  fromName: z.string(),
  emailHost: z.string(),
  emailUser: z.string(),
  emailPass: z.string(),
  toEmail: z.string(),
  subject: z.string(),
  text: z.string(),
  smsKey: z.string(),
  smsSender: z.string(),
  toPhone: z.string(),
});

export type NoticeResult = {
  email: { status: "sent" | "failed" | "skipped"; detail: string };
  sms: { status: "sent" | "failed" | "skipped"; detail: string };
};

const windowMs = 60_000;
const maxPerWindow = 24;
const stamps: number[] = [];

function rateOk() {
  const now = Date.now();
  while (stamps.length && now - stamps[0] > windowMs) stamps.shift();
  if (stamps.length >= maxPerWindow) return false;
  stamps.push(now);
  return true;
}

export const dispatchNotice = createServerFn({ method: "POST" })
  .validator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<NoticeResult> => {
    if (!rateOk()) {
      return {
        email: { status: "failed", detail: "Too many alerts in one minute. Try again shortly." },
        sms: { status: "failed", detail: "Too many alerts in one minute. Try again shortly." },
      };
    }
    const { sendEmail, sendSms } = await import("./notify-send.server.ts");
    const text = data.text.slice(0, 500);
    const email =
      data.toEmail.includes("@") && data.emailUser.trim() && data.emailPass
        ? await sendEmail({
            host: data.emailHost,
            user: data.emailUser,
            pass: data.emailPass,
            fromName: data.fromName || "Sta Catalina Gate",
            to: data.toEmail,
            subject: data.subject,
            text,
          })
        : {
            ok: false as const,
            detail: !data.toEmail.includes("@")
              ? "No parent email on file."
              : "Add the school Gmail in Office → Alerts.",
            skip: true,
          };
    const sms =
      data.toPhone.trim() && data.smsKey.trim()
        ? await sendSms({
            apiKey: data.smsKey,
            number: data.toPhone,
            message: text,
            sender: data.smsSender,
          })
        : {
            ok: false as const,
            detail: !data.toPhone.trim()
              ? "No parent mobile on file."
              : "Add a Semaphore SMS key in Office → Alerts.",
            skip: true,
          };
    return {
      email: {
        status: "skip" in email && email.skip ? "skipped" : email.ok ? "sent" : "failed",
        detail: email.detail,
      },
      sms: {
        status: "skip" in sms && sms.skip ? "skipped" : sms.ok ? "sent" : "failed",
        detail: sms.detail,
      },
    };
  });
