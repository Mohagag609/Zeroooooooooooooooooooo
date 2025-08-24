'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatDate, formatCurrency, formatNumber } from '@/lib/utils'
import { 
  Package, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Warehouse,
  Truck,
  AlertTriangle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Define the MaterialMove type
interface MaterialMove {
  id: string
  code: string
  materialId: string
  materialName: string
  materialCode: string
  moveType: 'IN' | 'OUT' | 'ADJUST' | 'TRANSFER'
  quantity: number
  unitPrice: number
  totalValue: number
  fromWarehouseId: string | null
  fromWarehouseName: string | null
  toWarehouseId: string | null
  toWarehouseName: string | null
  projectId: string | null
  projectName: string | null
  projectCode: string | null
  phaseId: string | null
  phaseName: string | null
  supplierId: string | null
  supplierName: string | null
  reference: string
  notes: string
  date: Date
  createdBy: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
}

const columns: ColumnDef<MaterialMove>[] = [
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
    accessorKey: 'materialName',
    header: 'المادة',
    cell: ({ row }) => {
      const move = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{move.materialName}</div>
          <div className="text-sm text-muted-foreground">
            {move.materialCode}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'moveType',
    header: 'نوع الحركة',
    cell: ({ row }) => {
      const moveType = row.getValue('moveType') as string
      const moveTypeConfig = {
        IN: { label: 'وارد', variant: 'success' as const, icon: ArrowDown },
        OUT: { label: 'صادر', variant: 'destructive' as const, icon: ArrowUp },
        ADJUST: { label: 'تعديل', variant: 'warning' as const, icon: Minus },
        TRANSFER: { label: 'تحويل', variant: 'default' as const, icon: ArrowUpDown },
      }
      const config = moveTypeConfig[moveType as keyof typeof moveTypeConfig]
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
    accessorKey: 'quantity',
    header: 'الكمية',
    cell: ({ row }) => {
      const quantity = row.getValue('quantity') as number
      const unitPrice = row.original.unitPrice
      const totalValue = row.original.totalValue
      
      return (
        <div className="flex flex-col">
          <div className="font-medium">{formatNumber(quantity)}</div>
          <div className="text-sm text-muted-foreground">
            {formatCurrency(unitPrice)} للوحدة
          </div>
          <div className="text-sm font-medium text-blue-600">
            {formatCurrency(totalValue)}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'fromWarehouseName',
    header: 'من/إلى',
    cell: ({ row }) => {
      const move = row.original
      return (
        <div className="flex flex-col text-sm">
          {move.moveType === 'TRANSFER' ? (
            <>
              <div className="flex items-center gap-1">
                <Warehouse className="h-3 w-3 text-muted-foreground" />
                <span>من: {move.fromWarehouseName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Warehouse className="h-3 w-3 text-muted-foreground" />
                <span>إلى: {move.toWarehouseName}</span>
              </div>
            </>
          ) : move.moveType === 'IN' ? (
            <div className="flex items-center gap-1">
              <Truck className="h-3 w-3 text-muted-foreground" />
              <span>من: {move.supplierName}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Warehouse className="h-3 w-3 text-muted-foreground" />
              <span>إلى: {move.toWarehouseName}</span>
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'projectName',
    header: 'المشروع/المرحلة',
    cell: ({ row }) => {
      const move = row.original
      if (!move.projectName) return <span className="text-muted-foreground">-</span>
      
      return (
        <div className="flex flex-col">
          <div className="font-medium">{move.projectName}</div>
          <div className="text-sm text-muted-foreground">
            {move.projectCode}
          </div>
          {move.phaseName && (
            <div className="text-xs text-muted-foreground">
              {move.phaseName}
            </div>
          )}
        </div>
      )
    },
  },
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
    accessorKey: 'status',
    header: 'الحالة',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const statusConfig = {
        PENDING: { label: 'في الانتظار', variant: 'warning' as const },
        APPROVED: { label: 'موافق', variant: 'success' as const },
        REJECTED: { label: 'مرفوض', variant: 'destructive' as const },
        CANCELLED: { label: 'ملغي', variant: 'secondary' as const },
      }
      const config = statusConfig[status as keyof typeof statusConfig]
      
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
      const move = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(move.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(move.id)}
            disabled={move.status !== 'PENDING'}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(move.id)}
            disabled={move.status !== 'PENDING'}
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
  console.log('View material move:', id)
}

const handleEdit = (id: string) => {
  console.log('Edit material move:', id)
}

const handleDelete = (id: string) => {
  console.log('Delete material move:', id)
}

const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
  console.log('Export material moves:', format)
}

const handlePrint = () => {
  console.log('Print material moves')
}

export default function MaterialMovesPage() {
  const [materialMoves, setMaterialMoves] = React.useState<MaterialMove[]>([])
  const [loading, setLoading] = React.useState(true)

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchMaterialMoves = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockMaterialMoves: MaterialMove[] = [
        {
          id: '1',
          code: 'MM-001',
          materialId: '1',
          materialName: 'أسمنت',
          materialCode: 'MAT-001',
          moveType: 'IN',
          quantity: 100,
          unitPrice: 25,
          totalValue: 2500,
          fromWarehouseId: null,
          fromWarehouseName: null,
          toWarehouseId: '1',
          toWarehouseName: 'المخزن الرئيسي',
          projectId: null,
          projectName: null,
          projectCode: null,
          phaseId: null,
          phaseName: null,
          supplierId: '1',
          supplierName: 'شركة الأسمنت السعودية',
          reference: 'فاتورة رقم 12345',
          notes: 'شحنة جديدة من الأسمنت',
          date: new Date('2024-03-15T10:00:00'),
          createdBy: 'أحمد محمد',
          status: 'APPROVED',
        },
        {
          id: '2',
          code: 'MM-002',
          materialId: '2',
          materialName: 'حديد تسليح',
          materialCode: 'MAT-002',
          moveType: 'OUT',
          quantity: 50,
          unitPrice: 80,
          totalValue: 4000,
          fromWarehouseId: '1',
          fromWarehouseName: 'المخزن الرئيسي',
          toWarehouseId: null,
          toWarehouseName: null,
          projectId: '1',
          projectName: 'فيلا الرياض',
          projectCode: 'PRJ-001',
          phaseId: '2',
          phaseName: 'الخرسانة المسلحة',
          supplierId: null,
          supplierName: null,
          reference: 'طلب مرحلة الخرسانة',
          notes: 'حديد للخرسانة المسلحة',
          date: new Date('2024-03-14T14:30:00'),
          createdBy: 'محمد علي',
          status: 'APPROVED',
        },
        {
          id: '3',
          code: 'MM-003',
          materialId: '3',
          materialName: 'طوب',
          materialCode: 'MAT-003',
          moveType: 'TRANSFER',
          quantity: 200,
          unitPrice: 2.5,
          totalValue: 500,
          fromWarehouseId: '1',
          fromWarehouseName: 'المخزن الرئيسي',
          toWarehouseId: '2',
          toWarehouseName: 'مخزن المشروع',
          projectId: '1',
          projectName: 'فيلا الرياض',
          projectCode: 'PRJ-001',
          phaseId: '3',
          phaseName: 'البناء',
          supplierId: null,
          supplierName: null,
          reference: 'تحويل للمشروع',
          notes: 'تحويل طوب لموقع المشروع',
          date: new Date('2024-03-13T09:15:00'),
          createdBy: 'علي أحمد',
          status: 'APPROVED',
        },
        {
          id: '4',
          code: 'MM-004',
          materialId: '1',
          materialName: 'أسمنت',
          materialCode: 'MAT-001',
          moveType: 'ADJUST',
          quantity: -5,
          unitPrice: 25,
          totalValue: -125,
          fromWarehouseId: '1',
          fromWarehouseName: 'المخزن الرئيسي',
          toWarehouseId: null,
          toWarehouseName: null,
          projectId: null,
          projectName: null,
          projectCode: null,
          phaseId: null,
          phaseName: null,
          supplierId: null,
          supplierName: null,
          reference: 'تعديل مخزون',
          notes: 'تعديل بسبب تلف في التخزين',
          date: new Date('2024-03-12T16:45:00'),
          createdBy: 'فاطمة أحمد',
          status: 'APPROVED',
        },
        {
          id: '5',
          code: 'MM-005',
          materialId: '4',
          materialName: 'رمل',
          materialCode: 'MAT-004',
          moveType: 'IN',
          quantity: 500,
          unitPrice: 15,
          totalValue: 7500,
          fromWarehouseId: null,
          fromWarehouseName: null,
          toWarehouseId: '1',
          toWarehouseName: 'المخزن الرئيسي',
          projectId: null,
          projectName: null,
          projectCode: null,
          phaseId: null,
          phaseName: null,
          supplierId: '2',
          supplierName: 'مؤسسة الرمل الأبيض',
          reference: 'فاتورة رقم 67890',
          notes: 'شحنة رمل للخرسانة',
          date: new Date('2024-03-11T11:20:00'),
          createdBy: 'أحمد محمد',
          status: 'PENDING',
        },
      ]
      
      setMaterialMoves(mockMaterialMoves)
      setLoading(false)
    }

    fetchMaterialMoves()
  }, [])

  // Calculate statistics
  const totalMoves = materialMoves.length
  const totalInMoves = materialMoves.filter(m => m.moveType === 'IN').length
  const totalOutMoves = materialMoves.filter(m => m.moveType === 'OUT').length
  const totalTransferMoves = materialMoves.filter(m => m.moveType === 'TRANSFER').length
  const totalAdjustMoves = materialMoves.filter(m => m.moveType === 'ADJUST').length
  const totalValue = materialMoves.reduce((sum, move) => sum + move.totalValue, 0)
  const pendingMoves = materialMoves.filter(m => m.status === 'PENDING').length

  const moveTypeFilters = [
    { label: 'وارد', value: 'IN' },
    { label: 'صادر', value: 'OUT' },
    { label: 'تحويل', value: 'TRANSFER' },
    { label: 'تعديل', value: 'ADJUST' },
  ]

  const statusFilters = [
    { label: 'في الانتظار', value: 'PENDING' },
    { label: 'موافق', value: 'APPROVED' },
    { label: 'مرفوض', value: 'REJECTED' },
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
          <h1 className="text-3xl font-bold">حركات المواد</h1>
          <p className="text-muted-foreground">
            تتبع حركات المواد في المخازن والمشاريع
          </p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إضافة حركة جديدة
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الحركات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMoves}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حركات واردة</CardTitle>
            <ArrowDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalInMoves}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حركات صادرة</CardTitle>
            <ArrowUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalOutMoves}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">في الانتظار</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingMoves}</div>
          </CardContent>
        </Card>
      </div>

      {/* Move Types Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            ملخص أنواع الحركات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">تحويلات</span>
              <span className="text-2xl font-bold text-blue-600">{totalTransferMoves}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">تعديلات</span>
              <span className="text-2xl font-bold text-orange-600">{totalAdjustMoves}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">إجمالي القيمة</span>
              <span className="text-2xl font-bold">{formatCurrency(totalValue)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">متوسط القيمة</span>
              <span className="text-2xl font-bold">
                {totalMoves > 0 ? formatCurrency(totalValue / totalMoves) : '0'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={materialMoves}
        searchPlaceholder="البحث في حركات المواد..."
        filters={[
          {
            key: 'moveType',
            label: 'نوع الحركة',
            options: moveTypeFilters,
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
        title="قائمة حركات المواد"
        description={`إجمالي ${totalMoves} حركة`}
        loading={loading}
        emptyMessage="لا توجد حركات مواد"
      />
    </motion.div>
  )
}