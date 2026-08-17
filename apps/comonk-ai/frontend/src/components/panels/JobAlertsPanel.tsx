"use client";

import React, { useEffect, useState } from "react";
import {
  BellRing,
  Send,
  Phone,
  Mail,
  MessageCircle,
  QrCode,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Info,
  ExternalLink,
  KeyRound,
} from "lucide-react";
import { authApi } from "@/lib/api";
import type { PanelId } from "@/lib/panels";

function CardShell({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="tcard flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#a78bfa]" />
        <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">{title}</p>
      </div>
      {children}
    </div>
  );
}

function SetupNote({ setup_url, setup_steps, note }: { setup_url?: string; setup_steps?: string[]; note?: string }) {
  return (
    <div className="text-[11px] text-[#fcd34d] bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-lg p-3 flex flex-col gap-1.5">
      <p className="font-bold flex items-center gap-1.5">
        <Info className="h-3 w-3" /> Not configured on the server yet
      </p>
      {note && <p className="text-[#9090b0]">{note}</p>}
      {setup_steps?.map((s) => (
        <p key={s} className="text-[#9090b0]">
          {s}
        </p>
      ))}
      {setup_url && (
        <a href={setup_url} target="_blank" rel="noreferrer" className="text-[#93c5fd] flex items-center gap-1">
          Setup guide <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}

function inputCls() {
  return "text-xs px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[#7c3aed]/50 w-full";
}
function btnCls() {
  return "flex items-center justify-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-lg text-white cursor-pointer disabled:opacity-60";
}
function btnStyle() {
  return { background: "linear-gradient(115deg, var(--primary), var(--secondary))" };
}

// ── Telegram ──────────────────────────────────────────────────────
function TelegramCard() {
  const [status, setStatus] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    authApi("GET", "/api/telegram-status").then(setStatus).catch(() => {});
  }, []);

  async function send() {
    if (!message.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await authApi("POST", "/api/telegram-alert", { message });
      setResult(res);
    } catch (e) {
      setResult({ sent: false, error: e instanceof Error ? e.message : "Failed to send." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardShell icon={Send} title="Telegram Alerts">
      {status && (
        <p className={`text-[11px] font-bold ${status.configured ? "text-[#6ee7b7]" : "text-[#fcd34d]"}`}>
          {status.configured ? "Configured" : "Not configured"}
        </p>
      )}
      <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Test message" className={inputCls()} />
      <button onClick={send} disabled={loading} className={btnCls()} style={btnStyle()}>
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />} Send Test Alert
      </button>
      {result && (result.sent ? (
        <p className="text-[11px] text-[#6ee7b7] flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" /> Sent successfully.</p>
      ) : result.missing ? (
        <SetupNote setup_url={result.setup_url} setup_steps={result.setup_steps} />
      ) : (
        <p className="text-[11px] text-[#fca5a5] flex items-center gap-1.5"><XCircle className="h-3 w-3" /> {result.error || "Failed to send."}</p>
      ))}
    </CardShell>
  );
}

// ── SMS / WhatsApp ────────────────────────────────────────────────
function SmsCard() {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState("sms");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!to.trim() || !message.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await authApi("POST", "/api/sms-alert", { to, message, channel });
      setResult(res);
    } catch (e) {
      setResult({ success: false, error: e instanceof Error ? e.message : "Failed to send." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardShell icon={Phone} title="SMS / WhatsApp Alerts">
      <div className="flex gap-2">
        <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="+91XXXXXXXXXX" className={inputCls()} />
        <select value={channel} onChange={(e) => setChannel(e.target.value)} className={`${inputCls()} w-28 cursor-pointer`}>
          <option value="sms">SMS</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Test message" className={inputCls()} />
      <button onClick={send} disabled={loading} className={btnCls()} style={btnStyle()}>
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Phone className="h-3.5 w-3.5" />} Send Test Alert
      </button>
      {result && (result.success ? (
        <p className="text-[11px] text-[#6ee7b7] flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" /> Sent successfully.</p>
      ) : result.configured === false ? (
        <SetupNote note={result.error} setup_url={result.help} />
      ) : (
        <p className="text-[11px] text-[#fca5a5] flex items-center gap-1.5"><XCircle className="h-3 w-3" /> {result.error || "Failed to send."}</p>
      ))}
    </CardShell>
  );
}

// ── Email (Brevo digest + Resend) ────────────────────────────────
function EmailCard() {
  const [provider, setProvider] = useState<"brevo" | "resend">("brevo");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("Comonk AI — Test Email");
  const [body, setBody] = useState("This is a test email from Comonk AI.");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!to.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res =
        provider === "brevo"
          ? await authApi("POST", "/api/send-email", { to_email: to, to_name: to, subject, text_content: body })
          : await authApi("POST", "/api/resend-email", { to, subject, body });
      setResult(res);
    } catch (e) {
      setResult({ sent: false, error: e instanceof Error ? e.message : "Failed to send." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardShell icon={Mail} title="Email Alerts">
      <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/5 rounded-lg p-1 w-fit">
        {(["brevo", "resend"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setProvider(p)}
            className={`text-[11px] font-bold px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
              provider === p ? "bg-[#7c3aed]/20 text-white" : "text-[#9090b0] hover:text-white"
            }`}
          >
            {p === "brevo" ? "Brevo Digest" : "Resend"}
          </button>
        ))}
      </div>
      <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Recipient email" type="email" className={inputCls()} />
      <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className={inputCls()} />
      <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" className={inputCls()} />
      <button onClick={send} disabled={loading} className={btnCls()} style={btnStyle()}>
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />} Send Test Email
      </button>
      {result && (result.sent ? (
        <p className="text-[11px] text-[#6ee7b7] flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" /> Sent successfully.</p>
      ) : result.missing ? (
        <SetupNote setup_url={result.setup_url} setup_steps={result.setup_steps} note={typeof result.message === "string" ? result.message : undefined} />
      ) : (
        <p className="text-[11px] text-[#fca5a5] flex items-center gap-1.5"><XCircle className="h-3 w-3" /> {result.error || "Failed to send."}</p>
      ))}
    </CardShell>
  );
}

// ── Discord ───────────────────────────────────────────────────────
function DiscordCard() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!message.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await authApi("POST", "/api/discord-alert", { message });
      setResult(res);
    } catch (e) {
      setResult({ sent: false, error: e instanceof Error ? e.message : "Failed to send." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardShell icon={MessageCircle} title="Discord Alerts">
      <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Test message" className={inputCls()} />
      <button onClick={send} disabled={loading} className={btnCls()} style={btnStyle()}>
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MessageCircle className="h-3.5 w-3.5" />} Send Test Alert
      </button>
      {result && (result.sent ? (
        <p className="text-[11px] text-[#6ee7b7] flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" /> Sent successfully.</p>
      ) : result.missing ? (
        <SetupNote setup_url={result.setup_url} setup_steps={result.setup_steps} />
      ) : (
        <p className="text-[11px] text-[#fca5a5] flex items-center gap-1.5"><XCircle className="h-3 w-3" /> {result.error || "Failed to send."}</p>
      ))}
    </CardShell>
  );
}

// ── Email Validator ───────────────────────────────────────────────
function ValidateEmailCard() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function check() {
    if (!email.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await authApi("GET", `/api/validate-email?email=${encodeURIComponent(email)}`);
      setResult(res);
    } catch (e) {
      setResult({ valid: null, error: e instanceof Error ? e.message : "Check failed." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardShell icon={CheckCircle2} title="Email Validator">
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="someone@example.com" type="email" className={inputCls()} />
      <button onClick={check} disabled={loading} className={btnCls()} style={btnStyle()}>
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />} Validate
      </button>
      {result && (result.missing ? (
        <SetupNote setup_url={result.setup_url} note={result.note} />
      ) : result.valid === true ? (
        <p className="text-[11px] text-[#6ee7b7] flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" /> Valid — deliverable ({result.deliverability}).</p>
      ) : result.valid === false ? (
        <p className="text-[11px] text-[#fca5a5] flex items-center gap-1.5"><XCircle className="h-3 w-3" /> Invalid — {result.deliverability || "undeliverable"}.</p>
      ) : (
        <p className="text-[11px] text-[#fca5a5] flex items-center gap-1.5"><AlertTriangle className="h-3 w-3" /> {result.error || "Could not validate."}</p>
      ))}
    </CardShell>
  );
}

// ── QR Code ───────────────────────────────────────────────────────
function QrCodeCard() {
  const [data, setData] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!data.trim()) return;
    setLoading(true);
    setError("");
    setQrUrl("");
    try {
      const res = await authApi("GET", `/api/qrcode?data=${encodeURIComponent(data)}&size=180`);
      setQrUrl(res.qr_url || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate QR code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardShell icon={QrCode} title="QR Code Generator">
      <input value={data} onChange={(e) => setData(e.target.value)} placeholder="Link or text to encode" className={inputCls()} />
      <button onClick={generate} disabled={loading} className={btnCls()} style={btnStyle()}>
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <QrCode className="h-3.5 w-3.5" />} Generate
      </button>
      {error && <p className="text-[11px] text-[#fca5a5] flex items-center gap-1.5"><XCircle className="h-3 w-3" /> {error}</p>}
      {qrUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qrUrl} alt="QR code" className="rounded-lg border border-white/10 w-fit mx-auto" />
      )}
    </CardShell>
  );
}

