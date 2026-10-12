import type { Tema } from "@/lib/types";

export default function ThemeDetails({ tema }: { tema: Tema }) {
  const query = `"${tema.titulo}" Costa Rica`;
  const href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  return (
    <div className="mx-auto w-full max-w-[36rem] animate-rise space-y-4 text-left">
      <p className="text-center text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent">
        {tema.epoca}
      </p>
      <p className="text-center text-[0.95rem] leading-relaxed text-muted">{tema.sinopsis}</p>
      <ol className="space-y-2 rounded-2xl bg-[rgba(244,232,214,0.04)] p-4 pill">
        {tema.preguntas.map((pregunta, i) => (
          <li key={pregunta} className="flex gap-3 text-[0.9rem] leading-snug text-ink/90">
            <span className="font-display text-accent">{i + 1}.</span>
            <span>{pregunta}</span>
          </li>
        ))}
      </ol>
      <div className="flex justify-center pt-1">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-transparent px-5 py-2.5 text-[0.92rem] font-semibold text-ink transition hover:-translate-y-px hover:bg-[rgba(244,232,214,0.06)]"
          style={{ boxShadow: "inset 0 0 0 1.5px rgba(244,232,214,0.28)" }}
        >
          Buscar en Google
          <span aria-hidden className="text-accent">
            ↗
          </span>
        </a>
      </div>
    </div>
  );
}
