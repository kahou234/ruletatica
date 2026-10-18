import type { Tema } from "@/lib/types";

export default function TopicReel({
  display,
  neighbor,
  spinning,
  landed,
  eyebrow,
}: {
  display: Tema | null;
  neighbor: string;
  spinning: boolean;
  landed: boolean;
  eyebrow: string;
}) {
  const titulo = display?.titulo ?? "¿Listo?";
  const esLargo = titulo.length > 30;

  return (
    <section className="flex min-h-[clamp(10rem,28vw,15rem)] w-full flex-col items-center justify-center gap-2 px-2">
      <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent">
        {eyebrow}
      </p>
      <div className="relative flex min-h-[8rem] w-full max-w-[38ch] flex-col items-center justify-center py-2">
        <p
          aria-hidden
          className={`pointer-events-none m-0 max-w-[32ch] truncate text-center font-display text-[clamp(1rem,2.5vw,1.35rem)] font-medium leading-tight text-ink/20 ${
            spinning ? "translate-y-[-2px]" : ""
          }`}
        >
          {spinning ? neighbor : " "}
        </p>
        <p
          className={`m-0 w-full text-center font-display font-medium leading-[1.18] tracking-[-0.02em] text-ink break-words [overflow-wrap:anywhere] hyphens-auto ${
            esLargo
              ? "text-[clamp(1.4rem,3.8vw,2.2rem)]"
              : "text-[clamp(1.6rem,4.5vw,2.75rem)]"
          } ${
            spinning ? "animate-tick-flash opacity-90" : landed ? "animate-topic-in" : ""
          }`}
        >
          {titulo}
        </p>
      </div>
    </section>
  );
}
