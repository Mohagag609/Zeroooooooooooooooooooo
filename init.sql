-- تهيئة قاعدة البيانات
CREATE DATABASE IF NOT EXISTS erp_db;
USE erp_db;

-- إنشاء المستخدم الافتراضي
CREATE USER IF NOT EXISTS 'erp_user'@'%' IDENTIFIED BY 'erp_password';
GRANT ALL PRIVILEGES ON erp_db.* TO 'erp_user'@'%';
FLUSH PRIVILEGES;