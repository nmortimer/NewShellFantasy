
"use client";

import { motion } from "framer-motion";

const pieces = new Array(80).fill(0).map((_, i) => i);

export default function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {pieces.map((i) => {
        const delay = Math.random() * 0.5;
        const duration = 1.5 + Math.random() * 1.5;
        const left = Math.random() * 100;
        const size = 6 + Math.random() * 10;
        const bg = randomColor();
        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: `${left}%`, opacity: 0 }}
            animate={{ y: "110vh", rotate: 360, opacity: 1 }}
            transition={{ delay, duration, ease: "easeOut" }}
            style={{ width: size, height: size, background: bg, position: "absolute", borderRadius: 2 }}
          />
        );
      })}
    </div>
  );
}

function randomColor() {
  const c = ["#FFD700", "#00E0FF", "#9B30FF", "#FF3B3B", "#ffffff"];
  return c[Math.floor(Math.random() * c.length)];
}
