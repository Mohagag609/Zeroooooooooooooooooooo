'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatCurrency } from '@/lib/utils'
import { Building, Users, DollarSign, Calendar, Calculator } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Define the Balance Sheet type
interface BalanceSheetItem {
  id: string
  accountCode: string
  accountName: string
  accountType: 'ASSET' | 'LIABILITY' | 'EQUITY'
  currentBalance: number
  previousBalance: number
  change: number
  changePercentage: number
  level: number
}

const columns: ColumnDef<BalanceSheetItem>[] = [
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
    accessorKey: 'currentBalance',
    header: 'الرصيد الحالي',
    cell: ({ row }) => {
      const item = row.original
      const balance = row.getValue('currentBalance') as number
      const isAsset = item.accountType === 'ASSET'
      const isPositive = isAsset ? balance >= 0 : balance <= 0
      
      return (
        <div className={`font-mono text-sm text-right ${
          isAsset ? 'text-green-600' : 'text-red-600'
        }`}>
          {formatCurrency(Math.abs(balance))}
        </div>
      )
    },
  },
  {
    accessorKey: 'previousBalance',
    header: 'الرصيد السابق',
    cell: ({ row }) => {
      const item = row.original
      const balance = row.getValue('previousBalance') as number
      const isAsset = item.accountType === 'ASSET'
      
      return (
        <div className="font-mono text-sm text-right text-muted-foreground">
          {formatCurrency(Math.abs(balance))}
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

export default function BalanceSheetPage() {
  const [balanceSheet, setBalanceSheet] = React.useState<BalanceSheetItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [asOfDate, setAsOfDate] = React.useState(new Date('2024-03-31'))

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchBalanceSheet = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockBalanceSheet: BalanceSheetItem[] = [
        // Assets
        {
          id: '1',
          accountCode: '1',
          accountName: 'الأصول',
          accountType: 'ASSET',
          currentBalance: 0,
          previousBalance: 0,
          change: 0,
          changePercentage: 0,
          level: 0,
        },
        {
          id: '2',
          accountCode: '11',
          accountName: 'الأصول المتداولة',
          accountType: 'ASSET',
          currentBalance: 0,
          previousBalance: 0,
          change: 0,
          changePercentage: 0,
          level: 1,
        },
        {
          id: '3',
          accountCode: '111',
          accountName: 'النقد وما في حكمه',
          accountType: 'ASSET',
          currentBalance: 0,
          previousBalance: 0,
          change: 0,
          changePercentage: 0,
          level: 2,
        },
        {
          id: '4',
          accountCode: '111001',
          accountName: 'الخزينة الرئيسية',
          accountType: 'ASSET',
          currentBalance: 150000,
          previousBalance: 100000,
          change: 50000,
          changePercentage: 50.0,
          level: 3,
        },
        {
          id: '5',
          accountCode: '111002',
          accountName: 'البنك الأهلي',
          accountType: 'ASSET',
          currentBalance: 2500000,
          previousBalance: 2000000,
          change: 500000,
          changePercentage: 25.0,
          level: 3,
        },
        {
          id: '6',
          accountCode: '112',
          accountName: 'المدينون',
          accountType: 'ASSET',
          currentBalance: 0,
          previousBalance: 0,
          change: 0,
          changePercentage: 0,
          level: 2,
        },
        {
          id: '7',
          accountCode: '112001',
          accountName: 'أرصدة العملاء',
          accountType: 'ASSET',
          currentBalance: 25000,
          previousBalance: 15000,
          change: 10000,
          changePercentage: 66.7,
          level: 3,
        },
        {
          id: '8',
          accountCode: '12',
          accountName: 'الأصول الثابتة',
          accountType: 'ASSET',
          currentBalance: 0,
          previousBalance: 0,
          change: 0,
          changePercentage: 0,
          level: 1,
        },
        {
          id: '9',
          accountCode: '121',
          accountName: 'المعدات والسيارات',
          accountType: 'ASSET',
          currentBalance: 500000,
          previousBalance: 500000,
          change: 0,
          changePercentage: 0,
          level: 2,
        },
        // Liabilities
        {
          id: '10',
          accountCode: '2',
          accountName: 'الخصوم',
          accountType: 'LIABILITY',
          currentBalance: 0,
          previousBalance: 0,
          change: 0,
          changePercentage: 0,
          level: 0,
        },
        {
          id: '11',
          accountCode: '21',
          accountName: 'الخصوم المتداولة',
          accountType: 'LIABILITY',
          currentBalance: 0,
          previousBalance: 0,
          change: 0,
          changePercentage: 0,
          level: 1,
        },
        {
          id: '12',
          accountCode: '211',
          accountName: 'الدائنون',
          accountType: 'LIABILITY',
          currentBalance: 0,
          previousBalance: 0,
          change: 0,
          changePercentage: 0,
          level: 2,
        },
        {
          id: '13',
          accountCode: '211001',
          accountName: 'أرصدة الموردين',
          accountType: 'LIABILITY',
          currentBalance: -45000,
          previousBalance: -30000,
          change: -15000,
          changePercentage: -50.0,
          level: 3,
        },
        // Equity
        {
          id: '14',
          accountCode: '3',
          accountName: 'حقوق الملكية',
          accountType: 'EQUITY',
          currentBalance: 0,
          previousBalance: 0,
          change: 0,
          changePercentage: 0,
          level: 0,
        },
        {
          id: '15',
          accountCode: '31',
          accountName: 'رأس المال',
          accountType: 'EQUITY',
          currentBalance: -1000000,
          previousBalance: -1000000,
          change: 0,
          changePercentage: 0,
          level: 1,
        },
        {
          id: '16',
          accountCode: '32',
          accountName: 'الأرباح المحتجزة',
          accountType: 'EQUITY',
          currentBalance: -1325000,
          previousBalance: -1015000,
          change: -310000,
          changePercentage: -30.5,
          level: 1,
        },
      ]
      
      setBalanceSheet(mockBalanceSheet)
      setLoading(false)
    }

    fetchBalanceSheet()
  }, [asOfDate])

  // Calculate totals
  const totalAssets = balanceSheet
    .filter(item => item.accountType === 'ASSET' && item.currentBalance > 0)
    .reduce((sum, item) => sum + item.currentBalance, 0)
  
  const totalLiabilities = balanceSheet
    .filter(item => item.accountType === 'LIABILITY' && item.currentBalance < 0)
    .reduce((sum, item) => sum + Math.abs(item.currentBalance), 0)
  
  const totalEquity = balanceSheet
    .filter(item => item.accountType === 'EQUITY' && item.currentBalance < 0)
    .reduce((sum, item) => sum + Math.abs(item.currentBalance), 0)
  
  const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    console.log('Export balance sheet:', format)
  }

  const handlePrint = () => {
    console.log('Print balance sheet')
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
          <h1 className="text-3xl font-bold">الميزانية العمومية</h1>
          <p className="text-muted-foreground">
            تقرير الميزانية العمومية حتى تاريخ محدد
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأصول</CardTitle>
            <Building className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalAssets)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الخصوم</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalLiabilities)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حقوق الملكية</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalEquity)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حالة التوازن</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
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
        data={balanceSheet}
        searchPlaceholder="البحث في الحسابات..."
        onExport={handleExport}
        onPrint={handlePrint}
        enableSelection={false}
        title="الميزانية العمومية"
        description={`حتى ${asOfDate.toLocaleDateString('ar-SA')}`}
        loading={loading}
        emptyMessage="لا توجد بيانات متاحة"
      />
    </motion.div>
  )
}