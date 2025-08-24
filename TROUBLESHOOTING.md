# دليل استكشاف الأخطاء

## مشاكل شائعة وحلولها

### مشاكل التثبيت

#### خطأ: Node.js غير مثبت
**السبب**: Node.js غير مثبت أو إصدار قديم
**الحل**:
```bash
# تثبيت Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### خطأ: npm install فشل
**السبب**: مشاكل في التبعيات أو الذاكرة
**الحل**:
```bash
# مسح cache
npm cache clean --force

# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install
```

#### خطأ: قاعدة البيانات لا تتصل
**السبب**: PostgreSQL غير مشغل أو إعدادات خاطئة
**الحل**:
```bash
# تشغيل PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# التحقق من الاتصال
psql -U postgres -d erp_system
```

### مشاكل التشغيل

#### خطأ: التطبيق لا يبدأ
**السبب**: مشاكل في المتغيرات البيئية
**الحل**:
```bash
# نسخ ملف البيئة
cp .env.example .env

# تعديل المتغيرات
nano .env

# تشغيل التطبيق
npm run dev
```

#### خطأ: الصفحة لا تتحمل
**السبب**: مشاكل في الخادم أو الذاكرة
**الحل**:
```bash
# إعادة تشغيل الخادم
npm run build
npm start

# التحقق من الذاكرة
free -h
```

#### خطأ: قاعدة البيانات بطيئة
**السبب**: عدم وجود فهارس أو استعلامات غير محسنة
**الحل**:
```sql
-- إنشاء فهارس
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_projects_name ON projects(name);

-- تحليل الأداء
EXPLAIN ANALYZE SELECT * FROM clients WHERE name LIKE '%test%';
```

### مشاكل الأمان

#### خطأ: خطأ في المصادقة
**السبب**: مشاكل في JWT أو الجلسات
**الحل**:
```bash
# مسح الجلسات
rm -rf .next

# إعادة تشغيل الخادم
npm run dev
```

#### خطأ: خطأ في الصلاحيات
**السبب**: صلاحيات غير صحيحة للملفات
**الحل**:
```bash
# تعديل الصلاحيات
chmod 755 /path/to/app
chown -R user:group /path/to/app
```

### مشاكل الأداء

#### خطأ: التطبيق بطيء
**السبب**: مشاكل في الذاكرة أو CPU
**الحل**:
```bash
# مراقبة الموارد
htop
df -h

# تحسين الذاكرة
node --max-old-space-size=4096 server.js
```

#### خطأ: قاعدة البيانات بطيئة
**السبب**: استعلامات غير محسنة أو عدم وجود فهارس
**الحل**:
```sql
-- تحليل الاستعلامات البطيئة
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- إنشاء فهارس
CREATE INDEX CONCURRENTLY idx_revenues_date ON revenues(date);
```

### مشاكل الشبكة

#### خطأ: لا يمكن الوصول للتطبيق
**السبب**: مشاكل في Firewall أو Port
**الحل**:
```bash
# فتح المنفذ
sudo ufw allow 3000

# التحقق من المنافذ المفتوحة
netstat -tulpn | grep :3000
```

#### خطأ: مشاكل في HTTPS
**السبب**: شهادات SSL غير صحيحة
**الحل**:
```bash
# تجديد الشهادات
sudo certbot renew

# التحقق من الشهادات
openssl s_client -connect domain.com:443
```

### مشاكل Docker

#### خطأ: Docker لا يبدأ
**السبب**: مشاكل في Docker daemon
**الحل**:
```bash
# إعادة تشغيل Docker
sudo systemctl restart docker

# التحقق من حالة Docker
sudo systemctl status docker
```

#### خطأ: مشاكل في Docker Compose
**السبب**: مشاكل في ملف docker-compose.yml
**الحل**:
```bash
# التحقق من الملف
docker-compose config

# إعادة بناء الصور
docker-compose build --no-cache
```

### مشاكل النسخ الاحتياطي

#### خطأ: النسخ الاحتياطي فشل
**السبب**: مشاكل في المساحة أو الصلاحيات
**الحل**:
```bash
# التحقق من المساحة
df -h

# إنشاء نسخة احتياطية يدوية
pg_dump -U postgres erp_system > backup.sql
```

#### خطأ: استعادة النسخة الاحتياطية فشلت
**السبب**: مشاكل في قاعدة البيانات أو الصلاحيات
**الحل**:
```bash
# إنشاء قاعدة بيانات جديدة
createdb -U postgres erp_system_new

# استعادة النسخة الاحتياطية
psql -U postgres erp_system_new < backup.sql
```

### مشاكل التقارير

#### خطأ: التقارير لا تظهر
**السبب**: مشاكل في البيانات أو الاستعلامات
**الحل**:
```sql
-- التحقق من البيانات
SELECT COUNT(*) FROM revenues;
SELECT COUNT(*) FROM expenses;

-- التحقق من الاستعلامات
EXPLAIN ANALYZE SELECT * FROM revenues WHERE date >= '2024-01-01';
```

#### خطأ: الرسوم البيانية لا تعمل
**السبب**: مشاكل في JavaScript أو البيانات
**الحل**:
```bash
# مسح cache المتصفح
# التحقق من console errors
# التحقق من البيانات
```

### مشاكل التحديث

#### خطأ: التحديث فشل
**السبب**: مشاكل في Git أو التبعيات
**الحل**:
```bash
# مسح التغييرات المحلية
git stash

# سحب التحديثات
git pull origin main

# إعادة تثبيت التبعيات
npm install
```

#### خطأ: مشاكل في Migration
**السبب**: مشاكل في قاعدة البيانات
**الحل**:
```bash
# تشغيل migrations
npx prisma migrate deploy

# إعادة توليد client
npx prisma generate
```

## الحصول على المساعدة

### المنتدى
- [منتدى المستخدمين](https://forum.erp-system.com)
- ابحث عن حلول سابقة
- اطرح سؤالك

### GitHub Issues
- [GitHub Issues](https://github.com/erp-system/erp-system/issues)
- ابحث عن issues مشابهة
- أنشئ issue جديد

### الدعم الفني
- البريد الإلكتروني: support@erp-system.com
- Discord: [discord.gg/erp-system](https://discord.gg/erp-system)

## معلومات النظام

### جمع معلومات النظام
```bash
# معلومات النظام
uname -a
cat /etc/os-release

# معلومات Node.js
node --version
npm --version

# معلومات قاعدة البيانات
psql --version

# معلومات Docker
docker --version
docker-compose --version
```

### سجلات النظام
```bash
# سجلات التطبيق
tail -f logs/app.log

# سجلات قاعدة البيانات
tail -f /var/log/postgresql/postgresql-*.log

# سجلات Docker
docker logs container_name
```

## نصائح عامة

1. **احتفظ بنسخ احتياطية منتظمة**
2. **راقب أداء النظام**
3. **حدث النظام بانتظام**
4. **وثق التغييرات**
5. **اختبر في بيئة التطوير أولاً**