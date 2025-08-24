# وثائق API

## نظرة عامة

نظام إدارة المقاولات يوفر APIs RESTful للتفاعل مع النظام.

## المصادقة

### JWT Token
```
Authorization: Bearer <token>
```

### الحصول على Token
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

## العملاء

### الحصول على قائمة العملاء
```http
GET /api/clients
Authorization: Bearer <token>
```

### إنشاء عميل جديد
```http
POST /api/clients
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "شركة البناء الحديثة",
  "email": "info@company.com",
  "phone": "+966501234567"
}
```

### تحديث عميل
```http
PUT /api/clients/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "شركة البناء المحدثة"
}
```

### حذف عميل
```http
DELETE /api/clients/:id
Authorization: Bearer <token>
```

## الموردين

### الحصول على قائمة الموردين
```http
GET /api/suppliers
Authorization: Bearer <token>
```

### إنشاء مورد جديد
```http
POST /api/suppliers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "مصنع الخرسانة",
  "email": "sales@factory.com",
  "phone": "+966501111111"
}
```

## المشاريع

### الحصول على قائمة المشاريع
```http
GET /api/projects
Authorization: Bearer <token>
```

### إنشاء مشروع جديد
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "برج السكني",
  "description": "بناء برج سكني فاخر",
  "client_id": 1,
  "budget": 50000000
}
```

## الإيرادات

### الحصول على قائمة الإيرادات
```http
GET /api/revenues
Authorization: Bearer <token>
```

### إنشاء إيراد جديد
```http
POST /api/revenues
Authorization: Bearer <token>
Content-Type: application/json

{
  "project_id": 1,
  "client_id": 1,
  "amount": 1000000,
  "description": "دفعة أولى",
  "date": "2024-01-15"
}
```

## المصروفات

### الحصول على قائمة المصروفات
```http
GET /api/expenses
Authorization: Bearer <token>
```

### إنشاء مصروف جديد
```http
POST /api/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "project_id": 1,
  "supplier_id": 1,
  "amount": 50000,
  "description": "شراء مواد بناء",
  "date": "2024-01-15"
}
```

## رموز الحالة

- `200` - نجح الطلب
- `201` - تم الإنشاء بنجاح
- `400` - طلب خاطئ
- `401` - غير مصرح
- `404` - غير موجود
- `500` - خطأ في الخادم

## Pagination

### معاملات Pagination
- `page` - رقم الصفحة (افتراضي: 1)
- `limit` - عدد العناصر في الصفحة (افتراضي: 10)
- `sort` - ترتيب النتائج
- `filter` - تصفية النتائج

### مثال
```http
GET /api/clients?page=1&limit=20&sort=name&filter=active
```

## Rate Limiting

- 1000 طلب في الساعة لكل مستخدم
- 100 طلب في الدقيقة لكل IP

## Webhooks

### إعداد Webhook
```http
POST /api/webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["client.created", "project.updated"]
}
```

### أحداث Webhook
- `client.created` - إنشاء عميل جديد
- `client.updated` - تحديث عميل
- `project.created` - إنشاء مشروع جديد
- `project.updated` - تحديث مشروع
- `revenue.created` - إنشاء إيراد جديد
- `expense.created` - إنشاء مصروف جديد