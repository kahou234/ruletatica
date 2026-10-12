"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ConfettiBurst from "./ConfettiBurst";
import type { Tema } from "@/lib/types";

function formatTime(total: number) {
  const s = Math.max(0, Math.ceil(total));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export default function TimerStage({
  tema,
  phase,
  remaining,
  duration,
  paused,
  onPause,
  onSkip,
  onAgain,
  notes,
  onNotes,
}: {
  tema: Tema;
  phase: "research" | "speak" | "done";
  remaining: number;
  duration: number;
  paused: boolean;
  onPause: () => void;
  onSkip: () => void;
  onAgain: () => void;
  notes: string;
  onNotes: (value: string) => void;
}) {
  const progress = duration > 0 ? 1 - remaining / duration : 1;
  const lastTen = phase === "speak" && remaining <= 10 && remaining > 0;
  const critical = phase === "speak" && remaining <= 5 && remaining > 0;
  const [notesOpen, setNotesOpen] = useState(true);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (phase === "research" && notesOpen) notesRef.current?.focus();
  }, [phase, notesOpen]);

  const ringColor = useMemo(() => {
    if (phase === "research") return "#6fc3d8";
    if (critical) return "#d45c4a";
    if (lastTen) return "#e0925c";
    return "#c47a4a";
  }, [phase, lastTen, critical]);

  const digitsClass =
    phase === "research"
      ? "text-research"
      : lastTen
        ? `text-alert ${critical ? "animate-blink" : ""}`
        : phase === "done"
          ? "text-accent-bright"
          : "text-ink";

  return (
    <div className="timer-overlay-layer animate-overlay-in fixed inset-0 z-30 grid place-items-center overflow-y-auto px-4 py-6 backdrop-blur-[10px]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 45%, rgba(196,122,74,0.16), transparent 60%), radial-gradient(90% 80% at 50% 100%, rgba(28,58,72,0.45), transparent 55%), rgba(10, 12, 14, 0.94)",
        }}
      />
      <ConfettiBurst active={phase === "done"} />
      <div className="relative z-10 flex w-full max-w-[920px] flex-col items-center gap-[clamp(0.85rem,2.5vh,1.5rem)] animate-rise">
        <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-research">
          {phase === "research"
            ? "Fase 1 · Investigación"
            : phase === "speak"
              ? "Fase 2 · Exposición"
              : "Tiempo"}
        </p>
        <p className="m-0 max-w-[28ch] text-center text-[clamp(0.85rem,2vw,1.05rem)] font-medium uppercase tracking-[0.04em] text-accent">
          {tema.titulo}
        </p>

        <div
          className={`timer-ring ${phase === "done" ? "animate-pulse-done" : ""} ${
            lastTen ? "animate-blink" : ""
          }`}
          style={{
            ["--p" as string]: String(progress),
            ["--ring" as string]: ringColor,
          }}
        >
          <p
            className={`m-0 font-display text-[clamp(3.5rem,14vw,7rem)] font-medium leading-none tracking-[-0.03em] tabular-nums ${digitsClass}`}
          >
            {phase === "done" ? "00:00" : formatTime(remaining)}
          </p>
        </div>

        <p className="m-0 text-[clamp(1rem,2.5vw,1.25rem)] text-muted">
          {phase === "research"
            ? paused
              ? "Pausado — seguí investigando cuando quieras"
              : "Anotá. Buscá. Armá el hilo."
            : phase === "speak"
              ? lastTen
                ? "Cerrá la idea. Ahora."
                : "Un minuto. Sin notas a la vista: contá la historia."
              : "Se acabó el minuto. ¿Otra ronda?"}
        </p>

        {phase === "research" && (
          <div className="w-full max-w-[36rem]">
            <button
              type="button"
              onClick={() => setNotesOpen((v) => !v)}
              className="mb-2 w-full text-center text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent"
            >
              Notas rápidas {notesOpen ? "▾" : "▸"}
            </button>
            {notesOpen && (
              <textarea
                ref={notesRef}
                value={notes}
                onChange={(e) => onNotes(e.target.value)}
                placeholder="Fechas, nombres, una frase para abrir, una duda pendiente…"
                className="min-h-[8.5rem] w-full resize-y rounded-2xl bg-[rgba(244,232,214,0.05)] p-4 font-body text-[0.95rem] leading-relaxed text-ink outline-none placeholder:text-ink/30 pill focus:shadow-[inset_0_0_0_1px_rgba(196,122,74,0.55)]"
              />
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          {phase === "research" && (
            <>
              <button type="button" className="btn-secondary" onClick={onPause}>
                {paused ? "Reanudar" : "Pausa"}
              </button>
              <button type="button" className="btn-primary" onClick={onSkip}>
                Saltar fase
              </button>
            </>
          )}
          {phase === "speak" && (
            <button type="button" className="btn-secondary" onClick={onSkip}>
              Terminar ahora
            </button>
          )}
          {phase === "done" && (
            <button type="button" className="btn-primary" onClick={onAgain}>
              Girar de nuevo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
