import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Archive, Check, LogIn, LogOut, RefreshCw, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Btn, Display, Label, Page, inputClass } from "@/components/site/ui";
import { checkAdmin, listForModeration, moderateTestimony, recordEmailedTestimony, STATUSES } from "@/lib/testimonies.functions";
import { TESTIMONY_CATEGORIES } from "@/lib/testimony-rules";

type ModerationItem = Awaited<ReturnType<typeof listForModeration>>[number];
type AdminStatus = (typeof STATUSES)[number];

const TITLE = "Testimony moderation — Seed of Christ Golden Church Worldwide";
const DESCRIPTION = "Private review tools for testimony submissions to Seed of Christ Golden Church Worldwide.";

export const Route = createFileRoute("/admin/testimonies")({
  head: () => ({ meta: [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    { property: "og:title", content: TITLE },
    { property: "og:description", content: DESCRIPTION },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: AdminTestimoniesPage,
});

function AdminTestimoniesPage() {
  const verifyAdmin = useServerFn(checkAdmin);
  const loadRows = useServerFn(listForModeration);
  const moderate = useServerFn(moderateTestimony);
  const addEmailed = useServerFn(recordEmailedTestimony);
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState<AdminStatus>("pending");
  const [rows, setRows] = useState<ModerationItem[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState("");
  const [reason, setReason] = useState<Record<string, string>>({});
  const [emailDraft, setEmailDraft] = useState({ fullName: "", email: "", location: "", title: "", testimony: "", category: "", consentConfirmed: false });

  const refresh = async (nextStatus = status) => {
    setError("");
    try {
      const access = await verifyAdmin();
      if (!access.isAdmin) {
        setIsAdmin(false);
        setError("This account is not authorized to review testimonies.");
        return;
      }
      setIsAdmin(true);
      const items = await loadRows({ data: { status: nextStatus } });
      setRows(items);
    } catch {
      setIsAdmin(false);
      setError("Please sign in with an authorized church administrator account.");
    }
  };

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const authenticated = Boolean(data.session);
      setSignedIn(authenticated);
      if (authenticated) await refresh();
    }).catch(() => {
      if (active) setError("Sign-in status could not be checked.");
    });
    return () => { active = false; };
  }, []);

  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("Sign-in failed. Check the account details and try again.");
      return;
    }
    setSignedIn(true);
    await refresh();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSignedIn(false);
    setIsAdmin(false);
    setRows([]);
    setNotice("");
  };

  const actOn = async (item: ModerationItem, action: "approve" | "reject" | "archive") => {
    setBusyId(item.id);
    setError("");
    setNotice("");
    try {
      await moderate({ data: { id: item.id, action, reason: reason[item.id] } });
      setNotice(action === "approve" ? "Testimony approved for publication." : action === "reject" ? "Testimony rejected." : "Testimony archived.");
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "This moderation action could not be completed.");
    } finally {
      setBusyId("");
    }
  };

  const saveEmailed = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusyId("emailed");
    setError("");
    setNotice("");
    try {
      await addEmailed({ data: {
        fullName: emailDraft.fullName,
        email: emailDraft.email,
        location: emailDraft.location || undefined,
        title: emailDraft.title,
        testimony: emailDraft.testimony,
        category: (emailDraft.category || undefined) as (typeof TESTIMONY_CATEGORIES)[number] | undefined,
        consentConfirmed: emailDraft.consentConfirmed,
      } });
      setEmailDraft({ fullName: "", email: "", location: "", title: "", testimony: "", category: "", consentConfirmed: false });
      setNotice("Emailed testimony added to Pending review; it is not published automatically.");
      await refresh("pending");
      setStatus("pending");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not add this emailed testimony.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <Page className="max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-5 border-b border-line pb-8">
        <div><Label>Private church tools</Label><Display as="h1" className="text-4xl md:text-6xl">TESTIMONY REVIEW</Display><p className="mt-4 max-w-2xl text-sm leading-7 opacity-70">Only authorized administrators can view private submissions and contact details.</p></div>
        {signedIn && <button type="button" onClick={() => void signOut()} className="font-label inline-flex min-h-11 items-center gap-2 border border-ink px-4 text-xs font-bold uppercase focus-visible:outline-2 focus-visible:outline-gold"><LogOut size={16} aria-hidden="true" />Sign out</button>}
      </div>

      {error && <p role="alert" className="mt-6 border border-crimson p-4 text-sm">{error}</p>}
      {notice && <p role="status" className="mt-6 border border-gold p-4 text-sm">{notice}</p>}

      {!signedIn && <form onSubmit={(event) => void signIn(event)} className="mt-10 max-w-md space-y-5">
        <h2 className="font-label text-sm font-bold uppercase">Administrator sign-in</h2>
        <label className="block text-sm" htmlFor="admin-email">Email address<input id="admin-email" className={`${inputClass} mt-2`} type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label className="block text-sm" htmlFor="admin-password">Password<input id="admin-password" className={`${inputClass} mt-2`} type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <Btn type="submit" icon={LogIn}>Sign in</Btn>
      </form>}

      {signedIn && isAdmin && <>
        <section className="mt-12 border-b border-line pb-10" aria-labelledby="emailed-review-heading">
          <Label>Consent confirmation</Label><h2 id="emailed-review-heading" className="font-display text-3xl">ADD AN EMAILED TESTIMONY TO PENDING REVIEW</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 opacity-70">Enter only details the submitter provided and record permission only after confirming it with them. This adds a pending item; approval is a separate step.</p>
          <form onSubmit={(event) => void saveEmailed(event)} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="text-sm">Submitter name<input required minLength={2} maxLength={120} className={`${inputClass} mt-2`} value={emailDraft.fullName} onChange={(event) => setEmailDraft((draft) => ({ ...draft, fullName: event.target.value }))} /></label>
            <label className="text-sm">Private email<input required type="email" maxLength={200} className={`${inputClass} mt-2`} value={emailDraft.email} onChange={(event) => setEmailDraft((draft) => ({ ...draft, email: event.target.value }))} /></label>
            <label className="text-sm">Location (optional)<input maxLength={120} className={`${inputClass} mt-2`} value={emailDraft.location} onChange={(event) => setEmailDraft((draft) => ({ ...draft, location: event.target.value }))} /></label>
            <label className="text-sm">Testimony title<input required minLength={3} maxLength={160} className={`${inputClass} mt-2`} value={emailDraft.title} onChange={(event) => setEmailDraft((draft) => ({ ...draft, title: event.target.value }))} /></label>
            <label className="text-sm md:col-span-2">Testimony text<textarea required minLength={20} maxLength={6000} rows={5} className={`${inputClass} mt-2`} value={emailDraft.testimony} onChange={(event) => setEmailDraft((draft) => ({ ...draft, testimony: event.target.value }))} /></label>
            <label className="text-sm">Category (optional)<select className={`${inputClass} mt-2`} value={emailDraft.category} onChange={(event) => setEmailDraft((draft) => ({ ...draft, category: event.target.value }))}><option value="">No category</option>{TESTIMONY_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="flex items-start gap-3 text-sm leading-6 md:col-span-2"><input type="checkbox" required className="mt-1 size-5 shrink-0 accent-gold" checked={emailDraft.consentConfirmed} onChange={(event) => setEmailDraft((draft) => ({ ...draft, consentConfirmed: event.target.checked }))} /><span>I confirm the submitter gave permission for church review and possible publication through official ministry channels.</span></label>
            <div className="md:col-span-2"><Btn type="submit" disabled={busyId === "emailed"} icon={SendIcon}>{busyId === "emailed" ? "Saving…" : "Add to pending review"}</Btn></div>
          </form>
        </section>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-5">
          <label className="font-label text-xs font-bold uppercase">Submission status<select value={status} onChange={(event) => { const next = event.target.value as AdminStatus; setStatus(next); void refresh(next); }} className={`${inputClass} mt-2 min-w-56`}>{STATUSES.map((value) => <option key={value} value={value}>{value.replace(/^./, (character) => character.toUpperCase())}</option>)}</select></label>
          <button type="button" onClick={() => void refresh()} className="font-label inline-flex min-h-11 items-center gap-2 border border-ink px-4 text-xs font-bold uppercase focus-visible:outline-2 focus-visible:outline-gold"><RefreshCw size={15} aria-hidden="true" />Refresh</button>
        </div>

        <div className="mt-6 divide-y divide-line border-y border-line">
          {rows.length === 0 ? <p className="py-10 text-center text-sm opacity-70">No submissions in this status.</p> : rows.map((item) => <article key={item.id} className="py-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0"><p className="font-label text-xs font-bold uppercase text-golddeep">{item.category ?? "Uncategorised"} · Received {formatDate(item.submitted_at)}</p><h2 className="font-display mt-3 break-words text-3xl">{item.title}</h2><p className="mt-2 text-sm">{item.full_name}{item.location ? ` · ${item.location}` : ""}</p></div>
              <a className="font-label min-h-11 break-all text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-gold" href={`mailto:${item.email}`}>{item.email}</a>
            </div>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-7">{item.testimony || "No written testimony provided."}</p>
            <p className="mt-4 text-xs font-semibold uppercase">Publication consent: {item.consent_to_publish ? "Confirmed" : "Not confirmed"}</p>
            {item.image_signed && <div className="mt-5"><img src={item.image_signed} alt={`Submitted photo evidence for ${item.title}`} className="max-h-80 max-w-full object-contain" /></div>}
            {item.audio_signed && <div className="mt-5 max-w-xl"><label className="font-label mb-2 block text-xs font-bold uppercase" htmlFor={`audio-${item.id}`}>Submitted audio</label><audio id={`audio-${item.id}`} controls preload="none" src={item.audio_signed} className="w-full" /></div>}
            {status === "pending" && <div className="mt-6 flex flex-wrap items-end gap-3"><label className="min-w-56 flex-1 text-xs font-bold uppercase">Rejection reason<textarea value={reason[item.id] ?? ""} onChange={(event) => setReason((current) => ({ ...current, [item.id]: event.target.value }))} rows={2} maxLength={1000} className={`${inputClass} mt-2`} /></label><button type="button" disabled={busyId === item.id || !item.consent_to_publish} onClick={() => void actOn(item, "approve")} className="font-label inline-flex min-h-11 items-center gap-2 border border-golddeep px-4 text-xs font-bold uppercase disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-gold"><Check size={16} aria-hidden="true" />Approve</button><button type="button" disabled={busyId === item.id || !(reason[item.id] ?? "").trim()} onClick={() => void actOn(item, "reject")} className="font-label inline-flex min-h-11 items-center gap-2 border border-crimson px-4 text-xs font-bold uppercase disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-crimson"><X size={16} aria-hidden="true" />Reject</button><button type="button" disabled={busyId === item.id} onClick={() => void actOn(item, "archive")} className="font-label inline-flex min-h-11 items-center gap-2 border border-ink px-4 text-xs font-bold uppercase disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-gold"><Archive size={16} aria-hidden="true" />Archive</button></div>}
          </article>)}
        </div>
      </>}
    </Page>
  );
}

function SendIcon() {
  return <Check size={15} aria-hidden="true" />;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(value));
}