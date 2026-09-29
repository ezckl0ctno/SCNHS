import nodemailer from "nodemailer";

export function normalizePh(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("09")) return `63${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("63")) return digits;
  if (digits.length === 10 && digits.startsWith("9")) return `63${digits}`;
  return "";
}

function clip(msg: string) {
  return msg.replace(/pass(word)?=[^&\s]+/gi, "pass=***").slice(0, 180);
}

export async function sendEmail(input: {
  host: string;
  user: string;
  pass: string;
  fromName: string;
  to: string;
  subject: string;
  text: string;
}): Promise<{ ok: true; detail: string } | { ok: false; detail: string }> {
  const host = input.host.trim() || "smtp.gmail.com";
  const gmail = host.includes("gmail");
  const transporter = nodemailer.createTransport({
    host,
    port: gmail ? 465 : 587,
    secure: gmail,
    auth: { user: input.user.trim(), pass: input.pass },
    connectionTimeout: 8000,
    socketTimeout: 8000,
  });
  try {
    await transporter.sendMail({
      from: `"${input.fromName}" <${input.user.trim()}>`,
      to: input.to.trim(),
      subject: input.subject.slice(0, 120),
      text: input.text.slice(0, 500),
    });
    return { ok: true, detail: `Sent to ${input.to.trim()}` };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Email could not be sent.";
    return { ok: false, detail: clip(msg) };
  } finally {
    transporter.close();
  }
}

export async function sendSms(input: {
  apiKey: string;
  number: string;
  message: string;
  sender: string;
}): Promise<{ ok: true; detail: string } | { ok: false; detail: string }> {
  const number = normalizePh(input.number);
  if (!number) return { ok: false, detail: "Mobile number is not a valid PH number." };
  try {
    const body = new URLSearchParams({
      apikey: input.apiKey.trim(),
      number,
      message: input.message.slice(0, 300),
    });
    if (input.sender.trim()) body.set("sendername", input.sender.trim().slice(0, 11));
    const res = await fetch("https://api.semaphore.co/api/v4/messages", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(8000),
    });
    const text = await res.text();
    if (!res.ok) return { ok: false, detail: clip(text || `SMS HTTP ${res.status}`) };
    return { ok: true, detail: `Sent to ${number}` };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "SMS could not be sent.";
    return { ok: false, detail: clip(msg) };
  }
}
