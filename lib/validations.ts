import { z } from 'zod'

// Client Schema
export const clientSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  phone: z.string().optional(),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  note: z.string().optional(),
})

export type ClientFormData = z.infer<typeof clientSchema>

// Supplier Schema
export const supplierSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  phone: z.string().optional(),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  address: z.string().optional(),
  taxId: z.string().optional(),
  note: z.string().optional(),
})

export type SupplierFormData = z.infer<typeof supplierSchema>

// Project Schema
export const projectSchema = z.object({
  code: z.string().min(2, 'الكود يجب أن يكون على الأقل حرفين'),
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  status: z.enum(['active', 'paused', 'closed']),
  startDate: z.date(),
  endDate: z.date().optional(),
  budget: z.number().positive('الميزانية يجب أن تكون موجبة').optional(),
  clientId: z.string().optional(),
})

export type ProjectFormData = z.infer<typeof projectSchema>

// Project Phase Schema
export const projectPhaseSchema = z.object({
  projectId: z.string(),
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  progress: z.number().min(0).max(100).optional(),
})

export type ProjectPhaseFormData = z.infer<typeof projectPhaseSchema>

// Material Schema
export const materialSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  unit: z.string().min(1, 'الوحدة مطلوبة'),
  defaultUnitCost: z.number().positive('التكلفة يجب أن تكون موجبة').optional(),
})

export type MaterialFormData = z.infer<typeof materialSchema>

// Warehouse Schema
export const warehouseSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  location: z.string().optional(),
})

export type WarehouseFormData = z.infer<typeof warehouseSchema>

// Material Move Schema
export const materialMoveSchema = z.object({
  projectId: z.string(),
  materialId: z.string(),
  type: z.enum(['in', 'out', 'adjust']),
  qty: z.number().positive('الكمية يجب أن تكون موجبة'),
  unitCost: z.number().positive('التكلفة يجب أن تكون موجبة'),
  date: z.date(),
  note: z.string().optional(),
  phaseId: z.string().optional(),
  fromWarehouseId: z.string().optional(),
  toWarehouseId: z.string().optional(),
})

export type MaterialMoveFormData = z.infer<typeof materialMoveSchema>

// Revenue Schema
export const revenueSchema = z.object({
  date: z.date(),
  amount: z.number().positive('المبلغ يجب أن يكون موجب'),
  projectId: z.string().optional(),
  clientId: z.string().optional(),
  phaseId: z.string().optional(),
  accountId: z.string(),
  note: z.string().optional(),
})

export type RevenueFormData = z.infer<typeof revenueSchema>

// Expense Schema
export const expenseSchema = z.object({
  date: z.date(),
  amount: z.number().positive('المبلغ يجب أن يكون موجب'),
  projectId: z.string().optional(),
  supplierId: z.string().optional(),
  phaseId: z.string().optional(),
  accountId: z.string(),
  note: z.string().optional(),
})

export type ExpenseFormData = z.infer<typeof expenseSchema>

// Invoice Schema
export const invoiceSchema = z.object({
  number: z.string().min(2, 'رقم الفاتورة يجب أن يكون على الأقل حرفين'),
  date: z.date(),
  dueDate: z.date().optional(),
  projectId: z.string().optional(),
  clientId: z.string().optional(),
  supplierId: z.string().optional(),
  total: z.number().positive('المجموع يجب أن يكون موجب'),
  status: z.enum(['draft', 'posted', 'paid', 'partial']),
  note: z.string().optional(),
})

export type InvoiceFormData = z.infer<typeof invoiceSchema>

// Cashbox Schema
export const cashboxSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  type: z.enum(['cash', 'bank']),
  code: z.string().min(2, 'الكود يجب أن يكون على الأقل حرفين'),
  accountId: z.string(),
  branch: z.string().optional(),
})

export type CashboxFormData = z.infer<typeof cashboxSchema>

// Transfer Schema
export const transferSchema = z.object({
  fromSafeId: z.string(),
  toSafeId: z.string(),
  amount: z.number().positive('المبلغ يجب أن يكون موجب'),
  date: z.date(),
  description: z.string().optional(),
}).refine((data) => data.fromSafeId !== data.toSafeId, {
  message: 'لا يمكن التحويل لنفس الخزنة',
  path: ['toSafeId'],
})

