import React, { useState, useEffect } from 'react';
import Input from './Input';
import { CATEGORIES, Transaction } from '../types';
import { Calendar, DollarSign, FileText, Tag, Zap } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';

interface TransactionFormProps {
  initialData?: Transaction | null;
  onSubmit: (data: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { templates } = useBudget();
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    type: 'expense',
    category: CATEGORIES.expense[0],
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        category: initialData.category,
        amount: initialData.amount,
        date: initialData.date,
        description: initialData.description,
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof Omit<Transaction, 'id'>, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset category if type changes
      if (field === 'type' && value !== prev.type) {
        newData.category = CATEGORIES[value as 'income' | 'expense'][0];
      }
      
      return newData;
    });
  };

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    const template = templates.find(t => t.id === templateId);
    if (template) {
        setFormData(prev => ({
            ...prev,
            type: template.type,
            category: template.category,
            amount: template.amount,
            description: template.description
            // Date stays current
        }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
        ...formData,
        amount: Number(formData.amount)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* Quick Fill Header */}
      {templates.length > 0 && !initialData && (
        <div className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-xl border border-neon-blue/20">
            <div className="flex items-center gap-2 mb-2 text-neon-blue text-xs font-bold uppercase tracking-wider">
                <Zap size={14} /> Quick Fill
            </div>
            <select 
                onChange={handleTemplateSelect}
                className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-neon-blue appearance-none"
            >
                <option value="">Select a template...</option>
                {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.amount})</option>
                ))}
            </select>
        </div>
      )}

      <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-white/10">
        {(['expense', 'income'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleChange('type', t)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
              formData.type === t
                ? t === 'income'
                  ? 'bg-neon-green text-black shadow-lg shadow-green-900/50'
                  : 'bg-neon-pink text-white shadow-lg shadow-pink-900/50'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="relative">
        <DollarSign className="absolute left-3 top-[34px] text-slate-500 dark:text-slate-400" size={18} />
        <Input
            label="Amount"
            type="number"
            value={formData.amount || ''}
            onChange={(e) => handleChange('amount', e.target.value)}
            className="pl-6"
            placeholder="0.00"
            required
            step="0.01"
            min="0"
            style={{ paddingLeft: '2.5rem' }} 
        />
      </div>

      <div className="relative">
        <Tag className="absolute left-3 top-[34px] text-slate-500 dark:text-slate-400 z-10" size={18} />
        <Input
            label="Category"
            type="select"
            options={CATEGORIES[formData.type]}
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
        />
      </div>

      <div className="relative">
        <Calendar className="absolute left-3 top-[34px] text-slate-500 dark:text-slate-400 z-10" size={18} />
        <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
        />
      </div>

      <div className="relative">
        <FileText className="absolute left-3 top-[34px] text-slate-500 dark:text-slate-400 z-10" size={18} />
        <Input
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="What was this for?"
            style={{ paddingLeft: '2.5rem' }}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all"
        >
          {initialData ? 'Update' : 'Add'} Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;