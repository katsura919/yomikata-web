"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BlurredCursorBackground() {
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateCursor);
    return () => window.removeEventListener("mousemove", updateCursor);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-[-1]">
      {/* First main blur (follows cursor closely) */}
      <motion.div
        className="absolute w-60 h-60 bg-gradient-to-br from-fuchsia-500 via-indigo-400 to-cyan-500 rounded-full blur-[100px] opacity-50"
        animate={{
          x: cursorPosition.x - 120, // Center the blur
          y: cursorPosition.y - 120,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20, duration: 0.3 }}
      />

      {/* Second blur (slightly slower movement for depth) */}
      <motion.div
        className="absolute w-80 h-80 bg-gradient-to-br from-blue-500 via-purple-400 to-pink-500 rounded-full blur-[150px] opacity-30"
        animate={{
          x: cursorPosition.x - 180,
          y: cursorPosition.y - 180,
        }}
        transition={{ type: "spring", stiffness: 30, damping: 30, duration: 0.5 }}
      />

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/5" />
    </div>
  );
}
