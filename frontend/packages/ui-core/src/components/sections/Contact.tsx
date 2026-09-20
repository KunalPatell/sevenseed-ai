"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Github, Linkedin, Send, Loader2, CheckCircle2, Copy, Check, ExternalLink } from "lucide-react";
import { isPlaceholderUrl, profile } from "../../lib/data";
import { SectionHeading } from "../ui";
import { sound } from "../../lib/sound";

type Status = "idle" | "sending" | "sent" | "error";

function HuggingFaceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.025 1.13c-5.77 0-10.449 4.647-10.449 10.378 0 1.112.178 2.181.503 3.185.064-.222.203-.444.416-.577a.96.96 0 0 1 .524-.15c.293 0 .584.124.84.284.278.173.48.408.71.694.226.282.458.611.684.951v-.014c.017-.324.106-.622.264-.874s.403-.487.762-.543c.3-.047.596.06.787.203s.31.313.4.467c.15.257.212.468.233.542.01.026.653 1.552 1.657 2.54.616.605 1.01 1.223 1.082 1.912.055.537-.096 1.059-.38 1.572.637.121 1.294.187 1.967.187.657 0 1.298-.063 1.921-.178-.287-.517-.44-1.041-.384-1.581.07-.69.465-1.307 1.081-1.913 1.004-.987 1.647-2.513 1.657-2.539.021-.074.083-.285.233-.542.09-.154.208-.323.4-.467a1.08 1.08 0 0 1 .787-.203c.359.056.604.29.762.543s.247.55.265.874v.015c.225-.34.457-.67.683-.952.23-.286.432-.52.71-.694.257-.16.547-.284.84-.285a.97.97 0 0 1 .524.151c.228.143.373.388.43.625l.006.04a10.3 10.3 0 0 0 .534-3.273c0-5.731-4.678-10.378-10.449-10.378M8.327 6.583a1.5 1.5 0 0 1 .713.174 1.487 1.487 0 0 1 .617 2.013c-.183.343-.762-.214-1.102-.094-.38.134-.532.914-.917.71a1.487 1.487 0 0 1 .69-2.803m7.486 0a1.487 1.487 0 0 1 .689 2.803c-.385.204-.536-.576-.916-.71-.34-.12-.92.437-1.103.094a1.487 1.487 0 0 1 .617-2.013 1.5 1.5 0 0 1 .713-.174m-10.68 1.55a.96.96 0 1 1 0 1.921.96.96 0 0 1 0-1.92m13.838 0a.96.96 0 1 1 0 1.92.96.96 0 0 1 0-1.92M8.489 11.458c.588.01 1.967.01 2.553.003.585.006 1.965.006 2.553-.003.743-.01.993-.326 1.018-.846.012-.249.006-.824.006-1.18 0-.462.247-.692.684-.692s.684.23.684.692v1.173c0 .546-.3.834-.848.854a37 37 0 0 1-2.018.006c-.636 0-1.963 0-2.502-.006.126.3.364.55.702.738.411.23.953.376 1.57.424a1.14 1.14 0 0 1 .927 1.088c.01.552-.397.94-.88.94-.097 0-.2-.02-.303-.047-1.077-.282-2.057-.962-2.737-1.848a6.5 6.5 0 0 1-.77 1.066 6.8 6.8 0 0 1-2.035.782.95.95 0 0 1-.303.047c-.483 0-.89-.388-.88-.94a1.14 1.14 0 0 1 .928-1.088c.616-.048 1.159-.193 1.57-.424.337-.188.575-.438.702-.738-.54.006-1.866.006-2.502.006a37 37 0 0 1-2.018-.006c-.548-.02-.848-.308-.848-.854V9.431c0-.462.247-.692.684-.692s.684.23.684.692c0 .356-.006.931.006 1.18.025.52.275.836 1.018.846" />
    </svg>
  );
}

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [copiedDraft, setCopiedDraft] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setFeedbackMsg("");
    sound.playClick();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setStatus("sent");
        setFeedbackMsg(data.message || "Message delivered successfully! Kunal will get back to you shortly.");
        sound.playSuccess();
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(data.error || "Failed to deliver message via server.");
      }
    } catch (err) {
      setStatus("error");
      const errText = err instanceof Error ? err.message : "Something went wrong.";
      setFeedbackMsg(`${errText} You can also email Kunal directly at ${profile.email}.`);
    }
  }

  const copyDraftToClipboard = () => {
    const text = `Name: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\n${form.message}`;
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    sound.playSuccess();
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const contactItems = [
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
    { icon: MapPin, label: "Location", value: profile.location },
    { icon: Linkedin, label: "LinkedIn", value: "in/kunalpatell", href: profile.socials.linkedin },
    {
      icon: Github,
      label: "GitHub",
      value: isPlaceholderUrl(profile.socials.github) ? "Coming soon" : "View profile",
      href: isPlaceholderUrl(profile.socials.github) ? undefined : profile.socials.github,
    },
    {
      icon: HuggingFaceIcon,
      label: "Hugging Face",
      value: isPlaceholderUrl(profile.socials.huggingface) ? "Coming soon" : "View profile",
      href: isPlaceholderUrl(profile.socials.huggingface) ? undefined : profile.socials.huggingface,
    },
  ];

  return (
    <section id="contact" className="section bg-[#050505] border-t border-white/5">
      <div className="container-px">
        <SectionHeading
          eyebrow="Contact"
          title={<>Let&apos;s build something intelligent</>}
          description="Open to AI engineering roles, automation projects, and collaborations."
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          <div data-blur-in className="space-y-4">
            {contactItems.map((c) => {
              const inner = (
                <div className="glass-card flex items-center gap-4 p-4 hover:border-[#9ed8ff]/30 transition-all duration-300">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#9ed8ff]/10 text-[#9ed8ff] border border-[#9ed8ff]/20 shadow-[0_0_10px_rgba(158,216,255,0.15)]">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-[#9ed8ff]/70">{c.label}</p>
                    <p className="truncate font-mono text-xs text-white uppercase tracking-wider mt-0.5">{c.value}</p>
                  </div>
                </div>
              );
              return c.href ? (
                <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block">
                  {inner}
                </a>
              ) : (
                <div key={c.label}>{inner}</div>
              );
            })}
          </div>

          <div data-blur-in style={{ transitionDelay: "100ms" }}>
            <form onSubmit={onSubmit} className="glass-card space-y-5 p-6 sm:p-8 hover:border-[#9ed8ff]/20 transition-all duration-300">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name">
                  <input required value={form.name} onChange={update("name")} className="font-mono bg-[#080a0f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all placeholder:text-white/20 focus:border-[#9ed8ff]/40 focus:bg-[#0b0e14] w-full" placeholder="Your name" />
                </Field>
                <Field label="Email">
                  <input required type="email" value={form.email} onChange={update("email")} className="font-mono bg-[#080a0f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all placeholder:text-white/20 focus:border-[#9ed8ff]/40 focus:bg-[#0b0e14] w-full" placeholder="you@example.com" />
                </Field>
              </div>
              <Field label="Subject">
                <input required value={form.subject} onChange={update("subject")} className="font-mono bg-[#080a0f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all placeholder:text-white/20 focus:border-[#9ed8ff]/40 focus:bg-[#0b0e14] w-full" placeholder="What's this about?" />
              </Field>
              <Field label="Message">
                <textarea required value={form.message} onChange={update("message")} rows={5} className="font-mono bg-[#080a0f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all placeholder:text-white/20 focus:border-[#9ed8ff]/40 focus:bg-[#0b0e14] w-full resize-none" placeholder="Tell me a bit more…" />
              </Field>

              {status === "error" && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 space-y-2">
                  <p className="font-mono text-xs text-amber-300">{feedbackMsg}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={copyDraftToClipboard}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] uppercase text-amber-200 hover:bg-amber-500/20 transition-all"
                    >
                      {copiedDraft ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copiedDraft ? "Copied Message" : "Copy Message"}
                    </button>
                    <a
                      href={`mailto:${profile.email}?subject=${encodeURIComponent(form.subject || "Portfolio inquiry")}&body=${encodeURIComponent(form.message)}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase text-white/80 hover:bg-white/10 transition-all"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Open Mail Client
                    </a>
                  </div>
                </div>
              )}

              {status === "sent" && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 space-y-2">
                  <p className="flex items-center gap-2 font-mono text-xs text-emerald-300 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    {feedbackMsg}
                  </p>
                  <p className="font-mono text-[10px] text-emerald-300/70">
                    A copy has been recorded for review. You can also reach Kunal directly at {profile.email}.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full h-11 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest text-[#9ed8ff] border border-[#9ed8ff]/30 bg-[#9ed8ff]/5 rounded-xl hover:bg-[#9ed8ff]/10 hover:border-[#9ed8ff]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// Field component to structure label & field inside form
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-white/40">
        {label}
      </span>
      {children}
    </label>
  );
}

