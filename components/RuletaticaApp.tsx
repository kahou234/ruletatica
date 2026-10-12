"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import temasData from "@/data/temas.json";
import { playAlarm, playBell, playLand, playTick, unlockAudio } from "@/lib/audio";
import { pickOther, runSpin } from "@/lib/spin";
import { MODE_CONFIG, type AppPhase, type PracticeMode, type Tema } from "@/lib/types";
import Atmosphere from "./Atmosphere";
import ModeSwitch from "./ModeSwitch";
import ThemeDetails from "./ThemeDetails";
import TimerStage from "./TimerStage";
import TopicReel from "./TopicReel";

const temas = temasData as Tema[];
const NOTES_KEY = "ruletatica-notes";

export default function RuletaticaApp() {
  const [mode, setMode] = useState<PracticeMode>("reto");
  const [phase, setPhase] = useState<AppPhase>("idle");
  const [tema, setTema] = useState<Tema | null>(null);
  const [preview, setPreview] = useState<Tema | null>(null);
  const [neighbor, setNeighbor] = useState("");
  const [remaining, setRemaining] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(false);
  const [notes, setNotes] = useState("");
  const cancelSpin = useRef<(() => void) | null>(null);
  const timerRef = useRef<number | null>(null);
  const endAt = useRef<number>(0);
  const leftWhenPaused = useRef(0);
  const phaseRef = useRef<AppPhase>("idle");
  const beginPhaseRef = useRef<(next: "research" | "speak", seconds: number) => void>(
    () => undefined
  );

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(NOTES_KEY);
      if (saved) setNotes(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const persistNotes = (value: string) => {
    setNotes(value);
    try {
      localStorage.setItem(NOTES_KEY, value);
    } catch {
      /* ignore */
    }
  };

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const beginPhase = useCallback((next: "research" | "speak", seconds: number) => {
    clearTimer();
    setPaused(false);
    setPhase(next);
    setDuration(seconds);
    setRemaining(seconds);
    endAt.current = Date.now() + seconds * 1000;
    timerRef.current = window.setInterval(() => {
      const left = Math.max(0, (endAt.current - Date.now()) / 1000);
      setRemaining(left);
      if (left <= 0) {
        clearTimer();
        if (phaseRef.current === "research") {
          playBell();
          beginPhaseRef.current("speak", 60);
        } else if (phaseRef.current === "speak") {
          playAlarm();
          setPhase("done");
        }
      }
    }, 100);
  }, []);

  beginPhaseRef.current = beginPhase;

  useEffect(() => () => {
    clearTimer();
    cancelSpin.current?.();
  }, []);

  const spin = useCallback(() => {
    if (phaseRef.current === "spinning") return;
    if (phaseRef.current === "research" || phaseRef.current === "speak") return;
    unlockAudio();
    cancelSpin.current?.();
    setPhase("spinning");
    setPreview(tema ?? pickOther(temas, null));
    cancelSpin.current = runSpin(temas, tema?.id, {
      onTick: (next, speed) => {
        setPreview(next);
        setNeighbor(pickOther(temas, next.id).titulo);
        playTick(speed);
      },
      onDone: (finalTema) => {
        setTema(finalTema);
        setPreview(finalTema);
        setPhase("landed");
        playLand();
      },
    });
  }, [tema]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return;
      e.preventDefault();
      if (phaseRef.current === "idle" || phaseRef.current === "landed" || phaseRef.current === "done") {
        if (phaseRef.current === "done") {
          clearTimer();
          setPhase("idle");
        }
        spin();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [spin]);

  const startResearch = () => {
    if (!tema) return;
    unlockAudio();
    beginPhase("research", MODE_CONFIG[mode].researchSeconds);
  };

  const togglePause = () => {
    if (paused) {
      endAt.current = Date.now() + leftWhenPaused.current * 1000;
      setPaused(false);
      timerRef.current = window.setInterval(() => {
        const left = Math.max(0, (endAt.current - Date.now()) / 1000);
        setRemaining(left);
        if (left <= 0) {
          clearTimer();
          if (phaseRef.current === "research") {
            playBell();
            beginPhase("speak", 60);
          } else if (phaseRef.current === "speak") {
            playAlarm();
            setPhase("done");
          }
        }
      }, 100);
    } else {
      leftWhenPaused.current = remaining;
      clearTimer();
      setPaused(true);
    }
  };

  const skipPhase = () => {
    clearTimer();
    if (phase === "research") {
      playBell();
      beginPhase("speak", 60);
    } else if (phase === "speak") {
      playAlarm();
      setPhase("done");
    }
  };

  const again = () => {
    clearTimer();
    setPhase("idle");
    spin();
  };

  const busy = phase === "spinning";
  const inTimer = phase === "research" || phase === "speak" || phase === "done";
  const shown = preview ?? tema;
  const eyebrow =
    phase === "spinning" ? "Girando" : phase === "landed" || tema ? "Tema" : "Listo";

  return (
    <div className="relative flex min-h-svh flex-col items-center overflow-x-hidden px-4 pb-10 pt-[max(1rem,env(safe-area-inset-top))]">
      <Atmosphere />
      <header className="relative z-10 mb-[clamp(2.5rem,8vh,5rem)] animate-rise text-center">
        <p className="m-0 font-display text-[clamp(1.65rem,4.5vw,2.15rem)] font-medium leading-none tracking-[-0.03em] text-ink">
          RuletaTica
        </p>
        <h1 className="mt-1.5 text-[clamp(0.82rem,1.6vw,0.95rem)] font-normal tracking-[0.01em] text-muted">
          Historia de Costa Rica
          <span className="ml-1.5 inline-flex items-center rounded-full bg-[rgba(244,232,214,0.06)] px-3 py-1 text-[0.8rem] font-medium text-ink pill">
            para grabar en vertical
          </span>
        </h1>
      </header>

      <main className="relative z-10 flex w-full max-w-[720px] flex-1 animate-rise-delay flex-col items-center gap-[clamp(1.5rem,4vw,2.25rem)] text-center">
        <ModeSwitch mode={mode} onChange={setMode} disabled={busy || inTimer} />

        <TopicReel
          display={shown}
          neighbor={neighbor}
          spinning={busy}
          landed={phase === "landed"}
          eyebrow={eyebrow}
        />

        {phase === "landed" && tema && <ThemeDetails tema={tema} />}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button type="button" className="btn-primary" onClick={spin} disabled={busy || inTimer}>
            Girar tema
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={startResearch}
            disabled={!tema || busy || inTimer}
          >
            {mode === "reto" ? "Iniciar 15 min" : "Iniciar 3 min"}
          </button>
        </div>
        <p className="m-0 text-[0.78rem] text-muted">
          Barra espaciadora para girar · {temas.length} temas en el mazo
        </p>
      </main>

      {inTimer && tema && (
        <TimerStage
          tema={tema}
          phase={phase === "done" ? "done" : phase === "speak" ? "speak" : "research"}
          remaining={remaining}
          duration={duration}
          paused={paused}
          onPause={togglePause}
          onSkip={skipPhase}
          onAgain={again}
          notes={notes}
          onNotes={persistNotes}
        />
      )}
    </div>
  );
}
