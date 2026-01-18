import React, { useState, useMemo } from 'react';
import { useBudget } from '../context/BudgetContext';
import Card from '../components/Card';
import Modal from '../components/Modal'; // Import Modal
import { Trash2, Edit2, Search, Filter, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction } from '../types';

interface HistoryProps {
    onEdit: (t: Transaction) => void;
}

const History: React.FC<HistoryProps> = ({ onEdit }) => {
  const { transactions, deleteTransaction, currency } = useBudget();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  
  // Modal State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, filterType]);

  const confirmDelete = () => {
      if (deleteId) {
          deleteTransaction(deleteId);
          setDeleteId(null);
      }
  };

  return (
    <div className="space-y-4 pb-24 h-full flex flex-col">
      <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">History</h1>
          <span className="text-xs font-mono text-neon-blue bg-neon-blue/10 px-2 py-1 rounded">
              {transactions.length} Records
          </span>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2 sticky top-0 bg-slate-100 dark:bg-[#020617] transition-colors duration-500 z-20 py-2">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
                type="text" 
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:border-neon-pink focus:outline-none transition-colors"
            />
        </div>
        <button 
            onClick={() => setFilterType(curr => curr === 'all' ? 'expense' : curr === 'expense' ? 'income' : 'all')}
            className={`
                px-3 rounded-xl border flex items-center justify-center transition-colors
                ${filterType !== 'all' 
                    ? 'bg-neon-blue text-black border-neon-blue' 
                    : 'bg-white dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10'}
            `}
        >
            <Filter size={18} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
        <AnimatePresence initial={false}>
            {filteredTransactions.map((t) => (
                <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    className="relative group"
                >
                    <Card className="p-4 flex items-center justify-between border-l-4 border-l-transparent hover:border-l-neon-pink transition-all">
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <span className="font-semibold text-slate-900 dark:text-white">{t.category}</span>
                                <span className={`font-bold ${t.type === 'income' ? 'text-neon-green' : 'text-slate-900 dark:text-white'}`}>
                                    {t.type === 'income' ? '+' : '-'} {currency}{t.amount}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                <span>{t.description || 'No description'}</span>
                                <span>{t.date}</span>
                            </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-3">
                            <button 
                                onClick={() => onEdit(t)}
                                className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-white hover:bg-blue-600 transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button 
                                onClick={() => setDeleteId(t.id)}
                                className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-white hover:bg-red-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </AnimatePresence>
        
        {filteredTransactions.length === 0 && (
             <div className="text-center py-20 text-slate-500">
                 <p>No transactions found.</p>
             </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Transaction?"
      >
          <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4 text-red-500">
                  <AlertTriangle size={32} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                  Are you sure you want to remove this transaction from your history?
              </p>
              
              <div className="flex gap-3 w-full">
                  <button 
                      onClick={() => setDeleteId(null)}
                      className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                      Cancel
                  </button>
                  <button 
                      onClick={confirmDelete}
                      className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors shadow-lg shadow-red-500/30"
                  >
                      Delete
                  </button>
              </div>
          </div>
      </Modal>
    </div>
  );
};

export default History;