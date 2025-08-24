import PageShell from "@/components/page-shell";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function WarehousesPage() {
  return (
    <PageShell title="إدارة المخازن" subtitle="إضافة/عرض/بحث وتصدير">
      <div className="text-muted-foreground">لا توجد بيانات بعد — ابدأ بإضافة مخزن.</div>
    </PageShell>
  );
}
