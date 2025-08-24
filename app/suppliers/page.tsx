'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Eye, Edit, Trash2, Plus, Phone, Mail, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

// Define the Supplier type based on our Prisma schema
interface Supplier {
  id: string
  name: string
  email: string | null
  phone: string
  address: string | null
  code: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: Date
  _count: {
    invoices: number
  }
  balance?: number
}

const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: 'code',
    header: 'الرمز',
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue('code')}</div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'اسم المورد',
    cell: ({ row }) => {
      const supplier = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{supplier.name}</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {supplier.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {supplier.phone}
              </div>
            )}
            {supplier.email && (
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {supplier.email}
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
          balance > 0 ? 'text-red-600' : balance < 0 ? 'text-green-600' : 'text-muted-foreground'
        }`}>
          {formatCurrency(Math.abs(balance))}
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
      const supplier = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(supplier.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(supplier.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(supplier.id)}
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
  console.log('View supplier:', id)
}

const handleEdit = (id: string) => {
  console.log('Edit supplier:', id)
}

const handleDelete = (id: string) => {
  console.log('Delete supplier:', id)
}

const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
  console.log('Export suppliers:', format)
}

const handlePrint = () => {
  console.log('Print suppliers')
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([])
  const [loading, setLoading] = React.useState(true)

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockSuppliers: Supplier[] = [
        {
          id: '1',
          name: 'شركة الخرسانة المتطورة',
          email: 'info@concrete.com',
          phone: '0112345678',
          address: 'الرياض، المملكة العربية السعودية',
          code: 'SUP-001',
          status: 'ACTIVE',
          createdAt: new Date('2024-01-10'),
          _count: { invoices: 15 },
          balance: 45000,
        },
        {
          id: '2',
          name: 'مؤسسة الحديد والصلب',
          email: 'sales@steel.com',
          phone: '0113456789',
          address: 'الدمام، المملكة العربية السعودية',
          code: 'SUP-002',
          status: 'ACTIVE',
          createdAt: new Date('2024-01-25'),
          _count: { invoices: 8 },
          balance: 22000,
        },
        {
          id: '3',
          name: 'معدات البناء الحديثة',
          email: null,
          phone: '0505555555',
          address: 'جدة، المملكة العربية السعودية',
          code: 'SUP-003',
          status: 'INACTIVE',
          createdAt: new Date('2024-02-15'),
          _count: { invoices: 3 },
          balance: 0,
        },
      ]
      
      setSuppliers(mockSuppliers)
      setLoading(false)
    }

    fetchSuppliers()
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
          <h1 className="text-3xl font-bold">إدارة الموردين</h1>
          <p className="text-muted-foreground">
            إدارة وعرض جميع موردي الشركة ومعلوماتهم
          </p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إضافة مورد جديد
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={suppliers}
        searchPlaceholder="البحث في الموردين..."
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
        title="قائمة الموردين"
        description={`إجمالي ${suppliers.length} مورد`}
        loading={loading}
        emptyMessage="لا يوجد موردين مسجلين"
      />
    </motion.div>
  )
}