import React from 'react';
import { EligibilityResult } from '../types';
import { formatCurrency } from '../utils/calculations';

interface EligibilityGaugeProps {
  result: EligibilityResult;
}

const EligibilityGauge: React.FC<EligibilityGaugeProps> = ({ result }) => {
  const getStatusConfig = () => {
    switch(result.status) {
      case 'excellent': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Excellent', icon: 'fa-circle-check', border: 'border-emerald-500/20' };
      case 'good': return { color: 'text-indigo-500', bg: 'bg-indigo-500/10', label: 'Good', icon: 'fa-thumbs-up', border: 'border-indigo-500/20' };
      case 'risky': return { color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Risky', icon: 'fa-triangle-exclamation', border: 'border-amber-500/20' };
      case 'rejected': return { color: 'text-rose-500', bg: 'bg-rose-500/10', label: 'Over-Leveraged', icon: 'fa-circle-xmark', border: 'border-rose-500/20' };
    }
  };

  const config = getStatusConfig();
  const foirWidth = Math.min(100, result.currentFOIR);

  return (
    <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden relative group h-full flex flex-col">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-1000"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 md:mb-14 gap-4">
        <div>
          <h3 className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-[0.4em] font-heading mb-1 md:mb-2">Risk Assessment</h3>
          <span className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white font-heading tracking-tight leading-none">Eligibility Check</span>
        </div>
        <div className={`px-6 py-3 md:px-8 md:py-4 rounded-2xl md:rounded-[1.75rem] ${config.bg} ${config.color} ${config.border} flex items-center gap-3 md:gap-4 text-xs md:text-base font-black uppercase tracking-[0.2em] border shadow-sm transition-all duration-500`}>
          <i className={`fa-solid ${config.icon} text-lg md:text-2xl`}></i>
          {config.label}
        </div>
      </div>

      <div className="space-y-10 md:space-y-14 flex-grow flex flex-col justify-center">
        <div>
          <div className="flex justify-between mb-4 md:mb-6 text-[10px] md:text-sm font-black uppercase tracking-[0.3em] text-slate-500">
            <span>Debt-to-Income (FOIR)</span>
            <span className={`${config.color} text-xl md:text-3xl`}>{result.currentFOIR.toFixed(1)}%</span>
          </div>
          <div className="h-4 md:h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 md:p-1.5 shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(0,0,0,0.1)] ${
                result.status === 'excellent' ? 'bg-emerald-500' :
                result.status === 'good' ? 'bg-indigo-500' :
                result.status === 'risky' ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${foirWidth}%` }}
            />
          </div>
          <div className="flex justify-between mt-4 md:mt-6 text-[9px] md:text-xs text-slate-400 font-black uppercase tracking-widest">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Healthy</span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Limit</span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Critical</span>
          </div>
        </div>

        <div className="pt-10 md:pt-14 border-t border-slate-50 dark:border-slate-800/60 grid grid-cols-2 gap-6 md:gap-10">
          <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-slate-50 dark:bg-slate-800/30 text-center border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
            <span className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-2 md:mb-4">EMI Capacity</span>
            <span className="text-xl md:text-3xl font-black text-slate-800 dark:text-white font-heading tracking-tight">{formatCurrency(result.maxEMICapacity)}</span>
          </div>
          <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-slate-50 dark:bg-slate-800/30 text-center border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
            <span className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-2 md:mb-4">Verdict</span>
            <span className={`text-xl md:text-3xl font-black font-heading tracking-tight ${result.isEligible ? 'text-emerald-500' : 'text-rose-500'}`}>
              {result.isEligible ? 'Favorable' : 'Declined'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilityGauge;