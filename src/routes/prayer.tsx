import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { HeartHandshake, Phone } from "lucide-react";
import { Btn, Page, PlaceholderNote, SectionHead, inputClass } from "@/components/site/ui";
import { submitChurchForm, type SubmitResult } from "@/lib/forms.functions";

const TITLE = "Prayer Request — Seed of Christ Golden Church Worldwide";
const DESCRIPTION =
  "Send a prayer request to the intercessory team at Seed of Christ Golden Church Worldwide, or call the prayer line.";

export const Route = createFileRoute("/prayer")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "/prayer" },
    ],
    links: [{ rel: "canonical", href: "/prayer" }],
  }),
  component: PrayerPage,
});

function PrayerPage() {
  const submit = useServerFn(submitChurchForm);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  return (
    <Page className="max-w-2xl">
      <SectionHead
        as="h1"
        label="We stand with you"
        title="PRAYER REQUEST"
        sub="Share your request with our intercessory team. Nothing you send is shared publicly."
      />

      <a
        href="tel:+2348082088888"
        className="border-ink font-label mb-8 inline-flex items-center gap-2 border-2 px-4 py-3 text-xs font-bold uppercase"
      >
        <Phone size={15} /> Prayer line: +234 808 208 8888
      </a>

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
                kind: "prayer",
                name: String(fd.get("name") ?? ""),
                email: String(fd.get("email") ?? ""),
                phone: String(fd.get("phone") ?? ""),
                message: String(fd.get("message") ?? ""),
                confidential: fd.get("confidential") === "on",
              },
            });
            setResult(res);
            if (res.ok) form.reset();
          } catch {
            setResult({ ok: false, unconfigured: false, message: "Something went wrong." });
          } finally {
            setBusy(false);
          }
        }}
      >
        <div>
          <label className="font-label text-xs font-bold uppercase" htmlFor="name">
            Your name
          </label>
          <input id="name" name="name" required className={`${inputClass} mt-1`} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-label text-xs font-bold uppercase" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`${inputClass} mt-1`}
            />
          </div>
          <div>
            <label className="font-label text-xs font-bold uppercase" htmlFor="phone">
              Phone (optional)
            </label>
            <input id="phone" name="phone" className={`${inputClass} mt-1`} />
          </div>
        </div>
        <div>
          <label className="font-label text-xs font-bold uppercase" htmlFor="message">
            Your request
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            className={`${inputClass} mt-1`}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="confidential" className="size-4" />
          Keep this request confidential to the pastoral team
        </label>
        <Btn type="submit" tone="crimson" icon={HeartHandshake} disabled={busy}>
          {busy ? "Sending…" : "Send request"}
        </Btn>
      </form>

      {result &&
        (result.unconfigured ? (
          <div className="mt-6">
            <PlaceholderNote>⚠ {result.message}</PlaceholderNote>
          </div>
        ) : (
          <p
            role="status"
            className={`font-label mt-6 border-2 p-3 text-xs font-bold uppercase ${result.ok ? "border-ink" : "border-crimson text-crimson"}`}
          >
            {result.message}
          </p>
        ))}
    </Page>
  );
}