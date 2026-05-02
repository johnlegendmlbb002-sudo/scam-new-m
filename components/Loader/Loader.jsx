"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Loader({ fullScreen = true }) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--background)] overflow-hidden"
    : "relative w-full py-24 flex flex-col items-center justify-center bg-transparent overflow-hidden";

  // Drawing Joker SVG Paths
  const jokerFacePath = "M50,30 Q60,10 70,30 Q90,10 100,30 Q110,60 80,90 Q50,110 20,90 Q-10,60 0,30 Q10,10 30,30 Q40,10 50,30"; // Simplified hat/face outline
  
  return (
    <div className={containerClasses}>
      {/* Dynamic Background Pulse */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent)]/10 blur-[120px] rounded-full" 
        />
      </div>

      <div className="relative flex flex-col items-center">
        {/* CUSTOM DRAWING JOKER SVG */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 mb-8">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]">
            {/* Jester Hat Drawing */}
            <motion.path
              d="M20,40 Q10,10 40,25 Q50,5 60,25 Q90,10 80,40 Q95,60 50,90 Q5,60 20,40" // Jester Hat + Face Outline
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1, 0],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Hat Bells (Small Circles) */}
            <motion.circle
              cx="40" cy="25" r="2"
              fill="var(--accent)"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            />
            <motion.circle
              cx="60" cy="25" r="2"
              fill="var(--accent)"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            />

            {/* Sinister Eyes */}
            <motion.path
              d="M35,50 L45,55 M65,50 L55,55"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />

            {/* Grin */}
            <motion.path
              d="M30,70 Q50,85 70,70"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
            />
          </svg>

          {/* Glitch Overlay Effect */}
          <motion.div 
            animate={{ 
              opacity: [0, 0.2, 0, 0.4, 0],
              x: [0, -2, 2, -1, 0]
            }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            className="absolute inset-0 bg-[var(--accent)]/5 mix-blend-overlay blur-sm"
          />
        </div>

        {/* LOADING TEXT - TACTICAL STYLE */}
        <div className="space-y-4 flex flex-col items-center">
           <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    backgroundColor: ["var(--muted)", "var(--accent)", "var(--muted)"]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 rounded-full"
                />
              ))}
           </div>
           
           <div className="relative group">
              <motion.p
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--accent)] text-center pl-[0.5em]"
              >
                Please wait...
              </motion.p>
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-20 mt-2" />
           </div>
        </div>
      </div>

      {/* TACTICAL OVERLAY */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/10 to-transparent" />
         <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/10 to-transparent" />
         <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[var(--accent)]/10 to-transparent" />
         <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[var(--accent)]/10 to-transparent" />
      </div>
    </div>
  );
}

