import PageShell from "@/components/page-shell";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SettlementsPage() {
  return (
    <PageShell title="إدارة تسويات الشركاء" subtitle="إضافة/عرض/بحث وتصدير">
      <div className="text-muted-foreground">لا توجد بيانات بعد — ابدأ بإضافة تسوية.</div>
    </PageShell>
  );
}
