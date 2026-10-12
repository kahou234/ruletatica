import { MODE_CONFIG, type PracticeMode } from "@/lib/types";

export default function ModeSwitch({
  mode,
  onChange,
  disabled,
}: {
  mode: PracticeMode;
  onChange: (mode: PracticeMode) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-2.5">
      <div
        role="radiogroup"
        aria-label="Modo de práctica"
        className={`relative flex rounded-full bg-[rgba(244,232,214,0.05)] p-1 pill ${
          disabled ? "pointer-events-none opacity-45" : ""
        }`}
      >
        <span
          aria-hidden
          className="absolute bottom-1 top-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-[#c47a4ae6] shadow-[0_6px_18px_#c47a4a40] transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(${mode === "express" ? "100%" : "0"})` }}
        />
        {(["reto", "express"] as PracticeMode[]).map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={mode === value}
            disabled={disabled}
            onClick={() => onChange(value)}
            className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5 text-[0.92rem] font-semibold tracking-[0.01em] transition-colors ${
              mode === value ? "text-[#1a1612]" : "text-muted"
            }`}
          >
            <span aria-hidden>{value === "reto" ? "📜" : "⚡"}</span>
            {MODE_CONFIG[value].label}
          </button>
        ))}
      </div>
      <p className="m-0 max-w-[42ch] text-[0.85rem] leading-snug text-muted">
        {MODE_CONFIG[mode].blurb}
      </p>
    </div>
  );
}
