# ERP نظام مقاولات محاسبي

نظام إدارة المشاريع والمحاسبة الشامل للمقاولات مبني بـ Next.js 14 و Prisma و PostgreSQL.

## المميزات

### 🏗️ إدارة المشاريع
- إنشاء وإدارة المشاريع والمراحل
- تتبع تقدم المشاريع
- إدارة المواد والمخازن
- حركات المواد (دخول/خروج/تسوية)

### 💰 المحاسبة المالية
- نظام محاسبة Double-Entry متكامل
- إدارة الإيرادات والمصروفات
- إدارة الفواتير (عملاء/موردين)
- إدارة الخزائن والتحويلات
- تقارير مالية شاملة

### 👥 إدارة الأطراف
- إدارة العملاء والموردين
- إدارة الشركاء وتسوياتهم
- إدارة الموظفين والمرتبات

### 📊 التقارير
- تقرير الأرباح والخسائر
- الميزانية العمومية
- تقرير التدفق النقدي
- تقرير تكلفة المراحل
- تقرير المواد والمخازن
- تقرير الذمم المدينة والدائنة

### 🔧 النظام
- نسخ احتياطي واستعادة
- إعادة تعيين بيانات المشروع
- نظام إشعارات متكامل
- تصميم RTL حديث مع حركات

## التقنيات المستخدمة

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS, shadcn/ui
- **Animations**: Framer Motion
- **Database**: PostgreSQL, Prisma ORM
- **Tables**: TanStack Table
- **Forms**: React Hook Form, Zod
- **Charts**: Recharts
- **Reports**: pdfmake, exceljs

## التثبيت والتشغيل

### المتطلبات
- Node.js 18+
- PostgreSQL 12+
- npm أو yarn

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd erp-construction
```

2. **تثبيت التبعيات**
```bash
npm install
```

3. **إعداد قاعدة البيانات**
```bash
# نسخ ملف البيئة
cp .env.example .env

# تعديل متغيرات البيئة في .env
DATABASE_URL="postgresql://user:pass@localhost:5432/erp_construction"
```

4. **إعداد قاعدة البيانات**
```bash
# توليد Prisma Client
npx prisma generate

# إنشاء جداول قاعدة البيانات
npx prisma migrate dev

# تهيئة البيانات الأولية
npm run seed
```

5. **تشغيل المشروع**
```bash
npm run dev
```

افتح المتصفح على `http://localhost:3000`

## هيكل المشروع

```
├── app/                    # Next.js App Router
│   ├── dashboard/         # لوحة التحكم
│   ├── core/             # العملاء والموردين
│   ├── projects/         # المشاريع والمراحل
│   ├── finance/          # المالية
│   ├── payroll/          # المرتبات
│   ├── reports/          # التقارير
│   └── settings/         # الإعدادات
├── components/           # مكونات React
│   ├── ui/              # مكونات UI الأساسية
│   ├── forms/           # نماذج الإدخال
│   └── datatable/       # جداول البيانات
├── lib/                 # مكتبات مساعدة
├── services/            # خدمات الأعمال
├── prisma/              # قاعدة البيانات
└── tests/               # الاختبارات
```

## الأوامر المتاحة

```bash
# التطوير
npm run dev              # تشغيل خادم التطوير
npm run build            # بناء المشروع
npm run start            # تشغيل الخادم الإنتاجي

# قاعدة البيانات
npm run db:generate      # توليد Prisma Client
npm run db:migrate       # تشغيل الهجرات
npm run db:studio        # فتح Prisma Studio
npm run seed             # تهيئة البيانات

# الجودة
npm run lint             # فحص الكود
npm run format           # تنسيق الكود
npm run typecheck        # فحص الأنواع
npm run test             # تشغيل الاختبارات
```

## النشر

### Netlify
1. ربط المستودع بـ Netlify
2. تعيين متغيرات البيئة
3. تعيين أمر البناء: `npm run build`
4. تعيين مجلد النشر: `.next`

### Vercel
1. ربط المستودع بـ Vercel
2. تعيين متغيرات البيئة
3. النشر التلقائي

## المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push للفرع
5. إنشاء Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## الدعم

للحصول على الدعم أو الإبلاغ عن مشاكل:
- إنشاء Issue في GitHub
- التواصل عبر البريد الإلكتروني

## التحديثات القادمة

- [ ] نظام مصادقة متقدم
- [ ] تطبيق موبايل
- [ ] تكامل مع أنظمة خارجية
- [ ] تقارير متقدمة
- [ ] نظام تنبيهات متطور
