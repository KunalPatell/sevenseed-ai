import { Reveal } from "../motion/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
}) {
  return (
    <Reveal className="mb-14 max-w-2xl">
      <span className="eyebrow font-mono text-[10px] tracking-widest">{eyebrow}</span>
      <h2 className="font-display heading mt-3 text-white uppercase tracking-widest leading-tight">{title}</h2>
      {description ? (
        <p className="mt-4 text-sm leading-relaxed text-muted">{description}</p>
      ) : null}
    </Reveal>
  );
}
