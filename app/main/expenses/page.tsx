import PageShell from "@/components/page-shell";
import { prisma } from "@/lib/db";
import { toPlain } from "@/lib/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  let rows: Array<{ id: string; amount: number; note?: string | null; date: string }> = [];
  try {
    const data = await prisma.expense.findMany({
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
    console.error("[ExpensesPage] DB error:", e);
    rows = [];
  }

  return (
    <PageShell title="إدارة المصروفات" subtitle="إضافة/عرض/بحث وتصدير">
      {rows.length === 0 ? (
        <div className="text-muted-foreground">لا توجد بيانات بعد — ابدأ بإضافة مصروف.</div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="p-3 border rounded-lg">
              <div className="font-semibold text-red-600">
                {new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(r.amount)}
              </div>
              <div className="text-sm text-muted-foreground">
                {r.note || "بدون وصف"}
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