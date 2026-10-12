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
  return (
    <section className="flex min-h-[clamp(10rem,28vw,15rem)] w-full flex-col items-center justify-center gap-2">
      <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent">
        {eyebrow}
      </p>
      <div className="relative flex min-h-[8rem] w-full max-w-[28ch] flex-col items-center justify-center overflow-hidden py-2">
        <p
          aria-hidden
          className={`pointer-events-none m-0 max-w-[20ch] truncate text-center font-display text-[clamp(1rem,3vw,1.45rem)] font-medium leading-tight text-ink/20 ${
            spinning ? "translate-y-[-2px]" : ""
          }`}
        >
          {spinning ? neighbor : " "}
        </p>
        <p
          className={`m-0 max-w-[26ch] text-center font-display text-[clamp(1.6rem,4.5vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.025em] text-ink ${
            spinning ? "animate-tick-flash opacity-90" : landed ? "animate-topic-in" : ""
          }`}
        >
          {display?.titulo ?? "¿Listo?"}
        </p>
      </div>
    </section>
  );
}
