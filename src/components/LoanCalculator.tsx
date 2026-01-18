import React, { useState, useEffect } from 'react';
import Card from './Card';
import Input from './Input';
import Modal from './Modal'; // Import Modal
import { Calculator, Save, AlertCircle, RefreshCw, Home, Building } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';

const LoanCalculator: React.FC = () => {
  const { currency, addTemplate } = useBudget();
  
  // Calculator State
  const [lender, setLender] = useState('');
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(5); // Annual Interest Rate
  const [term, setTerm] = useState(12); // Months
  const [frequency, setFrequency] = useState<'Monthly' | 'Bi-Monthly'>('Monthly');

  // Scheduling State
  const [payDate, setPayDate] = useState(1); // 1-31
  const [autoAdd, setAutoAdd] = useState(false);

  // Modal State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const [result, setResult] = useState({
    payment: 0,
    totalInterest: 0,
    totalPayment: 0
  });

  useEffect(() => {
    // Standard Amortization Formula
    const P = Number(amount);
    const i = (Number(rate) / 100) / 12;
    const n = Number(term);

    if (P > 0 && n > 0) {
      let monthlyPayment = 0;
      if (rate === 0) {
        monthlyPayment = P / n;
      } else {
        monthlyPayment = (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
      }

      const totalPay = monthlyPayment * n;
      const interest = totalPay - P;
      
      const finalPayment = frequency === 'Bi-Monthly' ? monthlyPayment / 2 : monthlyPayment;

      setResult({
        payment: finalPayment,
        totalInterest: interest,
        totalPayment: totalPay
      });
    }
  }, [amount, rate, term, frequency]);

  const openSaveModal = () => {
      const defaultName = lender ? `${lender} Loan` : "Housing/Loan Payment";
      setTemplateName(defaultName);
      setIsSaveModalOpen(true);
  };

  const confirmSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (templateName) {
      addTemplate({
        name: templateName,
        type: 'expense',
        category: 'Loan Payment',
        amount: Number(result.payment.toFixed(2)),
        description: `Loan Payment to ${lender || 'Lender'} (${frequency}) - ${term} months`,
        dayOfMonth: payDate,
        autoAdd: autoAdd
      });
      setIsSaveModalOpen(false);
      alert(autoAdd ? `Automation enabled! Transaction will be created on day ${payDate}.` : 'Saved to Templates.');
    }
  };

  const loadHousingSample = () => {
      setLender('City Bank Housing');
      setAmount(1500000); // Sample House Loan
      setRate(6.5);
      setTerm(120); // 10 years
      setFrequency('Monthly');
      setPayDate(19); // Per request
      setAutoAdd(true);
  };

  return (
    <>
        <Card glow="pink" className="mb-6">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-neon-pink">
                <Calculator size={20} />
                <h3 className="font-bold text-slate-900 dark:text-white">Loan Calculator & Planner</h3>
            </div>
            <button 
                onClick={loadHousingSample}
                className="text-[10px] flex items-center gap-1 bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 px-2 py-1 rounded text-slate-900 dark:text-white transition-colors"
            >
                <Home size={12} /> Load Housing Sample
            </button>
        </div>

        {/* Lender Info */}
        <div className="mb-4">
            <Input
                label="Lender / Company Name"
                type="text"
                value={lender}
                onChange={e => setLender(e.target.value)}
                placeholder="e.g. Chase Bank, Pag-IBIG"
            />
        </div>

        {/* Calculator Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-4">
            <Input 
            label={`Loan Amount (${currency})`} 
            type="number" 
            value={amount} 
            onChange={e => setAmount(Number(e.target.value))} 
            />
            <Input 
            label="Interest Rate (% Year)" 
            type="number" 
            value={rate} 
            onChange={e => setRate(Number(e.target.value))} 
            />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
            <Input 
            label="Term (Months)" 
            type="number" 
            value={term} 
            onChange={e => setTerm(Number(e.target.value))} 
            />
            <Input 
            label="Payment Frequency" 
            type="select" 
            options={['Monthly', 'Bi-Monthly']}
            value={frequency} 
            onChange={e => setFrequency(e.target.value as any)} 
            />
        </div>

        {/* Results Display */}
        <div className="bg-slate-100 dark:bg-slate-900/80 rounded-xl p-4 border border-slate-200 dark:border-white/5 space-y-3 mb-6">
            <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 text-sm">{frequency} Payment</span>
                <span className="text-2xl font-bold text-neon-green">
                    {currency}{result.payment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
            <div className="h-px bg-slate-200 dark:bg-white/10 my-2" />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Total Interest</span>
                <span>{currency}{result.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
        </div>

        {/* Automation Settings */}
        <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200 dark:border-white/5 mb-4">
            <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-3">Automation Settings</h4>
            <div className="flex items-end gap-4">
                <div className="flex-1">
                    <Input 
                        label="Payment Day of Month"
                        type="number"
                        min={1}
                        max={31}
                        value={payDate}
                        onChange={(e) => setPayDate(Number(e.target.value))}
                    />
                </div>
                <div className="flex-1 mb-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`
                            w-10 h-5 rounded-full relative transition-colors duration-300
                            ${autoAdd ? 'bg-neon-pink' : 'bg-slate-300 dark:bg-slate-700'}
                        `}>
                            <div className={`
                                absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300
                                ${autoAdd ? 'left-6' : 'left-1'}
                            `} />
                            <input type="checkbox" className="hidden" checked={autoAdd} onChange={e => setAutoAdd(e.target.checked)} />
                        </div>
                        <span className={`text-sm font-medium ${autoAdd ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                            Auto-add Transaction
                        </span>
                    </label>
                </div>
            </div>
        </div>

        <button 
            onClick={openSaveModal}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-neon-pink/10 border border-neon-pink/30 text-neon-pink hover:bg-neon-pink/20 transition-all font-semibold text-sm"
        >
            <Save size={16} />
            Save Configuration
        </button>

        <div className="mt-3 flex items-start gap-2 text-[10px] text-slate-500">
            <RefreshCw size={12} className="mt-0.5 shrink-0" />
            <p>
                {autoAdd 
                    ? `System will automatically create a transaction for ${currency}${result.payment.toFixed(0)} on day ${payDate} of every month.` 
                    : "Saved as a 'Quick Fill' template. You must manually add it via the Add button."}
            </p>
        </div>
        </Card>

        {/* Save Template Modal */}
        <Modal
            isOpen={isSaveModalOpen}
            onClose={() => setIsSaveModalOpen(false)}
            title="Save Template"
        >
            <form onSubmit={confirmSaveTemplate}>
                <div className="mb-6">
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                        Name this recurring payment to easily identify it in your settings or when adding transactions.
                    </p>
                    <Input 
                        label="Template Name"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        autoFocus
                    />
                </div>
                
                <div className="flex gap-3 w-full">
                    <button 
                        type="button"
                        onClick={() => setIsSaveModalOpen(false)}
                        className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="flex-1 py-3 rounded-xl bg-neon-blue hover:bg-cyan-400 text-black font-bold transition-colors shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                    >
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    </>
  );
};

export default LoanCalculator;