'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Eye, Edit, Trash2, Plus, DollarSign, Calendar, Building, Receipt } from 'lucide-react'
import { motion } from 'framer-motion'

// Define the Expense type based on our Prisma schema
interface Expense {
  id: string
  date: Date
  amount: number
  description: string
  reference: string | null
  category: string
  createdAt: Date
  project: {
    id: string
    name: string
    code: string
  } | null
  supplier: {
    id: string
    name: string
  } | null
  journalEntry: {
    id: string
    lines: {
      account: {
        name: string
        code: string
      }
    }[]
  } | null
}

const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: 'date',
    header: 'التاريخ',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          {formatDate(row.getValue('date'))}
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'الوصف',
    cell: ({ row }) => {
      const expense = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{expense.description}</div>
          {expense.reference && (
            <div className="text-sm text-muted-foreground">
              مرجع: {expense.reference}
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'category',
    header: 'الفئة',
    cell: ({ row }) => {
      const category = row.getValue('category') as string
      return (
        <Badge variant="outline" className="text-xs">
          {category}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: 'المبلغ',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number
      return (
        <div className="flex items-center gap-1 font-mono text-sm text-red-600">
          <DollarSign className="h-3 w-3" />
          {formatCurrency(amount)}
        </div>
      )
    },
  },
  {
    accessorKey: 'project.name',
    header: 'المشروع',
    cell: ({ row }) => {
      const project = row.original.project
      return project ? (
        <div className="flex flex-col">
          <div className="font-medium">{project.name}</div>
          <div className="text-sm text-muted-foreground">{project.code}</div>
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: 'supplier.name',
    header: 'المورد',
    cell: ({ row }) => {
      const supplier = row.original.supplier
      return supplier ? (
        <div className="font-medium">{supplier.name}</div>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: 'journalEntry.lines',
    header: 'الحساب',
    cell: ({ row }) => {
      const journalEntry = row.original.journalEntry
      if (!journalEntry || journalEntry.lines.length === 0) {
        return <span className="text-muted-foreground">-</span>
      }
      
      // Find the expense account (debit side)
      const expenseLine = journalEntry.lines.find(line => 
        line.account.code.startsWith('5') // Expense accounts start with 5
      )
      
      return expenseLine ? (
        <div className="flex flex-col">
          <div className="font-medium">{expenseLine.account.name}</div>
          <div className="text-sm text-muted-foreground">{expenseLine.account.code}</div>
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
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
      const expense = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(expense.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(expense.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(expense.id)}
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
  console.log('View expense:', id)
}

const handleEdit = (id: string) => {
  console.log('Edit expense:', id)
}

const handleDelete = (id: string) => {
  console.log('Delete expense:', id)
}

const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
  console.log('Export expenses:', format)
}

const handlePrint = () => {
  console.log('Print expenses')
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = React.useState<Expense[]>([])
  const [loading, setLoading] = React.useState(true)

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockExpenses: Expense[] = [
        {
          id: '1',
          date: new Date('2024-03-15'),
          amount: 150000,
          description: 'شراء خرسانة جاهزة',
          reference: 'INV-SUP-001',
          category: 'مواد بناء',
          createdAt: new Date('2024-03-15'),
          project: {
            id: '1',
            name: 'فيلا الرياض الفاخرة',
            code: 'PRJ-001',
          },
          supplier: {
            id: '1',
            name: 'شركة الخرسانة المتطورة',
          },
          journalEntry: {
            id: '1',
            lines: [
              {
                account: {
                  name: 'مصروفات المواد',
                  code: '500001',
                },
              },
              {
                account: {
                  name: 'البنك الأهلي',
                  code: '101001',
                },
              },
            ],
          },
        },
        {
          id: '2',
          date: new Date('2024-03-12'),
          amount: 25000,
          description: 'أجور عمالة',
          reference: 'PAY-001',
          category: 'أجور',
          createdAt: new Date('2024-03-12'),
          project: {
            id: '1',
            name: 'فيلا الرياض الفاخرة',
            code: 'PRJ-001',
          },
          supplier: null,
          journalEntry: {
            id: '2',
            lines: [
              {
                account: {
                  name: 'مصروفات الأجور',
                  code: '500002',
                },
              },
              {
                account: {
                  name: 'الخزينة الرئيسية',
                  code: '101002',
                },
              },
            ],
          },
        },
        {
          id: '3',
          date: new Date('2024-03-10'),
          amount: 80000,
          description: 'شراء حديد تسليح',
          reference: 'INV-SUP-002',
          category: 'مواد بناء',
          createdAt: new Date('2024-03-10'),
          project: {
            id: '2',
            name: 'مجمع تجاري جدة',
            code: 'PRJ-002',
          },
          supplier: {
            id: '2',
            name: 'مؤسسة الحديد والصلب',
          },
          journalEntry: {
            id: '3',
            lines: [
              {
                account: {
                  name: 'مصروفات المواد',
                  code: '500001',
                },
              },
              {
                account: {
                  name: 'البنك الأهلي',
                  code: '101001',
                },
              },
            ],
          },
        },
        {
          id: '4',
          date: new Date('2024-03-08'),
          amount: 12000,
          description: 'مصروفات إدارية',
          reference: 'ADM-001',
          category: 'إدارية',
          createdAt: new Date('2024-03-08'),
          project: null,
          supplier: null,
          journalEntry: {
            id: '4',
            lines: [
              {
                account: {
                  name: 'مصروفات إدارية',
                  code: '500003',
                },
              },
              {
                account: {
                  name: 'الخزينة الرئيسية',
                  code: '101002',
                },
              },
            ],
          },
        },
      ]
      
      setExpenses(mockExpenses)
      setLoading(false)
    }

    fetchExpenses()
  }, [])

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Calculate expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const categoryFilters = Object.keys(expensesByCategory).map(category => ({
    label: category,
    value: category,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة المصروفات</h1>
          <p className="text-muted-foreground">
            إدارة وعرض جميع مصروفات الشركة
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">إجمالي المصروفات</div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
          </div>
          <Button>
            <Plus className="ml-2 h-4 w-4" />
            إضافة مصروف جديد
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={expenses}
        searchPlaceholder="البحث في المصروفات..."
        filters={[
          {
            key: 'category',
            label: 'الفئة',
            options: categoryFilters,
          },
        ]}
        onExport={handleExport}
        onPrint={handlePrint}
        enableSelection={true}
        title="قائمة المصروفات"
        description={`إجمالي ${expenses.length} مصروف`}
        loading={loading}
        emptyMessage="لا يوجد مصروفات مسجلة"
      />
    </motion.div>
  )
}