
import React, { useState } from 'react';
import { EMIDetails, LoanData } from '../types';
import { formatCurrency } from '../utils/calculations';
import { generateLoanPDF } from '../utils/pdfGenerator';

interface AmortizationTableProps {
  details: EMIDetails;
  loanData: LoanData;
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({ details, loanData }) => {
  const [showAll, setShowAll] = useState(false);
  const displayLimit = showAll ? details.amortizationSchedule.length : 12;

  const downloadCSV = () => {
    const headers = ["Payment No", "Beginning Balance", "EMI Amount", "Principal Component", "Interest Component", "Remaining Balance"];
    const rows = details.amortizationSchedule.map(row => [
      row.month,
      row.beginningBalance.toFixed(2),
      row.emi.toFixed(2),
      row.principal.toFixed(2),
      row.interest.toFixed(2),
      row.endingBalance.toFixed(2)
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "amortization_schedule.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSavePDF = () => {
    generateLoanPDF(loanData, details);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      <div className="p-6 md:p-10 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-3 font-heading">
            <i className="fa-solid fa-table-list text-indigo-500"></i>
            Repayment Schedule
          </h3>
          <p className="text-sm md:text-base text-slate-400 dark:text-slate-500 mt-1 md:mt-2">Monthly breakdown of your repayment journey.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleSavePDF}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-[10px] md:text-sm font-black bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 px-4 md:px-6 py-3 rounded-xl hover:bg-rose-100 transition-colors uppercase tracking-widest"
          >
            <i className="fa-solid fa-file-pdf"></i>
            PDF
          </button>
          <button 
            onClick={downloadCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-[10px] md:text-sm font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 md:px-6 py-3 rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-widest"
          >
            <i className="fa-solid fa-file-csv"></i>
            CSV
          </button>
          <button 
            onClick={() => setShowAll(!showAll)}
            className="w-full sm:w-auto text-[10px] md:text-sm font-black bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-4 md:px-6 py-3 rounded-xl hover:bg-indigo-100 transition-colors uppercase tracking-widest"
          >
            {showAll ? 'Collapse' : `View All ${details.amortizationSchedule.length}`}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[10px] md:text-xs tracking-[0.2em] font-black">
            <tr>
              <th className="px-6 md:px-8 py-4 md:py-6 border-b border-slate-100 dark:border-slate-800">No.</th>
              <th className="px-6 md:px-8 py-4 md:py-6 border-b border-slate-100 dark:border-slate-800">Date</th>
              <th className="px-6 md:px-8 py-4 md:py-6 border-b border-slate-100 dark:border-slate-800 text-indigo-600 dark:text-indigo-400">EMI</th>
              <th className="px-6 md:px-8 py-4 md:py-6 border-b border-slate-100 dark:border-slate-800">Principal</th>
              <th className="px-6 md:px-8 py-4 md:py-6 border-b border-slate-100 dark:border-slate-800">Interest</th>
              <th className="px-6 md:px-8 py-4 md:py-6 border-b border-slate-100 dark:border-slate-800">End. Bal.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {details.amortizationSchedule.slice(0, displayLimit).map((row) => (
              <tr key={row.month} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group">
                <td className="px-6 md:px-8 py-4 md:py-6 font-black text-slate-500 dark:text-slate-400 text-sm md:text-base">{row.month}</td>
                <td className="px-6 md:px-8 py-4 md:py-6 text-slate-400 dark:text-slate-500 text-sm md:text-base whitespace-nowrap">{row.date}</td>
                <td className="px-6 md:px-8 py-4 md:py-6 font-black text-indigo-600 dark:text-indigo-400 text-base md:text-lg">{formatCurrency(row.emi)}</td>
                <td className="px-6 md:px-8 py-4 md:py-6 text-emerald-600 dark:text-emerald-400 font-black text-sm md:text-base whitespace-nowrap">
                  {formatCurrency(row.principal)}
                </td>
                <td className="px-6 md:px-8 py-4 md:py-6 text-rose-500 dark:text-rose-400 font-black text-sm md:text-base whitespace-nowrap">
                  {formatCurrency(row.interest)}
                </td>
                <td className="px-6 md:px-8 py-4 md:py-6 font-black text-slate-800 dark:text-slate-200 text-base md:text-lg whitespace-nowrap">{formatCurrency(row.endingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!showAll && details.amortizationSchedule.length > 12 && (
        <div className="p-6 md:p-8 bg-slate-50/50 dark:bg-slate-800/30 text-center border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs md:text-base text-slate-400 dark:text-slate-500 italic font-medium">Scroll down or click View All for full schedule.</p>
        </div>
      )}
    </div>
  );
};

export default AmortizationTable;
