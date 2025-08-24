'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface RevenueChartData {
  month: string
  revenues: number
  expenses: number
}

interface ProjectStatusChartData {
    name: string;
    value: number;
}

interface DashboardChartsProps {
  revenueData: RevenueChartData[]
  projectStatusData: ProjectStatusChartData[]
}

const COLORS = ['#10b981', '#3b82f6', '#ef4444'];

export default function DashboardCharts({ revenueData, projectStatusData }: DashboardChartsProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>الإيرادات والمصروفات الشهرية</CardTitle>
        </CardHeader>
        <CardContent>
          {(!revenueData || revenueData.length === 0) ? (
            <p className="text-muted-foreground">لا توجد بيانات كافية لعرض المخطط.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value, 'SAR').replace('ر.س.‏', '')} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="revenues" stroke="#10b981" strokeWidth={2} name="الإيرادات" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="المصروفات" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>حالة المشاريع</CardTitle>
        </CardHeader>
        <CardContent>
          {(!projectStatusData || projectStatusData.length === 0) ? (
            <p className="text-muted-foreground">لا توجد مشاريع لعرض حالتها.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} مشروع`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </>
  )
}
