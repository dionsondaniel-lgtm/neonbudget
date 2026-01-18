import React from 'react';
import { useBudget } from '../context/BudgetContext';
import { THEMES, ThemeId } from '../types';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme } = useBudget();

  return (
    <div className="grid grid-cols-2 gap-3">
      {(Object.keys(THEMES) as ThemeId[]).map((themeKey) => {
        const theme = THEMES[themeKey];
        const isActive = currentTheme === themeKey;

        return (
          <button
            key={themeKey}
            onClick={() => setTheme(themeKey)}
            className={`
              relative p-3 rounded-xl border text-left transition-all duration-300 group
              ${isActive ? 'border-neon-blue bg-white/10' : 'border-white/10 hover:border-white/30 bg-white/5'}
            `}
          >
            {/* Preview of the theme's colors */}
            <div className={`h-16 w-full rounded-lg mb-3 overflow-hidden relative ${theme.background}`}>
                 {/* Simulate Glows */}
                 <div className={`absolute top-0 left-0 w-full h-full ${theme.glow1} blur-xl opacity-80`} />
                 <div className={`absolute bottom-0 right-0 w-2/3 h-2/3 ${theme.glow2} blur-xl opacity-80`} />
                 
                 {/* Simulate Content */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 w-10 h-6 rounded border border-white/20 backdrop-blur-sm" />
            </div>

            <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {theme.name}
                </span>
                {isActive && (
                    <div className="bg-neon-blue text-black rounded-full p-0.5">
                        <Check size={12} strokeWidth={3} />
                    </div>
                )}
            </div>
            
            <p className="text-[10px] text-slate-500 mt-1">
                {theme.isDark ? 'Dark Mode' : 'Light Mode'}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSelector;