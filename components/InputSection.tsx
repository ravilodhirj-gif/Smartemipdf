
import React from 'react';
import { LoanData, LoanType } from '../types';
import { formatCurrency } from '../utils/calculations';

interface InputSectionProps {
  data: LoanData;
  onChange: (newData: LoanData) => void;
}

const CONSTRAINTS: Record<LoanType, { maxAmount: number; maxRate: number; maxTenure: number; icon: string; color: string }> = {
  general: { maxAmount: 10000000, maxRate: 20, maxTenure: 30, icon: 'fa-calculator', color: 'from-blue-500 to-indigo-600' },
  home: { maxAmount: 50000000, maxRate: 15, maxTenure: 30, icon: 'fa-house-chimney', color: 'from-emerald-500 to-teal-600' },
  personal: { maxAmount: 5000000, maxRate: 25, maxTenure: 10, icon: 'fa-user-tie', color: 'from-rose-500 to-pink-600' },
  car: { maxAmount: 5000000, maxRate: 18, maxTenure: 7, icon: 'fa-car', color: 'from-amber-500 to-orange-600' },
};

const InputSection: React.FC<InputSectionProps> = ({ data, onChange }) => {
  const constraints = CONSTRAINTS[data.type];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let numericValue = parseFloat(value) || 0;
    
    if (type === 'number') {
      const min = parseFloat(e.target.min);
      const max = parseFloat(e.target.max);
      if (numericValue > max) numericValue = max;
      if (numericValue < min && !name.includes('Charges')) numericValue = min;
    }

    onChange({ 
      ...data, 
      [name]: type === 'date' ? value : numericValue 
    });
  };

  const InputRange = ({ label, name, min, max, step, value, suffix, icon }: any) => (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <label className="text-sm md:text-base font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em] font-heading flex items-center gap-3 md:gap-4">
          {icon && <i className={`fa-solid ${icon} text-indigo-500 text-xl md:text-2xl`}></i>}
          {label}
        </label>
        
        <div className="relative group/input w-full sm:w-auto">
          <input
            type="number"
            name={name}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            className="w-full sm:w-48 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-xl md:text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight focus:border-indigo-500 outline-none transition-all shadow-inner"
          />
          {suffix && (
            <span className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
      </div>
      
      <div className="relative flex items-center pt-2">
        <input
          type="range"
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="w-full h-3 md:h-4 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600"
        />
      </div>
      
      <div className="flex justify-between px-1">
        <span className="text-[8px] md:text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
          Min: {name === 'amount' ? formatCurrency(min) : `${min}${suffix || ''}`}
        </span>
        <span className="text-[8px] md:text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
          Max: {name === 'amount' ? formatCurrency(max) : `${max}${suffix || ''}`}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-8 md:gap-10">
        <div className="flex items-center gap-6 md:gap-8 pb-6 md:pb-8 border-b border-slate-50 dark:border-slate-800">
          <div className={`w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-[1.5rem] bg-gradient-to-br ${constraints.color} flex items-center justify-center text-white text-2xl md:text-4xl shadow-xl shadow-indigo-500/20`}>
            <i className={`fa-solid ${constraints.icon}`}></i>
          </div>
          <div>
             <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-400 block mb-1 font-heading">Primary Config</span>
             <span className="text-xl md:text-3xl font-black text-slate-900 dark:text-white capitalize font-heading tracking-tight">{data.type} Loan</span>
          </div>
        </div>

        <div className="space-y-8 md:space-y-12">
          <InputRange label="Principal" name="amount" min="10000" max={constraints.maxAmount} step="10000" value={data.amount} icon="fa-coins" />
          <InputRange label="Interest Rate" name="interestRate" min="1" max={constraints.maxRate} step="0.1" value={data.interestRate} suffix="%" icon="fa-percent" />
          <InputRange label="Tenure" name="tenure" min="1" max={constraints.maxTenure} step="1" value={data.tenure} suffix="Yrs" icon="fa-calendar-day" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-8 md:gap-10">
        <div className="flex items-center gap-6 md:gap-8">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-600 dark:text-teal-400 text-xl md:text-3xl">
            <i className="fa-solid fa-receipt"></i>
          </div>
          <div>
             <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-400 block mb-1 font-heading">Deductions</span>
             <span className="text-xl md:text-2xl font-black text-slate-800 dark:text-white font-heading tracking-tight">Upfront Costs</span>
          </div>
        </div>

        <div className="space-y-8 md:space-y-12">
          <InputRange label="Processing Fee" name="processingFeeRate" min="0" max="5" step="0.1" value={data.processingFeeRate} suffix="%" icon="fa-file-invoice-dollar" />
          <InputRange label="Insurance" name="insuranceCharges" min="0" max="100000" step="500" value={data.insuranceCharges} icon="fa-shield-halved" />
          {data.type === 'car' && (
            <InputRange label="RTO Charges" name="rtoCharges" min="0" max="200000" step="1000" value={data.rtoCharges} icon="fa-id-card" />
          )}
          
          <div className="space-y-4 md:space-y-6">
            <label className="text-sm md:text-base font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em] font-heading flex items-center gap-3 md:gap-4">
              <i className="fa-solid fa-calendar-check text-indigo-500 text-xl md:text-2xl"></i>
              First EMI Date
            </label>
            <input 
              type="date" 
              name="firstEmiDate"
              value={data.firstEmiDate}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl md:rounded-[2rem] px-4 md:px-8 py-4 md:py-5 text-lg md:text-2xl font-black font-heading text-slate-900 dark:text-white outline-none transition-all shadow-inner cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border border-white/50 dark:border-slate-800/50 flex flex-col gap-8 md:gap-10 shadow-sm">
        <div className="flex items-center gap-6 md:gap-8">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl md:text-3xl">
            <i className="fa-solid fa-user-gear"></i>
          </div>
          <div>
             <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 block mb-1 font-heading">Borrower Profile</span>
             <span className="text-xl md:text-2xl font-black text-slate-800 dark:text-white font-heading tracking-tight">Eligibility Data</span>
          </div>
        </div>

        <div className="space-y-8 md:space-y-12">
          <InputRange label="Monthly Income" name="monthlyIncome" min="10000" max="1000000" step="5000" value={data.monthlyIncome} icon="fa-wallet" />
          <InputRange label="Running EMIs" name="existingEMIs" min="0" max="500000" step="1000" value={data.existingEMIs} icon="fa-receipt" />
          <InputRange label="Other Debts" name="otherLiabilities" min="0" max="500000" step="1000" value={data.otherLiabilities} icon="fa-hand-holding-dollar" />
        </div>
      </div>
    </div>
  );
};

export default InputSection;
