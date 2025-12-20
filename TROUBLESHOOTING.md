# Troubleshooting Guide - StudyMATE

## الأخطاء الشائعة والحلول

### 1. أخطاء الـ Build

#### خطأ: `Module not found`
**السبب:** ملف مفقود أو مسار غير صحيح
**الحل:**
```bash
# تنظيف الـ cache
rm -r .next
rm -r node_modules/.cache

# إعادة التثبيت
npm install

# إعادة البناء
npm run build
```

#### خطأ: `TypeScript Error`
**السبب:** مشاكل في التايبات
**الحل:**
```bash
# التحقق من الأخطاء
npx tsc --noEmit

# تصحيح الأخطاء يدويًا ثم:
npm run build
```

#### خطأ: `Port 3000 already in use`
**السبب:** عملية أخرى تستخدم المنفذ
**الحل:**
```bash
# Windows PowerShell
Get-Process node | Stop-Process -Force

# أو استخدم منفذ مختلف
PORT=3001 npm run dev
```

---

### 2. أخطاء Runtime

#### خطأ: `NEXT_PUBLIC_SUPABASE_URL is not defined`
**السبب:** متغيرات البيئة غير محددة
**الحل:**
1. تحقق من `.env.local`
2. تأكد من وجود جميع المتغيرات:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_APP_URL=your_app_url
```

#### خطأ: `Middleware Error`
**السبب:** مشكلة في الـ authentication middleware
**الحل:**
```bash
# تحقق من middleware.ts
cat middleware.ts

# أعد تشغيل الخادم
npm run dev
```

#### خطأ: `Database Connection Failed`
**السبب:** مشكلة في الاتصال مع Supabase
**الحل:**
1. تحقق من `NEXT_PUBLIC_SUPABASE_URL` الصحيح
2. تحقق من `NEXT_PUBLIC_SUPABASE_ANON_KEY` الصحيح
3. تحقق من اتصال الإنترنت
4. تحقق من حالة Supabase

---

### 3. أخطاء الـ Authentication

#### خطأ: `User not authenticated`
**السبب:** الجلسة منتهية أو لم تسجل الدخول
**الحل:**
```bash
# تحقق من cookies وauth tokens
# في المتصفح: DevTools > Application > Cookies

# اسح الـ localStorage و cookies
localStorage.clear()
sessionStorage.clear()
```

#### خطأ: `OAuth Provider Not Configured`
**السبب:** Google/GitHub OAuth غير مفعل
**الحل:**
1. ذهب إلى Supabase Dashboard
2. اذهب إلى Authentication > Providers
3. فعل Google و GitHub
4. أضف Callback URLs الصحيحة

---

### 4. أخطاء الـ API

#### خطأ: `API request failed`
**السبب:** مشكلة في الـ endpoint أو البيانات
**الحل:**
```bash
# تحقق من الـ console للأخطاء
# اضغط F12 في المتصفح > Console

# تحقق من الـ API logs في Supabase
```

#### خطأ: `CORS Error`
**السبب:** مشكلة في Cross-Origin
**الحل:**
```typescript
// في next.config.ts تأكد من headers الصحيحة
async headers() {
  return [{
    source: '/:path*',
    headers: [
      {
        key: 'Access-Control-Allow-Credentials',
        value: 'true',
      },
    ],
  }]
}
```

---

### 5. أخطاء الـ Deployment

#### خطأ: `Build fails on Vercel`
**الحل:**
1. تحقق من environment variables في Vercel dashboard
2. تأكد من git push قبل الـ deployment
3. تحقق من logs في Vercel

#### خطأ: `White screen after deployment`
**السبب:** مشاكل في الـ hydration أو البيانات
**الحل:**
```bash
# تحقق من console للأخطاء
# تنظيف الـ cache في الـ browser
# إعادة تحميل الصفحة (Ctrl+F5)
```

---

### 6. أخطاء الأداء

#### المشكلة: الموقع بطيء
**الحل:**
```bash
# تحقق من البناء
npm run build

# تحقق من حجم الـ bundle
npx next-bundle-analyzer

# استخدم الـ production mode
npm run start
```

---

### 7. أخطاء قاعدة البيانات

#### خطأ: `Table does not exist`
**السبب:** migrations لم تُطبق
**الحل:**
1. اذهب إلى Supabase Dashboard
2. اذهب إلى SQL Editor
3. أنشئ الجداول المطلوبة
4. تحقق من الهيكل

#### خطأ: `Permission denied`
**السبب:** صلاحيات RLS غير صحيحة
**الحل:**
1. اذهب إلى Supabase > Authentication
2. تحقق من Row Level Security (RLS)
3. تحقق من الـ policies

---

## 🔧 أدوات التصحيح

### 1. Browser DevTools
```
F12 > Console: أخطاء JavaScript
F12 > Network: طلبات API
F12 > Application: Cookies و LocalStorage
```

### 2. VS Code
```
Ctrl+Shift+J: صفحة الخطأ
Ctrl+Shift+P: Command Palette
```

### 3. Supabase Dashboard
```
Logs > Edge Functions
Logs > Database
Logs > Auth
```

### 4. Vercel Dashboard
```
Deployments > Build Logs
Deployments > Runtime Logs
```

---

## 📞 الحصول على المساعدة

### خطوات تقديم تقرير خطأ:
1. وصف المشكلة بوضوح
2. خطوات إعادة الإنتاج
3. الأخطاء المحددة من الـ console
4. الـ environment والمتصفح المستخدم

### الموارد المفيدة:
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)

---

**آخر تحديث:** Dec 20, 2025
