
export type LoanType = 'home' | 'personal' | 'general' | 'car';

export interface LoanData {
  amount: number;
  interestRate: number;
  tenure: number; // in years
  type: LoanType;
  monthlyIncome: number;
  existingEMIs: number;
  otherLiabilities: number;
  processingFeeRate: number; // percentage
  insuranceCharges: number;
  rtoCharges: number;
  firstEmiDate: string; // ISO date string
}

export interface ReminderSettings {
  enabled: boolean;
  dueDay: number;
  reminderDaysBefore: number;
  soundEnabled: boolean;
}

export interface EMIDetails {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  netDisbursement: number;
  totalUpfrontDeductions: number;
  firstEmiDateFormatted: string;
  amortizationSchedule: AmortizationEntry[];
}

export interface AmortizationEntry {
  month: number;
  date: string;
  beginningBalance: number;
  emi: number;
  principal: number;
  interest: number;
  endingBalance: number;
}

export interface EligibilityResult {
  isEligible: boolean;
  maxEMICapacity: number;
  currentFOIR: number;
  status: 'excellent' | 'good' | 'risky' | 'rejected';
}
