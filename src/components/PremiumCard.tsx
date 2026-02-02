import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CSSProperties, MouseEvent, ReactNode } from "react";

interface PremiumCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const PremiumCard = ({ title, children, className }: PremiumCardProps) => {
  const motionX = useMotionValue(0);
  const motionY = useMotionValue(0);
  const springX = useSpring(motionX, { stiffness: 220, damping: 26 });
  const springY = useSpring(motionY, { stiffness: 220, damping: 26 });

  const rotateX = useTransform(springY, [-50, 50], [12, -12]);
  const rotateY = useTransform(springX, [-50, 50], [-12, 12]);
  const glareX = useTransform(springX, (value) => `${50 + value / 2}%`);
  const glareY = useTransform(springY, (value) => `${50 + value / 2}%`);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    motionX.set(clamp(x, -50, 50));
    motionY.set(clamp(y, -50, 50));
  };

  const handleMouseLeave = () => {
    motionX.set(0);
    motionY.set(0);
  };

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.65)] backdrop-blur ${
        className ?? ""
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(59,130,246,0.35), transparent 60%)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.08), transparent 55%)",
          "--glare-x": glareX,
          "--glare-y": glareY,
        } as CSSProperties}
      />
      <div className="relative z-10 space-y-3" style={{ transform: "translateZ(20px)" }}>
        {title ? (
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">{title}</p>
        ) : null}
        {children}
      </div>
    </motion.div>
  );
};
