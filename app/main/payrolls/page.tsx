import PageShell from "@/components/page-shell";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function PayrollsPage() {
  return (
    <PageShell title="إدارة المرتبات" subtitle="إضافة/عرض/بحث وتصدير">
      <div className="text-muted-foreground">لا توجد بيانات بعد — ابدأ بإضافة مرتب.</div>
    </PageShell>
  );
}
