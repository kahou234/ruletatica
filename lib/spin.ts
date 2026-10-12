import type { Tema } from "./types";

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

export function pickOther(temas: Tema[], currentId?: string | null) {
  const pool = temas.filter((t) => t.id !== currentId);
  const source = pool.length ? pool : temas;
  return source[Math.floor(Math.random() * source.length)];
}

type SpinHandlers = {
  onTick: (tema: Tema, speed: number) => void;
  onDone: (tema: Tema) => void;
};

/** Gira títulos ~2.5s con desaceleración ease-out y entrega un tema final distinto. */
export function runSpin(
  temas: Tema[],
  currentId: string | null | undefined,
  handlers: SpinHandlers
): () => void {
  const duration = 5500;
  const final = pickOther(temas, currentId);
  const start = performance.now();
  let lastTick = 0;
  let lastId = currentId ?? "";
  let raf = 0;
  let cancelled = false;

  const tick = (now: number) => {
    if (cancelled) return;
    const t = Math.min(1, (now - start) / duration);
    const eased = easeOutCubic(t);
    const interval = 22 + Math.pow(eased, 2.2) * 260;
    if (now - lastTick >= interval) {
      lastTick = now;
      const speed = 1 - eased;
      const next =
      t > 0.94
          ? final
          : pickOther(
              temas,
              lastId
            );
      lastId = next.id;
      handlers.onTick(next, speed);
    }
    if (t < 1) {
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
