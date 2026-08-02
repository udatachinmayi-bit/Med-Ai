"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
}

export default function AuthCard({ children }: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
      }}
      className="
      w-full
      max-w-md
      rounded-[32px]
      border
      border-white/30
      bg-white/70
      backdrop-blur-xl
      shadow-[0_20px_80px_rgba(37,99,235,0.15)]
      p-10"
    >
      {children}
    </motion.div>
  );
}