import { z } from 'zod';

const accountType = z.enum(['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE']);
const voucherType = z.enum(['JOURNAL', 'PAYMENT', 'RECEIPT', 'EXPENSE', 'CREDIT_NOTE', 'DEBIT_NOTE', 'CONTRA', 'OPENING', 'CLOSING']);
const incomeType = z.enum(['ROOM_REVENUE', 'FNB_REVENUE', 'EVENT_REVENUE', 'OTHER_REVENUE', 'SERVICE_CHARGE', 'MISCELLANEOUS']);
const gstType = z.enum(['CGST', 'SGST', 'IGST', 'CESS', 'REVERSE_CHARGE']);

export const createJournalEntrySchema = z.object({
  entryDate: z.string().optional(),
  description: z.string().optional(),
  voucherType: voucherType.default('JOURNAL'),
  reference: z.string().max(100).optional(),
  costCenterId: z.string().uuid().optional(),
  sourceModule: z.string().max(50).optional(),
  sourceId: z.string().uuid().optional(),
  lines: z.array(z.object({
    accountId: z.string().uuid(),
    debit: z.coerce.number().min(0).default(0),
    credit: z.coerce.number().min(0).default(0),
    description: z.string().max(500).optional(),
  })).min(2),
});

export const createExpenseSchema = z.object({
  categoryId: z.string().uuid(),
  accountId: z.string().uuid().optional(),
  costCenterId: z.string().uuid().optional(),
  amount: z.coerce.number().positive(),
  gstAmount: z.coerce.number().min(0).default(0),
  tdsAmount: z.coerce.number().min(0).default(0),
  description: z.string().optional(),
  department: z.string().max(100).optional(),
  vendorName: z.string().max(255).optional(),
  expenseDate: z.string().optional(),
});

export const createIncomeSchema = z.object({
  accountId: z.string().uuid().optional(),
  type: incomeType,
  amount: z.coerce.number().positive(),
  description: z.string().optional(),
  reference: z.string().max(100).optional(),
  incomeDate: z.string().optional(),
  sourceModule: z.string().max(50).optional(),
});

export const createBankAccountSchema = z.object({
  name: z.string().min(1).max(255),
  bankName: z.string().max(255).optional(),
  accountNumber: z.string().max(50).optional(),
  ifscCode: z.string().max(20).optional(),
  type: z.enum(['CURRENT', 'SAVINGS', 'CASH', 'PETTY_CASH', 'UPI_WALLET']).default('CURRENT'),
  openingBalance: z.coerce.number().default(0),
  accountId: z.string().uuid().optional(),
});

export const createBudgetSchema = z.object({
  name: z.string().min(1).max(255),
  fiscalYear: z.coerce.number().int(),
  budgetAmount: z.coerce.number().positive(),
  costCenterId: z.string().uuid().optional(),
  category: z.string().max(100).optional(),
});

export const createCostCenterSchema = z.object({
  code: z.string().min(1).max(30),
  name: z.string().min(1).max(100),
  department: z.string().max(100).optional(),
  description: z.string().optional(),
});

export const createCashTransactionSchema = z.object({
  type: z.enum(['COLLECTION', 'DEPOSIT', 'WITHDRAWAL', 'PETTY_CASH', 'RECONCILIATION']),
  amount: z.coerce.number().positive(),
  description: z.string().optional(),
  counterName: z.string().max(100).optional(),
});

export const createGstEntrySchema = z.object({
  gstType: gstType,
  taxableAmount: z.coerce.number().min(0),
  gstAmount: z.coerce.number().min(0),
  gstRate: z.coerce.number().min(0).max(100).default(0),
  hsnSac: z.string().max(20).optional(),
  isOutput: z.boolean().default(true),
  reference: z.string().max(100).optional(),
});

export const postJournalSchema = z.object({
  entryId: z.string().uuid(),
});

export type CreateJournalEntrySchema = z.infer<typeof createJournalEntrySchema>;
export type CreateExpenseSchema = z.infer<typeof createExpenseSchema>;
export type CreateIncomeSchema = z.infer<typeof createIncomeSchema>;
export type CreateBankAccountSchema = z.infer<typeof createBankAccountSchema>;
export type CreateBudgetSchema = z.infer<typeof createBudgetSchema>;
export type CreateCostCenterSchema = z.infer<typeof createCostCenterSchema>;
export type CreateCashTransactionSchema = z.infer<typeof createCashTransactionSchema>;
export type CreateGstEntrySchema = z.infer<typeof createGstEntrySchema>;
export type PostJournalSchema = z.infer<typeof postJournalSchema>;
