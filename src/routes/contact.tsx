import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Btn, Page, PlaceholderNote, SectionHead, inputClass } from "@/components/site/ui";
import { submitChurchForm, type SubmitResult } from "@/lib/forms.functions";
import { SocialLinks } from "@/components/site/SocialLinks";

const TITLE = "Contact — Seed of Christ Golden Church Worldwide";
const DESCRIPTION =
  "Reach the Seed of Christ Golden Church Worldwide office in Ibadan, or our London branch, by phone or email.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const submit = useServerFn(submitChurchForm);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  return (
    <Page className="max-w-4xl">
      <SectionHead as="h1" label="Say hello" title="CONTACT US" />

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="border-ink border-2 p-5">
            <h2 className="font-label text-crimson text-xs font-bold uppercase">
              Headquarters — Ibadan
            </h2>
            <p className="mt-2 flex gap-2 text-sm">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              Orisunbare Street, Gbaremu Idi-Obi, Airport Area, Ibadan, Oyo State,
              Nigeria
            </p>
            <p className="mt-2 flex gap-2 text-sm">
              <Phone size={16} className="mt-0.5 shrink-0" />
              <a href="tel:+2348060291930">+234 806 029 1930</a>
            </p>
            <p className="mt-2 flex gap-2 text-sm">
              <Mail size={16} className="mt-0.5 shrink-0" />
              <span>
                <a href="mailto:admin@seedofchrist.org">admin@seedofchrist.org</a>
                {" · "}
                <a href="mailto:info@seedofchrist.org">info@seedofchrist.org</a>
              </span>
            </p>
          </div>

          <div className="border-ink border-2 p-5">
            <h2 className="font-label text-crimson text-xs font-bold uppercase">
              London — Enfield
            </h2>
            <p className="mt-2 flex gap-2 text-sm">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              46 Queensway Road, Enfield Town, United Kingdom
            </p>
            <p className="mt-2 flex gap-2 text-sm">
              <Phone size={16} className="mt-0.5 shrink-0" />
              <a href="tel:+447925749747">+44 7925 749747</a>
            </p>
            <p className="mt-2 flex gap-2 text-sm">
              <Mail size={16} className="mt-0.5 shrink-0" />
              <a href="mailto:Seedofchristlondon@yahoo.com">
                Seedofchristlondon@yahoo.com
              </a>
            </p>
          </div>
        </div>

        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            setBusy(true);
            try {
              const res = await submit({
                data: {
                  kind: "contact",
                  name: String(fd.get("name") ?? ""),
                  email: String(fd.get("email") ?? ""),
                  message: String(fd.get("message") ?? ""),
                },
              });
              setResult(res);
              if (res.ok) form.reset();
            } catch {
              setResult({
                ok: false,
                unconfigured: false,
                message: "Something went wrong.",
              });
            } finally {
              setBusy(false);
            }
          }}
        >
          <div>
            <label className="font-label text-xs font-bold uppercase" htmlFor="cname">
              Name
            </label>
            <input id="cname" name="name" required className={`${inputClass} mt-1`} />
          </div>
          <div>
            <label className="font-label text-xs font-bold uppercase" htmlFor="cemail">
              Email
            </label>
            <input
              id="cemail"
              name="email"
              type="email"
              required
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className="font-label text-xs font-bold uppercase" htmlFor="cmsg">
              Message
            </label>
            <textarea
              id="cmsg"
              name="message"
              rows={6}
              required
              className={`${inputClass} mt-1`}
            />
          </div>
          <Btn type="submit" icon={Send} disabled={busy}>
            {busy ? "Sending…" : "Send message"}
          </Btn>

          {result &&
            (result.unconfigured ? (
              <PlaceholderNote>⚠ {result.message}</PlaceholderNote>
            ) : (
              <p
                role="status"
                className={`font-label border-2 p-3 text-xs font-bold uppercase ${result.ok ? "border-ink" : "border-crimson text-crimson"}`}
              >
                {result.message}
              </p>
            ))}
        </form>
      </div>
      <section className="mt-14 bg-ink p-6 text-porcelain md:p-8" aria-labelledby="contact-social-heading">
        <h2 id="contact-social-heading" className="font-label mb-5 text-xs font-bold uppercase text-gold">Official social channels</h2>
        <SocialLinks showLabels />
      </section>
    </Page>
  );
}