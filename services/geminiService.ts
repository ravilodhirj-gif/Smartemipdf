
import { GoogleGenAI } from "@google/genai";
import { LoanData, EMIDetails } from '../types';
import { formatCurrency, calculateEligibility } from '../utils/calculations';

// Fix: Use API key directly from process.env as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getLoanInsights = async (loanData: LoanData, emiDetails: EMIDetails) => {
  try {
    const eligibility = calculateEligibility(loanData, emiDetails.emi);
    
    const prompt = `
      As a top-tier Indian financial strategist, provide a high-impact analysis of this profile:
      
      LOAN REQUEST:
      - Type: ${loanData.type.toUpperCase()} Loan
      - Principal: ${formatCurrency(loanData.amount)} @ ${loanData.interestRate}%
      - Tenure: ${loanData.tenure} years
      - New EMI: ${formatCurrency(emiDetails.emi)}
      
      FINANCIAL PROFILE:
      - Net Monthly Income: ${formatCurrency(loanData.monthlyIncome)}
      - Existing EMIs: ${formatCurrency(loanData.existingEMIs)}
      - Other Liabilities: ${formatCurrency(loanData.otherLiabilities)}
      - Total Obligations (incl. new EMI): ${formatCurrency(loanData.existingEMIs + loanData.otherLiabilities + emiDetails.emi)}
      - Fixed Obligation to Income Ratio (FOIR): ${eligibility.currentFOIR.toFixed(1)}%
      - Max Safe EMI Cap: ${formatCurrency(eligibility.maxEMICapacity)}
      
      Structure your response with:
      1. ELIGIBILITY VERDICT: Whether the bank would likely approve this based on the FOIR of ${eligibility.currentFOIR.toFixed(1)}%.
      2. RISK ANALYSIS: How this debt affects their liquidity.
      3. STRATEGIC MOVE: Should they proceed, increase tenure to lower EMI, or clear existing debts first?
      4. MARKET TIP: Specific context for ${loanData.type} loans in India today.
      
      Style: Professional, data-driven, encouraging, and razor-sharp. Use clean Markdown bullets.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Our AI strategist is currently recalculating. Please verify your inputs and try again shortly.";
  }
};
