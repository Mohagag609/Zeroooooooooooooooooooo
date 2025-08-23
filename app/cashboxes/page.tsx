'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Eye, Edit, Trash2, Plus, Wallet, Building2, TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'

// Define the Cashbox type based on our Prisma schema
interface Cashbox {
  id: string
  name: string
  code: string
  type: 'CASH' | 'BANK'
  accountNumber: string | null
  bankName: string | null
  balance: number
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: Date
  _count: {
    transfers: number
    journalLines: number
  }
}

const columns: ColumnDef<Cashbox>[] = [
  {
    accessorKey: 'code',
    header: 'الرمز',
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium">{row.getValue('code')}</div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'اسم الخزينة/البنك',
    cell: ({ row }) => {
      const cashbox = row.original
      return (
        <div className="flex items-center gap-2">
          {cashbox.type === 'BANK' ? (
            <Building2 className="h-4 w-4 text-blue-600" />
          ) : (
            <Wallet className="h-4 w-4 text-green-600" />
          )}
          <div className="flex flex-col">
            <div className="font-medium">{cashbox.name}</div>
            {cashbox.bankName && (
              <div className="text-sm text-muted-foreground">{cashbox.bankName}</div>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'type',
    header: 'النوع',
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      return (
        <Badge variant={type === 'BANK' ? 'default' : 'secondary'}>
          {type === 'BANK' ? 'بنك' : 'خزينة'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'accountNumber',
    header: 'رقم الحساب',
    cell: ({ row }) => {
      const accountNumber = row.getValue('accountNumber') as string
      return accountNumber ? (
        <div className="font-mono text-sm">{accountNumber}</div>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: 'balance',
    header: 'الرصيد الحالي',
    cell: ({ row }) => {
      const balance = row.getValue('balance') as number
      const isPositive = balance >= 0
      
      return (
        <div className="flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="h-3 w-3 text-green-600" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-600" />
          )}
          <div className={`font-mono text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(Math.abs(balance))}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'الحالة',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant={status === 'ACTIVE' ? 'success' : 'secondary'}>
          {status === 'ACTIVE' ? 'نشط' : 'غير نشط'}
        </Badge>
      )
    },
  },
  {
    accessorKey: '_count.transfers',
    header: 'التحويلات',
    cell: ({ row }) => {
      const count = row.original._count.transfers
      return (
        <Badge variant="outline" className="font-mono">
          {count}
        </Badge>
      )
    },
  },
  {
    accessorKey: '_count.journalLines',
    header: 'العمليات',
    cell: ({ row }) => {
      const count = row.original._count.journalLines
      return (
        <Badge variant="outline" className="font-mono">
          {count}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'تاريخ الإنشاء',
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground">
          {formatDate(row.getValue('createdAt'))}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => {
      const cashbox = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(cashbox.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(cashbox.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(cashbox.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]

// Mock functions for actions (to be implemented)
const handleView = (id: string) => {
  console.log('View cashbox:', id)
}

const handleEdit = (id: string) => {
  console.log('Edit cashbox:', id)
}

const handleDelete = (id: string) => {
  console.log('Delete cashbox:', id)
}

const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
  console.log('Export cashboxes:', format)
}

const handlePrint = () => {
  console.log('Print cashboxes')
}

export default function CashboxesPage() {
  const [cashboxes, setCashboxes] = React.useState<Cashbox[]>([])
  const [loading, setLoading] = React.useState(true)

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchCashboxes = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockCashboxes: Cashbox[] = [
        {
          id: '1',
          name: 'الخزينة الرئيسية',
          code: 'CASH-001',
          type: 'CASH',
          accountNumber: null,
          bankName: null,
          balance: 150000,
          status: 'ACTIVE',
          createdAt: new Date('2024-01-01'),
          _count: { transfers: 25, journalLines: 45 },
        },
        {
          id: '2',
          name: 'البنك الأهلي',
          code: 'BANK-001',
          type: 'BANK',
          accountNumber: '1234567890',
          bankName: 'البنك الأهلي السعودي',
          balance: 2500000,
          status: 'ACTIVE',
          createdAt: new Date('2024-01-01'),
          _count: { transfers: 12, journalLines: 38 },
        },
        {
          id: '3',
          name: 'البنك السعودي الفرنسي',
          code: 'BANK-002',
          type: 'BANK',
          accountNumber: '0987654321',
          bankName: 'البنك السعودي الفرنسي',
          balance: 1800000,
          status: 'ACTIVE',
          createdAt: new Date('2024-01-15'),
          _count: { transfers: 8, journalLines: 22 },
        },
        {
          id: '4',
          name: 'خزينة المشاريع',
          code: 'CASH-002',
          type: 'CASH',
          accountNumber: null,
          bankName: null,
          balance: 75000,
          status: 'ACTIVE',
          createdAt: new Date('2024-02-01'),
          _count: { transfers: 15, journalLines: 28 },
        },
        {
          id: '5',
          name: 'البنك الراجحي',
          code: 'BANK-003',
          type: 'BANK',
          accountNumber: '1122334455',
          bankName: 'البنك الراجحي',
          balance: -50000,
          status: 'ACTIVE',
          createdAt: new Date('2024-02-15'),
          _count: { transfers: 5, journalLines: 12 },
        },
      ]
      
      setCashboxes(mockCashboxes)
      setLoading(false)
    }

    fetchCashboxes()
  }, [])

  // Calculate total balance
  const totalBalance = cashboxes.reduce((sum, cashbox) => sum + cashbox.balance, 0)

  // Calculate cash vs bank balances
  const cashBalance = cashboxes
    .filter(c => c.type === 'CASH')
    .reduce((sum, cashbox) => sum + cashbox.balance, 0)
  
  const bankBalance = cashboxes
    .filter(c => c.type === 'BANK')
    .reduce((sum, cashbox) => sum + cashbox.balance, 0)

  const typeFilters = [
    { label: 'خزينة', value: 'CASH' },
    { label: 'بنك', value: 'BANK' },
  ]

  const statusFilters = [
    { label: 'نشط', value: 'ACTIVE' },
    { label: 'غير نشط', value: 'INACTIVE' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة الخزائن والبنوك</h1>
          <p className="text-muted-foreground">
            إدارة وعرض جميع الخزائن والحسابات البنكية
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">إجمالي الرصيد</div>
              <div className={`text-xl font-bold ${
                totalBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(Math.abs(totalBalance))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">الخزائن</div>
              <div className="text-lg font-medium">
                {formatCurrency(cashBalance)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">البنوك</div>
              <div className="text-lg font-medium">
                {formatCurrency(bankBalance)}
              </div>
            </div>
          </div>
          <Button>
            <Plus className="ml-2 h-4 w-4" />
            إضافة خزينة/بنك
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={cashboxes}
        searchPlaceholder="البحث في الخزائن..."
        filters={[
          {
            key: 'type',
            label: 'النوع',
            options: typeFilters,
          },
          {
            key: 'status',
            label: 'الحالة',
            options: statusFilters,
          },
        ]}
        onExport={handleExport}
        onPrint={handlePrint}
        enableSelection={true}
        title="قائمة الخزائن والبنوك"
        description={`إجمالي ${cashboxes.length} خزينة/بنك`}
        loading={loading}
        emptyMessage="لا يوجد خزائن أو بنوك مسجلة"
      />
    </motion.div>
  )
}