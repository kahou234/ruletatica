import type { Tema } from "./types";

export function pickOther(temas: Tema[], currentId?: string | null) {
  const pool = temas.filter((t) => t.id !== currentId);
  const source = pool.length ? pool : temas;
  return source[Math.floor(Math.random() * source.length)];
}

type SpinHandlers = {
  onTick: (tema: Tema, speed: number) => void;
  onDone: (tema: Tema) => void;
};

/**
 * Ruleta con ráfaga sostenida y frenado seco:
 * - 0% a 80%: Ráfaga ultra rápida sostenida (~2.4s).
 * - 80% a 100%: Freno seco y enérgico (~0.6s) sin quedarse pegada.
 */
export function runSpin(
  temas: Tema[],
  currentId: string | null | undefined,
  handlers: SpinHandlers
): () => void {
  const duration = 3000; // 3.0s total: ráfaga tensa y remate al instante
  const final = pickOther(temas, currentId);
  const start = performance.now();
  let lastTick = 0;
  let lastId = currentId ?? "";
  let raf = 0;
  let cancelled = false;

  const tick = (now: number) => {
    if (cancelled) return;
    const progress = Math.min(1, (now - start) / duration);

    let interval: number;
    if (progress < 0.80) {
      interval = 26; // Ráfaga ametralladora
    } else {
      // Solo el último 20% frena con un tope máximo de 95ms (firme y seco)
      const brakeProgress = (progress - 0.80) / 0.20;
      interval = 26 + brakeProgress * 69; // Llega máximo a 95ms
    }

    if (now - lastTick >= interval) {
      lastTick = now;
      const speed = 1 - progress;
      const next = progress >= 0.97 ? final : pickOther(temas, lastId);
      lastId = next.id;
      handlers.onTick(next, speed);
    }

    if (progress < 1) {
      raf = requestAnimationFrame(tick);
    } else {
      handlers.onDone(final);
    }
  };

  raf = requestAnimationFrame(tick);
  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
  };
}
