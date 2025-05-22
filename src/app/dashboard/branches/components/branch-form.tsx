'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { branchSchema, type BranchFormValues } from '@/lib/validations';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPickerNew } from '@/components/ui/map-picker-new';

interface Company {
  id: string;
  name: string;
}

interface BranchFormProps {
  initialData?: BranchFormValues & { id: string };
  isEditing?: boolean;
}

export function BranchForm({ initialData, isEditing = false }: BranchFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [coordinates, setCoordinates] = useState<{latitude: number | null, longitude: number | null}>({
    latitude: initialData?.latitude || null,
    longitude: initialData?.longitude || null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: initialData || {
      name: '',
      address: '',
      primaryPhone: '',
      secondaryPhone: '',
      companyId: '',
    },
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoadingCompanies(true);
        const response = await fetch('/api/companies');

        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }

        const data = await response.json();
        setCompanies(data);
      } catch (error: any) {
        setError(error.message || 'Failed to load companies');
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  // Handle location change
  const handleLocationChange = (lat: number, lng: number) => {
    console.log('Location changed in form:', lat, lng);
    setCoordinates({
      latitude: lat,
      longitude: lng
    });
  };

  const onSubmit = async (data: BranchFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // Prepare data for submission
      const formData = { ...data };

      // Add coordinates to data
      if (coordinates.latitude !== null && coordinates.longitude !== null) {
        formData.latitude = coordinates.latitude;
        formData.longitude = coordinates.longitude;
      } else {
        // Set to null if not provided
        formData.latitude = null;
        formData.longitude = null;
      }

      console.log('Submitting branch data:', formData);

      // Create or update branch
      const url = isEditing ? `/api/branches/${initialData?.id}` : '/api/branches';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save branch');
      }

      router.push('/dashboard/branches');
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
        <CardTitle>{isEditing ? 'تعديل الفرع' : 'إضافة فرع جديد'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <FormField name="companyId">
            <FormLabel required>الشركة</FormLabel>
            <FormControl>
              <Select
                {...register('companyId')}
                disabled={isLoading || isLoadingCompanies}
              >
                <option value="">اختر الشركة</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            {errors.companyId && <FormMessage>{errors.companyId.message}</FormMessage>}
          </FormField>

          <FormField name="name">
            <FormLabel required>اسم الفرع</FormLabel>
            <FormControl>
              <Input
                {...register('name')}
                placeholder="أدخل اسم الفرع"
                disabled={isLoading}
              />
            </FormControl>
            {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
          </FormField>

          <FormField name="address">
            <FormLabel required>العنوان</FormLabel>
            <FormControl>
              <Textarea
                {...register('address')}
                placeholder="أدخل عنوان الفرع"
                disabled={isLoading}
              />
            </FormControl>
            {errors.address && <FormMessage>{errors.address.message}</FormMessage>}
          </FormField>

          <FormField name="primaryPhone">
            <FormLabel required>الهاتف الرئيسي</FormLabel>
            <FormControl>
              <Input
                {...register('primaryPhone')}
                placeholder="أدخل رقم الهاتف الرئيسي"
                disabled={isLoading}
              />
            </FormControl>
            {errors.primaryPhone && <FormMessage>{errors.primaryPhone.message}</FormMessage>}
          </FormField>

          <FormField name="secondaryPhone">
            <FormLabel>الهاتف الثانوي</FormLabel>
            <FormControl>
              <Input
                {...register('secondaryPhone')}
                placeholder="أدخل رقم الهاتف الثانوي (اختياري)"
                disabled={isLoading}
              />
            </FormControl>
            {errors.secondaryPhone && <FormMessage>{errors.secondaryPhone.message}</FormMessage>}
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
                <span>حدد موقع الفرع على الخريطة</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                يمكنك تحديد موقع الفرع بدقة عن طريق النقر على الخريطة أو سحب المؤشر إلى الموقع المطلوب.
              </p>
            </div>
            <div className="border border-gray-200 rounded-md p-3 bg-white">
              <div className="map-wrapper" style={{ width: '100%', height: '350px' }}>
                <MapPickerNew
                  latitude={coordinates.latitude}
                  longitude={coordinates.longitude}
                  onLocationChange={handleLocationChange}
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

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/branches')}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'جاري الحفظ...' : isEditing ? 'حفظ التغييرات' : 'إضافة الفرع'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
