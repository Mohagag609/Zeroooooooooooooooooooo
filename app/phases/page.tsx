'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatDate, formatCurrency } from '@/lib/utils'
import { 
  Building2, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Calendar,
  DollarSign,
  Percent,
  Clock,
  CheckCircle,
  AlertCircle,
  PlayCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Define the Phase type
interface Phase {
  id: string
  code: string
  name: string
  projectId: string
  projectName: string
  projectCode: string
  description: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'
  startDate: Date
  endDate: Date
  actualStartDate: Date | null
  actualEndDate: Date | null
  budget: number
  actualCost: number
  completionPercentage: number
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  materialsCount: number
  employeesCount: number
}

const columns: ColumnDef<Phase>[] = [
  {
    accessorKey: 'code',
    header: 'الكود',
    cell: ({ row }) => {
      return (
        <div className="font-mono text-sm font-medium">
          {row.getValue('code')}
        </div>
      )
    },
  },
  {
    accessorKey: 'name',
    header: 'اسم المرحلة',
    cell: ({ row }) => {
      const phase = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{phase.name}</div>
          <div className="text-sm text-muted-foreground">
            {phase.description}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'projectName',
    header: 'المشروع',
    cell: ({ row }) => {
      const phase = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{phase.projectName}</div>
          <div className="text-sm text-muted-foreground">
            {phase.projectCode}
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
      const statusConfig = {
        NOT_STARTED: { label: 'لم تبدأ', variant: 'secondary' as const, icon: Clock },
        IN_PROGRESS: { label: 'قيد التنفيذ', variant: 'default' as const, icon: PlayCircle },
        COMPLETED: { label: 'مكتملة', variant: 'success' as const, icon: CheckCircle },
        ON_HOLD: { label: 'معلقة', variant: 'warning' as const, icon: AlertCircle },
      }
      const config = statusConfig[status as keyof typeof statusConfig]
      const Icon = config.icon
      
      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <Badge variant={config.variant} className="text-xs">
            {config.label}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'completionPercentage',
    header: 'نسبة الإنجاز',
    cell: ({ row }) => {
      const percentage = row.getValue('completionPercentage') as number
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-sm font-medium">{percentage}%</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'budget',
    header: 'الميزانية',
    cell: ({ row }) => {
      const budget = row.getValue('budget') as number
      const actualCost = row.original.actualCost
      const variance = actualCost - budget
      const variancePercentage = budget > 0 ? (variance / budget) * 100 : 0
      
      return (
        <div className="flex flex-col">
          <div className="font-medium">{formatCurrency(budget)}</div>
          <div className={`text-xs ${variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {variance > 0 ? '+' : ''}{formatCurrency(variance)} ({variancePercentage.toFixed(1)}%)
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'startDate',
    header: 'التواريخ',
    cell: ({ row }) => {
      const phase = row.original
      return (
        <div className="flex flex-col text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>من: {formatDate(phase.startDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>إلى: {formatDate(phase.endDate)}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'priority',
    header: 'الأولوية',
    cell: ({ row }) => {
      const priority = row.getValue('priority') as string
      const priorityConfig = {
        LOW: { label: 'منخفضة', variant: 'secondary' as const },
        MEDIUM: { label: 'متوسطة', variant: 'default' as const },
        HIGH: { label: 'عالية', variant: 'warning' as const },
        CRITICAL: { label: 'حرجة', variant: 'destructive' as const },
      }
      const config = priorityConfig[priority as keyof typeof priorityConfig]
      
      return (
        <Badge variant={config.variant} className="text-xs">
          {config.label}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => {
      const phase = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(phase.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(phase.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(phase.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]

// Mock functions for actions
const handleView = (id: string) => {
  console.log('View phase:', id)
}

const handleEdit = (id: string) => {
  console.log('Edit phase:', id)
}

const handleDelete = (id: string) => {
  console.log('Delete phase:', id)
}

const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
  console.log('Export phases:', format)
}

const handlePrint = () => {
  console.log('Print phases')
}

export default function PhasesPage() {
  const [phases, setPhases] = React.useState<Phase[]>([])
  const [loading, setLoading] = React.useState(true)

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchPhases = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockPhases: Phase[] = [
        {
          id: '1',
          code: 'PH-001',
          name: 'الأساسات',
          projectId: '1',
          projectName: 'فيلا الرياض',
          projectCode: 'PRJ-001',
          description: 'حفر وتأسيس الأساسات',
          status: 'COMPLETED',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-15'),
          actualStartDate: new Date('2024-01-01'),
          actualEndDate: new Date('2024-01-12'),
          budget: 50000,
          actualCost: 48000,
          completionPercentage: 100,
          priority: 'HIGH',
          materialsCount: 8,
          employeesCount: 12,
        },
        {
          id: '2',
          code: 'PH-002',
          name: 'الخرسانة المسلحة',
          projectId: '1',
          projectName: 'فيلا الرياض',
          projectCode: 'PRJ-001',
          description: 'صب الخرسانة المسلحة للجدران والأعمدة',
          status: 'IN_PROGRESS',
          startDate: new Date('2024-01-16'),
          endDate: new Date('2024-02-15'),
          actualStartDate: new Date('2024-01-18'),
          actualEndDate: null,
          budget: 120000,
          actualCost: 85000,
          completionPercentage: 65,
          priority: 'HIGH',
          materialsCount: 15,
          employeesCount: 18,
        },
        {
          id: '3',
          code: 'PH-003',
          name: 'البناء',
          projectId: '1',
          projectName: 'فيلا الرياض',
          projectCode: 'PRJ-001',
          description: 'بناء الجدران والطوابق',
          status: 'NOT_STARTED',
          startDate: new Date('2024-02-16'),
          endDate: new Date('2024-04-15'),
          actualStartDate: null,
          actualEndDate: null,
          budget: 200000,
          actualCost: 0,
          completionPercentage: 0,
          priority: 'MEDIUM',
          materialsCount: 25,
          employeesCount: 20,
        },
        {
          id: '4',
          code: 'PH-004',
          name: 'التشطيبات',
          projectId: '1',
          projectName: 'فيلا الرياض',
          projectCode: 'PRJ-001',
          description: 'التشطيبات النهائية والدهانات',
          status: 'NOT_STARTED',
          startDate: new Date('2024-04-16'),
          endDate: new Date('2024-06-15'),
          actualStartDate: null,
          actualEndDate: null,
          budget: 150000,
          actualCost: 0,
          completionPercentage: 0,
          priority: 'LOW',
          materialsCount: 30,
          employeesCount: 15,
        },
        {
          id: '5',
          code: 'PH-005',
          name: 'الأساسات',
          projectId: '2',
          projectName: 'مجمع تجاري جدة',
          projectCode: 'PRJ-002',
          description: 'حفر وتأسيس الأساسات للمجمع',
          status: 'ON_HOLD',
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-02-28'),
          actualStartDate: new Date('2024-02-01'),
          actualEndDate: null,
          budget: 80000,
          actualCost: 45000,
          completionPercentage: 40,
          priority: 'CRITICAL',
          materialsCount: 12,
          employeesCount: 25,
        },
      ]
      
      setPhases(mockPhases)
      setLoading(false)
    }

    fetchPhases()
  }, [])

  // Calculate statistics
  const totalPhases = phases.length
  const completedPhases = phases.filter(p => p.status === 'COMPLETED').length
  const inProgressPhases = phases.filter(p => p.status === 'IN_PROGRESS').length
  const totalBudget = phases.reduce((sum, phase) => sum + phase.budget, 0)
  const totalActualCost = phases.reduce((sum, phase) => sum + phase.actualCost, 0)
  const averageCompletion = phases.length > 0 
    ? phases.reduce((sum, phase) => sum + phase.completionPercentage, 0) / phases.length 
    : 0

  const statusFilters = [
    { label: 'لم تبدأ', value: 'NOT_STARTED' },
    { label: 'قيد التنفيذ', value: 'IN_PROGRESS' },
    { label: 'مكتملة', value: 'COMPLETED' },
    { label: 'معلقة', value: 'ON_HOLD' },
  ]

  const priorityFilters = [
    { label: 'منخفضة', value: 'LOW' },
    { label: 'متوسطة', value: 'MEDIUM' },
    { label: 'عالية', value: 'HIGH' },
    { label: 'حرجة', value: 'CRITICAL' },
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
          <h1 className="text-3xl font-bold">مراحل المشاريع</h1>
          <p className="text-muted-foreground">
            إدارة مراحل المشاريع وتتبع التقدم
          </p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إضافة مرحلة جديدة
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المراحل</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPhases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مراحل مكتملة</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedPhases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد التنفيذ</CardTitle>
            <PlayCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressPhases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الإنجاز</CardTitle>
            <Percent className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {averageCompletion.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            ملخص الميزانية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">إجمالي الميزانية</span>
              <span className="text-2xl font-bold">{formatCurrency(totalBudget)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">التكلفة الفعلية</span>
              <span className="text-2xl font-bold">{formatCurrency(totalActualCost)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">الفرق</span>
              <span className={`text-2xl font-bold ${totalActualCost > totalBudget ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(totalActualCost - totalBudget)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={phases}
        searchPlaceholder="البحث في المراحل..."
        filters={[
          {
            key: 'status',
            label: 'الحالة',
            options: statusFilters,
          },
          {
            key: 'priority',
            label: 'الأولوية',
            options: priorityFilters,
          },
        ]}
        onExport={handleExport}
        onPrint={handlePrint}
        enableSelection={true}
        title="قائمة المراحل"
        description={`إجمالي ${totalPhases} مرحلة`}
        loading={loading}
        emptyMessage="لا توجد مراحل"
      />
    </motion.div>
  )
}