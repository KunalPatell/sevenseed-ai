"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, X, Trash2 } from "lucide-react";

type EventType = "interview" | "deadline" | "follow-up" | "test" | "other";

interface CalEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: EventType;
  notes: string;
}

const STORAGE_KEY = "comonk_calendar_events";

const TYPE_META: Record<EventType, { label: string; color: string }> = {
  interview: { label: "Interview", color: "var(--secondary)" },
  deadline: { label: "Deadline", color: "var(--red)" },
  "follow-up": { label: "Follow-up", color: "var(--gold)" },
  test: { label: "Test", color: "var(--primary)" },
  other: { label: "Other", color: "var(--green)" },
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function toKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function todayKey() {
  return toKey(new Date());
}
function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function buildMonthGrid(year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  while (cells.length < 42) {
    const last = cells[cells.length - 1].date;
    cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false });
  }
  return cells;
}

export function CalendarPanel() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() };
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CalEvent | null>(null);
  const [formDate, setFormDate] = useState(todayKey());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEvents(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {
      // ignore
    }
  }, [events, loaded]);

  const grid = useMemo(() => buildMonthGrid(cursor.year, cursor.month), [cursor]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalEvent[]> = {};
    for (const e of events) {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    }
    return map;
  }, [events]);

  const upcoming = useMemo(() => {
    const t = todayKey();
    return [...events]
      .filter((e) => e.date >= t)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [events]);

  function openAdd(date?: string) {
    setEditing(null);
    setFormDate(date || todayKey());
    setModalOpen(true);
  }
  function openEdit(ev: CalEvent) {
    setEditing(ev);
    setFormDate(ev.date);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  function saveEvent(data: { title: string; date: string; type: EventType; notes: string }) {
    if (editing) {
      setEvents((prev) => prev.map((e) => (e.id === editing.id ? { ...editing, ...data } : e)));
    } else {
      setEvents((prev) => [...prev, { id: uid(), ...data }]);
    }
    closeModal();
  }
  function deleteEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    closeModal();
  }

  function prevMonth() {
    setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }));
  }
  function nextMonth() {
    setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }));
  }

  const t = todayKey();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="font-bold text-lg w-40 text-center">
            {MONTH_NAMES[cursor.month]} {cursor.year}
          </p>
          <button
            onClick={nextMonth}
            className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={() => openAdd()}
          className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-lg text-white cursor-pointer"
          style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
        >
          <Plus className="h-3.5 w-3.5" /> Add Event
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="tcard lg:col-span-2">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((w) => (
              <div key={w} className="text-center text-[10px] font-bold uppercase text-[#55556a] py-1">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {grid.map(({ date, inMonth }, i) => {
              const key = toKey(date);
              const dayEvents = eventsByDate[key] || [];
              const isToday = key === t;
              return (
                <button
                  key={i}
                  onClick={() => openAdd(key)}
                  className={`min-h-[76px] rounded-lg p-1.5 text-left flex flex-col gap-1 border cursor-pointer transition-colors ${
                    inMonth ? "bg-white/[0.02] border-white/5 hover:border-white/15" : "bg-transparent border-transparent opacity-40"
                  }`}
                >
                  <span
                    className={`text-[11px] font-semibold h-5 w-5 flex items-center justify-center rounded-full ${
                      isToday ? "text-white" : "text-[#9090b0]"
                    }`}
                    style={isToday ? { background: "linear-gradient(135deg, var(--primary), var(--secondary))" } : undefined}
                  >
                    {date.getDate()}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <span
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(ev);
                        }}
                        className="text-[9px] font-semibold truncate px-1 py-0.5 rounded flex items-center gap-1 bg-white/5 hover:bg-white/10"
                        title={ev.title}
                      >
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: TYPE_META[ev.type].color }} />
                        <span className="truncate text-[#eeeef8]">{ev.title}</span>
                      </span>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-[#55556a] px-1">+{dayEvents.length - 2} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="tcard flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Upcoming</p>
          {upcoming.length === 0 ? (
            <p className="text-xs text-[#55556a] py-6 text-center">No upcoming events. Add one to get started.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {upcoming.map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => openEdit(ev)}
                  className="text-left p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: TYPE_META[ev.type].color }} />
                    <span className="text-xs font-bold truncate">{ev.title}</span>
                  </div>
                  <p className="text-[10px] text-[#55556a] mt-1 ml-4">
                    {new Date(ev.date + "T00:00:00").toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                    {" · "}
                    {TYPE_META[ev.type].label}
                  </p>
                </button>
              ))}
            </div>
          )}

          <div className="pt-2 mt-1 border-t border-white/5 flex flex-wrap gap-2">
            {(Object.keys(TYPE_META) as EventType[]).map((tp) => (
              <span key={tp} className="flex items-center gap-1 text-[9px] text-[#55556a]">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: TYPE_META[tp].color }} />
                {TYPE_META[tp].label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <EventModal
            initialDate={formDate}
            editing={editing}
            onClose={closeModal}
            onSave={saveEvent}
            onDelete={editing ? () => deleteEvent(editing.id) : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EventModal({
  initialDate,
  editing,
  onClose,
  onSave,
  onDelete,
}: {
  initialDate: string;
  editing: CalEvent | null;
  onClose: () => void;
  onSave: (data: { title: string; date: string; type: EventType; notes: string }) => void;
  onDelete?: () => void;
}) {
  const [title, setTitle] = useState(editing?.title || "");
  const [date, setDate] = useState(editing?.date || initialDate);
  const [type, setType] = useState<EventType>(editing?.type || "interview");
  const [notes, setNotes] = useState(editing?.notes || "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;
    onSave({ title: title.trim(), date, type, notes: notes.trim() });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.form
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="tcard w-full max-w-md flex flex-col gap-3"
      >
        <div className="flex items-center justify-between">
          <p className="font-bold">{editing ? "Edit Event" : "Add Event"}</p>
          <button type="button" onClick={onClose} className="text-[#55556a] hover:text-white cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase text-[#55556a]">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            required
            placeholder="e.g. Interview with Acme Corp"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7c3aed]/60"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase text-[#55556a]">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7c3aed]/60 [color-scheme:dark]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase text-[#55556a]">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as EventType)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7c3aed]/60"
            >
              {(Object.keys(TYPE_META) as EventType[]).map((tp) => (
                <option key={tp} value={tp} className="bg-[#12121e]">
                  {TYPE_META[tp].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase text-[#55556a]">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Optional details..."
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7c3aed]/60 resize-none"
          />
        </div>

        <div className="flex items-center gap-2 mt-1">
          <button
            type="submit"
            className="flex-1 text-xs font-bold px-3.5 py-2.5 rounded-lg text-white cursor-pointer"
            style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
          >
            {editing ? "Save Changes" : "Add Event"}
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="h-[38px] w-[38px] flex items-center justify-center rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#fca5a5] hover:bg-[#ef4444]/20 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.form>
    </motion.div>
  );
}
