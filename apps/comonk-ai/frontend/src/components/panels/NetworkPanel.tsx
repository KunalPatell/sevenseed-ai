"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Contact, Plus, Trash2, Link2, Mail, Building2 } from "lucide-react";

interface ContactEntry {
  id: string;
  name: string;
  company: string;
  role: string;
  linkedin: string;
  email: string;
  notes: string;
}

const STORAGE_KEY = "comonk_contacts";
const EMPTY_FORM = { name: "", company: "", role: "", linkedin: "", email: "", notes: "" };

export function NetworkPanel() {
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setContacts(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts, loaded]);

  function addContact(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const entry: ContactEntry = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, ...form };
    setContacts((c) => [entry, ...c]);
    setForm(EMPTY_FORM);
  }

  function removeContact(id: string) {
    setContacts((c) => c.filter((x) => x.id !== id));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="tcard">
        <div className="flex items-center gap-2 mb-4">
          <Contact className="h-4 w-4 text-[#a78bfa]" />
          <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Add a Contact</p>
        </div>
        <form onSubmit={addContact} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Name *"
            required
            className="text-xs px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[#7c3aed]/50"
          />
          <input
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            placeholder="Company"
            className="text-xs px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[#7c3aed]/50"
          />
          <input
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            placeholder="Role / Title"
            className="text-xs px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[#7c3aed]/50"
          />
          <input
            value={form.linkedin}
            onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
            placeholder="LinkedIn URL"
            className="text-xs px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[#7c3aed]/50"
          />
          <input
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="Email"
            type="email"
            className="text-xs px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[#7c3aed]/50"
          />
          <input
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Notes"
            className="text-xs px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[#7c3aed]/50"
          />
          <button
            type="submit"
            className="sm:col-span-2 lg:col-span-3 flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-lg text-white cursor-pointer"
            style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
          >
            <Plus className="h-3.5 w-3.5" /> Add Contact
          </button>
        </form>
      </div>

      {contacts.length === 0 ? (
        <div className="tcard text-center py-16 text-xs text-[#55556a]">
          No contacts logged yet. Add people you meet networking, at events, or through referrals.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="tcard flex flex-col gap-2"
            >
              <div className="flex items-start gap-3">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
                >
                  {c.name[0]?.toUpperCase() || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm truncate">{c.name}</p>
                  {c.role && <p className="text-[11px] text-[#55556a] truncate">{c.role}</p>}
                </div>
                <button
                  onClick={() => removeContact(c.id)}
                  className="text-[#55556a] hover:text-[#fca5a5] cursor-pointer shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {c.company && (
                <p className="text-[11px] text-[#9090b0] flex items-center gap-1.5">
                  <Building2 className="h-3 w-3 shrink-0" /> {c.company}
                </p>
              )}
              {c.email && (
                <a href={`mailto:${c.email}`} className="text-[11px] text-[#93c5fd] flex items-center gap-1.5">
                  <Mail className="h-3 w-3 shrink-0" /> {c.email}
                </a>
              )}
              {c.linkedin && (
                <a href={c.linkedin} target="_blank" rel="noreferrer" className="text-[11px] text-[#93c5fd] flex items-center gap-1.5 truncate">
                  <Link2 className="h-3 w-3 shrink-0" /> LinkedIn
                </a>
              )}
              {c.notes && <p className="text-[11px] text-[#55556a] mt-1 leading-relaxed">{c.notes}</p>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
