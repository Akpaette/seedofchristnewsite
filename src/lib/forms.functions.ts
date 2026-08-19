import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  kind: z.enum(["prayer", "contact", "newsletter"]),
  name: z.string().max(120).optional(),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional(),
  message: z.string().max(4000).optional(),
  confidential: z.boolean().optional(),
});

export type SubmitResult = {
  ok: boolean;
  /** True when no delivery provider is configured yet (credentials pending). */
  unconfigured: boolean;
  message: string;
};

export const submitChurchForm = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }): Promise<SubmitResult> => {
    const formspreeId = process.env["FORMSPREE_FORM_ID"];
    const resendKey = process.env["RESEND_API_KEY"];
    const office = process.env["CHURCH_INBOX"] ?? "admin@seedofchrist.org";

    const subject = `[${data.kind}] Seed of Christ website`;
    const body = [
      `Type: ${data.kind}`,
      data.name ? `Name: ${data.name}` : null,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : null,
      data.confidential ? "Marked CONFIDENTIAL by sender" : null,
      "",
      data.message ?? "",
    ]
      .filter(Boolean)
      .join("\n");

    if (formspreeId) {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ subject, email: data.email, message: body }),
      });
      return res.ok
        ? { ok: true, unconfigured: false, message: "Received. The office will reply soon." }
        : { ok: false, unconfigured: false, message: "Delivery failed. Please try again." };
    }

    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env["RESEND_FROM"] ?? "website@seedofchrist.org",
          to: [office],
          reply_to: data.email,
          subject,
          text: body,
        }),
      });
      return res.ok
        ? { ok: true, unconfigured: false, message: "Received. The office will reply soon." }
        : { ok: false, unconfigured: false, message: "Delivery failed. Please try again." };
    }

    return {
      ok: false,
      unconfigured: true,
      message:
        "Form delivery is not connected yet — add the church's Formspree form ID or Resend API key before launch.",
    };
  });