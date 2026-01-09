
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LoanData, EMIDetails } from '../types';
import { formatCurrency } from './calculations';

export const generateLoanPDF = (loanData: LoanData, emiDetails: EMIDetails) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(79, 70, 229); // Indigo 600
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('SmartEMI Loan Report (₹)', 15, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 15, 25, { align: 'right' });

  // Section: Loan Summary
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Loan Summary', 15, 55);

  const summaryData = [
    ['Loan Amount', formatCurrency(loanData.amount)],
    ['Interest Rate', `${loanData.interestRate}%`],
    ['Tenure', `${loanData.tenure} Years (${loanData.tenure * 12} Months)`],
    ['Monthly EMI', formatCurrency(emiDetails.emi)],
    ['Total Interest', formatCurrency(emiDetails.totalInterest)],
    ['Total Payment', formatCurrency(emiDetails.totalPayment)]
  ];

  autoTable(doc, {
    startY: 60,
    head: [['Description', 'Value']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] },
    margin: { left: 15, right: 15 }
  });

  // Section: Amortization Schedule
  const finalY = (doc as any).lastAutoTable.cursor.y || 120;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Repayment Schedule', 15, finalY + 15);

  const scheduleData = emiDetails.amortizationSchedule.map(row => [
    row.month.toString(),
    formatCurrency(row.beginningBalance),
    formatCurrency(row.emi),
    formatCurrency(row.principal),
    formatCurrency(row.interest),
    formatCurrency(row.endingBalance)
  ]);

  autoTable(doc, {
    startY: finalY + 20,
    head: [['Month', 'Beg. Bal.', 'EMI', 'Principal', 'Interest', 'End. Bal.']],
    body: scheduleData,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229], fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 15 },
    },
    margin: { left: 15, right: 15, bottom: 20 }
  });

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(`Page ${i} of ${pageCount} - SmartEMI Calculator (India)`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }

  doc.save(`SmartEMI_Report_${loanData.amount}_${new Date().getTime()}.pdf`);
};
