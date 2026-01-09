import React, { useState } from 'react';
import { LoanData, EMIDetails } from '../types';
import { formatCurrency } from '../utils/calculations';

interface ContactSectionProps {
  loanData?: LoanData;
  emiDetails?: EMIDetails;
}

const ContactSection: React.FC<ContactSectionProps> = ({ loanData, emiDetails }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // Add loan details to form data if available
    if (loanData && emiDetails) {
      formData.append('Calculated Loan Type', loanData.type);
      formData.append('Calculated Loan Amount', formatCurrency(loanData.amount));
      formData.append('Calculated Interest Rate', `${loanData.interestRate}%`);
      formData.append('Calculated Tenure', `${loanData.tenure} Years`);
      formData.append('Calculated Monthly EMI', formatCurrency(emiDetails.emi));
      formData.append('Borrower Monthly Income', formatCurrency(loanData.monthlyIncome));
    }

    try {
      const response = await fetch('https://formspree.io/f/mgoowawn', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const data = await response.json();
        if (data.errors) {
          setError(data.errors.map((err: any) => err.message).join(', '));
        } else {
          setError("Oops! There was a problem submitting your form.");
        }
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div id="contact" className="mt-12 bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800 shadow-sm transition-all animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          <i className="fa-solid fa-check"></i>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Message Sent Successfully!</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Thank you for reaching out. One of our financial advisors will get back to you within 24 hours.</p>
        <button 
          onClick={() => setIsSubmitted(false)}
          className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div id="contact" className="mt-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Contact Info Sidebar */}
        <div className="bg-indigo-600 dark:bg-indigo-900 p-8 lg:p-12 text-white">
          <h3 className="text-3xl font-bold mb-6">Contact Us</h3>
          <p className="text-indigo-100 mb-10 text-lg">
            Have questions about your calculation or need personalized financial advice? Our team is here to help.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-indigo-200">Email Us</p>
                <p className="text-lg">support@smartemi.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-indigo-200">Our Office</p>
                <p className="text-lg">Financial District, New York, NY</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-clock"></i>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-indigo-200">Working Hours</p>
                <p className="text-lg">Mon - Fri: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">AI Priority Support Active</span>
            </div>
            <p className="text-sm text-indigo-100">Our Smart Assistant will help route your request to the right specialist instantly.</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                <input 
                  required
                  name="name"
                  type="text" 
                  placeholder="John Doe"
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  required
                  name="email"
                  type="email" 
                  placeholder="john@example.com"
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Message</label>
              <textarea 
                required
                name="message"
                rows={4}
                placeholder="How can we help you today?"
                className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              ></textarea>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-bold">
                <i className="fa-solid fa-circle-exclamation mr-2"></i>
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i>
                  Send Message
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-400 dark:text-slate-500">
              By sending this message, you agree to our privacy policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;