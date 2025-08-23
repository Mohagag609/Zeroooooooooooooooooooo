'use client'

export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Package, Plus, Calendar, DollarSign } from 'lucide-react'

// Mock data for projects
const mockProjects = [
  {
    id: '1',
    name: 'فيلا الرياض الفاخرة',
    client: 'أحمد محمد',
    status: 'ACTIVE',
    budget: 2500000,
    spent: 1800000,
    progress: 75,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-06-30'),
    location: 'الرياض، المملكة العربية السعودية'
  },
  {
    id: '2',
    name: 'مجمع تجاري جدة',
    client: 'فاطمة علي',
    status: 'COMPLETED',
    budget: 5000000,
    spent: 4800000,
    progress: 100,
    startDate: new Date('2023-08-01'),
    endDate: new Date('2024-02-28'),
    location: 'جدة، المملكة العربية السعودية'
  },
  {
    id: '3',
    name: 'مبنى إداري الدمام',
    client: 'محمد عبدالله',
    status: 'PAUSED',
    budget: 1800000,
    spent: 900000,
    progress: 50,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-12-31'),
    location: 'الدمام، المملكة العربية السعودية'
  }
]

export default function ProjectsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success'
      case 'COMPLETED':
        return 'default'
      case 'PAUSED':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'نشط'
      case 'COMPLETED':
        return 'مكتمل'
      case 'PAUSED':
        return 'متوقف'
      default:
        return 'غير محدد'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة المشاريع</h1>
          <p className="text-muted-foreground">
            إدارة وعرض جميع مشاريع الشركة
          </p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إضافة مشروع جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المشاريع</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              مشروع
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المشاريع النشطة</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockProjects.filter(p => p.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground">
              مشروع نشط
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الميزانية</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockProjects.reduce((sum, project) => sum + project.budget, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              ريال
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المشاريع المكتملة</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockProjects.filter(p => p.status === 'COMPLETED').length}
            </div>
            <p className="text-xs text-muted-foreground">
              مشروع مكتمل
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المشاريع</CardTitle>
        </CardHeader>
        <CardContent>
          {mockProjects.length > 0 ? (
            <div className="space-y-4">
              {mockProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">العميل: {project.client}</p>
                      <p className="text-sm text-muted-foreground">{project.location}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{project.startDate.toLocaleDateString('ar-SA')} - {project.endDate.toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(project.budget)}</p>
                      <p className="text-xs text-muted-foreground">الميزانية</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{project.progress}%</p>
                      <p className="text-xs text-muted-foreground">التقدم</p>
                    </div>
                    <Badge variant={getStatusColor(project.status) as any}>
                      {getStatusText(project.status)}
                    </Badge>
                    <Button variant="outline" size="sm">
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد بيانات مشاريع</h3>
              <p className="text-muted-foreground">
                لم يتم تسجيل أي مشاريع بعد. ابدأ بإضافة مشروع جديد.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}