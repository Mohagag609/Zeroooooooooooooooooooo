# دليل الاختبار

## أنواع الاختبارات

### اختبارات الوحدة
- اختبار المكونات الفردية
- اختبار الدوال
- اختبار الخدمات

### اختبارات التكامل
- اختبار التفاعل بين المكونات
- اختبار APIs
- اختبار قاعدة البيانات

### اختبارات النهاية
- اختبار سيناريوهات المستخدم
- اختبار التدفق الكامل
- اختبار الأداء

## تشغيل الاختبارات

### جميع الاختبارات
```bash
npm test
```

### اختبارات الوحدة
```bash
npm run test:unit
```

### اختبارات التكامل
```bash
npm run test:integration
```

### اختبارات النهاية
```bash
npm run test:e2e
```

## كتابة الاختبارات

### اختبارات React
```javascript
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

### اختبارات API
```javascript
import { testApi } from './api'

test('creates user successfully', async () => {
  const user = await testApi.createUser({
    name: 'Test User',
    email: 'test@example.com'
  })
  expect(user.id).toBeDefined()
})
```

## تغطية الاختبارات

### تشغيل التغطية
```bash
npm run test:coverage
```

### الحد الأدنى للتغطية
- الوحدة: 80%
- التكامل: 70%
- النهاية: 60%

## أدوات الاختبار

### Jest
- إطار الاختبار الرئيسي
- تشغيل الاختبارات
- قياس التغطية

### React Testing Library
- اختبار مكونات React
- محاكاة تفاعل المستخدم
- اختبار الوصول

### Cypress
- اختبارات النهاية
- اختبار المتصفح
- تسجيل الفيديو