export type TransferFormData = z.infer<typeof transferSchema>

// Employee Schema
export const employeeSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  nationalId: z.string().optional(),
  role: z.string().optional(),
  baseSalary: z.number().positive('الراتب الأساسي يجب أن يكون موجب').optional(),
})

export type EmployeeFormData = z.infer<typeof employeeSchema>

// Payroll Schema
export const payrollSchema = z.object({
  employeeId: z.string(),
  projectId: z.string().optional(),
  phaseId: z.string().optional(),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'الشهر يجب أن يكون بصيغة YYYY-MM'),
  gross: z.number().positive('الراتب الإجمالي يجب أن يكون موجب'),
  deductions: z.number().min(0, 'الخصومات يجب أن تكون موجبة أو صفر').default(0),
  net: z.number().positive('الراتب الصافي يجب أن يكون موجب'),
  paid: z.boolean().default(false),
  date: z.date().optional(),
})

export type PayrollFormData = z.infer<typeof payrollSchema>

// Partner Schema
export const partnerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  phone: z.string().optional(),
  note: z.string().optional(),
})

export type PartnerFormData = z.infer<typeof partnerSchema>

// Project Partner Schema
export const projectPartnerSchema = z.object({
  projectId: z.string(),
  partnerId: z.string(),
  sharePct: z.number().min(0).max(100, 'نسبة المشاركة يجب أن تكون بين 0 و 100'),
  walletId: z.string(),
  previousCarry: z.number().default(0),
})

export type ProjectPartnerFormData = z.infer<typeof projectPartnerSchema>

// Settlement Schema
export const settlementSchema = z.object({
  projectId: z.string(),
  date: z.date(),
  note: z.string().optional(),
})

export type SettlementFormData = z.infer<typeof settlementSchema>

// Settlement Line Schema
export const settlementLineSchema = z.object({
  settlementId: z.string(),
  fromPartnerId: z.string(),
  toPartnerId: z.string(),
  amount: z.number().positive('المبلغ يجب أن يكون موجب'),
}).refine((data) => data.fromPartnerId !== data.toPartnerId, {
  message: 'لا يمكن التحويل لنفس الشريك',
  path: ['toPartnerId'],
})

export type SettlementLineFormData = z.infer<typeof settlementLineSchema>

// Account Schema
export const accountSchema = z.object({
  code: z.string().min(2, 'الكود يجب أن يكون على الأقل حرفين'),
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  type: z.enum(['asset', 'liability', 'equity', 'revenue', 'expense']),
  parentId: z.string().optional(),
})

export type AccountFormData = z.infer<typeof accountSchema>

// Journal Entry Schema
export const journalEntrySchema = z.object({
  date: z.date(),
  ref: z.string().optional(),
  description: z.string().optional(),
  projectId: z.string().optional(),
  posted: z.boolean().default(true),
  reversedId: z.string().optional(),
})

export type JournalEntryFormData = z.infer<typeof journalEntrySchema>

// Journal Line Schema
export const journalLineSchema = z.object({
  entryId: z.string(),
  accountId: z.string(),
  debit: z.number().min(0, 'المدين يجب أن يكون موجب أو صفر').default(0),
  credit: z.number().min(0, 'الدائن يجب أن يكون موجب أو صفر').default(0),
  projectId: z.string().optional(),
  clientId: z.string().optional(),
  supplierId: z.string().optional(),
}).refine((data) => data.debit === 0 || data.credit === 0, {
  message: 'لا يمكن أن يكون المدين والدائن موجبين في نفس الوقت',
  path: ['credit'],
})

export type JournalLineFormData = z.infer<typeof journalLineSchema>

// Search Schema
export const searchSchema = z.object({
  query: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type SearchParams = z.infer<typeof searchSchema>

// Date Range Schema
export const dateRangeSchema = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
})

export type DateRange = z.infer<typeof dateRangeSchema>

// Filter Schema
export const filterSchema = z.object({
  status: z.string().optional(),
  projectId: z.string().optional(),
  clientId: z.string().optional(),
  supplierId: z.string().optional(),
  phaseId: z.string().optional(),
  dateRange: dateRangeSchema.optional(),
})

export type FilterParams = z.infer<typeof filterSchema>