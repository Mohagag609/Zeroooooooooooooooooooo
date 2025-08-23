import { prisma } from './prisma'
import { Decimal } from '@prisma/client/runtime/library'

export interface JournalLine {
  accountId: string
  debit: number
  credit: number
  projectId?: string
  clientId?: string
  supplierId?: string
}

export interface BalanceCheckResult {
  isBalanced: boolean
  totalDebit: number
  totalCredit: number
  difference: number
  error?: string
}

/**
 * التحقق من توازن القيد المحاسبي (مجموع المدين = مجموع الدائن)
 */
export function checkJournalBalance(lines: JournalLine[]): BalanceCheckResult {
  const totalDebit = lines.reduce((sum, line) => sum + line.debit, 0)
  const totalCredit = lines.reduce((sum, line) => sum + line.credit, 0)
  const difference = Math.abs(totalDebit - totalCredit)
  
  // التحقق من أن الفرق أقل من 0.01 (للتقريب)
  const isBalanced = difference < 0.01
  
  return {
    isBalanced,
    totalDebit,
    totalCredit,
    difference,
    error: !isBalanced ? `القيد غير متوازن: المدين ${totalDebit}، الدائن ${totalCredit}` : undefined
  }
}

/**
 * التحقق من صحة القيد قبل الحفظ
 */
export function validateJournalEntry(lines: JournalLine[]): void {
  // التحقق من وجود أسطر في القيد
  if (lines.length < 2) {
    throw new Error('يجب أن يحتوي القيد على سطرين على الأقل')
  }
  
  // التحقق من توازن القيد
  const balanceCheck = checkJournalBalance(lines)
  if (!balanceCheck.isBalanced) {
    throw new Error(balanceCheck.error!)
  }
  
  // التحقق من أن كل سطر إما مدين أو دائن (ليس كلاهما)
  for (const line of lines) {
    if (line.debit > 0 && line.credit > 0) {
      throw new Error(`السطر للحساب ${line.accountId} يحتوي على مدين ودائن معاً`)
    }
  }
}

/**
 * إنشاء قيد إيراد
 */
export function createRevenueEntry(
  amount: number,
  accountId: string,
  projectId?: string,
  clientId?: string
): JournalLine[] {
  const lines: JournalLine[] = []
  
  // إذا كان هناك عميل، نضع الإيراد في الذمم المدينة
  if (clientId) {
    lines.push({
      accountId: '1100', // الذمم المدينة
      debit: amount,
      credit: 0,
      projectId,
      clientId,
    })
  } else {
    // إذا كان نقدي، نضع الإيراد في النقدية أو البنك
    lines.push({
      accountId: '1000', // النقدية
      debit: amount,
      credit: 0,
      projectId,
    })
  }
  
  // دائن الإيراد
  lines.push({
    accountId,
    debit: 0,
    credit: amount,
    projectId,
  })
  
  return lines
}

/**
 * إنشاء قيد مصروف
 */
export function createExpenseEntry(
  amount: number,
  accountId: string,
  projectId?: string,
  supplierId?: string
): JournalLine[] {
  const lines: JournalLine[] = []
  
  // مدين المصروف
  lines.push({
    accountId,
    debit: amount,
    credit: 0,
    projectId,
  })
  
  // إذا كان هناك مورد، نضع المصروف في الذمم الدائنة
  if (supplierId) {
    lines.push({
      accountId: '2000', // الذمم الدائنة
      debit: 0,
      credit: amount,
      projectId,
      supplierId,
    })
  } else {
    // إذا كان نقدي، نضع المصروف في النقدية أو البنك
    lines.push({
      accountId: '1000', // النقدية
      debit: 0,
      credit: amount,
      projectId,
    })
  }
  
  return lines
}

/**
 * إنشاء قيد فاتورة عميل
 */
export function createClientInvoiceEntry(
  amount: number,
  projectId?: string,
  clientId?: string
): JournalLine[] {
  return [
    {
      accountId: '1100', // الذمم المدينة
      debit: amount,
      credit: 0,
      projectId,
      clientId,
    },
    {
      accountId: '4000', // إيرادات المبيعات
      debit: 0,
      credit: amount,
      projectId,
    }
  ]
}

/**
 * إنشاء قيد فاتورة مورد
 */
export function createSupplierInvoiceEntry(
  amount: number,
  projectId?: string,
  supplierId?: string
): JournalLine[] {
  return [
    {
      accountId: '5100', // تكاليف المشاريع
      debit: amount,
      credit: 0,
      projectId,
    },
    {
      accountId: '2000', // الذمم الدائنة
      debit: 0,
      credit: amount,
      projectId,
      supplierId,
    }
  ]
}

/**
 * إنشاء قيد تحصيل فاتورة عميل
 */
export function createClientPaymentEntry(
  amount: number,
  cashboxAccountId: string,
  projectId?: string,
  clientId?: string
): JournalLine[] {
  return [
    {
      accountId: cashboxAccountId,
      debit: amount,
      credit: 0,
      projectId,
    },
    {
      accountId: '1100', // الذمم المدينة
      debit: 0,
      credit: amount,
      projectId,
      clientId,
    }
  ]
}

/**
 * إنشاء قيد سداد فاتورة مورد
 */
