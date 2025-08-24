'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatDate, formatCurrency } from '@/lib/utils'
import { 
  ArrowLeftRight, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Calendar,
  DollarSign,
  Building2,
  CreditCard,
  Wallet,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Define the Transfer type
interface Transfer {
  id: string
  code: string
  fromAccountId: string
  fromAccountName: string
  fromAccountType: 'CASHBOX' | 'BANK'
  fromAccountNumber: string
  toAccountId: string
  toAccountName: string
  toAccountType: 'CASHBOX' | 'BANK'
  toAccountNumber: string
  amount: number
  fee: number
  netAmount: number
  description: string
  reference: string
  transferDate: Date
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  transferType: 'INTERNAL' | 'EXTERNAL'
  method: 'BANK_TRANSFER' | 'CASH' | 'CHECK' | 'WIRE'
  notes: string
  createdBy: string
  createdAt: Date
  completedAt: Date | null
}

const columns: ColumnDef<Transfer>[] = [
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
    accessorKey: 'fromAccountName',
    header: 'من حساب',
    cell: ({ row }) => {
      const transfer = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{transfer.fromAccountName}</div>
          <div className="text-sm text-muted-foreground">
            {transfer.fromAccountType === 'BANK' ? 'بنك' : 'خزنة'}
          </div>
          <div className="text-xs text-muted-foreground">
            {transfer.fromAccountNumber}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'toAccountName',
    header: 'إلى حساب',
    cell: ({ row }) => {
      const transfer = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{transfer.toAccountName}</div>
          <div className="text-sm text-muted-foreground">
            {transfer.toAccountType === 'BANK' ? 'بنك' : 'خزنة'}
          </div>
          <div className="text-xs text-muted-foreground">
            {transfer.toAccountNumber}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: 'المبلغ',
    cell: ({ row }) => {
      const transfer = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{formatCurrency(transfer.amount)}</div>
          {transfer.fee > 0 && (
            <div className="text-sm text-muted-foreground">
              رسوم: {formatCurrency(transfer.fee)}
            </div>
          )}
          <div className="text-sm font-medium text-blue-600">
            صافي: {formatCurrency(transfer.netAmount)}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'transferType',
    header: 'النوع',
    cell: ({ row }) => {
      const transferType = row.getValue('transferType') as string
      const method = row.original.method
      
      const methodConfig = {
        BANK_TRANSFER: { label: 'تحويل بنكي', variant: 'default' as const, icon: Building2 },
        CASH: { label: 'نقدي', variant: 'secondary' as const, icon: Wallet },
        CHECK: { label: 'شيك', variant: 'outline' as const, icon: CreditCard },
        WIRE: { label: 'تحويل سريع', variant: 'success' as const, icon: ArrowLeftRight },
      }
      const config = methodConfig[method as keyof typeof methodConfig]
      const Icon = config.icon
      
      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <Badge variant={config.variant} className="text-xs">
            {config.label}
          </Badge>
          <div className="text-xs text-muted-foreground">
            {transferType === 'INTERNAL' ? 'داخلي' : 'خارجي'}
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
        PENDING: { label: 'في الانتظار', variant: 'warning' as const, icon: Clock },
        COMPLETED: { label: 'مكتمل', variant: 'success' as const, icon: CheckCircle },
        FAILED: { label: 'فشل', variant: 'destructive' as const, icon: XCircle },
        CANCELLED: { label: 'ملغي', variant: 'secondary' as const, icon: XCircle },
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
    accessorKey: 'transferDate',
    header: 'التاريخ',
    cell: ({ row }) => {
      const transfer = row.original
      return (
        <div className="flex flex-col text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>تحويل: {formatDate(transfer.transferDate)}</span>
          </div>
          {transfer.completedAt && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3" />
              <span>إكمال: {formatDate(transfer.completedAt)}</span>
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'الوصف',
    cell: ({ row }) => {
      const transfer = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{transfer.description}</div>
          <div className="text-sm text-muted-foreground">
            {transfer.reference}
          </div>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => {
      const transfer = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(transfer.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(transfer.id)}
            disabled={transfer.status !== 'PENDING'}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(transfer.id)}
            disabled={transfer.status === 'COMPLETED'}
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
  console.log('View transfer:', id)
}

const handleEdit = (id: string) => {
  console.log('Edit transfer:', id)
}

const handleDelete = (id: string) => {
  console.log('Delete transfer:', id)
}

const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
  console.log('Export transfers:', format)
}

const handlePrint = () => {
  console.log('Print transfers')
}

export default function TransfersPage() {
  const [transfers, setTransfers] = React.useState<Transfer[]>([])
  const [loading, setLoading] = React.useState(true)

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchTransfers = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockTransfers: Transfer[] = [
        {
          id: '1',
          code: 'TRF-001',
          fromAccountId: '1',
          fromAccountName: 'الخزنة الرئيسية',
          fromAccountType: 'CASHBOX',
          fromAccountNumber: 'CASH-001',
          toAccountId: '2',
          toAccountName: 'بنك الراجحي',
          toAccountType: 'BANK',
          toAccountNumber: '1234567890',
          amount: 50000,
          fee: 25,
          netAmount: 49975,
          description: 'إيداع أموال في البنك',
          reference: 'إيداع يومي',
          transferDate: new Date('2024-03-15T10:00:00'),
          status: 'COMPLETED',
          transferType: 'INTERNAL',
          method: 'BANK_TRANSFER',
          notes: 'إيداع أموال من الخزنة إلى البنك',
          createdBy: 'أحمد محمد',
          createdAt: new Date('2024-03-15T09:30:00'),
          completedAt: new Date('2024-03-15T10:15:00'),
        },
        {
          id: '2',
          code: 'TRF-002',
          fromAccountId: '2',
          fromAccountName: 'بنك الراجحي',
          fromAccountType: 'BANK',
          fromAccountNumber: '1234567890',
          toAccountId: '3',
          toAccountName: 'بنك الأهلي',
          toAccountType: 'BANK',
          toAccountNumber: '0987654321',
          amount: 100000,
          fee: 50,
          netAmount: 99950,
          description: 'تحويل بين البنوك',
          reference: 'تحويل مشروع فيلا الرياض',
          transferDate: new Date('2024-03-14T14:00:00'),
          status: 'COMPLETED',
          transferType: 'INTERNAL',
          method: 'WIRE',
          notes: 'تحويل مبلغ المشروع إلى البنك الأهلي',
          createdBy: 'محمد علي',
          createdAt: new Date('2024-03-14T13:30:00'),
          completedAt: new Date('2024-03-14T14:30:00'),
        },
        {
          id: '3',
          code: 'TRF-003',
          fromAccountId: '3',
          fromAccountName: 'بنك الأهلي',
          fromAccountType: 'BANK',
          fromAccountNumber: '0987654321',
          toAccountId: '1',
          toAccountName: 'الخزنة الرئيسية',
          toAccountType: 'CASHBOX',
          toAccountNumber: 'CASH-001',
          amount: 25000,
          fee: 0,
          netAmount: 25000,
          description: 'سحب نقدي',
          reference: 'سحب للمصروفات اليومية',
          transferDate: new Date('2024-03-13T16:00:00'),
          status: 'COMPLETED',
          transferType: 'INTERNAL',
          method: 'CASH',
          notes: 'سحب نقدي للمصروفات',
          createdBy: 'علي أحمد',
          createdAt: new Date('2024-03-13T15:30:00'),
          completedAt: new Date('2024-03-13T16:15:00'),
        },
        {
          id: '4',
          code: 'TRF-004',
          fromAccountId: '2',
          fromAccountName: 'بنك الراجحي',
          fromAccountType: 'BANK',
          fromAccountNumber: '1234567890',
          toAccountId: '4',
          toAccountName: 'شركة الأسمنت السعودية',
          toAccountType: 'BANK',
          toAccountNumber: '5555555555',
          amount: 28750,
          fee: 30,
          netAmount: 28720,
          description: 'دفع فاتورة أسمنت',
          reference: 'فاتورة رقم 12345',
          transferDate: new Date('2024-03-12T11:00:00'),
          status: 'COMPLETED',
          transferType: 'EXTERNAL',
          method: 'BANK_TRANSFER',
          notes: 'دفع فاتورة المورد',
          createdBy: 'فاطمة أحمد',
          createdAt: new Date('2024-03-12T10:30:00'),
          completedAt: new Date('2024-03-12T11:30:00'),
        },
        {
          id: '5',
          code: 'TRF-005',
          fromAccountId: '1',
          fromAccountName: 'الخزنة الرئيسية',
          fromAccountType: 'CASHBOX',
          fromAccountNumber: 'CASH-001',
          toAccountId: '5',
          toAccountName: 'مؤسسة الرمل الأبيض',
          toAccountType: 'BANK',
          toAccountNumber: '6666666666',
          amount: 17250,
          fee: 25,
          netAmount: 17225,
          description: 'دفع فاتورة رمل',
          reference: 'فاتورة رقم 67890',
          transferDate: new Date('2024-03-11T09:00:00'),
          status: 'PENDING',
          transferType: 'EXTERNAL',
          method: 'BANK_TRANSFER',
          notes: 'دفع فاتورة رمل متأخرة',
          createdBy: 'خالد محمد',
          createdAt: new Date('2024-03-11T08:30:00'),
          completedAt: null,
        },
      ]
      
      setTransfers(mockTransfers)
      setLoading(false)
    }

    fetchTransfers()
  }, [])

  // Calculate statistics
  const totalTransfers = transfers.length
  const completedTransfers = transfers.filter(t => t.status === 'COMPLETED').length
  const pendingTransfers = transfers.filter(t => t.status === 'PENDING').length
  const failedTransfers = transfers.filter(t => t.status === 'FAILED').length
  const totalAmount = transfers.reduce((sum, t) => sum + t.amount, 0)
  const totalFees = transfers.reduce((sum, t) => sum + t.fee, 0)
  const totalNetAmount = transfers.reduce((sum, t) => sum + t.netAmount, 0)
  const internalTransfers = transfers.filter(t => t.transferType === 'INTERNAL').length
  const externalTransfers = transfers.filter(t => t.transferType === 'EXTERNAL').length

  const statusFilters = [
    { label: 'في الانتظار', value: 'PENDING' },
    { label: 'مكتمل', value: 'COMPLETED' },
    { label: 'فشل', value: 'FAILED' },
    { label: 'ملغي', value: 'CANCELLED' },
  ]

  const typeFilters = [
    { label: 'داخلي', value: 'INTERNAL' },
    { label: 'خارجي', value: 'EXTERNAL' },
  ]

  const methodFilters = [
    { label: 'تحويل بنكي', value: 'BANK_TRANSFER' },
    { label: 'نقدي', value: 'CASH' },
    { label: 'شيك', value: 'CHECK' },
    { label: 'تحويل سريع', value: 'WIRE' },
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
          <h1 className="text-3xl font-bold">التحويلات المالية</h1>
          <p className="text-muted-foreground">
            إدارة التحويلات بين الحسابات والبنوك
          </p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إنشاء تحويل جديد
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التحويلات</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransfers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تحويلات مكتملة</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTransfers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">في الانتظار</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingTransfers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المبالغ</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalAmount)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            ملخص مالي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">إجمالي الرسوم</span>
              <span className="text-2xl font-bold text-red-600">{formatCurrency(totalFees)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">الصافي</span>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(totalNetAmount)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">تحويلات داخلية</span>
              <span className="text-2xl font-bold">{internalTransfers}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">تحويلات خارجية</span>
              <span className="text-2xl font-bold">{externalTransfers}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={transfers}
        searchPlaceholder="البحث في التحويلات..."
        filters={[
          {
            key: 'status',
            label: 'الحالة',
            options: statusFilters,
          },
          {
            key: 'transferType',
            label: 'النوع',
            options: typeFilters,
          },
          {
            key: 'method',
            label: 'الطريقة',
            options: methodFilters,
          },
        ]}
        onExport={handleExport}
        onPrint={handlePrint}
        enableSelection={true}
        title="قائمة التحويلات"
        description={`إجمالي ${totalTransfers} تحويل`}
        loading={loading}
        emptyMessage="لا توجد تحويلات"
      />
    </motion.div>
  )
}