# تعليمات تطبيق التحديثات على قاعدة البيانات

## خطوات تطبيق RPC Function لإصلاح XP Race Condition

### الطريقة 1: باستخدام Supabase CLI

1. تأكد من تثبيت Supabase CLI:
```bash
npm install -g supabase
```

2. قم بتسجيل الدخول:
```bash
supabase login
```

3. ربط المشروع:
```bash
supabase link --project-ref <your-project-reference>
```

4. تطبيق Migration:
```bash
supabase db push
```

### الطريقة 2: من خلال Supabase Dashboard (أسهل)

1. افتح Supabase Dashboard: https://app.supabase.com
2. اختر مشروعك
3. انتقل إلى **SQL Editor**
4. افتح الملف `supabase/migrations/20251217_increment_xp_function.sql`
5. انسخ محتوى الملف بالكامل
6. الصق الكود في SQL Editor
7. اضغط **Run** أو **F5**

### التحقق من نجاح التطبيق

بعد تطبيق Migration، تحقق من وجود الدالة:

```sql
-- تحقق من وجود الدالة
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name = 'increment_xp';
```

### اختبار الدالة

```sql
-- اختبار زيادة XP (استبدل USER_ID بـ ID حقيقي)
SELECT * FROM increment_xp(
  'USER_ID'::uuid,
  100  -- قيمة XP للزيادة
);
```

## ملاحظات مهمة

⚠️ **تحذير**: هذه الدالة تقوم بـ:
1. زيادة XP بشكل atomic (آمن من race conditions)
2. تحديث `last_active` للمستخدم
3. حساب وتحديث `level` تلقائياً (كل 1000 XP = مستوى واحد)

✅ **فوائد**:
- حل مشكلة Race Condition نهائياً
- تحديث المستوى تلقائياً
- أداء أفضل (عملية واحدة بدلاً من قراءة ثم كتابة)

## Rollback (في حالة المشاكل)

إذا حدثت مشاكل، يمكنك حذف الدالة:

```sql
DROP FUNCTION IF EXISTS increment_xp(UUID, INTEGER);
```
