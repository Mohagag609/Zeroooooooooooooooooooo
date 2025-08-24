'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Eye, Edit, Trash2, Plus, DollarSign, Calendar, Building } from 'lucide-react'
import { motion } from 'framer-motion'

// Define the Revenue type based on our Prisma schema
interface Revenue {
  id: string
  date: Date
  amount: number
  description: string
  reference: string | null
  createdAt: Date
  project: {
    id: string
    name: string
    code: string
  } | null
  client: {
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

const columns: ColumnDef<Revenue>[] = [
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
      const revenue = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{revenue.description}</div>
          {revenue.reference && (
            <div className="text-sm text-muted-foreground">
              مرجع: {revenue.reference}
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: 'المبلغ',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number
      return (
        <div className="flex items-center gap-1 font-mono text-sm text-green-600">
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
    accessorKey: 'client.name',
    header: 'العميل',
    cell: ({ row }) => {
      const client = row.original.client
      return client ? (
        <div className="font-medium">{client.name}</div>
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
      
      // Find the revenue account (credit side)
      const revenueLine = journalEntry.lines.find(line => 
        line.account.code.startsWith('4') // Revenue accounts start with 4
      )
      
      return revenueLine ? (
        <div className="flex flex-col">
          <div className="font-medium">{revenueLine.account.name}</div>
          <div className="text-sm text-muted-foreground">{revenueLine.account.code}</div>
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
      const revenue = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(revenue.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(revenue.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(revenue.id)}
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
  console.log('View revenue:', id)
}

const handleEdit = (id: string) => {
  console.log('Edit revenue:', id)
}

const handleDelete = (id: string) => {
  console.log('Delete revenue:', id)
}

const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
  console.log('Export revenues:', format)
}

const handlePrint = () => {
  console.log('Print revenues')
}

export default function RevenuesPage() {
  const [revenues, setRevenues] = React.useState<Revenue[]>([])
  const [loading, setLoading] = React.useState(true)

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchRevenues = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockRevenues: Revenue[] = [
        {
          id: '1',
          date: new Date('2024-03-15'),
          amount: 500000,
          description: 'دفعة مقدمة - فيلا الرياض',
          reference: 'INV-001',
          createdAt: new Date('2024-03-15'),
          project: {
            id: '1',
            name: 'فيلا الرياض الفاخرة',
            code: 'PRJ-001',
          },
          client: {
            id: '1',
            name: 'أحمد محمد علي',
          },
          journalEntry: {
            id: '1',
            lines: [
              {
                account: {
                  name: 'البنك الأهلي',
                  code: '101001',
                },
              },
              {
                account: {
                  name: 'إيرادات المشاريع',
                  code: '400001',
                },
              },
            ],
          },
        },
        {
          id: '2',
          date: new Date('2024-03-10'),
          amount: 300000,
          description: 'دفعة مرحلة الأساسات',
          reference: 'INV-002',
          createdAt: new Date('2024-03-10'),
          project: {
            id: '1',
            name: 'فيلا الرياض الفاخرة',
            code: 'PRJ-001',
          },
          client: {
            id: '1',
            name: 'أحمد محمد علي',
          },
          journalEntry: {
            id: '2',
            lines: [
              {
                account: {
                  name: 'البنك الأهلي',
                  code: '101001',
                },
              },
              {
                account: {
                  name: 'إيرادات المشاريع',
                  code: '400001',
                },
              },
            ],
          },
        },
        {
          id: '3',
          date: new Date('2024-03-05'),
          amount: 750000,
          description: 'دفعة مقدمة - مجمع جدة',
          reference: 'INV-003',
          createdAt: new Date('2024-03-05'),
          project: {
            id: '2',
            name: 'مجمع تجاري جدة',
            code: 'PRJ-002',
          },
          client: {
            id: '2',
            name: 'فاطمة أحمد السالم',
          },
          journalEntry: {
            id: '3',
            lines: [
              {
                account: {
                  name: 'البنك الأهلي',
                  code: '101001',
                },
              },
              {
                account: {
                  name: 'إيرادات المشاريع',
                  code: '400001',
                },
              },
            ],
          },
        },
      ]
      
      setRevenues(mockRevenues)
      setLoading(false)
    }

    fetchRevenues()
  }, [])

  // Calculate total revenue
  const totalRevenue = revenues.reduce((sum, revenue) => sum + revenue.amount, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة الإيرادات</h1>
          <p className="text-muted-foreground">
            إدارة وعرض جميع إيرادات الشركة
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">إجمالي الإيرادات</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
          </div>
          <Button>
            <Plus className="ml-2 h-4 w-4" />
            إضافة إيراد جديد
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={revenues}
        searchPlaceholder="البحث في الإيرادات..."
        onExport={handleExport}
        onPrint={handlePrint}
        enableSelection={true}
        title="قائمة الإيرادات"
        description={`إجمالي ${revenues.length} إيراد`}
        loading={loading}
        emptyMessage="لا يوجد إيرادات مسجلة"
      />
    </motion.div>
  )
}