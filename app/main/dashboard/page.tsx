'use client'

export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { 
  DollarSign, 
  Users, 
  Building2, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Plus
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

// Mock data for charts
const revenueData = [
  { month: 'يناير', revenue: 450000, expenses: 320000, profit: 130000 },
  { month: 'فبراير', revenue: 520000, expenses: 380000, profit: 140000 },
  { month: 'مارس', revenue: 480000, expenses: 350000, profit: 130000 },
  { month: 'أبريل', revenue: 600000, expenses: 420000, profit: 180000 },
  { month: 'مايو', revenue: 550000, expenses: 400000, profit: 150000 },
  { month: 'يونيو', revenue: 700000, expenses: 480000, profit: 220000 },
]

const projectProgressData = [
  { name: 'مكتمل', value: 65, color: '#10b981' },
  { name: 'قيد التنفيذ', value: 25, color: '#3b82f6' },
  { name: 'متأخر', value: 10, color: '#ef4444' },
]

const recentActivities = [
  {
    id: '1',
    type: 'revenue',
    title: 'إيراد جديد',
    description: 'تم تسجيل إيراد بقيمة 50,000 ريال',
    amount: 50000,
    date: new Date('2024-03-15T10:30:00'),
    status: 'success'
  },
  {
    id: '2',
    type: 'expense',
    title: 'مصروف جديد',
    description: 'تم تسجيل مصروف بقيمة 25,000 ريال',
    amount: 25000,
    date: new Date('2024-03-15T09:15:00'),
    status: 'warning'
  },
  {
    id: '3',
    type: 'project',
    title: 'مشروع مكتمل',
    description: 'تم الانتهاء من مشروع فيلا الرياض',
    amount: 0,
    date: new Date('2024-03-14T16:45:00'),
    status: 'success'
  },
  {
    id: '4',
    type: 'invoice',
    title: 'فاتورة جديدة',
    description: 'تم إنشاء فاتورة للعميل أحمد محمد',
    amount: 75000,
    date: new Date('2024-03-14T14:20:00'),
    status: 'info'
  },
  {
    id: '5',
    type: 'material',
    title: 'حركة مواد',
    description: 'تم تسجيل حركة مواد في المخزن',
    amount: 0,
    date: new Date('2024-03-14T11:00:00'),
    status: 'info'
  }
]

const upcomingTasks = [
  {
    id: '1',
    title: 'دفع رواتب الموظفين',
    dueDate: new Date('2024-03-31'),
    priority: 'high',
    type: 'payroll'
  },
  {
    id: '2',
    title: 'مراجعة فواتير الموردين',
    dueDate: new Date('2024-03-25'),
    priority: 'medium',
    type: 'invoice'
  },
  {
    id: '3',
    title: 'تحديث مخزون المواد',
    dueDate: new Date('2024-03-28'),
    priority: 'low',
    type: 'inventory'
  },
  {
    id: '4',
    title: 'إعداد تقرير شهري',
    dueDate: new Date('2024-03-30'),
    priority: 'medium',
    type: 'report'
  }
]

export default function DashboardPage() {
  // Mock statistics
  const stats = {
    totalRevenue: 3300000,
    totalExpenses: 2350000,
    netProfit: 950000,
    profitMargin: 28.8,
    activeProjects: 8,
    completedProjects: 12,
    totalEmployees: 25,
    activeEmployees: 23,
    totalMaterials: 150,
    lowStockMaterials: 8,
    totalClients: 45,
    activeClients: 38,
    totalSuppliers: 32,
    activeSuppliers: 28,
    pendingInvoices: 15,
    overdueInvoices: 3,
    totalCashboxes: 5,
    totalBalance: 1250000
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'info':
        return <Eye className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground">
            نظرة عامة على أداء الشركة
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="ml-2 h-4 w-4" />
            مارس 2024
          </Button>
          <Button>
            <Plus className="ml-2 h-4 w-4" />
            إضافة معاملة
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> مقارنة بالشهر السابق
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">صافي الربح</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.netProfit)}</div>
            <p className="text-xs text-muted-foreground">
              هامش ربح {stats.profitMargin}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المشاريع النشطة</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedProjects} مشروع مكتمل
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الموظفين النشطين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEmployees}</div>
            <p className="text-xs text-muted-foreground">
              من أصل {stats.totalEmployees} موظف
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>الإيرادات والمصروفات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="الإيرادات"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="المصروفات"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>حالة المشاريع</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectProgressData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العملاء النشطين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClients}</div>
            <p className="text-xs text-muted-foreground">
              من أصل {stats.totalClients} عميل
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الموردين النشطين</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSuppliers}</div>
            <p className="text-xs text-muted-foreground">
              من أصل {stats.totalSuppliers} مورد
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المواد منخفضة المخزون</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStockMaterials}</div>
            <p className="text-xs text-muted-foreground">
              من أصل {stats.totalMaterials} مادة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الرصيد</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalBalance)}</div>
            <p className="text-xs text-muted-foreground">
              في {stats.totalCashboxes} صندوق
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>النشاطات الأخيرة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-1">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{activity.title}</h4>
                      {activity.amount > 0 && (
                        <span className="text-sm font-medium">
                          {formatCurrency(activity.amount)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(activity.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>المهام القادمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority === 'high' ? 'عالية' : 
                     task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}