import React, { createContext, useContext, useEffect, useState } from 'react';
import { BudgetContextType, Transaction, Backup, TransactionTemplate, ThemeId } from '../types';

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const STORAGE_KEY = 'neon-budget-data';
const BACKUPS_KEY = 'neon-budget-backups';
const TEMPLATES_KEY = 'neon-budget-templates';
const THEME_KEY = 'neon-budget-theme';

// Default data only used if LocalStorage is totally empty
const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'income',
    category: 'Salary',
    amount: 5000,
    date: new Date().toISOString().split('T')[0],
    description: 'Initial Deposit',
  }
];

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // =================================================================
  // 1. LAZY INITIALIZATION (The Fix)
  // We read LocalStorage *synchronously* when the state is created.
  // This prevents the "Empty Array" overwrite bug.
  // =================================================================

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_TRANSACTIONS;
    } catch (e) {
      return DEFAULT_TRANSACTIONS;
    }
  });

  const [backups, setBackups] = useState<Backup[]>(() => {
    try {
      const stored = localStorage.getItem(BACKUPS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) { return []; }
  });

  const [templates, setTemplates] = useState<TransactionTemplate[]>(() => {
    try {
      const stored = localStorage.getItem(TEMPLATES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) { return []; }
  });

  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    return (localStorage.getItem(THEME_KEY) as ThemeId) || 'cosmic';
  });

  // =================================================================
  // 2. SAVING EFFECTS
  // These run whenever data changes to keep LocalStorage in sync.
  // =================================================================

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(BACKUPS_KEY, JSON.stringify(backups));
  }, [backups]);

  useEffect(() => {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, currentTheme);
  }, [currentTheme]);

  // =================================================================
  // 3. LOGIC (Recurring, Add, Edit, Delete)
  // =================================================================

  // Recurring Transaction Checker
  useEffect(() => {
    if (templates.length === 0) return;

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonthStr = today.toISOString().slice(0, 7); // YYYY-MM
    const todayStr = today.toISOString().split('T')[0];

    let hasUpdates = false;
    const newTransactions: Transaction[] = [];
    
    // Check if we need to run any templates
    const updatedTemplates = templates.map(t => {
      if (t.autoAdd && t.dayOfMonth) {
         const isDayMatch = t.dayOfMonth === currentDay;
         const lastGenMonth = t.lastGenerated ? t.lastGenerated.slice(0, 7) : '';
         const alreadyRunThisMonth = lastGenMonth === currentMonthStr;

         if (isDayMatch && !alreadyRunThisMonth) {
             hasUpdates = true;
             newTransactions.push({
                 id: crypto.randomUUID(),
                 type: t.type,
                 category: t.category,
                 amount: t.amount,
                 date: todayStr,
                 description: `${t.name} (Auto-generated)`
             });
             return { ...t, lastGenerated: today.toISOString() };
         }
      }
      return t;
    });

    if (hasUpdates) {
        setTransactions(prev => [...newTransactions, ...prev]);
        setTemplates(updatedTemplates);
    }
  }, [templates.length]); // Check when templates change, but logic protects against dupes

  const setTheme = (theme: ThemeId) => {
    setCurrentTheme(theme);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const editTransaction = (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...updatedTransaction, id } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const clearData = () => {
    if (confirm("Are you sure? This will wipe all current transactions.")) {
        setTransactions([]);
    }
  };

  // =================================================================
  // 4. IMPORT / EXPORT / BACKUP
  // =================================================================

  const exportData = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `neon_budget_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed)) {
        setTransactions(parsed);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const createBackup = () => {
    try {
      const dataStr = JSON.stringify(transactions);
      const size = new Blob([dataStr]).size;
      const timestamp = new Date();
      
      const newBackup: Backup = {
        id: crypto.randomUUID(),
        name: `Snapshot ${timestamp.toLocaleString()}`,
        createdAt: timestamp.toISOString(),
        size,
        itemCount: transactions.length,
        data: [...transactions]
      };
      
      setBackups(prev => [newBackup, ...prev]);
    } catch (e) {
      console.error("Failed to create backup", e);
      alert("Could not create backup. Local storage might be full.");
    }
  };

  const deleteBackup = (id: string) => {
    setBackups(prev => prev.filter(b => b.id !== id));
  };

  const restoreBackup = (id: string) => {
    const backup = backups.find(b => b.id === id);
    if (backup) {
      if(confirm(`Restore backup "${backup.name}"? Current data will be replaced.`)){
          setTransactions([...backup.data]);
      }
    }
  };

  const addTemplate = (template: Omit<TransactionTemplate, 'id'>) => {
    const newTemplate = { ...template, id: crypto.randomUUID() };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const editTemplate = (id: string, updatedTemplate: Omit<TransactionTemplate, 'id'>) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...updatedTemplate, id } : t))
    );
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        clearData,
        exportData,
        importData,
        backups,
        createBackup,
        deleteBackup,
        restoreBackup,
        templates,
        addTemplate,
        editTemplate,
        deleteTemplate,
        currency: '₱', // Or '$'
        currentTheme,
        setTheme,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};