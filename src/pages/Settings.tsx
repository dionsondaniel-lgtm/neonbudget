import React, { useState, useEffect } from 'react';
import { useBudget } from '../context/BudgetContext';
import Card from '../components/Card';
import LoanCalculator from '../components/LoanCalculator';
import Modal from '../components/Modal';
import ThemeSelector from '../components/ThemeSelector';
import Input from '../components/Input';
import { Download, Upload, Trash2, Database, FileJson, Save, RotateCcw, Eye, EyeOff, Server, Copy, Zap, CalendarClock, Palette, Moon, AlertTriangle, Edit2, HardDrive } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { TransactionTemplate } from '../types';

const Settings: React.FC = () => {
  const { 
    transactions,
    clearData, 
    exportData, 
    importData, 
    backups, 
    createBackup, 
    deleteBackup, 
    restoreBackup,
    templates,
    editTemplate,
    deleteTemplate,
    currency,
    currentTheme
  } = useBudget();

  const [showRawActive, setShowRawActive] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  
  // Template Management States
  const [templateToDeleteId, setTemplateToDeleteId] = useState<string | null>(null);
  const [templateToEdit, setTemplateToEdit] = useState<TransactionTemplate | null>(null);

  // Snapshot Management States
  const [snapshotToDeleteId, setSnapshotToDeleteId] = useState<string | null>(null);
  const [snapshotToRestoreId, setSnapshotToRestoreId] = useState<string | null>(null);

  // Storage Stats
  const [storageStats, setStorageStats] = useState({ used: 0, percent: 0, max: 5 * 1024 * 1024 });

  useEffect(() => {
    const calculateStorage = () => {
        // Calculate storage used by our app specific keys
        const keys = ['neon-budget-data', 'neon-budget-backups', 'neon-budget-templates', 'neon-budget-theme'];
        let totalBytes = 0;
        
        keys.forEach(key => {
            const item = localStorage.getItem(key);
            if (item) {
                totalBytes += new Blob([item]).size; // Accurate byte size
            }
        });

        const maxBytes = 5 * 1024 * 1024; // 5MB limit
        setStorageStats({
            used: totalBytes,
            percent: Math.min((totalBytes / maxBytes) * 100, 100),
            max: maxBytes
        });
    };

    calculateStorage();
    // Recalculate when data changes
  }, [transactions, backups, templates, currentTheme]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (importData(text)) {
          alert('Data imported successfully!');
        } else {
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearDataConfirm = () => {
    clearData();
    setIsClearModalOpen(false);
  };

  // Snapshot Handlers
  const confirmDeleteSnapshot = () => {
      if (snapshotToDeleteId) {
          deleteBackup(snapshotToDeleteId);
          setSnapshotToDeleteId(null);
      }
  };

  const confirmRestoreSnapshot = () => {
      if (snapshotToRestoreId) {
          restoreBackup(snapshotToRestoreId);
          setSnapshotToRestoreId(null);
      }
  };

  // Template Handlers
  const confirmDeleteTemplate = () => {
    if (templateToDeleteId) {
        deleteTemplate(templateToDeleteId);
        setTemplateToDeleteId(null);
    }
  };

  const handleUpdateTemplate = (e: React.FormEvent) => {
      e.preventDefault();
      if (templateToEdit) {
          editTemplate(templateToEdit.id, {
              name: templateToEdit.name,
              type: templateToEdit.type,
              category: templateToEdit.category,
              amount: templateToEdit.amount,
              description: templateToEdit.description,
              dayOfMonth: templateToEdit.dayOfMonth,
              autoAdd: templateToEdit.autoAdd,
              lastGenerated: templateToEdit.lastGenerated
          });
          setTemplateToEdit(null);
      }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format the JSON to be "Toons Style" (Pretty Printed with indentation)
  const activeDataStr = JSON.stringify(transactions, null, 2);

  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Settings & Tools</h1>

      {/* Appearance Settings */}
      <Card glow="blue">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-neon-blue">
                <Palette size={20} />
                <h3 className="font-bold text-slate-900 dark:text-white">Appearance</h3>
            </div>
            <button 
                onClick={() => setIsThemeModalOpen(true)}
                className="bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white text-xs px-4 py-2 rounded-lg transition-colors border border-slate-300 dark:border-white/10"
            >
                Change Theme
            </button>
        </div>
        <div className="mt-4 flex items-center gap-2">
            <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                <Moon size={14} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Current: <span className="text-slate-900 dark:text-white font-medium capitalize">{currentTheme.replace('-', ' ')}</span>
            </p>
        </div>
      </Card>

      {/* Loan Calculator */}
      <LoanCalculator />

      {/* Templates Section */}
      <Card glow="none">
        <div className="flex items-center gap-3 text-neon-blue mb-4">
            <Copy size={20} />
            <h3 className="font-bold text-slate-900 dark:text-white">Recurring Templates</h3>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            Manage your templates and automatic recurring payments.
        </p>
        
        <div className="space-y-2">
            {templates.length === 0 ? (
                 <div className="text-center py-4 text-slate-500 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-sm">
                    No templates saved. Use the Calculator above to create one.
                </div>
            ) : (
                templates.map(t => (
                    <div key={t.id} className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-900 dark:text-white font-medium text-sm">{t.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{t.category}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-neon-green">{currency}{t.amount.toLocaleString()}</span>
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => setTemplateToEdit(t)}
                                        className="text-slate-400 dark:text-slate-500 hover:text-blue-400 transition-colors p-1"
                                        title="Edit Template"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => setTemplateToDeleteId(t.id)}
                                        className="text-slate-400 dark:text-slate-500 hover:text-red-400 transition-colors p-1"
                                        title="Delete Template"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Automation Status Badge */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-white/5">
                            {t.autoAdd ? (
                                <div className="flex items-center gap-1.5 text-[10px] text-neon-pink bg-neon-pink/10 px-2 py-1 rounded-md">
                                    <CalendarClock size={12} />
                                    <span>Auto-pays on Day {t.dayOfMonth}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-[10px] text-neon-blue bg-neon-blue/10 px-2 py-1 rounded-md">
                                    <Zap size={12} />
                                    <span>Quick Fill Only</span>
                                </div>
                            )}
                            <span className="text-[10px] text-slate-500 italic truncate flex-1 text-right">
                                {t.description}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
      </Card>

      {/* Storage Inspector */}
      <Card glow="none" delay={0.05}>
         <div className="flex items-center gap-3 text-neon-pink mb-4">
            <Server size={20} />
            <h3 className="font-bold text-slate-900 dark:text-white">Storage Inspector</h3>
        </div>

        {/* Storage Bar */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-200 dark:border-white/5 mb-4">
            <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
                     <HardDrive size={16} className="text-slate-500" />
                     <span>Local Storage Usage</span>
                 </div>
                 <span className={`text-xs font-bold ${storageStats.percent > 90 ? 'text-red-500' : 'text-neon-green'}`}>
                     {storageStats.percent.toFixed(1)}%
                 </span>
            </div>
            
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                <div 
                    className={`h-full transition-all duration-1000 ease-out ${
                        storageStats.percent > 90 ? 'bg-red-500' : 
                        storageStats.percent > 75 ? 'bg-yellow-500' : 
                        'bg-neon-green'
                    }`}
                    style={{ width: `${storageStats.percent}%` }}
                />
            </div>
            
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span>Used: {formatBytes(storageStats.used)}</span>
                <span>Total Limit: ~5 MB</span>
            </div>
        </div>
        
        {/* Active Data Stats */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-200 dark:border-white/5 mb-3">
             <div className="flex justify-between items-center mb-2">
                 <div className="flex items-center gap-2">
                     <span className="text-sm font-medium text-slate-900 dark:text-white">Active Transactions</span>
                     <span className="text-[10px] text-slate-500 font-mono">neon-budget-data</span>
                 </div>
                 <button 
                    onClick={() => setShowRawActive(!showRawActive)}
                    className="text-xs text-neon-blue hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                 >
                    {showRawActive ? <><EyeOff size={12}/> Hide Raw</> : <><Eye size={12}/> View Raw</>}
                 </button>
             </div>
             
             <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                 <div>
                     <span className="block text-slate-500 dark:text-slate-600 uppercase tracking-wider text-[10px]">Items</span>
                     <span className="text-slate-900 dark:text-white font-mono">{transactions.length}</span>
                 </div>
                 <div>
                     <span className="block text-slate-500 dark:text-slate-600 uppercase tracking-wider text-[10px]">Last Sync</span>
                     <span className="text-slate-900 dark:text-white font-mono">Now</span>
                 </div>
             </div>

             <AnimatePresence>
                {showRawActive && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-3"
                    >
                        <textarea 
                            readOnly
                            value={activeDataStr}
                            className="w-full h-48 bg-slate-200 dark:bg-black/50 rounded-lg p-2 text-[10px] font-mono text-slate-700 dark:text-green-400 border border-slate-300 dark:border-white/10 focus:outline-none custom-scrollbar whitespace-pre"
                        />
                    </motion.div>
                )}
             </AnimatePresence>
        </div>
      </Card>

      {/* Snapshot Management Section */}
      <Card glow="blue" delay={0.1}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3 text-neon-blue">
            <Database size={20} />
            <h3 className="font-bold text-slate-900 dark:text-white">Local Snapshots</h3>
          </div>
          <button 
            onClick={createBackup}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-blue/10 text-neon-blue text-xs font-bold border border-neon-blue/20 hover:bg-neon-blue/20 transition-colors"
          >
            <Save size={14} />
            CREATE
          </button>
        </div>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
          Saved restore points in local storage.
        </p>

        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
          {backups.length === 0 ? (
            <div className="text-center py-6 text-slate-500 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
              <p className="text-sm">No snapshots saved yet.</p>
            </div>
          ) : (
            backups.map(backup => (
              <div 
                key={backup.id} 
                className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-white/5 flex items-center justify-between group hover:border-slate-300 dark:hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0">
                    <FileJson size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-white truncate pr-2">{backup.name}</div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                        {formatBytes(backup.size)}
                      </span>
                      <span>•</span>
                      <span>{backup.itemCount} Items</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                       {new Date(backup.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 pl-2">
                  <button 
                    onClick={() => setSnapshotToRestoreId(backup.id)}
                    title="Restore"
                    className="p-2 rounded-lg text-slate-400 hover:text-neon-green hover:bg-neon-green/10 transition-colors"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button 
                    onClick={() => setSnapshotToDeleteId(backup.id)}
                    title="Delete"
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Global Data Actions */}
      <Card glow="none" delay={0.2}>
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider text-slate-500">Global Actions</h3>
        <div className="space-y-3">
            <button 
                onClick={exportData}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-neon-blue/50 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-500/10 text-blue-400 group-hover:text-blue-300">
                        <Download size={18} />
                    </div>
                    <span className="text-slate-700 dark:text-slate-200">Export Active Data to File</span>
                </div>
            </button>

            <label className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-neon-blue/50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-500/10 text-green-400 group-hover:text-green-300">
                        <Upload size={18} />
                    </div>
                    <span className="text-slate-700 dark:text-slate-200">Import File</span>
                </div>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            <button 
                onClick={() => setIsClearModalOpen(true)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-red-500/50 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-red-500/10 text-red-400 group-hover:text-red-300">
                        <Trash2 size={18} />
                    </div>
                    <span className="text-slate-700 dark:text-slate-200">Clear Active Data</span>
                </div>
            </button>
        </div>
      </Card>

      {/* Modals */}
      <Modal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        title="Select Theme"
      >
        <ThemeSelector />
      </Modal>

      {/* Clear Data Confirmation */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear All Data?"
      >
          <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4 text-red-500">
                  <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Are you absolutely sure?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                  This action will permanently delete all your transaction history. This action cannot be undone unless you have a backup.
              </p>
              
              <div className="flex gap-3 w-full">
                  <button 
                      onClick={() => setIsClearModalOpen(false)}
                      className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                      Cancel
                  </button>
                  <button 
                      onClick={handleClearDataConfirm}
                      className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors shadow-lg shadow-red-500/30"
                  >
                      Yes, Clear Data
                  </button>
              </div>
          </div>
      </Modal>

      {/* Delete Snapshot Confirmation */}
      <Modal
        isOpen={!!snapshotToDeleteId}
        onClose={() => setSnapshotToDeleteId(null)}
        title="Delete Snapshot?"
      >
          <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4 text-red-500">
                  <AlertTriangle size={32} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                  This snapshot will be permanently deleted from local storage.
              </p>
              
              <div className="flex gap-3 w-full">
                  <button 
                      onClick={() => setSnapshotToDeleteId(null)}
                      className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                      Cancel
                  </button>
                  <button 
                      onClick={confirmDeleteSnapshot}
                      className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors shadow-lg shadow-red-500/30"
                  >
                      Delete
                  </button>
              </div>
          </div>
      </Modal>

      {/* Restore Snapshot Confirmation */}
      <Modal
        isOpen={!!snapshotToRestoreId}
        onClose={() => setSnapshotToRestoreId(null)}
        title="Restore Snapshot?"
      >
          <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center mb-4 text-neon-blue">
                  <RotateCcw size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Overwrite active data?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                  This will replace your current active transactions with the data from this snapshot. Any unsaved changes in active data will be lost.
              </p>
              
              <div className="flex gap-3 w-full">
                  <button 
                      onClick={() => setSnapshotToRestoreId(null)}
                      className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                      Cancel
                  </button>
                  <button 
                      onClick={confirmRestoreSnapshot}
                      className="flex-1 py-3 rounded-xl bg-neon-blue hover:bg-cyan-400 text-black font-bold transition-colors shadow-lg shadow-neon-blue/30"
                  >
                      Restore
                  </button>
              </div>
          </div>
      </Modal>

      {/* Delete Template Confirmation */}
      <Modal
        isOpen={!!templateToDeleteId}
        onClose={() => setTemplateToDeleteId(null)}
        title="Delete Template?"
      >
          <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4 text-red-500">
                  <AlertTriangle size={32} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                  Removing this template will stop any future automated payments associated with it.
              </p>
              
              <div className="flex gap-3 w-full">
                  <button 
                      onClick={() => setTemplateToDeleteId(null)}
                      className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                      Cancel
                  </button>
                  <button 
                      onClick={confirmDeleteTemplate}
                      className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors shadow-lg shadow-red-500/30"
                  >
                      Delete
                  </button>
              </div>
          </div>
      </Modal>

      {/* Edit Template Modal */}
      <Modal
        isOpen={!!templateToEdit}
        onClose={() => setTemplateToEdit(null)}
        title="Edit Template"
      >
        {templateToEdit && (
            <form onSubmit={handleUpdateTemplate} className="space-y-4">
                <Input 
                    label="Template Name" 
                    value={templateToEdit.name} 
                    onChange={(e) => setTemplateToEdit({...templateToEdit, name: e.target.value})}
                />
                
                <Input 
                    label="Amount" 
                    type="number"
                    value={templateToEdit.amount} 
                    onChange={(e) => setTemplateToEdit({...templateToEdit, amount: Number(e.target.value)})}
                />

                <Input 
                    label="Description" 
                    value={templateToEdit.description} 
                    onChange={(e) => setTemplateToEdit({...templateToEdit, description: e.target.value})}
                />

                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <Input 
                            label="Day of Month" 
                            type="number"
                            min={1}
                            max={31}
                            value={templateToEdit.dayOfMonth || ''} 
                            onChange={(e) => setTemplateToEdit({...templateToEdit, dayOfMonth: Number(e.target.value)})}
                        />
                     </div>
                     <div className="flex items-end mb-3">
                         <label className="flex items-center gap-3 cursor-pointer group h-[48px]">
                            <div className={`
                                w-10 h-5 rounded-full relative transition-colors duration-300
                                ${templateToEdit.autoAdd ? 'bg-neon-pink' : 'bg-slate-300 dark:bg-slate-700'}
                            `}>
                                <div className={`
                                    absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300
                                    ${templateToEdit.autoAdd ? 'left-6' : 'left-1'}
                                `} />
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={templateToEdit.autoAdd || false} 
                                    onChange={e => setTemplateToEdit({...templateToEdit, autoAdd: e.target.checked})} 
                                />
                            </div>
                            <span className={`text-sm font-medium ${templateToEdit.autoAdd ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                                Auto-add
                            </span>
                        </label>
                     </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button 
                        type="button"
                        onClick={() => setTemplateToEdit(null)}
                        className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="flex-1 py-3 rounded-xl bg-neon-blue hover:bg-cyan-400 text-black font-bold transition-colors shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                    >
                        Update
                    </button>
                </div>
            </form>
        )}
      </Modal>

      <div className="text-center text-xs text-slate-500 mt-10">
          <p>NeonBudget v2.0.0</p>
          <p>Offline-First PWA</p>
      </div>
    </div>
  );
};

export default Settings;