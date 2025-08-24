'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatDate, formatCurrency, formatNumber } from '@/lib/utils'
import { 
  Warehouse, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  MapPin,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Building2,
  Phone,
  Mail
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Define the Warehouse type
interface WarehouseData {
  id: string
  code: string
  name: string
  type: 'MAIN' | 'PROJECT' | 'TEMPORARY' | 'EXTERNAL'
  location: string
  address: string
  phone: string
  email: string
  manager: string
  managerPhone: string
  capacity: number
  currentStock: number
  totalValue: number
  materialsCount: number
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'
  projectId: string | null
  projectName: string | null
  projectCode: string | null
  notes: string
  createdAt: Date
  lastUpdated: Date
}

const columns: ColumnDef<WarehouseData>[] = [
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
    header: 'اسم المخزن',
    cell: ({ row }) => {
      const warehouse = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{warehouse.name}</div>
          <div className="text-sm text-muted-foreground">
            {warehouse.type === 'PROJECT' && warehouse.projectName && (
              <span>مشروع: {warehouse.projectName}</span>
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
      const typeConfig = {
        MAIN: { label: 'رئيسي', variant: 'default' as const },
        PROJECT: { label: 'مشروع', variant: 'success' as const },
        TEMPORARY: { label: 'مؤقت', variant: 'warning' as const },
        EXTERNAL: { label: 'خارجي', variant: 'secondary' as const },
      }
      const config = typeConfig[type as keyof typeof typeConfig]
      
      return (
        <Badge variant={config.variant} className="text-xs">
          {config.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'location',
    header: 'الموقع',
    cell: ({ row }) => {
      const warehouse = row.original
      return (
        <div className="flex flex-col text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span>{warehouse.location}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {warehouse.address}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'manager',
    header: 'المدير',
    cell: ({ row }) => {
      const warehouse = row.original
      return (
        <div className="flex flex-col text-sm">
          <div className="font-medium">{warehouse.manager}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{warehouse.managerPhone}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'currentStock',
    header: 'المخزون',
    cell: ({ row }) => {
      const warehouse = row.original
      const utilizationPercentage = warehouse.capacity > 0 
        ? (warehouse.currentStock / warehouse.capacity) * 100 
        : 0
      
      return (
        <div className="flex flex-col">
          <div className="font-medium">
            {formatNumber(warehouse.currentStock)} / {formatNumber(warehouse.capacity)}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  utilizationPercentage > 90 ? 'bg-red-600' : 
                  utilizationPercentage > 70 ? 'bg-yellow-600' : 'bg-green-600'
                }`}
                style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
              />
            </div>
            <span className="text-xs font-medium">{utilizationPercentage.toFixed(1)}%</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'totalValue',
    header: 'القيمة الإجمالية',
    cell: ({ row }) => {
      const warehouse = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{formatCurrency(warehouse.totalValue)}</div>
          <div className="text-sm text-muted-foreground">
            {warehouse.materialsCount} مادة
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
        ACTIVE: { label: 'نشط', variant: 'success' as const, icon: CheckCircle },
        INACTIVE: { label: 'غير نشط', variant: 'secondary' as const, icon: Building2 },
        MAINTENANCE: { label: 'صيانة', variant: 'warning' as const, icon: AlertTriangle },
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
    accessorKey: 'lastUpdated',
    header: 'آخر تحديث',
    cell: ({ row }) => {
      return (
        <div className="text-sm">
          {formatDate(row.getValue('lastUpdated'))}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => {
      const warehouse = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(warehouse.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(warehouse.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(warehouse.id)}
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
  console.log('View warehouse:', id)
}

const handleEdit = (id: string) => {
  console.log('Edit warehouse:', id)
}

const handleDelete = (id: string) => {
  console.log('Delete warehouse:', id)
}

const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
  console.log('Export warehouses:', format)
}

const handlePrint = () => {
  console.log('Print warehouses')
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = React.useState<WarehouseData[]>([])
  const [loading, setLoading] = React.useState(true)

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchWarehouses = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockWarehouses: WarehouseData[] = [
        {
          id: '1',
          code: 'WH-001',
          name: 'المخزن الرئيسي',
          type: 'MAIN',
          location: 'الرياض',
          address: 'شارع الملك فهد، حي النزهة',
          phone: '+966-11-123-4567',
          email: 'main@warehouse.com',
          manager: 'أحمد محمد',
          managerPhone: '+966-50-123-4567',
          capacity: 10000,
          currentStock: 8500,
          totalValue: 1250000,
          materialsCount: 45,
          status: 'ACTIVE',
          projectId: null,
          projectName: null,
          projectCode: null,
          notes: 'المخزن الرئيسي للشركة',
          createdAt: new Date('2024-01-01'),
          lastUpdated: new Date('2024-03-15T10:30:00'),
        },
        {
          id: '2',
          code: 'WH-002',
          name: 'مخزن مشروع فيلا الرياض',
          type: 'PROJECT',
          location: 'الرياض',
          address: 'حي النرجس، موقع المشروع',
          phone: '+966-11-234-5678',
          email: 'villa@warehouse.com',
          manager: 'محمد علي',
          managerPhone: '+966-50-234-5678',
          capacity: 2000,
          currentStock: 1800,
          totalValue: 450000,
          materialsCount: 25,
          status: 'ACTIVE',
          projectId: '1',
          projectName: 'فيلا الرياض',
          projectCode: 'PRJ-001',
          notes: 'مخزن مخصص لمشروع فيلا الرياض',
          createdAt: new Date('2024-01-15'),
          lastUpdated: new Date('2024-03-14T16:45:00'),
        },
        {
          id: '3',
          code: 'WH-003',
          name: 'مخزن مؤقت جدة',
          type: 'TEMPORARY',
          location: 'جدة',
          address: 'حي الكورنيش، موقع مؤقت',
          phone: '+966-12-345-6789',
          email: 'temp@warehouse.com',
          manager: 'علي أحمد',
          managerPhone: '+966-50-345-6789',
          capacity: 1500,
          currentStock: 1200,
          totalValue: 280000,
          materialsCount: 18,
          status: 'ACTIVE',
          projectId: null,
          projectName: null,
          projectCode: null,
          notes: 'مخزن مؤقت للمشاريع في جدة',
          createdAt: new Date('2024-02-01'),
          lastUpdated: new Date('2024-03-13T09:15:00'),
        },
        {
          id: '4',
          code: 'WH-004',
          name: 'مخزن خارجي الدمام',
          type: 'EXTERNAL',
          location: 'الدمام',
          address: 'حي الشاطئ، مستودع خارجي',
          phone: '+966-13-456-7890',
          email: 'external@warehouse.com',
          manager: 'فاطمة أحمد',
          managerPhone: '+966-50-456-7890',
          capacity: 3000,
          currentStock: 2800,
          totalValue: 650000,
          materialsCount: 32,
          status: 'MAINTENANCE',
          projectId: null,
          projectName: null,
          projectCode: null,
          notes: 'مخزن خارجي تحت الصيانة',
          createdAt: new Date('2024-01-20'),
          lastUpdated: new Date('2024-03-12T14:20:00'),
        },
        {
          id: '5',
          code: 'WH-005',
          name: 'مخزن مشروع مجمع جدة',
          type: 'PROJECT',
          location: 'جدة',
          address: 'حي التحلية، موقع المشروع',
          phone: '+966-12-567-8901',
          email: 'mall@warehouse.com',
          manager: 'خالد محمد',
          managerPhone: '+966-50-567-8901',
          capacity: 5000,
          currentStock: 3200,
          totalValue: 780000,
          materialsCount: 40,
          status: 'ACTIVE',
          projectId: '2',
          projectName: 'مجمع تجاري جدة',
          projectCode: 'PRJ-002',
          notes: 'مخزن مخصص لمشروع المجمع التجاري',
          createdAt: new Date('2024-02-10'),
          lastUpdated: new Date('2024-03-11T11:45:00'),
        },
      ]
      
      setWarehouses(mockWarehouses)
      setLoading(false)
    }

    fetchWarehouses()
  }, [])

  // Calculate statistics
  const totalWarehouses = warehouses.length
  const activeWarehouses = warehouses.filter(w => w.status === 'ACTIVE').length
  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0)
  const totalCurrentStock = warehouses.reduce((sum, w) => sum + w.currentStock, 0)
  const totalValue = warehouses.reduce((sum, w) => sum + w.totalValue, 0)
  const utilizationPercentage = totalCapacity > 0 ? (totalCurrentStock / totalCapacity) * 100 : 0
  const lowStockWarehouses = warehouses.filter(w => {
    const utilization = w.capacity > 0 ? (w.currentStock / w.capacity) * 100 : 0
    return utilization < 20
  }).length

  const typeFilters = [
    { label: 'رئيسي', value: 'MAIN' },
    { label: 'مشروع', value: 'PROJECT' },
    { label: 'مؤقت', value: 'TEMPORARY' },
    { label: 'خارجي', value: 'EXTERNAL' },
  ]

  const statusFilters = [
    { label: 'نشط', value: 'ACTIVE' },
    { label: 'غير نشط', value: 'INACTIVE' },
    { label: 'صيانة', value: 'MAINTENANCE' },
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
          <h1 className="text-3xl font-bold">المخازن</h1>
          <p className="text-muted-foreground">
            إدارة المخازن والمستودعات
          </p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إضافة مخزن جديد
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المخازن</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWarehouses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مخازن نشطة</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeWarehouses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي السعة</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatNumber(totalCapacity)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">القيمة الإجمالية</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalValue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Utilization Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            ملخص الاستخدام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">المخزون الحالي</span>
              <span className="text-2xl font-bold">{formatNumber(totalCurrentStock)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">نسبة الاستخدام</span>
              <span className="text-2xl font-bold">{utilizationPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">مخازن منخفضة المخزون</span>
              <span className="text-2xl font-bold text-red-600">{lowStockWarehouses}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">متوسط القيمة</span>
              <span className="text-2xl font-bold">
                {totalWarehouses > 0 ? formatCurrency(totalValue / totalWarehouses) : '0'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={warehouses}
        searchPlaceholder="البحث في المخازن..."
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
        title="قائمة المخازن"
        description={`إجمالي ${totalWarehouses} مخزن`}
        loading={loading}
        emptyMessage="لا توجد مخازن"
      />
    </motion.div>
  )
}