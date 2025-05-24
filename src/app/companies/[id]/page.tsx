'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';

import dynamic from 'next/dynamic';
import { StaticMap } from '@/components/ui/static-map';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Import MapDisplay only on client side
const MapDisplay = dynamic(
  () => import('@/components/ui/map-display').then((mod) => mod.MapDisplay),
  {
    ssr: false,

   loading: () => (
  <StaticMap
    latitude={32.8872}
    longitude={13.1913}
    height={400}
    width={800}
    className="w-full h-full"
  />
)
  }
);

interface Company {
  id: string;
  name: string;
  speciality: string;
  address: string;
  logoUrl?: string;
  latitude?: number;
  longitude?: number;
  branches: Array<{
    id: string;
    name: string;
    address: string;
    primaryPhone: string;
    secondaryPhone?: string;
    latitude?: number;
    longitude?: number;
  }>;
}

interface CompanyDetailPageProps {
  params: {
    id: string;
  };
}

export default function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  // Unwrap params using React.use()
  // const unwrappedParams = use(params);
  const companyId = params.id;

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompany() {
      try {
        setLoading(true);
        const response = await fetch(`/api/companies/${companyId}`);

        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch company');
        }

        const data = await response.json();
        setCompany(data);
      } catch (err) {
        console.error('Error fetching company:', err);
        setError('Failed to load company data');
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, [companyId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">جاري تحميل بيانات الشركة...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <p>{error || 'Failed to load company'}</p>
          <Link href="/" className="mt-4 inline-block">
            <Button variant="outline" size="sm">
              العودة إلى الصفحة الرئيسية
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/">
          <Button variant="outline" size="sm">
            &larr; العودة إلى الصفحة الرئيسية
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{company.name}</h1>
          <p className="text-xl text-gray-600 mb-6">{company.speciality}</p>

          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">معلومات الشركة</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">العنوان</h3>
                  <p className="mt-1 text-gray-900">{company.address}</p>
                </div>
              </div>
            </div>
          </div>

          {company.branches.length > 0 && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">الفروع</h2>
                <div className="space-y-6">
            {company.branches.map((branch: typeof company.branches[0]) => (
                    <div key={branch.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <Link href={`/branches/${branch.id}`}>
                        <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">{branch.name}</h3>
                      </Link>
                      <p className="mt-1 text-gray-600">{branch.address}</p>
                      <p className="mt-1 text-gray-600">
                        هاتف: {branch.primaryPhone}
                        {branch.secondaryPhone && ` / ${branch.secondaryPhone}`}
                      </p>
                      {branch.latitude && branch.longitude && (
                        <div className="mt-3">
                          <div className="h-48 rounded-md overflow-hidden mb-2">
                            <MapDisplay
                              latitude={branch.latitude}
                              longitude={branch.longitude}
                              popupText={branch.name}
                              height="100%"
                            />
                          </div>
                          <div className="flex space-x-2 space-x-reverse">
                            <Link href={`/branches/${branch.id}`} className="flex-1">
                              <Button variant="outline" size="sm" className="w-full">
                                عرض تفاصيل الفرع
                              </Button>
                            </Link>
                            <Link href={`https://www.google.com/maps?q=${branch.latitude},${branch.longitude}`} target="_blank" className="flex-1">
                              <Button variant="outline" size="sm" className="w-full">
                                فتح في خرائط جوجل
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="h-64 w-full relative">
              {company.logoUrl ? (
                <Image
                  src={company.logoUrl}
                  alt={company.name}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">لا يوجد شعار</span>
                </div>
              )}
            </div>
          </div>

          {company.latitude && company.longitude && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">الموقع</h2>
                <div className="h-96 rounded-md overflow-hidden border-2 border-blue-200">
                  <MapDisplay
                    latitude={company.latitude}
                    longitude={company.longitude}
                    popupText={company.name}
                  />
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">الإحداثيات:</span> {company.latitude.toFixed(6)}, {company.longitude.toFixed(6)}
                  </div>
                  <Link href={`https://www.google.com/maps?q=${company.latitude},${company.longitude}`} target="_blank">
                    <Button variant="outline" size="sm">
                      فتح في خرائط جوجل
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


