'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, Calendar, Calculator } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Define the Income Statement type
interface IncomeStatementItem {
  id: string
  accountCode: string
  accountName: string
  accountType: 'REVENUE' | 'EXPENSE' | 'GROSS_PROFIT' | 'NET_INCOME'
  currentPeriod: number
  previousPeriod: number
  change: number
  changePercentage: number
  level: number
}

const columns: ColumnDef<IncomeStatementItem>[] = [
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
    accessorKey: 'currentPeriod',
    header: 'الفترة الحالية',
    cell: ({ row }) => {
      const item = row.original
      const amount = row.getValue('currentPeriod') as number
      const isRevenue = item.accountType === 'REVENUE'
      const isPositive = isRevenue ? amount >= 0 : amount <= 0
      
      return (
        <div className={`font-mono text-sm text-right ${
          isRevenue ? 'text-green-600' : 'text-red-600'
        }`}>
          {formatCurrency(Math.abs(amount))}
        </div>
      )
    },
  },
  {
    accessorKey: 'previousPeriod',
    header: 'الفترة السابقة',
    cell: ({ row }) => {
      const item = row.original
      const amount = row.getValue('previousPeriod') as number
      const isRevenue = item.accountType === 'REVENUE'
      
      return (
        <div className={`font-mono text-sm text-right text-muted-foreground`}>
          {formatCurrency(Math.abs(amount))}
        </div>
      )
    },
  },
  {
    accessorKey: 'change',
    header: 'التغير',
    cell: ({ row }) => {
      const change = row.getValue('change') as number
      const isPositive = change >= 0
      
      return (
        <div className={`font-mono text-sm text-right ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? '+' : ''}{formatCurrency(change)}
        </div>
      )
    },
  },
  {
    accessorKey: 'changePercentage',
    header: 'نسبة التغير',
    cell: ({ row }) => {
      const percentage = row.getValue('changePercentage') as number
      const isPositive = percentage >= 0
      
      return (
        <div className={`font-mono text-sm text-right ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? '+' : ''}{percentage.toFixed(1)}%
        </div>
      )
    },
  },
]

export default function IncomeStatementPage() {
  const [incomeStatement, setIncomeStatement] = React.useState<IncomeStatementItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [startDate, setStartDate] = React.useState(new Date('2024-01-01'))
  const [endDate, setEndDate] = React.useState(new Date('2024-03-31'))

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchIncomeStatement = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockIncomeStatement: IncomeStatementItem[] = [
        // Revenue
        {
          id: '1',
          accountCode: '4',
          accountName: 'الإيرادات',
          accountType: 'REVENUE',
          currentPeriod: 0,
          previousPeriod: 0,
          change: 0,
          changePercentage: 0,
          level: 0,
        },
        {
          id: '2',
          accountCode: '41',
          accountName: 'إيرادات المشاريع',
          accountType: 'REVENUE',
          currentPeriod: 1550000,
          previousPeriod: 1200000,
          change: 350000,
          changePercentage: 29.2,
          level: 1,
        },
        {
          id: '3',
          accountCode: '42',
          accountName: 'إيرادات أخرى',
          accountType: 'REVENUE',
          currentPeriod: 50000,
          previousPeriod: 30000,
          change: 20000,
          changePercentage: 66.7,
          level: 1,
        },
        // Total Revenue
        {
          id: '4',
          accountCode: '',
          accountName: 'إجمالي الإيرادات',
          accountType: 'REVENUE',
          currentPeriod: 1600000,
          previousPeriod: 1230000,
          change: 370000,
          changePercentage: 30.1,
          level: 0,
        },
        // Expenses
        {
          id: '5',
          accountCode: '5',
          accountName: 'المصروفات',
          accountType: 'EXPENSE',
          currentPeriod: 0,
          previousPeriod: 0,
          change: 0,
          changePercentage: 0,
          level: 0,
        },
        {
          id: '6',
          accountCode: '51',
          accountName: 'مصروفات المواد',
          accountType: 'EXPENSE',
          currentPeriod: -230000,
          previousPeriod: -180000,
          change: -50000,
          changePercentage: -27.8,
          level: 1,
        },
        {
          id: '7',
          accountCode: '52',
          accountName: 'مصروفات الأجور',
          accountType: 'EXPENSE',
          currentPeriod: -25000,
          previousPeriod: -20000,
          change: -5000,
          changePercentage: -25.0,
          level: 1,
        },
        {
          id: '8',
          accountCode: '53',
          accountName: 'مصروفات إدارية',
          accountType: 'EXPENSE',
          currentPeriod: -12000,
          previousPeriod: -10000,
          change: -2000,
          changePercentage: -20.0,
          level: 1,
        },
        {
          id: '9',
          accountCode: '54',
          accountName: 'مصروفات أخرى',
          accountType: 'EXPENSE',
          currentPeriod: -8000,
          previousPeriod: -5000,
          change: -3000,
          changePercentage: -60.0,
          level: 1,
        },
        // Total Expenses
        {
          id: '10',
          accountCode: '',
          accountName: 'إجمالي المصروفات',
          accountType: 'EXPENSE',
          currentPeriod: -275000,
          previousPeriod: -215000,
          change: -60000,
          changePercentage: -27.9,
          level: 0,
        },
        // Net Income
        {
          id: '11',
          accountCode: '',
          accountName: 'صافي الدخل',
          accountType: 'NET_INCOME',
          currentPeriod: 1325000,
          previousPeriod: 1015000,
          change: 310000,
          changePercentage: 30.5,
          level: 0,
        },
      ]
      
      setIncomeStatement(mockIncomeStatement)
      setLoading(false)
    }

    fetchIncomeStatement()
  }, [startDate, endDate])

  // Calculate totals
  const totalRevenue = incomeStatement
    .filter(item => item.accountType === 'REVENUE' && item.currentPeriod > 0)
    .reduce((sum, item) => sum + item.currentPeriod, 0)
  
  const totalExpenses = incomeStatement
    .filter(item => item.accountType === 'EXPENSE' && item.currentPeriod < 0)
    .reduce((sum, item) => sum + Math.abs(item.currentPeriod), 0)
  
  const netIncome = totalRevenue - totalExpenses

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    console.log('Export income statement:', format)
  }

  const handlePrint = () => {
    console.log('Print income statement')
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
          <h1 className="text-3xl font-bold">قائمة الدخل</h1>
          <p className="text-muted-foreground">
            تقرير قائمة الدخل للفترة المحددة
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              من: {startDate.toLocaleDateString('ar-SA')} إلى: {endDate.toLocaleDateString('ar-SA')}
            </span>
          </div>
          <Button variant="outline" onClick={() => {
            setStartDate(new Date('2024-01-01'))
            setEndDate(new Date('2024-03-31'))
          }}>
            تحديث الفترة
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المصروفات</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">صافي الدخل</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              netIncome >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(Math.abs(netIncome))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الربحية</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue > 0 ? ((netIncome / totalRevenue) * 100).toFixed(1) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={incomeStatement}
        searchPlaceholder="البحث في الحسابات..."
        onExport={handleExport}
        onPrint={handlePrint}
        enableSelection={false}
        title="قائمة الدخل"
        description={`من ${startDate.toLocaleDateString('ar-SA')} إلى ${endDate.toLocaleDateString('ar-SA')}`}
        loading={loading}
        emptyMessage="لا توجد بيانات متاحة"
      />
    </motion.div>
  )
}