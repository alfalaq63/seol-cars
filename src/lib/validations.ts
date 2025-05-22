import { z } from 'zod';

// Company validation schema
export const companySchema = z.object({
  name: z.string().min(2, { message: 'اسم الشركة يجب أن يكون على الأقل حرفين' }),
  speciality: z.string().min(2, { message: 'التخصص يجب أن يكون على الأقل حرفين' }),
  address: z.string().min(5, { message: 'العنوان يجب أن يكون على الأقل 5 أحرف' }),
  logoUrl: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});

export type CompanyFormValues = z.infer<typeof companySchema>;

// Branch validation schema
export const branchSchema = z.object({
  name: z.string().min(2, { message: 'أسم الفرع يجب أن يكون على الأقل حرفين' }),
  address: z.string().min(5, { message: 'العنوان يجب أن يكون على الأقل 5 أحرف' }),
  primaryPhone: z.string().min(8, { message: 'رقم الهاتف الرئيسي يجب أن يكون على الأقل 8 أرقام' }),
  secondaryPhone: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  companyId: z.string().min(1, { message: 'الشركة مطلوبة' }),
});

export type BranchFormValues = z.infer<typeof branchSchema>;

// News validation schema
export const newsSchema = z.object({
  title: z.string().min(5, { message: 'عنوان الخبر يجب أن يكون على الأقل 5 أحرف' }),
  content: z.string().min(10, { message: 'محتوى الخبر يجب أن يكون على الأقل 10 أحرف' }),
  mainImage: z.string().optional(),
});

export type NewsFormValues = z.infer<typeof newsSchema>;

// Image validation schema
export const imageSchema = z.object({
  url: z.string().min(1, { message: 'عنوان الصورة ضروري' }),
  newsId: z.string().min(1, { message: 'الرقم المميز ضروري' }),
});

export type ImageFormValues = z.infer<typeof imageSchema>;

// Advertisement validation schema
export const advertisementSchema = z.object({
  content: z.string().min(5, { message: 'محتوى الإعلان يجب أن يكون على الأقل 5 أحرف' }),
  date: z.string().optional().default(() => new Date().toISOString()),
});

export type AdvertisementFormValues = z.infer<typeof advertisementSchema>;

// Message validation schema
export const messageSchema = z.object({
  name: z.string().min(2, { message: 'الاسم يجب أن يكون على الأقل حرفين' }),
  email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
  message: z.string().min(10, { message: 'الرسالة يجب أن تكون على الأقل 10 أحرف' }),
});

export type MessageFormValues = z.infer<typeof messageSchema>;

// User validation schema for creation
export const userCreateSchema = z.object({
  name: z.string().min(2, { message: 'الاسم يجب أن يكون على الأقل حرفين' }),
  email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون على الأقل 6 أحرف' }),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
});

// User validation schema for updates
export const userUpdateSchema = z.object({
  name: z.string().min(2, { message: 'الاسم يجب أن يكون على الأقل حرفين' }),
  email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
  password: z.string().optional(),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
});

// For backward compatibility
export const userSchema = userCreateSchema;

export type UserFormValues = z.infer<typeof userSchema>;

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
  password: z.string().min(1, { message: 'كلمة المرور مطلوبة' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
