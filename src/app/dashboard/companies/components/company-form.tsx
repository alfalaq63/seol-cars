'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { companySchema, type CompanyFormValues } from '@/lib/validations';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPickerNew } from '@/components/ui/map-picker-new';
import { ImageUpload } from '@/components/ui/image-upload';

interface CompanyFormProps {
  initialData?: CompanyFormValues & { id: string };
  isEditing?: boolean;
}

export function CompanyForm({ initialData, isEditing = false }: CompanyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>(initialData?.logoUrl || '');
  const [coordinates, setCoordinates] = useState<{latitude: number | null, longitude: number | null}>({
    latitude: initialData?.latitude || null,
    longitude: initialData?.longitude || null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: initialData || {
      name: '',
      speciality: '',
      address: '',
      logoUrl: '',
      latitude: null,
      longitude: null,
    },
  });



  const onSubmit = async (data: CompanyFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // Prepare data for submission
      const formData = { ...data };

      // Set logo URL
      formData.logoUrl = logoUrl;

      // Add coordinates to data
      if (coordinates.latitude !== null && coordinates.longitude !== null) {
        formData.latitude = coordinates.latitude;
        formData.longitude = coordinates.longitude;
      } else {
        // Set to null if not provided
        formData.latitude = null;
        formData.longitude = null;
      }

      console.log('Submitting company data:', formData);

      // Create or update company
      const url = isEditing ? `/api/companies/${initialData?.id}` : '/api/companies';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('API error response:', responseData);
        throw new Error(responseData.error || 'فشل في حفظ الشركة');
      }

      console.log('Company saved successfully:', responseData);

      // Use setTimeout to ensure state updates are processed before navigation
      setTimeout(() => {
        router.push('/dashboard/companies');
        router.refresh();
      }, 100);

    } catch (error: unknown) {
  if (error instanceof Error) {
    setError(error.message || 'حدث خطأ عند حفظ الشركة');
  } else {
    setError('An unknown error occurred');
  }
} finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'تعديل الشركة' : 'إضافة شركة جديدة'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <FormField name="name">
            <FormLabel required>اسم الشركة</FormLabel>
            <FormControl>
              <Input
                {...register('name')}
                placeholder="أدخل اسم الشركة"
                disabled={isLoading}
              />
            </FormControl>
            {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
          </FormField>

          <FormField name="speciality">
            <FormLabel required>التخصص</FormLabel>
            <FormControl>
              <Input
                {...register('speciality')}
                placeholder="أدخل تخصص الشركة"
                disabled={isLoading}
              />
            </FormControl>
            {errors.speciality && <FormMessage>{errors.speciality.message}</FormMessage>}
          </FormField>

          <FormField name="address">
            <FormLabel required>العنوان</FormLabel>
            <FormControl>
              <Textarea
                {...register('address')}
                placeholder="أدخل عنوان الشركة"
                disabled={isLoading}
              />
            </FormControl>
            {errors.address && <FormMessage>{errors.address.message}</FormMessage>}
          </FormField>

          <div className="space-y-2">
            <FormLabel>
              <span className="flex items-center">
                <span>الموقع الجغرافي</span>
                <span className="mr-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">اختياري</span>
              </span>
            </FormLabel>
            <div className="bg-blue-50 p-3 rounded-md mb-3">
              <div className="flex items-center text-sm text-blue-700 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>حدد موقع الشركة على الخريطة</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                يمكنك تحديد موقع الشركة بدقة عن طريق النقر على الخريطة أو سحب المؤشر إلى الموقع المطلوب.
              </p>
            </div>
            <div className="border border-gray-200 rounded-md p-3 bg-white">
              <div className="map-wrapper" style={{ width: '100%', height: '350px' }}>
                <MapPickerNew
                  latitude={coordinates.latitude}
                  longitude={coordinates.longitude}
                  onLocationChange={(lat, lng) => {
                    console.log('Location changed in form:', lat, lng);
                    setCoordinates({
                      latitude: lat,
                      longitude: lng
                    });
                  }}
                  height="350px"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-500">
                {coordinates.latitude && coordinates.longitude
                  ? (
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      تم تحديد الموقع بنجاح
                    </span>
                  )
                  : 'لم يتم تحديد موقع بعد. انقر على الخريطة لتحديد الموقع.'
                }
              </p>
              {coordinates.latitude && coordinates.longitude && (
                <button
                  type="button"
                  className="text-xs text-red-600 hover:text-red-800"
                  onClick={() => setCoordinates({ latitude: null, longitude: null })}
                >
                  إعادة تعيين الموقع
                </button>
              )}
            </div>
          </div>

          <FormField name="logoUrl">
            <FormLabel>شعار الشركة</FormLabel>
            <FormControl>
              <ImageUpload
                value={logoUrl}
                onChange={setLogoUrl}
                disabled={isLoading}
                maxSize={2}
              />
            </FormControl>
            <input type="hidden" {...register('logoUrl')} value={logoUrl} />
          </FormField>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/companies')}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'جاري الحفظ...' : isEditing ? 'حفظ التغييرات' : 'إضافة الشركة'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
