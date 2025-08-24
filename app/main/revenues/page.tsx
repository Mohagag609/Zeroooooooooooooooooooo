import PageShell from "@/components/page-shell";
import { prisma } from "@/lib/db";
import { toPlain } from "@/lib/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function RevenuesPage() {
  let rows: Array<{ id: string; amount: number; note?: string | null; date: string }> = [];
  try {
    const data = await prisma.revenue.findMany({
      select: { 
        id: true, 
        amount: true, 
        note: true, 
        date: true 
      },
      orderBy: { date: "desc" },
      take: 50,
    });
    rows = data.map((d) => ({
      id: d.id,
      amount: Number(d.amount as any),
      note: d.note,
      date: (d.date as Date).toISOString(),
    }));
  } catch (e) {
    console.error("[RevenuesPage] DB error:", e);
    rows = [];
  }

  return (
    <PageShell title="إدارة الإيرادات" subtitle="إضافة/عرض/بحث وتصدير">
      {rows.length === 0 ? (
        <div className="text-muted-foreground">لا توجد بيانات بعد — ابدأ بإضافة إيراد.</div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="p-3 border rounded-lg">
              <div className="font-semibold text-green-600">
                {new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(r.amount)}
              </div>
              <div className="text-sm text-muted-foreground">
                {r.note || "بدون ملاحظات"}
              </div>
              <div className="text-sm text-muted-foreground">
                التاريخ: {new Date(r.date).toLocaleDateString('ar-SA')}
              </div>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}