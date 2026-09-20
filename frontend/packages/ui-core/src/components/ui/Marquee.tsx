"use client";

const items = [
  "Python",
  "Machine Learning",
  "Deep Learning",
  "LLM Applications",
  "NLP",
  "FastAPI",
  "LangChain",
  "Computer Vision",
  "n8n",
  "Prompt Engineering",
  "Hugging Face",
  "REST APIs",
  "Streamlit",
  "SQL",
];

/** Infinite horizontal scrolling tech strip. */
export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative flex overflow-hidden border-y border-white/5 bg-[#080a0f]/60 py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#050505] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#050505] to-transparent" />
      <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-widest text-white/40 transition-colors hover:text-[#9ed8ff]"
          >
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-[#9ed8ff]/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
