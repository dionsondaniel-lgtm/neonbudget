import React from 'react';
import { useBudget } from '../context/BudgetContext';
import Card from '../components/Card';
import { ArrowDownRight, ArrowUpRight, Wallet, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { transactions, currency } = useBudget();

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  // Prepare chart data (Last 7 days balance trend)
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    const dayTransactions = transactions.filter(t => t.date === date);
    const dayIncome = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const dayExpense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return {
        date: date.slice(5), // MM-DD
        net: dayIncome - dayExpense
    };
  });
  
  let runningTotal = 0; 
  const trendData = chartData.map(d => {
      runningTotal += d.net;
      return { ...d, value: runningTotal };
  });

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back to NeonBudget</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-blue-600 flex items-center justify-center text-black font-bold shadow-lg shadow-neon-blue/30">
            NB
        </div>
      </div>

      {/* Main Balance Card */}
      <Card glow="blue" className="py-8">
        <div className="flex flex-col items-center justify-center">
            <span className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-widest mb-2">Total Balance</span>
            <motion.h2 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-bold text-slate-900 dark:text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            >
                {currency}{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </motion.h2>
        </div>
        
        {/* Mini Chart */}
        <div className="h-16 mt-6 -mx-5 -mb-5 opacity-50">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col justify-between" delay={0.1}>
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-full bg-neon-green/10 text-neon-green">
                    <ArrowDownRight size={18} />
                </div>
                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Income</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">{currency}{totalIncome.toLocaleString()}</span>
        </Card>
        <Card className="flex flex-col justify-between" delay={0.2}>
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-full bg-neon-pink/10 text-neon-pink">
                    <ArrowUpRight size={18} />
                </div>
                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Expense</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">{currency}{totalExpense.toLocaleString()}</span>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent</h3>
        </div>
        <div className="space-y-3">
            {recentTransactions.map((t, idx) => (
                <Card key={t.id} className="p-4 flex items-center justify-between group" delay={0.3 + (idx * 0.05)}>
                    <div className="flex items-center gap-4">
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center text-lg
                            ${t.type === 'income' ? 'bg-neon-green/10 text-neon-green' : 'bg-neon-pink/10 text-neon-pink'}
                        `}>
                            {t.type === 'income' ? <Wallet size={18} /> : <TrendingUp size={18} />}
                        </div>
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">{t.category}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{t.description || t.date}</p>
                        </div>
                    </div>
                    <span className={`font-bold ${t.type === 'income' ? 'text-neon-green' : 'text-slate-900 dark:text-white'}`}>
                        {t.type === 'income' ? '+' : '-'} {currency}{t.amount}
                    </span>
                </Card>
            ))}
            {recentTransactions.length === 0 && (
                <div className="text-center text-slate-500 py-10">No transactions yet.</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;