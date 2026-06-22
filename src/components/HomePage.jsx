import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap } from "lucide-react";

// Generate 20 random particles that will float upwards in the background
const particles = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  size: Math.random() * 3 + 1, // Size between 1px and 4px
  x: Math.random() * 100, // Horizontal start position (0 - 100vw)
  delay: Math.random() * 5, // Random start delay
  duration: Math.random() * 6 + 6 // Random animation duration (6s - 12s)
}));

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-screen bg-app text-white flex items-center justify-center overflow-hidden font-sans">
      
      {/* Drifting Glow Orbs */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -30, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[110px] pointer-events-none" 
      />
      <motion.div 
        animate={{
          scale: [1, 1.15, 1],
          x: [0, -30, 0],
          y: [0, 30, 0]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none" 
      />

      {/* Tech Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)] pointer-events-none" />

      {/* Floating Spark/Particle System */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: "110vh", x: `${p.x}vw`, opacity: 0 }}
            animate={{ 
              y: "-10vh",
              opacity: [0, 0.4, 0.4, 0],
              x: [`${p.x}vw`, `${p.x + (Math.random() * 8 - 4)}vw`]
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
            className="absolute rounded-full bg-gradient-to-tr from-primary to-indigo-400 blur-[0.5px]"
          />
        ))}
      </div>

      <div className="relative z-10 max-w-lg w-full px-6 flex flex-col items-center text-center">
        {/* Animated Brand Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.05, 1], opacity: 1 }}
          transition={{ 
            scale: { duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" },
            opacity: { duration: 0.6 }
          }}
          className="w-20 h-20 bg-card border border-border-card rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10 mb-8 text-primary"
        >
          <GraduationCap size={40} />
        </motion.div>

        {/* Brand Header */}
        <motion.h1
          initial={{ letterSpacing: "0.2em", opacity: 0, y: 15 }}
          animate={{ letterSpacing: "0.05em", opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl sm:text-6xl font-black mb-12 tracking-wider"
        >
          NEXUS_<span className="text-primary">HUB</span>
        </motion.h1>

        {/* Enter Portal CTA Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate("/login")}
          className="px-10 py-4 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary-hover shadow-lg shadow-primary/20 flex items-center gap-3 transition-colors border border-transparent"
        >
          <span>Entry</span>
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}
