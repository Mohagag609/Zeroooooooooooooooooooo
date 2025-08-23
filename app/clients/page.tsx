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

// API functions for actions
const handleView = async (id: string) => {
  try {
    const response = await fetch(`/api/clients/${id}`)
    if (response.ok) {
      const client = await response.json()
      console.log('Client details:', client)
      // TODO: Navigate to client details page
    }
  } catch (error) {
    console.error('Error fetching client:', error)
  }
}

const handleEdit = (id: string) => {
  // TODO: Navigate to edit client page
  console.log('Edit client:', id)
}

const handleDelete = async (id: string) => {
  if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        // Refresh the clients list
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'فشل في حذف العميل')
      }
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('فشل في حذف العميل')
    }
  }
}

const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
  console.log('Export clients:', format)
  // TODO: Implement export functionality
}

const handlePrint = () => {
  console.log('Print clients')
  // TODO: Implement print functionality
}

export default function ClientsPage() {
  const [clients, setClients] = React.useState<Client[]>([])
  const [loading, setLoading] = React.useState(true)

  // Fetch clients from API
  React.useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/clients')
        
        if (!response.ok) {
          throw new Error('فشل في جلب بيانات العملاء')
        }
        
        const data = await response.json()
        setClients(data.clients || [])
      } catch (error) {
        console.error('Error fetching clients:', error)
        // Fallback to empty array on error
        setClients([])
      } finally {
        setLoading(false)
      }
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