"use client";

import { useMemo } from "react";

const COLORS = ["#c47a4a", "#e0925c", "#f4e8d6", "#6fc3d8", "#2e6b5e"];

export default function ConfettiBurst({ active }: { active: boolean }) {
  const bits = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: 8 + ((i * 23) % 84),
        delay: (i % 12) * 0.04,
        duration: 1.6 + (i % 5) * 0.18,
        color: COLORS[i % COLORS.length],
        rot: (i * 37) % 360,
        size: 5 + (i % 4) * 2,
      })),
    []
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {bits.map((bit) => (
        <span
          key={bit.id}
          className="absolute top-[-8%] rounded-[1px]"
          style={{
            left: `${bit.left}%`,
            width: bit.size,
            height: bit.size * 1.6,
            background: bit.color,
            opacity: 0.85,
            transform: `rotate(${bit.rot}deg)`,
            animation: `confetti-fall ${bit.duration}s cubic-bezier(0.22, 1, 0.36, 1) ${bit.delay}s both`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          12% { opacity: 0.9; }
          100% { transform: translateY(110vh) rotate(220deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
