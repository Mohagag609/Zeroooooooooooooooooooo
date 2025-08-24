'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatDate, formatCurrency } from '@/lib/utils'
import { 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Calendar,
  DollarSign,
  User,
  Building2,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Define the Invoice type
interface Invoice {
  id: string
  number: string
  type: 'CLIENT' | 'SUPPLIER'
  clientId: string | null
  clientName: string | null
  supplierId: string | null
  supplierName: string | null
  projectId: string | null
  projectName: string | null
  projectCode: string | null
  issueDate: Date
  dueDate: Date
  subtotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  paidAmount: number
  balanceAmount: number
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID'
  currency: string
  notes: string
  terms: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'number',
    header: 'رقم الفاتورة',
    cell: ({ row }) => {
      const invoice = row.original
      return (
        <div className="flex flex-col">
          <div className="font-mono text-sm font-medium">{invoice.number}</div>
          <div className="text-xs text-muted-foreground">
            {invoice.type === 'CLIENT' ? 'فاتورة عميل' : 'فاتورة مورد'}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'clientName',
    header: 'العميل/المورد',
    cell: ({ row }) => {
      const invoice = row.original
      const name = invoice.type === 'CLIENT' ? invoice.clientName : invoice.supplierName
      return (
        <div className="flex flex-col">
          <div className="font-medium">{name}</div>
          <div className="text-sm text-muted-foreground">
            {invoice.type === 'CLIENT' ? 'عميل' : 'مورد'}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'projectName',
    header: 'المشروع',
    cell: ({ row }) => {
      const invoice = row.original
      if (!invoice.projectName) return <span className="text-muted-foreground">-</span>
      
      return (
        <div className="flex flex-col">
          <div className="font-medium">{invoice.projectName}</div>
          <div className="text-sm text-muted-foreground">
            {invoice.projectCode}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'totalAmount',
    header: 'المبلغ',
    cell: ({ row }) => {
      const invoice = row.original
      const paymentPercentage = invoice.totalAmount > 0 
        ? (invoice.paidAmount / invoice.totalAmount) * 100 
        : 0
      
      return (
        <div className="flex flex-col">
          <div className="font-medium">{formatCurrency(invoice.totalAmount)}</div>
          <div className="text-sm text-muted-foreground">
            مدفوع: {formatCurrency(invoice.paidAmount)}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  paymentPercentage === 100 ? 'bg-green-600' : 
                  paymentPercentage > 50 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                style={{ width: `${paymentPercentage}%` }}
              />
            </div>
            <span className="text-xs font-medium">{paymentPercentage.toFixed(0)}%</span>
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
        DRAFT: { label: 'مسودة', variant: 'secondary' as const, icon: FileText },
        SENT: { label: 'مرسلة', variant: 'default' as const, icon: Send },
        PAID: { label: 'مدفوعة', variant: 'success' as const, icon: CheckCircle },
        OVERDUE: { label: 'متأخرة', variant: 'destructive' as const, icon: AlertTriangle },
        CANCELLED: { label: 'ملغية', variant: 'secondary' as const, icon: XCircle },
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
    accessorKey: 'issueDate',
    header: 'التواريخ',
    cell: ({ row }) => {
      const invoice = row.original
      const isOverdue = invoice.status === 'OVERDUE' && new Date() > invoice.dueDate
      
      return (
        <div className="flex flex-col text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>إصدار: {formatDate(invoice.issueDate)}</span>
          </div>
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : ''}`}>
            <Calendar className="h-3 w-3" />
            <span>استحقاق: {formatDate(invoice.dueDate)}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'balanceAmount',
    header: 'المتبقي',
    cell: ({ row }) => {
      const invoice = row.original
      const isOverdue = invoice.status === 'OVERDUE' && new Date() > invoice.dueDate
      
      return (
        <div className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
          {formatCurrency(invoice.balanceAmount)}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => {
      const invoice = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(invoice.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(invoice.id)}
            disabled={invoice.status === 'PAID' || invoice.status === 'CANCELLED'}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDownload(invoice.id)}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(invoice.id)}
            disabled={invoice.status === 'PAID'}
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
  console.log('View invoice:', id)
}

const handleEdit = (id: string) => {
  console.log('Edit invoice:', id)
}

const handleDownload = (id: string) => {
  console.log('Download invoice:', id)
}

const handleDelete = (id: string) => {
  console.log('Delete invoice:', id)
}

const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
  console.log('Export invoices:', format)
}

const handlePrint = () => {
  console.log('Print invoices')
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = React.useState<Invoice[]>([])
  const [loading, setLoading] = React.useState(true)

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockInvoices: Invoice[] = [
        {
          id: '1',
          number: 'INV-2024-001',
          type: 'CLIENT',
          clientId: '1',
          clientName: 'أحمد محمد',
          supplierId: null,
          supplierName: null,
          projectId: '1',
          projectName: 'فيلا الرياض',
          projectCode: 'PRJ-001',
          issueDate: new Date('2024-03-01'),
          dueDate: new Date('2024-03-31'),
          subtotal: 100000,
          taxAmount: 15000,
          discountAmount: 5000,
          totalAmount: 110000,
          paidAmount: 110000,
          balanceAmount: 0,
          status: 'PAID',
          paymentStatus: 'PAID',
          currency: 'SAR',
          notes: 'فاتورة مرحلة الأساسات',
          terms: 'شروط الدفع: 30 يوم من تاريخ الإصدار',
          createdBy: 'محمد علي',
          createdAt: new Date('2024-03-01T10:00:00'),
          updatedAt: new Date('2024-03-15T14:30:00'),
        },
        {
          id: '2',
          number: 'INV-2024-002',
          type: 'CLIENT',
          clientId: '1',
          clientName: 'أحمد محمد',
          supplierId: null,
          supplierName: null,
          projectId: '1',
          projectName: 'فيلا الرياض',
          projectCode: 'PRJ-001',
          issueDate: new Date('2024-03-10'),
          dueDate: new Date('2024-04-09'),
          subtotal: 150000,
          taxAmount: 22500,
          discountAmount: 0,
          totalAmount: 172500,
          paidAmount: 86000,
          balanceAmount: 86500,
          status: 'SENT',
          paymentStatus: 'PARTIAL',
          currency: 'SAR',
          notes: 'فاتورة مرحلة الخرسانة المسلحة',
          terms: 'شروط الدفع: 30 يوم من تاريخ الإصدار',
          createdBy: 'محمد علي',
          createdAt: new Date('2024-03-10T11:00:00'),
          updatedAt: new Date('2024-03-10T11:00:00'),
        },
        {
          id: '3',
          number: 'INV-2024-003',
          type: 'SUPPLIER',
          clientId: null,
          clientName: null,
          supplierId: '1',
          supplierName: 'شركة الأسمنت السعودية',
          projectId: null,
          projectName: null,
          projectCode: null,
          issueDate: new Date('2024-03-05'),
          dueDate: new Date('2024-03-20'),
          subtotal: 25000,
          taxAmount: 3750,
          discountAmount: 0,
          totalAmount: 28750,
          paidAmount: 28750,
          balanceAmount: 0,
          status: 'PAID',
          paymentStatus: 'PAID',
          currency: 'SAR',
          notes: 'فاتورة أسمنت',
          terms: 'شروط الدفع: 15 يوم من تاريخ الإصدار',
          createdBy: 'علي أحمد',
          createdAt: new Date('2024-03-05T09:00:00'),
          updatedAt: new Date('2024-03-18T16:00:00'),
        },
        {
          id: '4',
          number: 'INV-2024-004',
          type: 'SUPPLIER',
          clientId: null,
          clientName: null,
          supplierId: '2',
          supplierName: 'مؤسسة الرمل الأبيض',
          projectId: null,
          projectName: null,
          projectCode: null,
          issueDate: new Date('2024-03-01'),
          dueDate: new Date('2024-03-16'),
          subtotal: 15000,
          taxAmount: 2250,
          discountAmount: 0,
          totalAmount: 17250,
          paidAmount: 0,
          balanceAmount: 17250,
          status: 'OVERDUE',
          paymentStatus: 'UNPAID',
          currency: 'SAR',
          notes: 'فاتورة رمل',
          terms: 'شروط الدفع: 15 يوم من تاريخ الإصدار',
          createdBy: 'علي أحمد',
          createdAt: new Date('2024-03-01T08:00:00'),
          updatedAt: new Date('2024-03-01T08:00:00'),
        },
        {
          id: '5',
          number: 'INV-2024-005',
          type: 'CLIENT',
          clientId: '2',
          clientName: 'خالد عبدالله',
          supplierId: null,
          supplierName: null,
          projectId: '2',
          projectName: 'مجمع تجاري جدة',
          projectCode: 'PRJ-002',
          issueDate: new Date('2024-03-12'),
          dueDate: new Date('2024-04-11'),
          subtotal: 200000,
          taxAmount: 30000,
          discountAmount: 10000,
          totalAmount: 220000,
          paidAmount: 0,
          balanceAmount: 220000,
          status: 'DRAFT',
          paymentStatus: 'UNPAID',
          currency: 'SAR',
          notes: 'فاتورة مرحلة الأساسات',
          terms: 'شروط الدفع: 30 يوم من تاريخ الإصدار',
          createdBy: 'فاطمة أحمد',
          createdAt: new Date('2024-03-12T15:00:00'),
          updatedAt: new Date('2024-03-12T15:00:00'),
        },
      ]
      
      setInvoices(mockInvoices)
      setLoading(false)
    }

    fetchInvoices()
  }, [])

  // Calculate statistics
  const totalInvoices = invoices.length
  const clientInvoices = invoices.filter(i => i.type === 'CLIENT')
  const supplierInvoices = invoices.filter(i => i.type === 'SUPPLIER')
  const paidInvoices = invoices.filter(i => i.status === 'PAID')
  const overdueInvoices = invoices.filter(i => i.status === 'OVERDUE')
  const totalAmount = invoices.reduce((sum, i) => sum + i.totalAmount, 0)
  const totalPaid = invoices.reduce((sum, i) => sum + i.paidAmount, 0)
  const totalBalance = invoices.reduce((sum, i) => sum + i.balanceAmount, 0)
  const clientTotal = clientInvoices.reduce((sum, i) => sum + i.totalAmount, 0)
  const supplierTotal = supplierInvoices.reduce((sum, i) => sum + i.totalAmount, 0)

  const typeFilters = [
    { label: 'فواتير عملاء', value: 'CLIENT' },
    { label: 'فواتير موردين', value: 'SUPPLIER' },
  ]

  const statusFilters = [
    { label: 'مسودة', value: 'DRAFT' },
    { label: 'مرسلة', value: 'SENT' },
    { label: 'مدفوعة', value: 'PAID' },
    { label: 'متأخرة', value: 'OVERDUE' },
    { label: 'ملغية', value: 'CANCELLED' },
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
          <h1 className="text-3xl font-bold">الفواتير</h1>
          <p className="text-muted-foreground">
            إدارة فواتير العملاء والموردين
          </p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إنشاء فاتورة جديدة
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الفواتير</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">فواتير مدفوعة</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidInvoices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">فواتير متأخرة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueInvoices.length}</div>
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
              <span className="text-sm text-muted-foreground">إجمالي المدفوع</span>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">المتبقي</span>
              <span className="text-2xl font-bold text-red-600">{formatCurrency(totalBalance)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">فواتير عملاء</span>
              <span className="text-2xl font-bold">{formatCurrency(clientTotal)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">فواتير موردين</span>
              <span className="text-2xl font-bold">{formatCurrency(supplierTotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={invoices}
        searchPlaceholder="البحث في الفواتير..."
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
        title="قائمة الفواتير"
        description={`إجمالي ${totalInvoices} فاتورة`}
        loading={loading}
        emptyMessage="لا توجد فواتير"
      />
    </motion.div>
  )
}