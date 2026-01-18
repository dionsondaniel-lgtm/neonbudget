import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'blue' | 'pink' | 'none';
  delay?: number;
}

const Card: React.FC<CardProps> = ({ children, className = '', glow = 'none', delay = 0 }) => {
  const glowClass =
    glow === 'blue'
      ? 'shadow-neon-blue border-neon-blue/30'
      : glow === 'pink'
      ? 'shadow-neon-pink border-neon-pink/30'
      : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`
        relative overflow-hidden
        bg-white/70 dark:bg-white/5 backdrop-blur-xl 
        border rounded-2xl p-5 
        transition-all duration-300
        text-slate-900 dark:text-white
        ${glowClass}
        ${className}
      `}
    >
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 dark:from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default Card;