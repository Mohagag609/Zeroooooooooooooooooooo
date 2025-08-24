import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageShell from "@/components/page-shell";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Building2, DollarSign, Plus, TrendingUp, Users } from "lucide-react";
import DashboardCharts from "@/components/dashboard-charts";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getDashboardData() {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      clients,
      suppliers,
      projects,
      totalRevenues,
      totalExpenses,
      monthlyRevenues,
      monthlyExpenses,
      projectStatusCounts,
    ] = await Promise.all([
      prisma.client.count(),
      prisma.supplier.count(),
      prisma.project.count(),
      prisma.revenue.aggregate({ _sum: { amount: true } }),
      prisma.expense.aggregate({ _sum: { amount: true } }),
      prisma.revenue.findMany({
        where: { date: { gte: sixMonthsAgo } },
        select: { amount: true, date: true },
      }),
      prisma.expense.findMany({
        where: { date: { gte: sixMonthsAgo } },
        select: { amount: true, date: true },
      }),
      prisma.project.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
    ]);

    const stats = {
      clients,
      suppliers,
      projects,
      revenues: Number(totalRevenues._sum.amount || 0),
      expenses: Number(totalExpenses._sum.amount || 0),
    };

    const monthlyData: { [key: string]: { revenues: number; expenses: number } } = {};
    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

    monthlyRevenues.forEach(r => {
      const month = monthNames[r.date.getMonth()];
      const key = `${r.date.getFullYear()}-${r.date.getMonth()}`;
      if (!monthlyData[key]) monthlyData[key] = { revenues: 0, expenses: 0 };
      monthlyData[key].revenues += r.amount.toNumber();
    });

    monthlyExpenses.forEach(e => {
      const month = monthNames[e.date.getMonth()];
      const key = `${e.date.getFullYear()}-${e.date.getMonth()}`;
      if (!monthlyData[key]) monthlyData[key] = { revenues: 0, expenses: 0 };
      monthlyData[key].expenses += e.amount.toNumber();
    });

    const revenueChartData = Object.entries(monthlyData).map(([key, value]) => {
        const [year, monthIndex] = key.split('-');
        return {
            month: monthNames[parseInt(monthIndex, 10)],
            ...value
        }
    }).slice(-6);

    const projectStatusData = projectStatusCounts.map(item => ({
      name: item.status === 'active' ? 'نشط' : item.status === 'paused' ? 'متوقف' : 'مغلق',
      value: item._count.status,
    }));

    return { stats, revenueChartData, projectStatusData };
  } catch (e) {
    // In case of a database error, return default empty values
    return {
      stats: { clients: 0, suppliers: 0, projects: 0, revenues: 0, expenses: 0 },
      revenueChartData: [],
      projectStatusData: [],
    };
  }
}

export default async function DashboardPage() {
  const { stats, revenueChartData, projectStatusData } = await getDashboardData();

  const netProfit = stats.revenues - stats.expenses;
  const profitMargin = stats.revenues === 0 ? 0 : (netProfit / stats.revenues) * 100;

  return (
    <PageShell
      title="لوحة التحكم"
      subtitle="نظرة عامة على أداء الشركة"
      action={
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/main/revenues/new">
              <Plus className="ml-2 h-4 w-4" />
              إضافة إيراد
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/main/expenses/new">
              <Plus className="ml-2 h-4 w-4" />
              إضافة مصروف
            </Link>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.revenues)}</div>
              <p className="text-xs text-muted-foreground">بناءً على جميع السجلات</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">صافي الربح</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(netProfit)}</div>
              <p className="text-xs text-muted-foreground">هامش ربح {profitMargin.toFixed(2)}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المشاريع</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.projects}</div>
              <p className="text-xs text-muted-foreground">إجمالي المشاريع المسجلة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">العملاء</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.clients}</div>
              <p className="text-xs text-muted-foreground">إجمالي العملاء المسجلين</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardCharts revenueData={revenueChartData} projectStatusData={projectStatusData} />
        </div>
      </div>
    </PageShell>
  );
}