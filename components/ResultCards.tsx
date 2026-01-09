
import React, { useState, useEffect } from 'react';
import { EMIDetails } from '../types';
import { formatCurrency } from '../utils/calculations';

interface ResultCardsProps {
  details: EMIDetails;
}

const AnimatedCounter = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    const duration = 800;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(start + (end - start) * easeOutExpo);
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [value]);

  return <>{formatCurrency(displayValue)}</>;
};

const ResultCards: React.FC<ResultCardsProps> = ({ details }) => {
  const Card = ({ label, value, textValue, primary, icon, colorClass }: any) => (
    <div className={`group relative overflow-hidden p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] flex flex-col items-center justify-center transition-all duration-700 hover:scale-[1.02] md:hover:scale-[1.04] ${
      primary 
        ? 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-900 text-white shadow-xl shadow-indigo-500/20' 
        : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none'
    }`}>
      <div className={`absolute -right-24 -top-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${primary ? 'bg-white' : 'bg-indigo-500'}`}></div>

      <div className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-[2rem] mb-6 md:mb-10 flex items-center justify-center text-3xl md:text-5xl shadow-xl transition-all duration-500 ${
        primary 
          ? 'bg-white/10 text-white ring-4 ring-white/10' 
          : `bg-slate-50 dark:bg-slate-800 ${colorClass} ring-4 ring-slate-100 dark:ring-slate-700`
      }`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>

      <span className={`text-[10px] md:text-sm font-black uppercase tracking-[0.4em] mb-4 md:mb-6 font-heading text-center ${primary ? 'text-indigo-100/70' : 'text-slate-400 dark:text-slate-500'}`}>
        {label}
      </span>
      
      <span className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter font-heading text-center ${primary ? '' : 'text-slate-900 dark:text-white'}`}>
        {textValue ? textValue : <AnimatedCounter value={value} />}
      </span>
      
      <div className={`mt-8 md:mt-10 h-1.5 md:h-2 w-12 md:w-16 rounded-full transition-all duration-700 group-hover:w-24 md:group-hover:w-32 ${primary ? 'bg-white/20' : 'bg-indigo-500/20'}`}></div>
    </div>
  );

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
        <Card label="Monthly EMI" value={details.emi} icon="fa-money-bill-trend-up" colorClass="text-indigo-600" primary />
        <Card label="Total Interest" value={details.totalInterest} icon="fa-percent" colorClass="text-rose-500" />
        <Card label="Total Payable" value={details.totalPayment} icon="fa-vault" colorClass="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <Card 
          label="Net Disbursement" 
          value={details.netDisbursement} 
          icon="fa-hand-holding-dollar" 
          colorClass="text-teal-600" 
        />
        <Card 
          label="First EMI Date" 
          textValue={details.firstEmiDateFormatted} 
          icon="fa-calendar-day" 
          colorClass="text-amber-500" 
        />
      </div>
    </div>
  );
};

export default ResultCards;
