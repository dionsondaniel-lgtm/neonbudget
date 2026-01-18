import React from 'react';
import { Home, PieChart, List, Settings, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onAddClick }) => {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'analytics', icon: PieChart, label: 'Analytics' },
    { id: 'history', icon: List, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#020617]/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 pb-safe z-40 transition-colors duration-500">
      <div className="relative flex justify-around items-center h-16 max-w-md mx-auto px-2">
        
        {/* FAB Button (Floating Center) */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-50">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddClick}
            className="bg-gradient-to-tr from-fuchsia-600 to-purple-600 p-4 rounded-full shadow-[0_0_20px_rgba(217,70,239,0.5)] border-4 border-slate-100 dark:border-[#020617] text-white"
          >
            <Plus size={28} strokeWidth={3} />
          </motion.button>
        </div>

        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          // Add spacer for the FAB
          if (index === 2) {
             // We insert a dummy element to space out the icons around the FAB
             return (
               <React.Fragment key="spacer">
                  <div className="w-12" />
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                      isActive ? 'text-neon-blue' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-1 w-1 h-1 bg-neon-blue rounded-full"
                      />
                    )}
                  </button>
               </React.Fragment>
             );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive ? 'text-neon-blue' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-1 w-1 h-1 bg-neon-blue rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;