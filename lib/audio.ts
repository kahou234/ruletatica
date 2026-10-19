let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (muted) return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setMuted(value: boolean) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function envelope(
  ctxRef: AudioContext,
  gain: GainNode,
  peak: number,
  attack: number,
  release: number
) {
  const now = ctxRef.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + release);
}

/** Tick/clic idéntico al original en timbre y textura, pero con el volumen maximizado. */
export function playTick(speed: number) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  const filter = c.createBiquadFilter();

  filter.type = "highpass";
  filter.frequency.value = 2200;

  osc.type = "triangle";
  osc.frequency.value = 950;

  envelope(c, gain, 0.90, 0.002, 0.045);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);

  osc.start();
  osc.stop(c.currentTime + 0.08);
}

/** Acorde de llegada firme y brillante ("correcto") al detenerse en el tema. */
export function playLand() {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;

  // Acorde Do Mayor brillante: G4 (392Hz), C5 (523.25Hz), E5 (659.25Hz)
  const freqs = [392, 523.25, 659.25];

  freqs.forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.015, now + 0.35);

    // Volumen escalonado fuerte (0.55 el fundamental, 0.45 y 0.38 los armónicos)
    const peak = 0.55 - i * 0.08;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

    osc.connect(gain);
    gain.connect(c.destination);

    osc.start(now);
    osc.stop(now + 0.7);
  });
}

/** Campana sutil al pasar a exposición. */
export function playBell() {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const freqs = [523.25, 659.25, 783.99];
  freqs.forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const peak = 0.05 - i * 0.01;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 1.45);
  });
}

/** Alarma final al llegar a 00:00. */
export function playAlarm() {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  for (let i = 0; i < 3; i += 1) {
    const start = now + i * 0.22;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(880, start);
    osc.frequency.setValueAtTime(660, start + 0.1);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.07, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(start);
    osc.stop(start + 0.2);
  }
}

export function unlockAudio() {
  getCtx();
}
