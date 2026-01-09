
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { EMIDetails, LoanData } from '../types';

interface ChartsSectionProps {
  data: LoanData;
  details: EMIDetails;
  isDarkMode: boolean;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ data, details, isDarkMode }) => {
  const pieData = [
    { name: 'Principal', value: data.amount },
    { name: 'Interest', value: details.totalInterest },
  ];

  const COLORS = ['#4f46e5', '#f43f5e'];
  const gridColor = isDarkMode ? '#1e293b' : '#f1f5f9';
  const labelColor = isDarkMode ? '#64748b' : '#94a3b8';

  const trendData = details.amortizationSchedule
    .filter((_, index) => index % (Math.max(1, Math.floor(details.amortizationSchedule.length / 10))) === 0)
    .map(entry => ({
      name: `M${entry.month}`,
      Balance: Math.round(entry.endingBalance),
    }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-3 uppercase tracking-widest font-heading">
          <i className="fa-solid fa-chart-pie text-indigo-500 text-lg"></i>
          Debt Breakdown
        </h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={6}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  padding: '12px',
                  backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', 
                  borderColor: isDarkMode ? '#1e293b' : '#e2e8f0',
                  color: isDarkMode ? '#f1f5f9' : '#1e293b'
                }}
                formatter={(value: number) => `₹${value.toLocaleString()}`} 
              />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: '900', paddingTop: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-3 uppercase tracking-widest font-heading">
          <i className="fa-solid fa-chart-line text-indigo-500 text-lg"></i>
          Repayment Curve
        </h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" stroke={labelColor} fontSize={12} fontWeight="bold" tickLine={false} axisLine={false} />
              <YAxis stroke={labelColor} fontSize={12} fontWeight="bold" tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', 
                  borderColor: isDarkMode ? '#1e293b' : '#e2e8f0',
                  color: isDarkMode ? '#f1f5f9' : '#1e293b'
                }}
                formatter={(value: number) => `₹${value.toLocaleString()}`} 
              />
              <Area type="monotone" dataKey="Balance" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorBalance)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
