export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface TransactionTemplate {
  id: string;
  name: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  dayOfMonth?: number;
  autoAdd?: boolean;
  lastGenerated?: string;
}

export interface Backup {
  id: string;
  name: string;
  createdAt: string;
  size: number;
  itemCount: number;
  data: Transaction[];
}

export type ThemeId = 'cosmic' | 'forest' | 'ocean' | 'sunset' | 'polar';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  background: string; // CSS Class for bg
  glow1: string; // Color for top-left glow
  glow2: string; // Color for bottom-right glow
  accent: string; // Main accent color class
  isDark: boolean;
}

export interface BudgetContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, updatedTransaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  clearData: () => void;
  exportData: () => void;
  importData: (jsonData: string) => boolean;
  
  // Backup management
  backups: Backup[];
  createBackup: () => void;
  deleteBackup: (id: string) => void;
  restoreBackup: (id: string) => void;

  // Templates
  templates: TransactionTemplate[];
  addTemplate: (template: Omit<TransactionTemplate, 'id'>) => void;
  editTemplate: (id: string, updatedTemplate: Omit<TransactionTemplate, 'id'>) => void;
  deleteTemplate: (id: string) => void;

  // Settings
  currency: string;
  currentTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

export const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investments', 'Gift', 'Other'],
  expense: ['Food', 'Transport', 'Housing', 'Loan Payment', 'Entertainment', 'Health', 'Shopping', 'Utilities', 'Other'],
};

export const THEMES: Record<ThemeId, ThemeConfig> = {
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Neon',
    background: 'bg-[#020617]',
    glow1: 'bg-purple-900/30',
    glow2: 'bg-cyan-900/30',
    accent: 'text-neon-blue',
    isDark: true
  },
  forest: {
    id: 'forest',
    name: 'Dark Forest',
    background: 'bg-[#022c22]', // Deep green
    glow1: 'bg-emerald-900/40',
    glow2: 'bg-yellow-900/20',
    accent: 'text-emerald-400',
    isDark: true
  },
  ocean: {
    id: 'ocean',
    name: 'Midnight Ocean',
    background: 'bg-[#0c4a6e]', // Deep Ocean Blue
    glow1: 'bg-blue-900/40',
    glow2: 'bg-teal-900/30',
    accent: 'text-cyan-400',
    isDark: true
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Drive',
    background: 'bg-[#2a0a18]', // Deep Burgundy
    glow1: 'bg-orange-900/30',
    glow2: 'bg-fuchsia-900/30',
    accent: 'text-orange-400',
    isDark: true
  },
  polar: {
    id: 'polar',
    name: 'Polar Light',
    background: 'bg-slate-100', // Light mode
    glow1: 'bg-blue-300/30',
    glow2: 'bg-purple-300/30',
    accent: 'text-blue-600',
    isDark: false
  }
};