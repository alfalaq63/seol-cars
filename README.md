# 🚗 سيول ليبيا للسيارات

موقع إلكتروني شامل لشركة سيول ليبيا للسيارات مبني بتقنيات حديثة لإدارة الشركات والفروع والأخبار.

## ✨ الميزات

### 🏠 الصفحة الرئيسية
- تصميم احترافي مع قسم البطل التفاعلي
- قسم الإحصائيات (15+ سنة خبرة، 50+ شركة تابعة)
- قسم الخدمات مع أيقونات معبرة
- عرض أحدث الأخبار والشركات
- قسم "من نحن" التفاعلي

### 🏢 إدارة الشركات
- إضافة وتعديل الشركات
- رفع شعارات الشركات
- تحديد المواقع الجغرافية
- إدارة الفروع لكل شركة

### 📰 إدارة الأخبار
- نشر الأخبار مع الصور
- رفع صور متعددة لكل خبر
- تحرير وحذف الأخبار
- عرض الأخبار بتصميم جذاب

### 📢 نظام الإعلانات
- إضافة إعلانات متحركة
- عرض الإعلانات في شريط متحرك
- إدارة كاملة للإعلانات

### 🗺️ الخرائط التفاعلية
- عرض مواقع الشركات والفروع
- خرائط تفاعلية مع Leaflet
- ربط مع خرائط جوجل

### 🔐 نظام المصادقة
- تسجيل دخول آمن
- إدارة الجلسات
- حماية صفحات الإدارة

## 🛠️ التقنيات المستخدمة

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Maps**: Leaflet, React-Leaflet
- **UI Components**: Headless UI, Heroicons
- **File Upload**: Custom upload system
- **Deployment**: Vercel

## 🚀 التشغيل المحلي

### المتطلبات
- Node.js 18+
- npm أو yarn
- قاعدة بيانات PostgreSQL

### خطوات التشغيل

1. **استنساخ المشروع**:
```bash
git clone https://github.com/alfalaq63/seol-cars.git
cd seol-cars
```

2. **تثبيت التبعيات**:
```bash
npm install --legacy-peer-deps
```

3. **إعداد متغيرات البيئة**:
```bash
cp .env.example .env.local
```

4. **تحديث متغيرات البيئة**:
```env
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

5. **إعداد قاعدة البيانات**:
```bash
npx prisma generate
npx prisma db push
```

6. **تشغيل الخادم**:
```bash
npm run dev
```

7. **إعداد المستخدم الإداري**:
- اذهب إلى: http://localhost:3000/setup
- اضغط على "إعداد قاعدة البيانات"

## 📦 النشر على Vercel

### خطوات النشر

1. **ربط Repository بـ Vercel**:
   - اذهب إلى [vercel.com](https://vercel.com)
   - اربط هذا Repository
   - اختر Framework: Next.js

2. **إعداد متغيرات البيئة**:
```env
DATABASE_URL=your-production-database-url
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-app.vercel.app
```

3. **إعدادات Build**:
   - Build Command: `npm run build:vercel`
   - Install Command: `npm install --legacy-peer-deps`
   - Output Directory: `.next`
   - Node.js Version: 18.x

4. **بعد النشر**:
   - اذهب إلى: `https://your-app.vercel.app/setup`
   - أعد إعداد قاعدة البيانات

## 🔑 بيانات تسجيل الدخول الافتراضية

```
البريد الإلكتروني: admin@admin.com
كلمة المرور: admin
```

⚠️ **مهم**: غيّر كلمة المرور بعد أول تسجيل دخول!

## 📁 هيكل المشروع

```
src/
├── app/                    # صفحات Next.js
│   ├── api/               # API Routes
│   ├── dashboard/         # لوحة التحكم
│   ├── companies/         # صفحات الشركات
│   ├── news/             # صفحات الأخبار
│   └── ...
├── components/            # مكونات React
│   ├── ui/               # مكونات UI
│   └── layout/           # مكونات التخطيط
├── lib/                  # مكتبات مساعدة
└── scripts/              # سكريبتات الإعداد
```

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 التواصل

- **الموقع**: [سيول ليبيا للسيارات](https://seol-cars.vercel.app)
- **GitHub**: [alfalaq63/seol-cars](https://github.com/alfalaq63/seol-cars)

---

صُنع بـ ❤️ في ليبيا
