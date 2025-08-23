'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Eye, Edit, Trash2, Plus, Phone, Mail, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

// Define the Client type based on our Prisma schema
interface Client {
  id: string
  name: string
  email: string | null
  phone: string
  address: string | null
  code: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: Date
  _count: {
    projects: number
    invoices: number
  }
  balance?: number
}

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'code',
    header: 'الرمز',
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue('code')}</div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'اسم العميل',
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{client.name}</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {client.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {client.phone}
              </div>
            )}
            {client.email && (
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {client.email}
              </div>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'address',
    header: 'العنوان',
    cell: ({ row }) => {
      const address = row.getValue('address') as string
      return address ? (
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          {address}
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
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
    accessorKey: '_count.projects',
    header: 'المشاريع',
    cell: ({ row }) => {
      const count = row.original._count.projects
      return (
        <Badge variant="outline" className="font-mono">
          {count}
        </Badge>
      )
    },
  },
  {
    accessorKey: '_count.invoices',
    header: 'الفواتير',
    cell: ({ row }) => {
      const count = row.original._count.invoices
      return (
        <Badge variant="outline" className="font-mono">
          {count}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'balance',
    header: 'الرصيد',
    cell: ({ row }) => {
      const balance = row.original.balance || 0
      return (
        <div className={`font-mono text-sm ${
          balance > 0 ? 'text-green-600' : balance < 0 ? 'text-red-600' : 'text-muted-foreground'
        }`}>
          {formatCurrency(balance)}
        </div>
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
      const client = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(client.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(client.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(client.id)}
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
  console.log('View client:', id)
}

const handleEdit = (id: string) => {
  console.log('Edit client:', id)
}

const handleDelete = (id: string) => {
  console.log('Delete client:', id)
}

const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
  console.log('Export clients:', format)
}

const handlePrint = () => {
  console.log('Print clients')
}

export default function ClientsPage() {
  const [clients, setClients] = React.useState<Client[]>([])
  const [loading, setLoading] = React.useState(true)

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchClients = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockClients: Client[] = [
        {
          id: '1',
          name: 'أحمد محمد علي',
          email: 'ahmed@example.com',
          phone: '0501234567',
          address: 'الرياض، المملكة العربية السعودية',
          code: 'CLI-001',
          status: 'ACTIVE',
          createdAt: new Date('2024-01-15'),
          _count: { projects: 3, invoices: 12 },
          balance: 25000,
        },
        {
          id: '2',
          name: 'فاطمة أحمد السالم',
          email: 'fatima@example.com',
          phone: '0507654321',
          address: 'جدة، المملكة العربية السعودية',
          code: 'CLI-002',
          status: 'ACTIVE',
          createdAt: new Date('2024-02-20'),
          _count: { projects: 1, invoices: 5 },
          balance: -15000,
        },
        {
          id: '3',
          name: 'محمد عبدالله الخالد',
          email: null,
          phone: '0551234567',
          address: null,
          code: 'CLI-003',
          status: 'INACTIVE',
          createdAt: new Date('2024-03-10'),
          _count: { projects: 0, invoices: 2 },
          balance: 0,
        },
      ]
      
      setClients(mockClients)
      setLoading(false)
    }

    fetchClients()
  }, [])

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
          <h1 className="text-3xl font-bold">إدارة العملاء</h1>
          <p className="text-muted-foreground">
            إدارة وعرض جميع عملاء الشركة ومعلوماتهم
          </p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إضافة عميل جديد
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={clients}
        searchPlaceholder="البحث في العملاء..."
        filters={[
          {
            key: 'status',
            label: 'الحالة',
            options: statusFilters,
          },
        ]}
        onExport={handleExport}
        onPrint={handlePrint}
        enableSelection={true}
        title="قائمة العملاء"
        description={`إجمالي ${clients.length} عميل`}
        loading={loading}
        emptyMessage="لا يوجد عملاء مسجلين"
      />
    </motion.div>
  )
}