// ── Calendar Link ─────────────────────────────────────────────────
function CalendarLinkCard() {
  const [title, setTitle] = useState("Interview");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState(60);
  const [calUrl, setCalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    setCalUrl("");
    try {
      const timeStart = time.replace(":", "");
      const params = new URLSearchParams({
        title,
        date: date || "",
        time_start: timeStart,
        duration_mins: String(duration),
      });
      const res = await authApi("GET", `/api/calendar-link?${params.toString()}`);
      setCalUrl(res.calendar_url || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to build calendar link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardShell icon={Calendar} title="Calendar Link">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" className={inputCls()} />
      <div className="flex gap-2">
        <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className={inputCls()} />
        <input value={time} onChange={(e) => setTime(e.target.value)} type="time" className={inputCls()} />
      </div>
      <input
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value) || 60)}
        type="number"
        min={15}
        step={15}
        placeholder="Duration (mins)"
        className={inputCls()}
      />
      <button onClick={generate} disabled={loading} className={btnCls()} style={btnStyle()}>
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Calendar className="h-3.5 w-3.5" />} Generate Link
      </button>
      {error && <p className="text-[11px] text-[#fca5a5] flex items-center gap-1.5"><XCircle className="h-3 w-3" /> {error}</p>}
      {calUrl && (
        <a href={calUrl} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-[#93c5fd] flex items-center gap-1.5">
          Open in Google Calendar <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </CardShell>
  );
}

// ── Info-only integrations ──────────────────────────────────────
function InfoCard({
  icon,
  title,
  note,
  onOpenKeys,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  note: string;
  onOpenKeys?: () => void;
}) {
  return (
    <CardShell icon={icon} title={title}>
      <p className="text-[11px] text-[#9090b0] leading-relaxed">{note}</p>
      {onOpenKeys ? (
        <button onClick={onOpenKeys} className="text-[11px] font-bold text-[#93c5fd] flex items-center gap-1.5 cursor-pointer w-fit">
          <KeyRound className="h-3 w-3" /> Configure in My API Keys
        </button>
      ) : (
        <p className="text-[11px] font-bold text-[#93c5fd] flex items-center gap-1.5 w-fit">
          <KeyRound className="h-3 w-3" /> Configure in the &quot;My API Keys&quot; panel
        </p>
      )}
    </CardShell>
  );
}

export function JobAlertsPanel({ onNavigate }: { onNavigate?: (id: PanelId) => void } = {}) {
  const openKeys = onNavigate ? () => onNavigate("apikeys") : undefined;

  return (
    <div className="flex flex-col gap-5">
      <div className="tcard flex items-center gap-3">
        <div className="h-9 w-9 rounded-full flex items-center justify-center bg-[#7c3aed]/15 border border-[#7c3aed]/40 shrink-0">
          <BellRing className="h-4.5 w-4.5 text-[#a78bfa]" />
        </div>
        <div>
          <p className="font-bold text-sm">Job Alerts &amp; Integrations Setup</p>
          <p className="text-xs text-[#55556a] mt-0.5">Test each channel below to confirm it&apos;s wired up correctly.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TelegramCard />
        <SmsCard />
        <EmailCard />
        <DiscordCard />
        <ValidateEmailCard />
        <QrCodeCard />
        <CalendarLinkCard />
        <InfoCard
          icon={Send}
          title="OpenRouter"
          note="Free-tier access to Llama, Gemma, and Mistral models for AI features across the app."
          onOpenKeys={openKeys}
        />
        <InfoCard
          icon={MessageCircle}
          title="Cohere"
          note="Alternate LLM provider used as a fallback for chat and generation features."
          onOpenKeys={openKeys}
        />
        <InfoCard
          icon={Info}
          title="HuggingFace"
          note="Runs open-source inference models for select AI features when configured."
          onOpenKeys={openKeys}
        />
        <InfoCard
          icon={ExternalLink}
          title="Notion"
          note="Export your learning plan, tracker, or roadmap straight to a Notion page."
          onOpenKeys={openKeys}
        />
      </div>
    </div>
  );
}
