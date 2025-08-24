#!/bin/bash

# سكريبت بدء تشغيل نظام إدارة المقاولات

echo "🚀 بدء تشغيل نظام إدارة المقاولات..."

# التحقق من وجود Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت"
    exit 1
fi

# التحقق من وجود npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm غير مثبت"
    exit 1
fi

# تثبيت التبعيات
echo "📦 تثبيت التبعيات..."
npm install

# تشغيل قاعدة البيانات
echo "🗄️ تشغيل قاعدة البيانات..."
docker-compose up -d postgres

# انتظار تشغيل قاعدة البيانات
echo "⏳ انتظار تشغيل قاعدة البيانات..."
sleep 10

# تشغيل التطبيق
echo "🌐 تشغيل التطبيق..."
npm run dev

echo "✅ تم بدء التشغيل بنجاح!"