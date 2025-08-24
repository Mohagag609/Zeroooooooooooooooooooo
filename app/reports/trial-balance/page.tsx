'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatCurrency } from '@/lib/utils'
import { FileText, Download, Calendar, Calculator } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Define the Trial Balance type
interface TrialBalanceItem {
  id: string
  accountCode: string
  accountName: string
  accountType: string
  debitBalance: number
  creditBalance: number
  netBalance: number
  level: number
}

const columns: ColumnDef<TrialBalanceItem>[] = [
  {
    accessorKey: 'accountCode',
    header: 'رمز الحساب',
    cell: ({ row }) => (
      <div className="font-mono text-sm" style={{ paddingRight: `${row.original.level * 20}px` }}>
        {row.getValue('accountCode')}
      </div>
    ),
  },
  {
    accessorKey: 'accountName',
    header: 'اسم الحساب',
    cell: ({ row }) => (
      <div className="font-medium" style={{ paddingRight: `${row.original.level * 20}px` }}>
        {row.getValue('accountName')}
      </div>
    ),
  },
  {
    accessorKey: 'accountType',
    header: 'نوع الحساب',
    cell: ({ row }) => {
      const type = row.getValue('accountType') as string
      const typeConfig = {
        ASSET: { label: 'أصول', variant: 'default' as const },
        LIABILITY: { label: 'خصوم', variant: 'secondary' as const },
        EQUITY: { label: 'حقوق ملكية', variant: 'outline' as const },
        REVENUE: { label: 'إيرادات', variant: 'success' as const },
        EXPENSE: { label: 'مصروفات', variant: 'destructive' as const },
      }
      const config = typeConfig[type as keyof typeof typeConfig]
      return (
        <Badge variant={config.variant} className="text-xs">
          {config.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'debitBalance',
    header: 'مدين',
    cell: ({ row }) => {
      const debit = row.getValue('debitBalance') as number
      return (
        <div className="font-mono text-sm text-right">
          {debit > 0 ? formatCurrency(debit) : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'creditBalance',
    header: 'دائن',
    cell: ({ row }) => {
      const credit = row.getValue('creditBalance') as number
      return (
        <div className="font-mono text-sm text-right">
          {credit > 0 ? formatCurrency(credit) : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'netBalance',
    header: 'الرصيد',
    cell: ({ row }) => {
      const net = row.getValue('netBalance') as number
      const isPositive = net >= 0
      
      return (
        <div className={`font-mono text-sm font-medium text-right ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {formatCurrency(Math.abs(net))}
        </div>
      )
    },
  },
]

export default function TrialBalancePage() {
  const [trialBalance, setTrialBalance] = React.useState<TrialBalanceItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [asOfDate, setAsOfDate] = React.useState(new Date())

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchTrialBalance = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockTrialBalance: TrialBalanceItem[] = [
        // Assets
        {
          id: '1',
          accountCode: '1',
          accountName: 'الأصول',
          accountType: 'ASSET',
          debitBalance: 0,
          creditBalance: 0,
          netBalance: 0,
          level: 0,
        },
        {
          id: '2',
          accountCode: '11',
          accountName: 'الأصول المتداولة',
          accountType: 'ASSET',
          debitBalance: 0,
          creditBalance: 0,
          netBalance: 0,
          level: 1,
        },
        {
          id: '3',
          accountCode: '111',
          accountName: 'النقد وما في حكمه',
          accountType: 'ASSET',
          debitBalance: 0,
          creditBalance: 0,
          netBalance: 0,
          level: 2,
        },
        {
          id: '4',
          accountCode: '111001',
          accountName: 'الخزينة الرئيسية',
          accountType: 'ASSET',
          debitBalance: 150000,
          creditBalance: 0,
          netBalance: 150000,
          level: 3,
        },
        {
          id: '5',
          accountCode: '111002',
          accountName: 'البنك الأهلي',
          accountType: 'ASSET',
          debitBalance: 2500000,
          creditBalance: 0,
          netBalance: 2500000,
          level: 3,
        },
        {
          id: '6',
          accountCode: '112',
          accountName: 'المدينون',
          accountType: 'ASSET',
          debitBalance: 0,
          creditBalance: 0,
          netBalance: 0,
          level: 2,
        },
        {
          id: '7',
          accountCode: '112001',
          accountName: 'أرصدة العملاء',
          accountType: 'ASSET',
          debitBalance: 25000,
          creditBalance: 0,
          netBalance: 25000,
          level: 3,
        },
        // Liabilities
        {
          id: '8',
          accountCode: '2',
          accountName: 'الخصوم',
          accountType: 'LIABILITY',
          debitBalance: 0,
          creditBalance: 0,
          netBalance: 0,
          level: 0,
        },
        {
          id: '9',
          accountCode: '21',
          accountName: 'الخصوم المتداولة',
          accountType: 'LIABILITY',
          debitBalance: 0,
          creditBalance: 0,
          netBalance: 0,
          level: 1,
        },
        {
          id: '10',
          accountCode: '211',
          accountName: 'الدائنون',
          accountType: 'LIABILITY',
          debitBalance: 0,
          creditBalance: 0,
          netBalance: 0,
          level: 2,
        },
        {
          id: '11',
          accountCode: '211001',
          accountName: 'أرصدة الموردين',
          accountType: 'LIABILITY',
          debitBalance: 0,
          creditBalance: 45000,
          netBalance: -45000,
          level: 3,
        },
        // Equity
        {
          id: '12',
          accountCode: '3',
          accountName: 'حقوق الملكية',
          accountType: 'EQUITY',
          debitBalance: 0,
          creditBalance: 0,
          netBalance: 0,
          level: 0,
        },
        {
          id: '13',
          accountCode: '31',
          accountName: 'رأس المال',
          accountType: 'EQUITY',
          debitBalance: 0,
          creditBalance: 1000000,
          netBalance: -1000000,
          level: 1,
        },
        {
          id: '14',
          accountCode: '32',
          accountName: 'الأرباح المحتجزة',
          accountType: 'EQUITY',
          debitBalance: 0,
          creditBalance: 0,
          netBalance: 0,
          level: 1,
        },
        // Revenue
        {
          id: '15',
          accountCode: '4',
          accountName: 'الإيرادات',
          accountType: 'REVENUE',
          debitBalance: 0,
          creditBalance: 0,
          netBalance: 0,
          level: 0,
        },
        {
          id: '16',
          accountCode: '41',
          accountName: 'إيرادات المشاريع',
          accountType: 'REVENUE',
          debitBalance: 0,
          creditBalance: 1550000,
          netBalance: -1550000,
          level: 1,
        },
        // Expenses
        {
          id: '17',
          accountCode: '5',
          accountName: 'المصروفات',
          accountType: 'EXPENSE',
          debitBalance: 0,
          creditBalance: 0,
          netBalance: 0,
          level: 0,
        },
        {
          id: '18',
          accountCode: '51',
          accountName: 'مصروفات المواد',
          accountType: 'EXPENSE',
          debitBalance: 230000,
          creditBalance: 0,
          netBalance: 230000,
          level: 1,
        },
        {
          id: '19',
          accountCode: '52',
          accountName: 'مصروفات الأجور',
          accountType: 'EXPENSE',
          debitBalance: 25000,
          creditBalance: 0,
          netBalance: 25000,
          level: 1,
        },
        {
          id: '20',
          accountCode: '53',
          accountName: 'مصروفات إدارية',
          accountType: 'EXPENSE',
          debitBalance: 12000,
          creditBalance: 0,
          netBalance: 12000,
          level: 1,
        },
      ]
      
      setTrialBalance(mockTrialBalance)
      setLoading(false)
    }

    fetchTrialBalance()
  }, [asOfDate])

  // Calculate totals
  const totalDebit = trialBalance.reduce((sum, item) => sum + item.debitBalance, 0)
  const totalCredit = trialBalance.reduce((sum, item) => sum + item.creditBalance, 0)
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    console.log('Export trial balance:', format)
  }

  const handlePrint = () => {
    console.log('Print trial balance')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ميزان المراجعة</h1>
          <p className="text-muted-foreground">
            تقرير ميزان المراجعة حتى تاريخ محدد
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              حتى: {asOfDate.toLocaleDateString('ar-SA')}
            </span>
          </div>
          <Button variant="outline" onClick={() => setAsOfDate(new Date())}>
            تحديث التاريخ
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المدين</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDebit)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الدائن</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCredit)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حالة التوازن</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={isBalanced ? 'success' : 'destructive'}>
              {isBalanced ? 'متوازن' : 'غير متوازن'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={trialBalance}
        searchPlaceholder="البحث في الحسابات..."
        onExport={handleExport}
        onPrint={handlePrint}
        enableSelection={false}
        title="ميزان المراجعة"
        description={`حتى ${asOfDate.toLocaleDateString('ar-SA')}`}
        loading={loading}
        emptyMessage="لا توجد بيانات متاحة"
      />
    </motion.div>
  )
}