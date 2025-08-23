'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatDate, formatCurrency } from '@/lib/utils'
import { 
  CreditCard, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Calendar,
  DollarSign,
  Users,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Calculator
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Define the Payroll type
interface Payroll {
  id: string
  code: string
  employeeId: string
  employeeName: string
  employeeCode: string
  period: string
  month: number
  year: number
  payDate: Date
  basicSalary: number
  allowance: number
  overtime: number
  bonus: number
  deductions: number
  tax: number
  insurance: number
  netSalary: number
  status: 'DRAFT' | 'APPROVED' | 'PAID' | 'CANCELLED'
  paymentMethod: 'BANK_TRANSFER' | 'CASH' | 'CHECK'
  bankName: string
  bankAccount: string
  iban: string
  notes: string
  approvedBy: string | null
  approvedAt: Date | null
  paidAt: Date | null
  createdAt: Date
  updatedAt: Date
}

const columns: ColumnDef<Payroll>[] = [
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
    accessorKey: 'employeeName',
    header: 'الموظف',
    cell: ({ row }) => {
      const payroll = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{payroll.employeeName}</div>
          <div className="text-sm text-muted-foreground">
            {payroll.employeeCode}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'period',
    header: 'الفترة',
    cell: ({ row }) => {
      const payroll = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{payroll.period}</div>
          <div className="text-sm text-muted-foreground">
            {payroll.month}/{payroll.year}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'basicSalary',
    header: 'الراتب',
    cell: ({ row }) => {
      const payroll = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{formatCurrency(payroll.basicSalary)}</div>
          <div className="text-sm text-muted-foreground">
            بدل: {formatCurrency(payroll.allowance)}
          </div>
          {payroll.overtime > 0 && (
            <div className="text-sm text-muted-foreground">
              إضافي: {formatCurrency(payroll.overtime)}
            </div>
          )}
          {payroll.bonus > 0 && (
            <div className="text-sm text-green-600">
              مكافأة: {formatCurrency(payroll.bonus)}
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'deductions',
    header: 'الخصومات',
    cell: ({ row }) => {
      const payroll = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium text-red-600">
            -{formatCurrency(payroll.deductions)}
          </div>
          <div className="text-sm text-muted-foreground">
            ضريبة: {formatCurrency(payroll.tax)}
          </div>
          <div className="text-sm text-muted-foreground">
            تأمين: {formatCurrency(payroll.insurance)}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'netSalary',
    header: 'صافي الراتب',
    cell: ({ row }) => {
      const payroll = row.original
      return (
        <div className="font-bold text-lg text-blue-600">
          {formatCurrency(payroll.netSalary)}
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
        DRAFT: { label: 'مسودة', variant: 'secondary' as const, icon: Clock },
        APPROVED: { label: 'موافق', variant: 'default' as const, icon: CheckCircle },
        PAID: { label: 'مدفوع', variant: 'success' as const, icon: CheckCircle },
        CANCELLED: { label: 'ملغي', variant: 'destructive' as const, icon: XCircle },
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
    accessorKey: 'payDate',
    header: 'التواريخ',
    cell: ({ row }) => {
      const payroll = row.original
      return (
        <div className="flex flex-col text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>دفع: {formatDate(payroll.payDate)}</span>
          </div>
          {payroll.approvedAt && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3" />
              <span>موافقة: {formatDate(payroll.approvedAt)}</span>
            </div>
          )}
          {payroll.paidAt && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CreditCard className="h-3 w-3" />
              <span>دفع: {formatDate(payroll.paidAt)}</span>
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'paymentMethod',
    header: 'طريقة الدفع',
    cell: ({ row }) => {
      const paymentMethod = row.getValue('paymentMethod') as string
      const paymentMethodConfig = {
        BANK_TRANSFER: { label: 'تحويل بنكي', variant: 'default' as const },
        CASH: { label: 'نقدي', variant: 'secondary' as const },
        CHECK: { label: 'شيك', variant: 'outline' as const },
      }
      const config = paymentMethodConfig[paymentMethod as keyof typeof paymentMethodConfig]
      
      return (
        <div className="flex flex-col">
          <Badge variant={config.variant} className="text-xs">
            {config.label}
          </Badge>
          <div className="text-xs text-muted-foreground">
            {payroll.bankName}
          </div>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => {
      const payroll = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(payroll.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(payroll.id)}
            disabled={payroll.status !== 'DRAFT'}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDownload(payroll.id)}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(payroll.id)}
            disabled={payroll.status === 'PAID'}
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
  console.log('View payroll:', id)
}

const handleEdit = (id: string) => {
  console.log('Edit payroll:', id)
}

const handleDownload = (id: string) => {
  console.log('Download payroll:', id)
}

const handleDelete = (id: string) => {
  console.log('Delete payroll:', id)
}

const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
  console.log('Export payrolls:', format)
}

const handlePrint = () => {
  console.log('Print payrolls')
}

export default function PayrollsPage() {
  const [payrolls, setPayrolls] = React.useState<Payroll[]>([])
  const [loading, setLoading] = React.useState(true)

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchPayrolls = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockPayrolls: Payroll[] = [
        {
          id: '1',
          code: 'PR-2024-03-001',
          employeeId: '1',
          employeeName: 'أحمد محمد',
          employeeCode: 'EMP-001',
          period: 'مارس 2024',
          month: 3,
          year: 2024,
          payDate: new Date('2024-03-31'),
          basicSalary: 15000,
          allowance: 2000,
          overtime: 1500,
          bonus: 1000,
          deductions: 500,
          tax: 1500,
          insurance: 750,
          netSalary: 16750,
          status: 'PAID',
          paymentMethod: 'BANK_TRANSFER',
          bankName: 'بنك الراجحي',
          bankAccount: '1234567890',
          iban: 'SA0380000000608010167519',
          notes: 'مرتب مارس 2024',
          approvedBy: 'مدير الموارد البشرية',
          approvedAt: new Date('2024-03-30T10:00:00'),
          paidAt: new Date('2024-03-31T09:00:00'),
          createdAt: new Date('2024-03-25T08:00:00'),
          updatedAt: new Date('2024-03-31T09:00:00'),
        },
        {
          id: '2',
          code: 'PR-2024-03-002',
          employeeId: '2',
          employeeName: 'محمد علي',
          employeeCode: 'EMP-002',
          period: 'مارس 2024',
          month: 3,
          year: 2024,
          payDate: new Date('2024-03-31'),
          basicSalary: 12000,
          allowance: 1500,
          overtime: 800,
          bonus: 0,
          deductions: 300,
          tax: 1200,
          insurance: 600,
          netSalary: 12200,
          status: 'PAID',
          paymentMethod: 'BANK_TRANSFER',
          bankName: 'بنك الأهلي',
          bankAccount: '0987654321',
          iban: 'SA0380000000608010167520',
          notes: 'مرتب مارس 2024',
          approvedBy: 'مدير الموارد البشرية',
          approvedAt: new Date('2024-03-30T10:30:00'),
          paidAt: new Date('2024-03-31T09:15:00'),
          createdAt: new Date('2024-03-25T08:30:00'),
          updatedAt: new Date('2024-03-31T09:15:00'),
        },
        {
          id: '3',
          code: 'PR-2024-03-003',
          employeeId: '3',
          employeeName: 'علي أحمد',
          employeeCode: 'EMP-003',
          period: 'مارس 2024',
          month: 3,
          year: 2024,
          payDate: new Date('2024-03-31'),
          basicSalary: 10000,
          allowance: 1000,
          overtime: 0,
          bonus: 500,
          deductions: 200,
          tax: 1000,
          insurance: 500,
          netSalary: 9800,
          status: 'APPROVED',
          paymentMethod: 'BANK_TRANSFER',
          bankName: 'بنك سامبا',
          bankAccount: '1122334455',
          iban: 'SA0380000000608010167521',
          notes: 'مرتب مارس 2024',
          approvedBy: 'مدير الموارد البشرية',
          approvedAt: new Date('2024-03-30T11:00:00'),
          paidAt: null,
          createdAt: new Date('2024-03-25T09:00:00'),
          updatedAt: new Date('2024-03-30T11:00:00'),
        },
        {
          id: '4',
          code: 'PR-2024-03-004',
          employeeId: '4',
          employeeName: 'فاطمة أحمد',
          employeeCode: 'EMP-004',
          period: 'مارس 2024',
          month: 3,
          year: 2024,
          payDate: new Date('2024-03-31'),
          basicSalary: 11000,
          allowance: 1200,
          overtime: 0,
          bonus: 0,
          deductions: 0,
          tax: 1100,
          insurance: 550,
          netSalary: 10550,
          status: 'DRAFT',
          paymentMethod: 'BANK_TRANSFER',
          bankName: 'بنك الراجحي',
          bankAccount: '2233445566',
          iban: 'SA0380000000608010167522',
          notes: 'مرتب مارس 2024 - في إجازة',
          approvedBy: null,
          approvedAt: null,
          paidAt: null,
          createdAt: new Date('2024-03-25T09:30:00'),
          updatedAt: new Date('2024-03-25T09:30:00'),
        },
        {
          id: '5',
          code: 'PR-2024-02-005',
          employeeId: '5',
          employeeName: 'خالد محمد',
          employeeCode: 'EMP-005',
          period: 'فبراير 2024',
          month: 2,
          year: 2024,
          payDate: new Date('2024-02-29'),
          basicSalary: 8000,
          allowance: 500,
          overtime: 1200,
          bonus: 0,
          deductions: 100,
          tax: 800,
          insurance: 400,
          netSalary: 8400,
          status: 'PAID',
          paymentMethod: 'CASH',
          bankName: 'نقدي',
          bankAccount: 'CASH',
          iban: '',
          notes: 'آخر مرتب قبل إنهاء العقد',
          approvedBy: 'مدير الموارد البشرية',
          approvedAt: new Date('2024-02-28T10:00:00'),
          paidAt: new Date('2024-02-29T09:00:00'),
          createdAt: new Date('2024-02-25T08:00:00'),
          updatedAt: new Date('2024-02-29T09:00:00'),
        },
      ]
      
      setPayrolls(mockPayrolls)
      setLoading(false)
    }

    fetchPayrolls()
  }, [])

  // Calculate statistics
  const totalPayrolls = payrolls.length
  const paidPayrolls = payrolls.filter(p => p.status === 'PAID').length
  const approvedPayrolls = payrolls.filter(p => p.status === 'APPROVED').length
  const draftPayrolls = payrolls.filter(p => p.status === 'DRAFT').length
  const totalBasicSalary = payrolls.reduce((sum, p) => sum + p.basicSalary, 0)
  const totalAllowance = payrolls.reduce((sum, p) => sum + p.allowance, 0)
  const totalOvertime = payrolls.reduce((sum, p) => sum + p.overtime, 0)
  const totalBonus = payrolls.reduce((sum, p) => sum + p.bonus, 0)
  const totalDeductions = payrolls.reduce((sum, p) => sum + p.deductions, 0)
  const totalTax = payrolls.reduce((sum, p) => sum + p.tax, 0)
  const totalInsurance = payrolls.reduce((sum, p) => sum + p.insurance, 0)
  const totalNetSalary = payrolls.reduce((sum, p) => sum + p.netSalary, 0)
  const averageNetSalary = totalPayrolls > 0 ? totalNetSalary / totalPayrolls : 0

  const statusFilters = [
    { label: 'مسودة', value: 'DRAFT' },
    { label: 'موافق', value: 'APPROVED' },
    { label: 'مدفوع', value: 'PAID' },
    { label: 'ملغي', value: 'CANCELLED' },
  ]

  const paymentMethodFilters = [
    { label: 'تحويل بنكي', value: 'BANK_TRANSFER' },
    { label: 'نقدي', value: 'CASH' },
    { label: 'شيك', value: 'CHECK' },
  ]

  const monthFilters = [
    { label: 'يناير', value: '1' },
    { label: 'فبراير', value: '2' },
    { label: 'مارس', value: '3' },
    { label: 'أبريل', value: '4' },
    { label: 'مايو', value: '5' },
    { label: 'يونيو', value: '6' },
    { label: 'يوليو', value: '7' },
    { label: 'أغسطس', value: '8' },
    { label: 'سبتمبر', value: '9' },
    { label: 'أكتوبر', value: '10' },
    { label: 'نوفمبر', value: '11' },
    { label: 'ديسمبر', value: '12' },
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
          <h1 className="text-3xl font-bold">المرتبات</h1>
          <p className="text-muted-foreground">
            إدارة مرتبات الموظفين
          </p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إنشاء مرتب جديد
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المرتبات</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPayrolls}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مرتبات مدفوعة</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidPayrolls}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">في الانتظار</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{approvedPayrolls + draftPayrolls}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المدفوع</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalNetSalary)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            ملخص المرتبات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">إجمالي الرواتب الأساسية</span>
              <span className="text-2xl font-bold">{formatCurrency(totalBasicSalary)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">إجمالي البدلات والإضافي</span>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(totalAllowance + totalOvertime + totalBonus)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">إجمالي الخصومات</span>
              <span className="text-2xl font-bold text-red-600">{formatCurrency(totalDeductions + totalTax + totalInsurance)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">متوسط صافي الراتب</span>
              <span className="text-2xl font-bold">{formatCurrency(averageNetSalary)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={payrolls}
        searchPlaceholder="البحث في المرتبات..."
        filters={[
          {
            key: 'status',
            label: 'الحالة',
            options: statusFilters,
          },
          {
            key: 'paymentMethod',
            label: 'طريقة الدفع',
            options: paymentMethodFilters,
          },
          {
            key: 'month',
            label: 'الشهر',
            options: monthFilters,
          },
        ]}
        onExport={handleExport}
        onPrint={handlePrint}
        enableSelection={true}
        title="قائمة المرتبات"
        description={`إجمالي ${totalPayrolls} مرتب`}
        loading={loading}
        emptyMessage="لا توجد مرتبات"
      />
    </motion.div>
  )
}