export function createSupplierPaymentEntry(
  amount: number,
  cashboxAccountId: string,
  projectId?: string,
  supplierId?: string
): JournalLine[] {
  return [
    {
      accountId: '2000', // الذمم الدائنة
      debit: amount,
      credit: 0,
      projectId,
      supplierId,
    },
    {
      accountId: cashboxAccountId,
      debit: 0,
      credit: amount,
      projectId,
    }
  ]
}

/**
 * إنشاء قيد تحويل بين خزائن
 */
export function createTransferEntry(
  amount: number,
  fromCashboxAccountId: string,
  toCashboxAccountId: string,
  projectId?: string
): JournalLine[] {
  return [
    {
      accountId: toCashboxAccountId,
      debit: amount,
      credit: 0,
      projectId,
    },
    {
      accountId: fromCashboxAccountId,
      debit: 0,
      credit: amount,
      projectId,
    }
  ]
}

/**
 * إنشاء قيد حركة مواد خروج
 */
export function createMaterialOutEntry(
  amount: number,
  projectId: string
): JournalLine[] {
  return [
    {
      accountId: '5100', // تكاليف المشاريع
      debit: amount,
      credit: 0,
      projectId,
    },
    {
      accountId: '1200', // مخزون المواد
      debit: 0,
      credit: amount,
      projectId,
    }
  ]
}

/**
 * إنشاء قيد مرتب مستحق
 */
export function createPayrollAccrualEntry(
  amount: number,
  projectId?: string
): JournalLine[] {
  return [
    {
      accountId: '5100', // تكاليف المشاريع
      debit: amount,
      credit: 0,
      projectId,
    },
    {
      accountId: '2100', // أجور مستحقة
      debit: 0,
      credit: amount,
    }
  ]
}

/**
 * إنشاء قيد دفع مرتب
 */
export function createPayrollPaymentEntry(
  amount: number,
  cashboxAccountId: string
): JournalLine[] {
  return [
    {
      accountId: '2100', // أجور مستحقة
      debit: amount,
      credit: 0,
    },
    {
      accountId: cashboxAccountId,
      debit: 0,
      credit: amount,
    }
  ]
}

/**
 * إنشاء قيد تسوية شركاء
 */
export function createPartnerSettlementEntry(
  amount: number,
  fromPartnerWalletId: string,
  toPartnerWalletId: string,
  projectId: string
): JournalLine[] {
  return [
    {
      accountId: toPartnerWalletId,
      debit: amount,
      credit: 0,
      projectId,
    },
    {
      accountId: fromPartnerWalletId,
      debit: 0,
      credit: amount,
      projectId,
    }
  ]
}

/**
 * التحقق من رصيد الخزنة
 */
export async function checkCashboxBalance(cashboxId: string): Promise<number> {
  const cashbox = await prisma.cashbox.findUnique({
    where: { id: cashboxId },
    include: { account: true }
  })
  
  if (!cashbox) {
    throw new Error('الخزنة غير موجودة')
  }
  
  // حساب رصيد الخزنة من القيود
  const balance = await prisma.journalLine.aggregate({
    where: {
      accountId: cashbox.accountId
    },
    _sum: {
      debit: true,
      credit: true
    }
  })
  
  const totalDebit = balance._sum.debit || 0
  const totalCredit = balance._sum.credit || 0
  
  return Number(totalDebit - totalCredit)
}

/**
 * التحقق من رصيد العميل
 */
export async function checkClientBalance(clientId: string): Promise<number> {
  const balance = await prisma.journalLine.aggregate({
    where: {
      clientId: clientId,
      account: {
        code: '1100' // الذمم المدينة
      }
    },
    _sum: {
      debit: true,
      credit: true
    }
  })
  
  const totalDebit = balance._sum.debit || 0
  const totalCredit = balance._sum.credit || 0
  
  return Number(totalDebit - totalCredit)
}

/**
 * التحقق من رصيد المورد
 */
export async function checkSupplierBalance(supplierId: string): Promise<number> {
  const balance = await prisma.journalLine.aggregate({
    where: {
      supplierId: supplierId,
      account: {
        code: '2000' // الذمم الدائنة
      }
    },
    _sum: {
      debit: true,
      credit: true
    }
  })
  
  const totalDebit = balance._sum.debit || 0
  const totalCredit = balance._sum.credit || 0
  
  return Number(totalCredit - totalDebit) // المورد دائن
}

/**
 * التحقق من رصيد المشروع
 */
export async function checkProjectBalance(projectId: string): Promise<{
  revenue: number
  expense: number
  profit: number
}> {
  const revenue = await prisma.journalLine.aggregate({
    where: {
      projectId: projectId,
      account: {
        type: 'revenue'
      }
    },
    _sum: {
      credit: true
    }
  })
  
  const expense = await prisma.journalLine.aggregate({
    where: {
      projectId: projectId,
      account: {
        type: 'expense'
      }
    },
    _sum: {
      debit: true
    }
  })
  
  const totalRevenue = Number(revenue._sum.credit || 0)
  const totalExpense = Number(expense._sum.debit || 0)
  const profit = totalRevenue - totalExpense
  
  return {
    revenue: totalRevenue,
    expense: totalExpense,
    profit
  }
}