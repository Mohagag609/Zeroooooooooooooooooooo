import PageShell from "@/components/page-shell";
import { prisma } from "@/lib/db";
import { toPlain } from "@/lib/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let stats = {
    clients: 0,
    suppliers: 0,
    projects: 0,
    revenues: 0,
    expenses: 0
  };

  try {
    const [clients, suppliers, projects, revenues, expenses] = await Promise.all([
      prisma.client.count(),
      prisma.supplier.count(),
      prisma.project.count(),
      prisma.revenue.aggregate({ _sum: { amount: true } }),
      prisma.expense.aggregate({ _sum: { amount: true } })
    ]);

    stats = toPlain({
      clients,
      suppliers,
      projects,
      revenues: Number(revenues._sum.amount || 0),
      expenses: Number(expenses._sum.amount || 0)
    });
  } catch (e) {
    // Database errors are intentionally ignored in the dashboard to prevent crashes.
    // A monitoring/logging service should be used in production.
  }

  return (
    <PageShell title="لوحة التحكم" subtitle="نظرة عامة على النظام">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">العملاء</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.clients}</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">الموردين</h3>
          <p className="text-2xl font-bold text-green-600">{stats.suppliers}</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">المشاريع</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.projects}</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">الإيرادات</h3>
          <p className="text-2xl font-bold text-green-600">
            {new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(stats.revenues)}
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">المصروفات</h3>
          <p className="text-2xl font-bold text-red-600">
            {new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(stats.expenses)}
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">صافي الربح</h3>
          <p className="text-2xl font-bold text-blue-600">
            {new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(stats.revenues - stats.expenses)}
          </p>
        </div>
      </div>
    </PageShell>
  );
}