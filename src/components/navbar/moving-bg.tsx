"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react"; // Import ReactNode type

interface MovingBackgroundProps {
  children: ReactNode;
}

export default function MovingBackground({ children }: MovingBackgroundProps) {
  return (
    <div className="relative overflow-hidden w-full h-16">
      <motion.div
        className="absolute inset-0 flex w-[400%] h-full"
        animate={{ x: ["0%", "-5%"] }} 
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
      >
        <div
          className="w-1/3 h-full bg-fill bg-center"
          style={{ backgroundImage: "url('/img/nav-bar-bg.png')" }}
        />
        <div
          className="w-1/3 h-full bg-fill bg-center"
          style={{ backgroundImage: "url('/img/nav-bar-bg.png')" }}
        />
      </motion.div>

      {/* Navbar content (passed as children) */}
      <div className="relative flex items-center justify-between w-full h-full px-4">
        {children}
      </div>
    </div>
  );
}
