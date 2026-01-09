import React, { useState, useMemo, useEffect } from 'react';
import InputSection from './components/InputSection';
import ResultCards from './components/ResultCards';
import ChartsSection from './components/ChartsSection';
import AmortizationTable from './components/AmortizationTable';
import AIAssistant from './components/AIAssistant';
import ContactSection from './components/ContactSection';
import ReminderSection from './components/ReminderSection';
import EligibilityGauge from './components/EligibilityGauge';
import { LoanData, LoanType } from './types';
import { calculateEMI, calculateEligibility, formatCurrency } from './utils/calculations';

const getInitialDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(1);
  return date.toISOString().split('T')[0];
};

const DEFAULTS: Record<LoanType, LoanData> = {
  general: { amount: 500000, interestRate: 10.0, tenure: 5, type: 'general', monthlyIncome: 100000, existingEMIs: 15000, otherLiabilities: 5000, processingFeeRate: 1.0, insuranceCharges: 2000, rtoCharges: 0, firstEmiDate: getInitialDate() },
  home: { amount: 5000000, interestRate: 8.5, tenure: 20, type: 'home', monthlyIncome: 150000, existingEMIs: 0, otherLiabilities: 0, processingFeeRate: 0.5, insuranceCharges: 15000, rtoCharges: 0, firstEmiDate: getInitialDate() },
  personal: { amount: 200000, interestRate: 14.0, tenure: 3, type: 'personal', monthlyIncome: 80000, existingEMIs: 5000, otherLiabilities: 2000, processingFeeRate: 2.5, insuranceCharges: 1000, rtoCharges: 0, firstEmiDate: getInitialDate() },
  car: { amount: 800000, interestRate: 9.5, tenure: 5, type: 'car', monthlyIncome: 120000, existingEMIs: 10000, otherLiabilities: 3000, processingFeeRate: 1.0, insuranceCharges: 5000, rtoCharges: 15000, firstEmiDate: getInitialDate() },
};

