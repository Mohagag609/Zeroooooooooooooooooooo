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
  Handshake,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  UserX,
  Percent
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Define the Partner type
interface Partner {
  id: string
  code: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  nationalId: string
  dateOfBirth: Date
  joinDate: Date
  exitDate: Date | null
  partnershipType: 'ACTIVE' | 'SLEEPING' | 'EXIT'
  ownershipPercentage: number
  capitalContribution: number
  currentBalance: number
  profitShare: number
  lossShare: number
  address: string
  city: string
  bankName: string
  bankAccount: string
  iban: string
  emergencyContact: string
  emergencyPhone: string
  notes: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  createdAt: Date
  updatedAt: Date
}

const columns: ColumnDef<Partner>[] = [
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
    header: 'الشريك',
    cell: ({ row }) => {
      const partner = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{partner.fullName}</div>
          <div className="text-sm text-muted-foreground">
            {partner.partnershipType === 'ACTIVE' ? 'شريك نشط' : 
             partner.partnershipType === 'SLEEPING' ? 'شريك نائم' : 'شريك منسحب'}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'contact',
    header: 'معلومات الاتصال',
    cell: ({ row }) => {
      const partner = row.original
      return (
        <div className="flex flex-col text-sm">
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span>{partner.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span>{partner.phone}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'ownershipPercentage',
    header: 'نسبة الملكية',
    cell: ({ row }) => {
      const partner = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium text-lg">{partner.ownershipPercentage}%</div>
          <div className="text-sm text-muted-foreground">
            ربح: {partner.profitShare}% | خسارة: {partner.lossShare}%
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'capitalContribution',
    header: 'رأس المال',
    cell: ({ row }) => {
      const partner = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium">{formatCurrency(partner.capitalContribution)}</div>
          <div className="text-sm text-muted-foreground">
            رصيد: {formatCurrency(partner.currentBalance)}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'partnershipType',
    header: 'نوع الشراكة',
    cell: ({ row }) => {
      const partnershipType = row.getValue('partnershipType') as string
      const status = row.original.status
      
      const typeConfig = {
        ACTIVE: { label: 'نشط', variant: 'success' as const, icon: UserCheck },
        SLEEPING: { label: 'نائم', variant: 'warning' as const, icon: AlertTriangle },
        EXIT: { label: 'منسحب', variant: 'destructive' as const, icon: UserX },
      }
      const typeConfigItem = typeConfig[partnershipType as keyof typeof typeConfig]
      const TypeIcon = typeConfigItem.icon
      
      const statusConfig = {
        ACTIVE: { label: 'نشط', variant: 'success' as const },
        INACTIVE: { label: 'غير نشط', variant: 'secondary' as const },
        SUSPENDED: { label: 'معلق', variant: 'warning' as const },
      }
      const statusConfigItem = statusConfig[status as keyof typeof statusConfig]
      
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <TypeIcon className="h-3 w-3" />
            <Badge variant={typeConfigItem.variant} className="text-xs">
              {typeConfigItem.label}
            </Badge>
          </div>
          <Badge variant={statusConfigItem.variant} className="text-xs">
            {statusConfigItem.label}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'joinDate',
    header: 'التواريخ',
    cell: ({ row }) => {
      const partner = row.original
      const yearsOfPartnership = Math.floor(
        (new Date().getTime() - new Date(partner.joinDate).getTime()) / 
        (1000 * 60 * 60 * 24 * 365)
      )
      
      return (
        <div className="flex flex-col text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>انضمام: {formatDate(partner.joinDate)}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            سنوات الشراكة: {yearsOfPartnership} سنة
          </div>
          {partner.exitDate && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <Calendar className="h-3 w-3" />
              <span>انسحاب: {formatDate(partner.exitDate)}</span>
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'location',
    header: 'الموقع',
    cell: ({ row }) => {
      const partner = row.original
      return (
        <div className="flex flex-col text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span>{partner.city}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'bankName',
    header: 'المعلومات البنكية',
    cell: ({ row }) => {
      const partner = row.original
      return (
        <div className="flex flex-col text-sm">
          <div className="font-medium">{partner.bankName}</div>
          <div className="text-xs text-muted-foreground">
            {partner.bankAccount}
          </div>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => {
      const partner = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(partner.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(partner.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(partner.id)}
            disabled={partner.partnershipType === 'EXIT'}
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
  console.log('View partner:', id)
}

const handleEdit = (id: string) => {
  console.log('Edit partner:', id)
}

const handleDelete = (id: string) => {
  console.log('Delete partner:', id)
}

const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
  console.log('Export partners:', format)
}

const handlePrint = () => {
  console.log('Print partners')
}

export default function PartnersPage() {
  const [partners, setPartners] = React.useState<Partner[]>([])
  const [loading, setLoading] = React.useState(true)

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockPartners: Partner[] = [
        {
          id: '1',
          code: 'PTR-001',
          firstName: 'أحمد',
          lastName: 'محمد',
          fullName: 'أحمد محمد',
          email: 'ahmed.mohamed@partners.com',
          phone: '+966-50-123-4567',
          nationalId: '1234567890',
          dateOfBirth: new Date('1980-05-15'),
          joinDate: new Date('2020-01-01'),
          exitDate: null,
          partnershipType: 'ACTIVE',
          ownershipPercentage: 40,
          capitalContribution: 2000000,
          currentBalance: 2500000,
          profitShare: 40,
          lossShare: 40,
          address: 'حي النزهة، الرياض',
          city: 'الرياض',
          bankName: 'بنك الراجحي',
          bankAccount: '1234567890',
          iban: 'SA0380000000608010167519',
          emergencyContact: 'فاطمة محمد',
          emergencyPhone: '+966-50-987-6543',
          notes: 'شريك مؤسس',
          status: 'ACTIVE',
          createdAt: new Date('2020-01-01T09:00:00'),
          updatedAt: new Date('2024-03-15T10:30:00'),
        },
        {
          id: '2',
          code: 'PTR-002',
          firstName: 'محمد',
          lastName: 'علي',
          fullName: 'محمد علي',
          email: 'mohamed.ali@partners.com',
          phone: '+966-50-234-5678',
          nationalId: '2345678901',
          dateOfBirth: new Date('1975-08-20'),
          joinDate: new Date('2020-01-01'),
          exitDate: null,
          partnershipType: 'ACTIVE',
          ownershipPercentage: 35,
          capitalContribution: 1750000,
          currentBalance: 2200000,
          profitShare: 35,
          lossShare: 35,
          address: 'حي التحلية، جدة',
          city: 'جدة',
          bankName: 'بنك الأهلي',
          bankAccount: '0987654321',
          iban: 'SA0380000000608010167520',
          emergencyContact: 'سارة علي',
          emergencyPhone: '+966-50-876-5432',
          notes: 'شريك مؤسس',
          status: 'ACTIVE',
          createdAt: new Date('2020-01-01T09:00:00'),
          updatedAt: new Date('2024-03-14T16:45:00'),
        },
        {
          id: '3',
          code: 'PTR-003',
          firstName: 'علي',
          lastName: 'أحمد',
          fullName: 'علي أحمد',
          email: 'ali.ahmed@partners.com',
          phone: '+966-50-345-6789',
          nationalId: '3456789012',
          dateOfBirth: new Date('1985-12-10'),
          joinDate: new Date('2021-06-01'),
          exitDate: null,
          partnershipType: 'ACTIVE',
          ownershipPercentage: 15,
          capitalContribution: 750000,
          currentBalance: 900000,
          profitShare: 15,
          lossShare: 15,
          address: 'حي الشاطئ، الدمام',
          city: 'الدمام',
          bankName: 'بنك سامبا',
          bankAccount: '1122334455',
          iban: 'SA0380000000608010167521',
          emergencyContact: 'نور أحمد',
          emergencyPhone: '+966-50-765-4321',
          notes: 'شريك مستثمر',
          status: 'ACTIVE',
          createdAt: new Date('2021-06-01T10:00:00'),
          updatedAt: new Date('2024-03-13T09:15:00'),
        },
        {
          id: '4',
          code: 'PTR-004',
          firstName: 'فاطمة',
          lastName: 'أحمد',
          fullName: 'فاطمة أحمد',
          email: 'fatima.ahmed@partners.com',
          phone: '+966-50-456-7890',
          nationalId: '4567890123',
          dateOfBirth: new Date('1988-03-25'),
          joinDate: new Date('2022-03-01'),
          exitDate: null,
          partnershipType: 'SLEEPING',
          ownershipPercentage: 10,
          capitalContribution: 500000,
          currentBalance: 500000,
          profitShare: 10,
          lossShare: 10,
          address: 'حي النرجس، الرياض',
          city: 'الرياض',
          bankName: 'بنك الراجحي',
          bankAccount: '2233445566',
          iban: 'SA0380000000608010167522',
          emergencyContact: 'أحمد فاطمة',
          emergencyPhone: '+966-50-654-3210',
          notes: 'شريك نائم',
          status: 'INACTIVE',
          createdAt: new Date('2022-03-01T11:00:00'),
          updatedAt: new Date('2024-03-12T14:20:00'),
        },
        {
          id: '5',
          code: 'PTR-005',
          firstName: 'خالد',
          lastName: 'محمد',
          fullName: 'خالد محمد',
          email: 'khalid.mohamed@partners.com',
          phone: '+966-50-567-8901',
          nationalId: '5678901234',
          dateOfBirth: new Date('1970-07-12'),
          joinDate: new Date('2020-01-01'),
          exitDate: new Date('2023-12-31'),
          partnershipType: 'EXIT',
          ownershipPercentage: 0,
          capitalContribution: 1000000,
          currentBalance: 0,
          profitShare: 0,
          lossShare: 0,
          address: 'حي الكورنيش، جدة',
          city: 'جدة',
          bankName: 'بنك الأهلي',
          bankAccount: '3344556677',
          iban: 'SA0380000000608010167523',
          emergencyContact: 'ليلى محمد',
          emergencyPhone: '+966-50-543-2109',
          notes: 'انسحب من الشراكة',
          status: 'INACTIVE',
          createdAt: new Date('2020-01-01T09:30:00'),
          updatedAt: new Date('2023-12-31T16:00:00'),
        },
      ]
      
      setPartners(mockPartners)
      setLoading(false)
    }

    fetchPartners()
  }, [])

  // Calculate statistics
  const totalPartners = partners.length
  const activePartners = partners.filter(p => p.partnershipType === 'ACTIVE').length
  const sleepingPartners = partners.filter(p => p.partnershipType === 'SLEEPING').length
  const exitedPartners = partners.filter(p => p.partnershipType === 'EXIT').length
  const totalCapital = partners.reduce((sum, p) => sum + p.capitalContribution, 0)
  const totalCurrentBalance = partners.reduce((sum, p) => sum + p.currentBalance, 0)
  const totalOwnershipPercentage = partners.reduce((sum, p) => sum + p.ownershipPercentage, 0)
  const averageOwnership = totalPartners > 0 ? totalOwnershipPercentage / totalPartners : 0
  const totalProfitShare = partners.reduce((sum, p) => sum + p.profitShare, 0)
  const totalLossShare = partners.reduce((sum, p) => sum + p.lossShare, 0)

  const partnershipTypeFilters = [
    { label: 'نشط', value: 'ACTIVE' },
    { label: 'نائم', value: 'SLEEPING' },
    { label: 'منسحب', value: 'EXIT' },
  ]

  const statusFilters = [
    { label: 'نشط', value: 'ACTIVE' },
    { label: 'غير نشط', value: 'INACTIVE' },
    { label: 'معلق', value: 'SUSPENDED' },
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
          <h1 className="text-3xl font-bold">الشركاء</h1>
          <p className="text-muted-foreground">
            إدارة شركاء الشركة
          </p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إضافة شريك جديد
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الشركاء</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPartners}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">شركاء نشطين</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activePartners}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">شركاء نائمين</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{sleepingPartners}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي رأس المال</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalCapital)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Partnership Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="h-5 w-5" />
            ملخص الشراكة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">إجمالي رأس المال</span>
              <span className="text-2xl font-bold">{formatCurrency(totalCapital)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">الرصيد الحالي</span>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(totalCurrentBalance)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">متوسط نسبة الملكية</span>
              <span className="text-2xl font-bold">{averageOwnership.toFixed(1)}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">إجمالي نسب الأرباح</span>
              <span className="text-2xl font-bold">{totalProfitShare}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={partners}
        searchPlaceholder="البحث في الشركاء..."
        filters={[
          {
            key: 'partnershipType',
            label: 'نوع الشراكة',
            options: partnershipTypeFilters,
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
        title="قائمة الشركاء"
        description={`إجمالي ${totalPartners} شريك`}
        loading={loading}
        emptyMessage="لا يوجد شركاء"
      />
    </motion.div>
  )
}