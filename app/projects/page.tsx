'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Eye, Edit, Trash2, Plus, MapPin, Calendar, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'

// Define the Project type based on our Prisma schema
interface Project {
  id: string
  name: string
  code: string
  location: string | null
  startDate: Date
  endDate: Date | null
  budget: number
  actualCost: number
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
  createdAt: Date
  client: {
    id: string
    name: string
    phone: string
  }
  phases: {
    id: string
    name: string
    status: string
    budget: number
    actualCost: number
  }[]
  _count: {
    phases: number
    partners: number
    materialMoves: number
  }
}

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'code',
    header: 'رمز المشروع',
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium">{row.getValue('code')}</div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'اسم المشروع',
    cell: ({ row }) => {
      const project = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{project.name}</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {project.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {project.location}
              </div>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'client.name',
    header: 'العميل',
    cell: ({ row }) => {
      const client = row.original.client
      return (
        <div className="flex flex-col">
          <div className="font-medium">{client.name}</div>
          <div className="text-sm text-muted-foreground">{client.phone}</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'الحالة',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const statusConfig = {
        PLANNING: { label: 'تخطيط', variant: 'secondary' as const },
        IN_PROGRESS: { label: 'قيد التنفيذ', variant: 'default' as const },
        COMPLETED: { label: 'مكتمل', variant: 'success' as const },
        ON_HOLD: { label: 'معلق', variant: 'warning' as const },
        CANCELLED: { label: 'ملغي', variant: 'destructive' as const },
      }
      const config = statusConfig[status as keyof typeof statusConfig]
      return (
        <Badge variant={config.variant}>
          {config.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'startDate',
    header: 'تاريخ البداية',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          {formatDate(row.getValue('startDate'))}
        </div>
      )
    },
  },
  {
    accessorKey: 'budget',
    header: 'الميزانية',
    cell: ({ row }) => {
      const budget = row.getValue('budget') as number
      return (
        <div className="font-mono text-sm">
          {formatCurrency(budget)}
        </div>
      )
    },
  },
  {
    accessorKey: 'actualCost',
    header: 'التكلفة الفعلية',
    cell: ({ row }) => {
      const actualCost = row.getValue('actualCost') as number
      const budget = row.getValue('budget') as number
      const percentage = budget > 0 ? (actualCost / budget) * 100 : 0
      
      return (
        <div className="flex flex-col">
          <div className="font-mono text-sm">
            {formatCurrency(actualCost)}
          </div>
          <div className={`text-xs ${
            percentage > 100 ? 'text-red-600' : 
            percentage > 80 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {percentage.toFixed(1)}%
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: '_count.phases',
    header: 'المراحل',
    cell: ({ row }) => {
      const count = row.original._count.phases
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
      const project = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(project.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(project.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(project.id)}
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
  console.log('View project:', id)
}

const handleEdit = (id: string) => {
  console.log('Edit project:', id)
}

const handleDelete = (id: string) => {
  console.log('Delete project:', id)
}

const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
  console.log('Export projects:', format)
}

const handlePrint = () => {
  console.log('Print projects')
}

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>([])
  const [loading, setLoading] = React.useState(true)

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'فيلا الرياض الفاخرة',
          code: 'PRJ-001',
          location: 'الرياض، حي النرجس',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-12-31'),
          budget: 2500000,
          actualCost: 1800000,
          status: 'IN_PROGRESS',
          createdAt: new Date('2024-01-10'),
          client: {
            id: '1',
            name: 'أحمد محمد علي',
            phone: '0501234567',
          },
          phases: [
            { id: '1', name: 'الأساسات', status: 'COMPLETED', budget: 300000, actualCost: 280000 },
            { id: '2', name: 'الهيكل الخرساني', status: 'IN_PROGRESS', budget: 800000, actualCost: 650000 },
            { id: '3', name: 'البناء', status: 'PLANNING', budget: 600000, actualCost: 0 },
          ],
          _count: { phases: 3, partners: 2, materialMoves: 45 },
        },
        {
          id: '2',
          name: 'مجمع تجاري جدة',
          code: 'PRJ-002',
          location: 'جدة، شارع التحلية',
          startDate: new Date('2024-03-01'),
          endDate: new Date('2025-06-30'),
          budget: 5000000,
          actualCost: 1200000,
          status: 'IN_PROGRESS',
          createdAt: new Date('2024-02-20'),
          client: {
            id: '2',
            name: 'فاطمة أحمد السالم',
            phone: '0507654321',
          },
          phases: [
            { id: '4', name: 'الأساسات', status: 'COMPLETED', budget: 500000, actualCost: 480000 },
            { id: '5', name: 'الهيكل', status: 'IN_PROGRESS', budget: 1500000, actualCost: 720000 },
          ],
          _count: { phases: 2, partners: 1, materialMoves: 28 },
        },
        {
          id: '3',
          name: 'مبنى إداري الدمام',
          code: 'PRJ-003',
          location: 'الدمام، حي الشاطئ',
          startDate: new Date('2024-02-01'),
          endDate: null,
          budget: 1800000,
          actualCost: 0,
          status: 'PLANNING',
          createdAt: new Date('2024-01-25'),
          client: {
            id: '3',
            name: 'محمد عبدالله الخالد',
            phone: '0551234567',
          },
          phases: [],
          _count: { phases: 0, partners: 0, materialMoves: 0 },
        },
      ]
      
      setProjects(mockProjects)
      setLoading(false)
    }

    fetchProjects()
  }, [])

  const statusFilters = [
    { label: 'تخطيط', value: 'PLANNING' },
    { label: 'قيد التنفيذ', value: 'IN_PROGRESS' },
    { label: 'مكتمل', value: 'COMPLETED' },
    { label: 'معلق', value: 'ON_HOLD' },
    { label: 'ملغي', value: 'CANCELLED' },
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
          <h1 className="text-3xl font-bold">إدارة المشاريع</h1>
          <p className="text-muted-foreground">
            إدارة وعرض جميع مشاريع الشركة ومراحلها
          </p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إضافة مشروع جديد
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        searchPlaceholder="البحث في المشاريع..."
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
        title="قائمة المشاريع"
        description={`إجمالي ${projects.length} مشروع`}
        loading={loading}
        emptyMessage="لا يوجد مشاريع مسجلة"
      />
    </motion.div>
  )
}