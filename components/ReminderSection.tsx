
import React, { useState, useEffect } from 'react';
import { ReminderSettings } from '../types';
import { formatCurrency } from '../utils/calculations';

interface ReminderSectionProps {
  emiAmount: number;
}

const ReminderSection: React.FC<ReminderSectionProps> = ({ emiAmount }) => {
  const [settings, setSettings] = useState<ReminderSettings>(() => {
    const saved = localStorage.getItem('emi_reminder');
    return saved ? JSON.parse(saved) : {
      enabled: false,
      dueDay: 1,
      reminderDaysBefore: 1,
      soundEnabled: true
    };
  });

  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    localStorage.setItem('emi_reminder', JSON.stringify(settings));
  }, [settings]);

  const checkReminder = () => {
    if (!settings.enabled) return;
    
    const today = new Date().getDate();
    if (today === settings.dueDay) {
      triggerAlarm("EMI Due Today!");
    } else if (today === settings.dueDay - settings.reminderDaysBefore) {
      triggerAlarm(`EMI Due in ${settings.reminderDaysBefore} day(s)!`);
    }
  };

  const triggerAlarm = (msg: string) => {
    setIsRinging(true);
    if (settings.soundEnabled) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => console.log("Audio playback blocked by browser"));
    }
  };

  const handleToggle = () => setSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => 
    setSettings(prev => ({ ...prev, dueDay: parseInt(e.target.value) }));
  const handleLeadChange = (e: React.ChangeEvent<HTMLSelectElement>) => 
    setSettings(prev => ({ ...prev, reminderDaysBefore: parseInt(e.target.value) }));

  return (
    <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] shadow-lg border border-slate-100 dark:border-slate-800 transition-all duration-500 hover:shadow-xl group">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 text-4xl group-hover:rotate-12 transition-transform">
             <i className="fa-solid fa-bell"></i>
           </div>
           <div>
             <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] font-heading mb-1.5">Alerts</h3>
             <span className="text-xl font-black text-slate-800 dark:text-white font-heading tracking-tight">Reminders</span>
           </div>
        </div>
        <button 
          onClick={handleToggle}
          className={`relative inline-flex h-9 w-18 shrink-0 cursor-pointer rounded-full border-4 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${settings.enabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
        >
          <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${settings.enabled ? 'translate-x-9' : 'translate-x-0'}`} />
        </button>
      </div>

      <div className={`space-y-8 transition-all duration-500 ${settings.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none grayscale'}`}>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase mb-3 tracking-widest font-heading text-center">Due Day</label>
            <select 
              value={settings.dueDay}
              onChange={handleDayChange}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-base font-black font-heading text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>{day}th Day</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase mb-3 tracking-widest font-heading text-center">Advance</label>
            <select 
              value={settings.reminderDaysBefore}
              onChange={handleLeadChange}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-base font-black font-heading text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer"
            >
              <option value={1}>1 Day</option>
              <option value={2}>2 Days</option>
              <option value={3}>3 Days</option>
              <option value={7}>1 Week</option>
            </select>
          </div>
        </div>

        <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-800/50">
          <p className="text-sm text-indigo-700 dark:text-indigo-300 font-black leading-relaxed text-center italic font-heading">
            "Alert scheduled for the {settings.dueDay}th and {settings.reminderDaysBefore} day(s) before."
          </p>
        </div>

        <button 
          onClick={checkReminder}
          className="w-full text-sm font-black py-5 px-8 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all uppercase tracking-[0.3em] font-heading active:scale-[0.98]"
        >
          Test Alarm
        </button>
      </div>

      {isRinging && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-8 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[4rem] p-16 max-w-xl w-full shadow-[0_32px_64px_rgba(0,0,0,0.3)] border border-indigo-100 dark:border-indigo-900 text-center animate-in zoom-in duration-300">
            <div className="w-32 h-32 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-10 text-6xl animate-bounce shadow-xl shadow-amber-500/20">
              <i className="fa-solid fa-bell"></i>
            </div>
            <h4 className="text-4xl font-black text-slate-900 dark:text-white mb-6 font-heading tracking-tight">Payment Due!</h4>
            <p className="text-slate-500 dark:text-slate-400 mb-10 text-xl font-medium leading-relaxed">
              EMI installment of <span className="font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(emiAmount)}</span> is coming up.
            </p>
            <button 
              onClick={() => setIsRinging(false)}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-black py-6 rounded-3xl hover:scale-[1.02] transition-all shadow-xl shadow-indigo-500/40 text-base uppercase tracking-widest font-heading"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReminderSection;
