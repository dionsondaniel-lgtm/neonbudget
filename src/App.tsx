import React, { useState, useEffect } from 'react';
import { BudgetProvider } from './context/BudgetContext';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import History from './pages/History';
import Settings from './pages/Settings';
import Modal from './components/Modal';
import TransactionForm from './components/TransactionForm';
import { Transaction, THEMES } from './types';
import { useBudget } from './context/BudgetContext';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  const { addTransaction, editTransaction, currentTheme } = useBudget();
  const theme = THEMES[currentTheme];

  // Sync dark mode class
  useEffect(() => {
    if (theme.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme.isDark]);

  const handleOpenAdd = () => {
      setEditingTransaction(null);
      setIsModalOpen(true);
  };

  const handleOpenEdit = (transaction: Transaction) => {
      setEditingTransaction(transaction);
      setIsModalOpen(true);
  };

  const handleSubmit = (data: Omit<Transaction, 'id'>) => {
      if (editingTransaction) {
          editTransaction(editingTransaction.id, data);
      } else {
          addTransaction(data);
      }
      setIsModalOpen(false);
      setEditingTransaction(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'history':
        return <History onEdit={handleOpenEdit} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${theme.background} selection:bg-neon-pink selection:text-white`}>
      {/* Background Ambient Glows - Dynamic based on theme */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] transition-colors duration-1000 ${theme.glow1}`} />
          <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] transition-colors duration-1000 ${theme.glow2}`} />
      </div>

      <main className="relative z-10 max-w-md mx-auto min-h-screen p-4">
        {renderContent()}
      </main>

      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onAddClick={handleOpenAdd}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTransaction ? 'Edit Transaction' : 'New Transaction'}
      >
        <TransactionForm
            initialData={editingTransaction}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BudgetProvider>
      <MainLayout />
    </BudgetProvider>
  );
};

export default App;