import PageShell from "@/components/page-shell";
import { prisma } from "@/lib/db";
import { toPlain } from "@/lib/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  let rows: Array<{ id: string; name: string; status: string; startDate?: string | null }> = [];
  try {
    const data = await prisma.project.findMany({
      select: { 
        id: true, 
        name: true, 
        status: true, 
        startDate: true 
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    rows = toPlain(data);
  } catch (e) {
    console.error("[ProjectsPage] DB error:", e);
    rows = [];
  }

  return (
    <PageShell title="إدارة المشاريع" subtitle="إضافة/عرض/بحث وتصدير">
      {rows.length === 0 ? (
        <div className="text-muted-foreground">لا توجد بيانات بعد — ابدأ بإضافة مشروع.</div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="p-3 border rounded-lg">
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm text-muted-foreground">
                الحالة: {r.status === 'active' ? 'نشط' : r.status === 'paused' ? 'متوقف' : 'مغلق'}
              </div>
              {r.startDate && (
                <div className="text-sm text-muted-foreground">
                  تاريخ البدء: {new Date(r.startDate).toLocaleDateString('ar-SA')}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}