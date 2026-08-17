"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Mail } from "lucide-react";
import { api } from "@/lib/api";
import { Auth } from "@/lib/auth";

type Tab = "login" | "register" | "otp";

export function AuthModal({
  initialTab = "login",
  onClose,
  onSuccess,
}: {
  initialTab?: "login" | "register";
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [city, setCity] = useState("Ahmedabad");
  const [otp, setOtp] = useState("");

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api("POST", "/api/auth/login", { email, password });
      if (!res.success) {
        setError(res.error || "Login failed");
        return;
      }
      Auth.save(res.token, {
        name: res.name,
        email: res.email,
        is_verified: res.is_verified,
        target_role: res.target_role,
        contacts_used: res.contacts_used,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function submitRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api("POST", "/api/auth/register", {
        name,
        email,
        phone,
        password,
        target_role: targetRole,
        city,
      });
      if (!res.success) {
        setError(res.error || "Registration failed");
        return;
      }
      if (res.dev_otp) setDevOtp(res.dev_otp);
      setTab("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api("POST", "/api/auth/verify-otp", { email, otp });
      if (!res.success) {
        setError(res.error || "Invalid or expired OTP");
        return;
      }
      Auth.save(res.token, {
        name: res.name || name,
        email,
        is_verified: res.is_verified ?? 0,
        target_role: res.target_role || targetRole,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="bg-[#0d0d16] border border-white/10 rounded-2xl p-7 max-w-md w-full shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-black">
            {tab === "login" && "Welcome back"}
            {tab === "register" && "Create your account"}
            {tab === "otp" && "Verify your email"}
          </h2>
          <button onClick={onClose} className="text-[#55556a] hover:text-white cursor-pointer bg-transparent border-none">
            <X className="h-5 w-5" />
          </button>
        </div>

        {tab !== "otp" && (
          <div className="flex gap-1 mb-6 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => { setTab("login"); setError(""); }}
              className={`flex-1 py-2 rounded-md text-sm font-semibold cursor-pointer border-none transition-all ${
                tab === "login" ? "bg-[#7c3aed] text-white" : "bg-transparent text-[#9090b0]"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setTab("register"); setError(""); }}
              className={`flex-1 py-2 rounded-md text-sm font-semibold cursor-pointer border-none transition-all ${
                tab === "register" ? "bg-[#7c3aed] text-white" : "bg-transparent text-[#9090b0]"
              }`}
            >
              Register
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {tab === "login" && (
            <motion.form
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={submitLogin}
              className="flex flex-col gap-3"
            >
              <Field label="Email" type="email" value={email} onChange={setEmail} required />
              <Field label="Password" type="password" value={password} onChange={setPassword} required />
              {error && <ErrorText text={error} />}
              <SubmitButton loading={loading} label="Log in" />
            </motion.form>
          )}

          {tab === "register" && (
            <motion.form
              key="register"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={submitRegister}
              className="flex flex-col gap-3"
            >
              <Field label="Full name" value={name} onChange={setName} required />
              <Field label="Email" type="email" value={email} onChange={setEmail} required />
              <Field label="Phone" type="tel" value={phone} onChange={setPhone} />
              <Field label="Password" type="password" value={password} onChange={setPassword} required />
              <Field label="Target role" value={targetRole} onChange={setTargetRole} />
              <Field label="City" value={city} onChange={setCity} />
              {error && <ErrorText text={error} />}
              <SubmitButton loading={loading} label="Create account" />
            </motion.form>
          )}

          {tab === "otp" && (
            <motion.form
              key="otp"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={submitOtp}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 text-sm text-[#9090b0] bg-white/5 rounded-lg p-3">
                <Mail className="h-4 w-4 shrink-0" />
                We sent a 6-digit code to <span className="text-white font-semibold">{email}</span>
              </div>
              {devOtp && (
                <div className="text-xs text-[#fcd34d] bg-[#f59e0b]/10 border border-[#f59e0b]/25 rounded-lg p-3">
                  Email delivery isn&apos;t configured yet — your code is <span className="font-mono font-bold">{devOtp}</span>
                </div>
              )}
              <Field label="6-digit code" value={otp} onChange={setOtp} required maxLength={6} />
              {error && <ErrorText text={error} />}
              <SubmitButton loading={loading} label="Verify & continue" />
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block mb-1 text-[10px] uppercase font-bold text-[#55556a] tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        maxLength={maxLength}
        className="w-full bg-[#12121e] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c3aed] transition-colors"
      />
    </div>
  );
}

function ErrorText({ text }: { text: string }) {
  return <p className="text-sm text-[#fca5a5] bg-[#ef4444]/10 border border-[#ef4444]/25 rounded-lg px-3 py-2">{text}</p>;
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-2 w-full py-2.5 rounded-lg text-sm font-bold text-white cursor-pointer border-none disabled:opacity-60 flex items-center justify-center gap-2"
      style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </button>
  );
}
