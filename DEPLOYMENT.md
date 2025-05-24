# دليل النشر على Vercel

## خطوات النشر:

### 1. إعداد متغيرات البيئة في Vercel Dashboard:
اذهب إلى Project Settings > Environment Variables وأضف:

```
DATABASE_URL=postgresql://neondb_owner:npg_1jOmZvIbU0lo@ep-dawn-forest-a8ckvkhe-pooler.eastus2.azure.neon.tech/siol-libya-cars?sslmode=require
NEXTAUTH_SECRET=siol-libya-cars-secret-key-2024-production-vercel-deployment
NEXTAUTH_URL=https://siol-libya-cars.vercel.app
```

### 2. إعدادات Build في Vercel:
- Build Command: `npm run build:vercel`
- Install Command: `npm install --legacy-peer-deps`
- Output Directory: `.next`
- Framework: Next.js
- Node.js Version: 18.x

### 3. بعد النشر الأول:
1. اذهب إلى: https://siol-libya-cars.vercel.app/setup
2. اضغط على "إعداد قاعدة البيانات"
3. سجل دخول بـ:
   - البريد الإلكتروني: admin@admin.com
   - كلمة المرور: admin

### 4. استكشاف الأخطاء:
- إذا فشل البناء، تحقق من logs في Vercel Dashboard
- إذا كانت هناك مشاكل في قاعدة البيانات، تحقق من Neon Dashboard
- إذا كانت هناك مشاكل JWT، امسح الكوكيز أو استخدم نافذة خاصة
- تأكد من أن جميع متغيرات البيئة مضبوطة بشكل صحيح

### 5. الميزات المتاحة بعد النشر:
- ✅ الصفحة الرئيسية المحدثة مع تصميم جديد
- ✅ نظام تسجيل الدخول والمصادقة
- ✅ إدارة الشركات والفروع
- ✅ إدارة الأخبار والصور
- ✅ إدارة الإعلانات
- ✅ نظام الخرائط التفاعلية
- ✅ تصميم متجاوب لجميع الأجهزة

## الملفات المهمة:
- `.env` - متغيرات الإنتاج (لا تُرفع إلى Git)
- `.env.local` - متغيرات التطوير المحلي (لا تُرفع إلى Git)
- `vercel.json` - إعدادات Vercel
- `package.json` - scripts البناء
- `prisma/schema.prisma` - مخطط قاعدة البيانات

## بيانات تسجيل الدخول الافتراضية:
- البريد الإلكتروني: `admin@admin.com`
- كلمة المرور: `admin`

⚠️ **مهم**: غيّر كلمة المرور الافتراضية بعد أول تسجيل دخول!
