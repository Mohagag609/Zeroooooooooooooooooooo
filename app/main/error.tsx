"use client";
export default function SegmentError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  console.error("[SegmentError]", error);
  return (
    <div className="max-w-md mx-auto my-10 rounded-2xl border p-6 text-center">
      <div className="text-rose-600 text-2xl mb-2">حدث خطأ</div>
      <p className="text-muted-foreground mb-4">عذرًا، حدث خطأ غير متوقع. جرّب إعادة المحاولة.</p>
      <button onClick={() => reset()} className="px-4 py-2 rounded-lg bg-blue-600 text-white">إعادة المحاولة</button>
    </div>
  );
}