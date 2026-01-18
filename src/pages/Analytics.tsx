import React from 'react';
import { useBudget } from '../context/BudgetContext';
import Card from '../components/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Legend } from 'recharts';
import { TrendingUp, PiggyBank } from 'lucide-react';

const COLORS = ['#22d3ee', '#d946ef', '#f472b6', '#818cf8', '#34d399', '#fbbf24'];

const Analytics: React.FC = () => {
  const { transactions, currency, currentTheme } = useBudget();
  const isDark = currentTheme !== 'polar';

  // Overall totals
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  // Pie Chart Data: Expenses by Category
  const expensesByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.keys(expensesByCategory).map((cat) => ({
    name: cat,
    value: expensesByCategory[cat],
  }));

  // Bar Chart Data: Monthly Spending (Last 6 months)
  const monthlyDataMap = transactions
    .reduce((acc, curr) => {
      const month = curr.date.substring(0, 7); // YYYY-MM
      if (!acc[month]) acc[month] = { name: month, income: 0, expense: 0 };
      
      if (curr.type === 'income') acc[month].income += curr.amount;
      else acc[month].expense += curr.amount;
      
      return acc;
    }, {} as Record<string, { name: string, income: number, expense: number }>);
  
  const barData = Object.keys(monthlyDataMap)
    .sort()
    .slice(-6)
    .map(month => monthlyDataMap[month]);

  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Analytics</h1>

      {/* KPI Savings Rate */}
      <Card glow="blue" className="flex items-center justify-between">
          <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Savings Rate</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {savingsRate.toFixed(1)}%
              </h2>
              <p className="text-xs text-neon-green mt-1 flex items-center gap-1">
                  <TrendingUp size={12} />
                  Based on total history
              </p>
          </div>
          <div className="p-4 rounded-full bg-neon-blue/10 text-neon-blue">
              <PiggyBank size={24} />
          </div>
      </Card>

      <Card glow="pink" className="flex flex-col items-center" delay={0.1}>
        <h3 className="text-slate-900 dark:text-white font-medium mb-4 self-start">Expense Breakdown</h3>
        <div className="w-full h-64">
            {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', 
                            borderRadius: '8px',
                            color: isDark ? '#fff' : '#0f172a'
                        }}
                        itemStyle={{ color: isDark ? '#fff' : '#0f172a' }}
                    />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex h-full items-center justify-center text-slate-500">
                    No expense data
                </div>
            )}
        </div>
        <div className="w-full grid grid-cols-2 gap-2 mt-4">
            {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs text-slate-600 dark:text-slate-300 flex-1">{entry.name}</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{currency}{entry.value}</span>
                </div>
            ))}
        </div>
      </Card>

      <Card glow="blue" delay={0.2}>
         <h3 className="text-slate-900 dark:text-white font-medium mb-4">Cash Flow (Income vs Expense)</h3>
         <div className="w-full h-64">
            {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                        <XAxis 
                            dataKey="name" 
                            stroke={isDark ? "#475569" : "#94a3b8"} 
                            fontSize={10} 
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => {
                                const [y, m] = val.split('-');
                                const date = new Date(parseInt(y), parseInt(m) - 1);
                                return date.toLocaleString('default', { month: 'short' });
                            }}
                        />
                        <Tooltip 
                            cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                            contentStyle={{ 
                                backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', 
                                borderRadius: '8px',
                                color: isDark ? '#fff' : '#0f172a'
                            }}
                            itemStyle={{ color: isDark ? '#fff' : '#0f172a' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                        <Bar name="Income" dataKey="income" fill="#4ade80" radius={[4, 4, 0, 0]} />
                        <Bar name="Expense" dataKey="expense" fill="#d946ef" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex h-full items-center justify-center text-slate-500">
                    No data available
                </div>
            )}
         </div>
      </Card>
    </div>
  );
};

export default Analytics;