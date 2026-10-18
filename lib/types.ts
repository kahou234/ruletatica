export type Tema = {
  id: string;
  titulo: string;
  epoca: string;
  sinopsis: string;
  preguntas: string[];
  categoria?: string;
};

export type PracticeMode = "reto" | "express";

export type AppPhase = "idle" | "spinning" | "landed" | "research" | "speak" | "done";

export const MODE_CONFIG: Record<
  PracticeMode,
  { label: string; blurb: string; researchSeconds: number; speakSeconds: number }
> = {
  reto: {
    label: "Modo Reto",
    blurb: "15 minutos para investigar. 1 minuto para exponer.",
    researchSeconds: 15 * 60,
    speakSeconds: 60,
  },
  express: {
    label: "Modo Express",
    blurb: "3 minutos para investigar. 1 minuto para exponer.",
    researchSeconds: 3 * 60,
    speakSeconds: 60,
  },
};
