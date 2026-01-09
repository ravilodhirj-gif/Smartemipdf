
import { LoanData, EMIDetails, AmortizationEntry, EligibilityResult } from '../types';

export const calculateEMI = (data: LoanData): EMIDetails => {
  const { amount, interestRate, tenure, processingFeeRate, insuranceCharges, rtoCharges, firstEmiDate } = data;
  const monthlyRate = interestRate / 12 / 100;
  const numberOfMonths = tenure * 12;

  // EMI formula: [P x R x (1+R)^N]/[(1+R)^N-1]
  const emi = 
    (amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) / 
    (Math.pow(1 + monthlyRate, numberOfMonths) - 1);

  const totalPayment = emi * numberOfMonths;
  const totalInterest = totalPayment - amount;

  // Upfront deductions
  const processingFeeAmt = (amount * processingFeeRate) / 100;
  const totalUpfrontDeductions = processingFeeAmt + insuranceCharges + rtoCharges;
  const netDisbursement = amount - totalUpfrontDeductions;

  const amortizationSchedule: AmortizationEntry[] = [];
  let remainingBalance = amount;
  
  const startDate = new Date(firstEmiDate || new Date());

  for (let i = 1; i <= numberOfMonths; i++) {
    const interest = remainingBalance * monthlyRate;
    const principal = emi - interest;
    const beginningBalance = remainingBalance;
    remainingBalance -= principal;

    const currentDate = new Date(startDate);
    currentDate.setMonth(startDate.getMonth() + (i - 1));

    amortizationSchedule.push({
      month: i,
      date: currentDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      beginningBalance,
      emi,
      principal,
      interest,
      endingBalance: Math.max(0, remainingBalance),
    });
  }

  return {
    emi,
    totalInterest,
    totalPayment,
    netDisbursement,
    totalUpfrontDeductions,
    firstEmiDateFormatted: startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    amortizationSchedule,
  };
};

export const calculateEligibility = (data: LoanData, newEMI: number): EligibilityResult => {
  const totalObligations = data.existingEMIs + data.otherLiabilities + newEMI;
  const currentFOIR = (totalObligations / data.monthlyIncome) * 100;
  
  const maxEMICapacity = (data.monthlyIncome * 0.5) - data.existingEMIs - data.otherLiabilities;
  
  let status: EligibilityResult['status'] = 'rejected';
  if (currentFOIR <= 35) status = 'excellent';
  else if (currentFOIR <= 50) status = 'good';
  else if (currentFOIR <= 65) status = 'risky';

  return {
    isEligible: currentFOIR <= 60,
    maxEMICapacity: Math.max(0, maxEMICapacity),
    currentFOIR,
    status
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};