const App: React.FC = () => {
  const [loanData, setLoanData] = useState<LoanData>(DEFAULTS.general);
  const [resetKey, setResetKey] = useState(0);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia?.('(prefers-color-scheme: dark)')?.matches);
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const emiDetails = useMemo(() => calculateEMI(loanData), [loanData]);
  const eligibility = useMemo(() => calculateEligibility(loanData, emiDetails.emi), [loanData, emiDetails.emi]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const resetAllQueries = () => {
    // Deep clear all user session data
    setLoanData(DEFAULTS.general);
    localStorage.removeItem('emi_reminder');
    setResetKey(prev => prev + 1); // Triggers re-render of AI Assistant and other components
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchLoanType = (type: LoanType) => {
    setLoanData(DEFAULTS[type]);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} selection:bg-indigo-100 selection:text-indigo-700 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden`}>
      <div className="flex flex-col items-center py-4 md:py-16 px-4">
        <div className="w-full max-w-7xl glass shadow-2xl rounded-[2.5rem] md:rounded-[4.5rem] overflow-hidden flex flex-col border border-white/60 dark:border-slate-800/60 transition-all duration-700">
          
          <header className="px-6 md:px-14 h-24 md:h-36 flex justify-between items-center border-b border-slate-200/40 dark:border-slate-800/40">
            <div className="flex items-center gap-4 md:gap-8 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center text-white text-2xl md:text-5xl shadow-2xl shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-500">
                <i className="fa-solid fa-bolt-lightning"></i>
              </div>
              <span className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter font-heading">
                Smart<span className="text-indigo-600 dark:text-indigo-400">EMI</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2 md:gap-8">
              <nav className="hidden xl:flex items-center space-x-12 text-[11px] md:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">
                <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition-opacity">Calculator</button>
                <button onClick={() => scrollToSection('contact')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact Expert</button>
              </nav>
              
              <div className="flex items-center gap-2 md:gap-4">
                <button 
                  onClick={resetAllQueries}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-all active:scale-90 border border-transparent hover:border-rose-500/30 group/reset"
                  title="Clear All Queries"
                >
                  <i className="fa-solid fa-rotate-left text-lg md:text-2xl group-hover/reset:-rotate-90 transition-transform"></i>
                </button>
                <button 
                  onClick={toggleDarkMode}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-100 dark:border-slate-700 active:scale-90 transition-all hover:border-indigo-500/30 group/theme"
                  aria-label="Toggle Dark Mode"
                >
                  <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-xl md:text-2xl group-hover/theme:rotate-12 transition-transform`}></i>
                </button>
              </div>
            </div>
          </header>

          <main className="p-6 md:p-16 lg:p-24">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-12 md:mb-20 gap-8 md:gap-14">
              <div className="space-y-4 md:space-y-8 stagger-1">
                <div className="inline-flex items-center gap-3 px-4 md:px-8 py-2 md:py-3 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] border border-indigo-100 dark:border-indigo-800">
                  <span className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-indigo-500 animate-ping"></span>
                  Financial Engine v3.1 Ready
                </div>
                <h1 className="text-4xl sm:text-7xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] font-heading">
                  Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600">{loanData.type}</span> analysis.
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg md:text-3xl max-w-4xl font-medium leading-snug">The gold standard in loan simulation. Precise. Professional. Immediate.</p>
              </div>
              
              <div className="flex p-2 md:p-4 bg-slate-100/80 dark:bg-slate-800/80 rounded-3xl md:rounded-[2.5rem] border border-slate-200/50 dark:border-slate-700/50 self-start shadow-inner overflow-x-auto max-w-full no-scrollbar stagger-2">
                {(['general', 'home', 'personal', 'car'] as LoanType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => switchLoanType(type)}
                    className={`px-6 md:px-10 py-3 md:py-5 text-[11px] md:text-sm font-black uppercase tracking-[0.2em] rounded-2xl md:rounded-[1.75rem] transition-all duration-500 whitespace-nowrap ${
                      loanData.type === type 
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xl scale-[1.05]' 
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-16 items-start stagger-3">
              <div className="xl:col-span-4 space-y-8 md:space-y-16">
                <InputSection data={loanData} onChange={setLoanData} />
                <ReminderSection key={`reminders-${resetKey}`} emiAmount={emiDetails.emi} />
                <AIAssistant key={`ai-${resetKey}`} loanData={loanData} emiDetails={emiDetails} />
              </div>

              <div className="xl:col-span-8 space-y-8 md:space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
                   <div className="lg:col-span-7">
                      <EligibilityGauge result={eligibility} />
                   </div>
                   <div className="lg:col-span-5 flex flex-col gap-8 md:gap-16">
                      <div className="p-8 md:p-12 bg-indigo-600 rounded-[3rem] md:rounded-[4rem] text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden group">
                         <i className="fa-solid fa-bolt absolute -right-6 -top-6 text-7xl md:text-10xl opacity-10 group-hover:scale-125 transition-transform duration-1000"></i>
                         <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] opacity-80 mb-3 font-heading">Net Commitment</h4>
                         <p className="text-3xl md:text-5xl font-black font-heading tracking-tight leading-none">
                           {formatCurrency(loanData.existingEMIs + loanData.otherLiabilities + emiDetails.emi)}
                         </p>
                      </div>
                      <div className="p-8 md:p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] md:rounded-[4rem] shadow-sm flex flex-col justify-center hover:border-indigo-500/30 transition-colors">
                         <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-3 font-heading">Net Disbursement</h4>
                         <p className="text-3xl md:text-5xl font-black font-heading tracking-tight leading-none text-teal-600 dark:text-teal-400">
                           {formatCurrency(emiDetails.netDisbursement)}
                         </p>
                      </div>
                   </div>
                </div>
                
                <ResultCards details={emiDetails} />
                
                <div className="p-2 md:p-4 bg-white dark:bg-slate-900/40 rounded-[3rem] md:rounded-[5rem] shadow-sm border border-slate-100 dark:border-slate-800/60">
                   <ChartsSection data={loanData} details={emiDetails} isDarkMode={isDarkMode} />
                </div>
                
                <AmortizationTable details={emiDetails} loanData={loanData} />
              </div>
            </div>

            <ContactSection loanData={loanData} emiDetails={emiDetails} />
          </main>

          <footer className="border-t border-slate-200/40 dark:border-slate-800/40 p-10 md:p-20 text-center text-slate-400 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md">
            <div className="flex flex-col items-center gap-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl text-left">
                <div className="space-y-4">
                  <h4 className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs">Repository</h4>
                  <a href="#" className="flex items-center gap-3 text-slate-500 hover:text-indigo-600 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      <i className="fa-brands fa-github"></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold">View Source</p>
                      <p className="text-[10px] opacity-60">GitHub Intelligence Lab</p>
                    </div>
                  </a>
                </div>
                <div className="space-y-4">
                  <h4 className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs">Connectivity</h4>
                  <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl hover:text-indigo-500 hover:scale-110 transition-all">
                      <i className="fa-brands fa-x-twitter"></i>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl hover:text-indigo-500 hover:scale-110 transition-all">
                      <i className="fa-brands fa-linkedin"></i>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl hover:text-indigo-500 hover:scale-110 transition-all">
                      <i className="fa-solid fa-paper-plane"></i>
                    </a>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs">Legal</h4>
                  <nav className="flex flex-col gap-2 text-[11px] font-bold uppercase tracking-wider">
                    <a href="#" className="hover:text-indigo-500 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-indigo-500 transition-colors">Terms of Service</a>
                  </nav>
                </div>
              </div>
              
              <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
              
              <div className="flex flex-col items-center gap-2">
                <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.5em] text-slate-300 dark:text-slate-700 font-heading">SmartEMI Financial Intelligence © 2024</p>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Built with React 19 & Google Gemini AI</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default App;