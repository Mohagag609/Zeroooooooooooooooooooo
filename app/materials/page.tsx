'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Eye, Edit, Trash2, Plus, Package, Scale, DollarSign, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

// Define the Material type based on our Prisma schema
interface Material {
  id: string
  name: string
  code: string
  description: string | null
  unit: string
  unitPrice: number
  minQuantity: number
  currentQuantity: number
  category: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  _count: {
    materialMoves: number
  }
}

const columns: ColumnDef<Material>[] = [
  {
    accessorKey: 'code',
    header: 'رمز المادة',
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium">{row.getValue('code')}</div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'اسم المادة',
    cell: ({ row }) => {
      const material = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{material.name}</div>
          {material.description && (
            <div className="text-sm text-muted-foreground">{material.description}</div>
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
    accessorKey: 'currentQuantity',
    header: 'الكمية الحالية',
    cell: ({ row }) => {
      const material = row.original
      const isLowStock = material.currentQuantity <= material.minQuantity
      
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Scale className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-sm">
              {formatNumber(material.currentQuantity)} {material.unit}
            </span>
          </div>
          {isLowStock && (
            <AlertTriangle className="h-3 w-3 text-red-500" />
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'minQuantity',
    header: 'الحد الأدنى',
    cell: ({ row }) => {
      const material = row.original
      return (
        <div className="text-sm text-muted-foreground">
          {formatNumber(material.minQuantity)} {material.unit}
        </div>
      )
    },
  },
  {
    accessorKey: 'unitPrice',
    header: 'سعر الوحدة',
    cell: ({ row }) => {
      const unitPrice = row.getValue('unitPrice') as number
      return (
        <div className="flex items-center gap-1 font-mono text-sm">
          <DollarSign className="h-3 w-3 text-muted-foreground" />
          {formatCurrency(unitPrice)}
        </div>
      )
    },
  },
  {
    accessorKey: 'totalValue',
    header: 'القيمة الإجمالية',
    cell: ({ row }) => {
      const material = row.original
      const totalValue = material.currentQuantity * material.unitPrice
      return (
        <div className="font-mono text-sm font-medium">
          {formatCurrency(totalValue)}
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
          {status === 'ACTIVE' ? 'متوفر' : 'غير متوفر'}
        </Badge>
      )
    },
  },
  {
    accessorKey: '_count.materialMoves',
    header: 'الحركات',
    cell: ({ row }) => {
      const count = row.original._count.materialMoves
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
          {new Date(row.getValue('createdAt')).toLocaleDateString('ar-SA')}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => {
      const material = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(material.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(material.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(material.id)}
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
  console.log('View material:', id)
}

const handleEdit = (id: string) => {
  console.log('Edit material:', id)
}

const handleDelete = (id: string) => {
  console.log('Delete material:', id)
}

const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
  console.log('Export materials:', format)
}

const handlePrint = () => {
  console.log('Print materials')
}

export default function MaterialsPage() {
  const [materials, setMaterials] = React.useState<Material[]>([])
  const [loading, setLoading] = React.useState(true)

  // Fetch materials from API
  React.useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/materials')
        if (!res.ok) throw new Error('فشل في جلب بيانات المواد')
        const data = await res.json()
        setMaterials(data.materials ?? [])
      } catch (e) {
        console.error('[MaterialsPage] fetch error', e)
        setMaterials([])
      } finally {
        setLoading(false)
      }
    }
    fetchMaterials()
  }, [])

  // Calculate total inventory value
  const totalValue = materials.reduce((sum, material) => 
    sum + (material.currentQuantity * material.unitPrice), 0
  )

  // Calculate low stock items
  const lowStockItems = materials.filter(material => 
    material.currentQuantity <= material.minQuantity
  ).length

  // Get unique categories
  const categories = Array.from(new Set(materials.map(m => m.category)))
  const categoryFilters = categories.map(category => ({
    label: category,
    value: category,
  }))

  const statusFilters = [
    { label: 'متوفر', value: 'ACTIVE' },
    { label: 'غير متوفر', value: 'INACTIVE' },
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
          <h1 className="text-3xl font-bold">إدارة المواد</h1>
          <p className="text-muted-foreground">
            إدارة وعرض جميع مواد البناء والمخزون
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">قيمة المخزون</div>
              <div className="text-xl font-bold">
                {formatCurrency(totalValue)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">مواد منخفضة</div>
              <div className="text-xl font-bold text-red-600">
                {lowStockItems}
              </div>
            </div>
          </div>
          <Button>
            <Plus className="ml-2 h-4 w-4" />
            إضافة مادة جديدة
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={materials}
        searchPlaceholder="البحث في المواد..."
        filters={[
          {
            key: 'category',
            label: 'الفئة',
            options: categoryFilters,
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
        title="قائمة المواد"
        description={`إجمالي ${materials.length} مادة`}
        loading={loading}
        emptyMessage="لا يوجد مواد مسجلة"
      />
    </motion.div>
  )
}