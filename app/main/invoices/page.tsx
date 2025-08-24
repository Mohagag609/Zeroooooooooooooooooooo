import PageShell from "@/components/page-shell";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  return (
    <PageShell title="إدارة الفواتير" subtitle="إضافة/عرض/بحث وتصدير">
      <div className="text-muted-foreground">لا توجد بيانات بعد — ابدأ بإضافة فاتورة.</div>
    </PageShell>
  );
}
