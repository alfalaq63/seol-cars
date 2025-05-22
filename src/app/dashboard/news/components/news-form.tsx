'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsSchema, type NewsFormValues } from '@/lib/validations';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

interface NewsFormProps {
  initialData?: NewsFormValues & { 
    id: string;
    images?: { id: string; url: string }[];
  };
  isEditing?: boolean;
}

export function NewsForm({ initialData, isEditing = false }: NewsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(initialData?.mainImage || null);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<{ file: File; preview: string }[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: string; url: string }[]>(
    initialData?.images || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: initialData || {
      title: '',
      content: '',
      mainImage: '',
    },
  });

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMainImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setMainImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: { file: File; preview: string }[] = [];
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        newImages.push({
          file,
          preview: reader.result as string,
        });
        
        if (newImages.length === files.length) {
          setAdditionalImages(prev => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (id: string) => {
    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete image');
      }
      
      setExistingImages(prev => prev.filter(img => img.id !== id));
    } catch (error: any) {
      setError(error.message || 'Failed to delete image');
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  };

  const uploadAdditionalImages = async (newsId: string) => {
    for (const image of additionalImages) {
      try {
        const imageUrl = await uploadImage(image.file);
        
        await fetch('/api/images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: imageUrl,
            newsId,
          }),
        });
      } catch (error) {
        console.error('Failed to upload additional image:', error);
      }
    }
  };

  const onSubmit = async (data: NewsFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // Upload main image if changed
      if (mainImageFile) {
        const mainImageUrl = await uploadImage(mainImageFile);
        data.mainImage = mainImageUrl;
      }

      // Create or update news
      const url = isEditing ? `/api/news/${initialData?.id}` : '/api/news';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save news');
      }

      const newsData = await response.json();
      
      // Upload additional images
      if (additionalImages.length > 0) {
        await uploadAdditionalImages(newsData.id || initialData?.id);
      }

      router.push('/dashboard/news');
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'تعديل الخبر' : 'إضافة خبر جديد'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <FormField name="title">
            <FormLabel required>عنوان الخبر</FormLabel>
            <FormControl>
              <Input
                {...register('title')}
                placeholder="أدخل عنوان الخبر"
                disabled={isLoading}
              />
            </FormControl>
            {errors.title && <FormMessage>{errors.title.message}</FormMessage>}
          </FormField>

          <FormField name="content">
            <FormLabel required>محتوى الخبر</FormLabel>
            <FormControl>
              <Textarea
                {...register('content')}
                placeholder="أدخل محتوى الخبر"
                rows={10}
                disabled={isLoading}
              />
            </FormControl>
            {errors.content && <FormMessage>{errors.content.message}</FormMessage>}
          </FormField>

          <FormField name="mainImage">
            <FormLabel>الصورة الرئيسية</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                disabled={isLoading}
              />
            </FormControl>
            <input type="hidden" {...register('mainImage')} />
            {mainImagePreview && (
              <div className="mt-2 relative h-40 w-full">
                <Image
                  src={mainImagePreview}
                  alt="Main image preview"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </FormField>

          {isEditing && (
            <div>
              <FormLabel>الصور الإضافية الحالية</FormLabel>
              {existingImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="relative h-32 w-full">
                        <Image
                          src={image.url}
                          alt="Additional image"
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(image.id)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-2">لا توجد صور إضافية</p>
              )}
            </div>
          )}

          <div>
            <FormLabel>إضافة صور جديدة</FormLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleAdditionalImagesChange}
              disabled={isLoading}
              className="mt-1"
            />
            
            {additionalImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {additionalImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-32 w-full">
                      <Image
                        src={image.preview}
                        alt={`Additional image ${index + 1}`}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/news')}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'جاري الحفظ...' : isEditing ? 'حفظ التغييرات' : 'إضافة الخبر'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
