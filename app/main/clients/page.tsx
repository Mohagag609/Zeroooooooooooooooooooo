import PageShell from "@/components/page-shell";
import { prisma } from "@/lib/db";
import { toPlain } from "@/lib/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  let rows: Array<{ id: string; name: string; phone?: string | null }> = [];
  try {
    const data = await prisma.client.findMany({
      select: { id: true, name: true, phone: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    rows = toPlain(data);
  } catch (e) {
    console.error("[ClientsPage] DB error:", e);
    rows = [];
  }

  return (
    <PageShell title="إدارة العملاء" subtitle="إضافة/عرض/بحث وتصدير">
      {rows.length === 0 ? (
        <div className="text-muted-foreground">لا توجد بيانات بعد — ابدأ بإضافة عميل.</div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="p-3 border rounded-lg">
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm">{r.phone || "بدون هاتف"}</div>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}