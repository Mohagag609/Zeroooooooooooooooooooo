'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatDate, formatCurrency } from '@/lib/utils'
import { 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Calendar,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Building2,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  UserX
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Define the Employee type
interface Employee {
  id: string
  code: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  nationalId: string
  dateOfBirth: Date
  hireDate: Date
  terminationDate: Date | null
  position: string
  department: string
  salary: number
  allowance: number
  totalCompensation: number
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED'
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY'
  address: string
  city: string
  emergencyContact: string
  emergencyPhone: string
  bankName: string
  bankAccount: string
  iban: string
  projectId: string | null
  projectName: string | null
  projectCode: string | null
  notes: string
  createdAt: Date
  updatedAt: Date
}

const columns: ColumnDef<Employee>[] = [
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
    accessorKey: 'fullName',
    header: 'الموظف',
    cell: ({ row }) => {
      const employee = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{employee.fullName}</div>
          <div className="text-sm text-muted-foreground">
            {employee.position}
          </div>
          <div className="text-xs text-muted-foreground">
            {employee.department}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'contact',
    header: 'معلومات الاتصال',
    cell: ({ row }) => {
      const employee = row.original
      return (
        <div className="flex flex-col text-sm">
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span>{employee.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span>{employee.phone}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'employmentType',
    header: 'نوع التوظيف',
    cell: ({ row }) => {
      const employmentType = row.getValue('employmentType') as string
      const status = row.original.status
      
      const typeConfig = {
        FULL_TIME: { label: 'دوام كامل', variant: 'default' as const },
        PART_TIME: { label: 'دوام جزئي', variant: 'secondary' as const },
        CONTRACT: { label: 'عقد', variant: 'outline' as const },
        TEMPORARY: { label: 'مؤقت', variant: 'warning' as const },
      }
      const typeConfigItem = typeConfig[employmentType as keyof typeof typeConfig]
      
      const statusConfig = {
        ACTIVE: { label: 'نشط', variant: 'success' as const, icon: UserCheck },
        INACTIVE: { label: 'غير نشط', variant: 'secondary' as const, icon: UserX },
        ON_LEAVE: { label: 'في إجازة', variant: 'warning' as const, icon: Clock },
        TERMINATED: { label: 'منتهي', variant: 'destructive' as const, icon: UserX },
      }
      const statusConfigItem = statusConfig[status as keyof typeof statusConfig]
      const StatusIcon = statusConfigItem.icon
      
      return (
        <div className="flex flex-col gap-1">
          <Badge variant={typeConfigItem.variant} className="text-xs">
            {typeConfigItem.label}
          </Badge>
          <div className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            <Badge variant={statusConfigItem.variant} className="text-xs">
              {statusConfigItem.label}
            </Badge>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'salary',
    header: 'الراتب',
    cell: ({ row }) => {
      const employee = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{formatCurrency(employee.salary)}</div>
          {employee.allowance > 0 && (
            <div className="text-sm text-muted-foreground">
              بدل: {formatCurrency(employee.allowance)}
            </div>
          )}
          <div className="text-sm font-medium text-blue-600">
            إجمالي: {formatCurrency(employee.totalCompensation)}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'hireDate',
    header: 'التواريخ',
    cell: ({ row }) => {
      const employee = row.original
      const yearsOfService = Math.floor(
        (new Date().getTime() - new Date(employee.hireDate).getTime()) / 
        (1000 * 60 * 60 * 24 * 365)
      )
      
      return (
        <div className="flex flex-col text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>تعيين: {formatDate(employee.hireDate)}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            سنوات الخدمة: {yearsOfService} سنة
          </div>
          {employee.terminationDate && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <Calendar className="h-3 w-3" />
              <span>إنهاء: {formatDate(employee.terminationDate)}</span>
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'projectName',
    header: 'المشروع',
    cell: ({ row }) => {
      const employee = row.original
      if (!employee.projectName) return <span className="text-muted-foreground">-</span>
      
      return (
        <div className="flex flex-col">
          <div className="font-medium">{employee.projectName}</div>
          <div className="text-sm text-muted-foreground">
            {employee.projectCode}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'location',
    header: 'الموقع',
    cell: ({ row }) => {
      const employee = row.original
      return (
        <div className="flex flex-col text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span>{employee.city}</span>
          </div>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => {
      const employee = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(employee.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(employee.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(employee.id)}
            disabled={employee.status === 'TERMINATED'}
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
  console.log('View employee:', id)
}

const handleEdit = (id: string) => {
  console.log('Edit employee:', id)
}

const handleDelete = (id: string) => {
  console.log('Delete employee:', id)
}

const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
  console.log('Export employees:', format)
}

const handlePrint = () => {
  console.log('Print employees')
}

export default function EmployeesPage() {
  const [employees, setEmployees] = React.useState<Employee[]>([])
  const [loading, setLoading] = React.useState(true)

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockEmployees: Employee[] = [
        {
          id: '1',
          code: 'EMP-001',
          firstName: 'أحمد',
          lastName: 'محمد',
          fullName: 'أحمد محمد',
          email: 'ahmed.mohamed@company.com',
          phone: '+966-50-123-4567',
          nationalId: '1234567890',
          dateOfBirth: new Date('1990-05-15'),
          hireDate: new Date('2020-03-01'),
          terminationDate: null,
          position: 'مدير مشروع',
          department: 'إدارة المشاريع',
          salary: 15000,
          allowance: 2000,
          totalCompensation: 17000,
          status: 'ACTIVE',
          employmentType: 'FULL_TIME',
          address: 'حي النزهة، الرياض',
          city: 'الرياض',
          emergencyContact: 'فاطمة محمد',
          emergencyPhone: '+966-50-987-6543',
          bankName: 'بنك الراجحي',
          bankAccount: '1234567890',
          iban: 'SA0380000000608010167519',
          projectId: '1',
          projectName: 'فيلا الرياض',
          projectCode: 'PRJ-001',
          notes: 'مدير مشروع متميز',
          createdAt: new Date('2020-03-01T09:00:00'),
          updatedAt: new Date('2024-03-15T10:30:00'),
        },
        {
          id: '2',
          code: 'EMP-002',
          firstName: 'محمد',
          lastName: 'علي',
          fullName: 'محمد علي',
          email: 'mohamed.ali@company.com',
          phone: '+966-50-234-5678',
          nationalId: '2345678901',
          dateOfBirth: new Date('1985-08-20'),
          hireDate: new Date('2019-06-15'),
          terminationDate: null,
          position: 'مهندس مدني',
          department: 'الهندسة',
          salary: 12000,
          allowance: 1500,
          totalCompensation: 13500,
          status: 'ACTIVE',
          employmentType: 'FULL_TIME',
          address: 'حي التحلية، جدة',
          city: 'جدة',
          emergencyContact: 'سارة علي',
          emergencyPhone: '+966-50-876-5432',
          bankName: 'بنك الأهلي',
          bankAccount: '0987654321',
          iban: 'SA0380000000608010167520',
          projectId: '1',
          projectName: 'فيلا الرياض',
          projectCode: 'PRJ-001',
          notes: 'مهندس متمرس',
          createdAt: new Date('2019-06-15T08:00:00'),
          updatedAt: new Date('2024-03-14T16:45:00'),
        },
        {
          id: '3',
          code: 'EMP-003',
          firstName: 'علي',
          lastName: 'أحمد',
          fullName: 'علي أحمد',
          email: 'ali.ahmed@company.com',
          phone: '+966-50-345-6789',
          nationalId: '3456789012',
          dateOfBirth: new Date('1992-12-10'),
          hireDate: new Date('2021-01-10'),
          terminationDate: null,
          position: 'محاسب',
          department: 'المحاسبة',
          salary: 10000,
          allowance: 1000,
          totalCompensation: 11000,
          status: 'ACTIVE',
          employmentType: 'FULL_TIME',
          address: 'حي الشاطئ، الدمام',
          city: 'الدمام',
          emergencyContact: 'نور أحمد',
          emergencyPhone: '+966-50-765-4321',
          bankName: 'بنك سامبا',
          bankAccount: '1122334455',
          iban: 'SA0380000000608010167521',
          projectId: null,
          projectName: null,
          projectCode: null,
          notes: 'محاسب دقيق',
          createdAt: new Date('2021-01-10T10:00:00'),
          updatedAt: new Date('2024-03-13T09:15:00'),
        },
        {
          id: '4',
          code: 'EMP-004',
          firstName: 'فاطمة',
          lastName: 'أحمد',
          fullName: 'فاطمة أحمد',
          email: 'fatima.ahmed@company.com',
          phone: '+966-50-456-7890',
          nationalId: '4567890123',
          dateOfBirth: new Date('1988-03-25'),
          hireDate: new Date('2022-09-01'),
          terminationDate: null,
          position: 'مدير مخازن',
          department: 'المخازن',
          salary: 11000,
          allowance: 1200,
          totalCompensation: 12200,
          status: 'ON_LEAVE',
          employmentType: 'FULL_TIME',
          address: 'حي النرجس، الرياض',
          city: 'الرياض',
          emergencyContact: 'أحمد فاطمة',
          emergencyPhone: '+966-50-654-3210',
          bankName: 'بنك الراجحي',
          bankAccount: '2233445566',
          iban: 'SA0380000000608010167522',
          projectId: null,
          projectName: null,
          projectCode: null,
          notes: 'في إجازة مرضية',
          createdAt: new Date('2022-09-01T11:00:00'),
          updatedAt: new Date('2024-03-12T14:20:00'),
        },
        {
          id: '5',
          code: 'EMP-005',
          firstName: 'خالد',
          lastName: 'محمد',
          fullName: 'خالد محمد',
          email: 'khalid.mohamed@company.com',
          phone: '+966-50-567-8901',
          nationalId: '5678901234',
          dateOfBirth: new Date('1995-07-12'),
          hireDate: new Date('2023-02-15'),
          terminationDate: new Date('2024-01-31'),
          position: 'عامل بناء',
          department: 'البناء',
          salary: 8000,
          allowance: 500,
          totalCompensation: 8500,
          status: 'TERMINATED',
          employmentType: 'CONTRACT',
          address: 'حي الكورنيش، جدة',
          city: 'جدة',
          emergencyContact: 'ليلى محمد',
          emergencyPhone: '+966-50-543-2109',
          bankName: 'بنك الأهلي',
          bankAccount: '3344556677',
          iban: 'SA0380000000608010167523',
          projectId: '2',
          projectName: 'مجمع تجاري جدة',
          projectCode: 'PRJ-002',
          notes: 'تم إنهاء العقد',
          createdAt: new Date('2023-02-15T09:30:00'),
          updatedAt: new Date('2024-01-31T16:00:00'),
        },
      ]
      
      setEmployees(mockEmployees)
      setLoading(false)
    }

    fetchEmployees()
  }, [])

  // Calculate statistics
  const totalEmployees = employees.length
  const activeEmployees = employees.filter(e => e.status === 'ACTIVE').length
  const onLeaveEmployees = employees.filter(e => e.status === 'ON_LEAVE').length
  const terminatedEmployees = employees.filter(e => e.status === 'TERMINATED').length
  const totalSalary = employees.reduce((sum, e) => sum + e.salary, 0)
  const totalAllowance = employees.reduce((sum, e) => sum + e.allowance, 0)
  const totalCompensation = employees.reduce((sum, e) => sum + e.totalCompensation, 0)
  const fullTimeEmployees = employees.filter(e => e.employmentType === 'FULL_TIME').length
  const contractEmployees = employees.filter(e => e.employmentType === 'CONTRACT').length
  const averageSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0

  const statusFilters = [
    { label: 'نشط', value: 'ACTIVE' },
    { label: 'غير نشط', value: 'INACTIVE' },
    { label: 'في إجازة', value: 'ON_LEAVE' },
    { label: 'منتهي', value: 'TERMINATED' },
  ]

  const employmentTypeFilters = [
    { label: 'دوام كامل', value: 'FULL_TIME' },
    { label: 'دوام جزئي', value: 'PART_TIME' },
    { label: 'عقد', value: 'CONTRACT' },
    { label: 'مؤقت', value: 'TEMPORARY' },
  ]

  const departmentFilters = [
    { label: 'إدارة المشاريع', value: 'إدارة المشاريع' },
    { label: 'الهندسة', value: 'الهندسة' },
    { label: 'المحاسبة', value: 'المحاسبة' },
    { label: 'المخازن', value: 'المخازن' },
    { label: 'البناء', value: 'البناء' },
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
          <h1 className="text-3xl font-bold">الموظفين</h1>
          <p className="text-muted-foreground">
            إدارة الموظفين والموارد البشرية
          </p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إضافة موظف جديد
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الموظفين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">موظفين نشطين</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">في إجازة</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{onLeaveEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الرواتب</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalCompensation)}</div>
          </CardContent>
        </Card>
      </div>

      {/* HR Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            ملخص الموارد البشرية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">إجمالي الرواتب الأساسية</span>
              <span className="text-2xl font-bold">{formatCurrency(totalSalary)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">إجمالي البدلات</span>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(totalAllowance)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">متوسط الراتب</span>
              <span className="text-2xl font-bold">{formatCurrency(averageSalary)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">موظفين منتهيين</span>
              <span className="text-2xl font-bold text-red-600">{terminatedEmployees}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={employees}
        searchPlaceholder="البحث في الموظفين..."
        filters={[
          {
            key: 'status',
            label: 'الحالة',
            options: statusFilters,
          },
          {
            key: 'employmentType',
            label: 'نوع التوظيف',
            options: employmentTypeFilters,
          },
          {
            key: 'department',
            label: 'القسم',
            options: departmentFilters,
          },
        ]}
        onExport={handleExport}
        onPrint={handlePrint}
        enableSelection={true}
        title="قائمة الموظفين"
        description={`إجمالي ${totalEmployees} موظف`}
        loading={loading}
        emptyMessage="لا يوجد موظفين"
      />
    </motion.div>
  )
}