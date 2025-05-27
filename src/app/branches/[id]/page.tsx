'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import dynamicImport from 'next/dynamic';
import { StaticMap } from '@/components/ui/static-map';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Import MapDisplay only on client side
const MapDisplay = dynamicImport(
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

interface BranchDetailPageProps {
  params: {
    id: string;
  };
}

interface Branch {
  id: string;
  name: string;
  address: string;
  primaryPhone: string;
  secondaryPhone?: string;
  latitude?: number;
  longitude?: number;
  company: {
    id: string;
    name: string;
  };
}

export default function BranchDetailPage({ params }: BranchDetailPageProps) {
  const branchId = params.id;

  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBranch() {
      try {
        setLoading(true);
        const response = await fetch(`/api/branches/${branchId}`);

        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch branch');
        }

        const data = await response.json();
        setBranch(data);
      } catch (err) {
        console.error('Error fetching branch:', err);
        setError('Failed to load branch data');
      } finally {
        setLoading(false);
      }
    }

    fetchBranch();
  }, [branchId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">جاري تحميل بيانات الفرع...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !branch) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <p>{error || 'Failed to load branch'}</p>
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
        <Link href={`/companies/${branch.company.id}`}>
          <Button variant="outline" size="sm">
            &larr; العودة إلى {branch.company.name}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{branch.name}</h1>
          <p className="text-xl text-gray-600 mb-6">{branch.company.name}</p>

          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">معلومات الفرع</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">العنوان</h3>
                  <p className="mt-1 text-gray-900">{branch.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">الهاتف الرئيسي</h3>
                  <p className="mt-1 text-gray-900">{branch.primaryPhone}</p>
                </div>
                {branch.secondaryPhone && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">الهاتف الثانوي</h3>
                    <p className="mt-1 text-gray-900">{branch.secondaryPhone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {branch.latitude && branch.longitude && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">الموقع</h2>
              <div className="h-96 rounded-md overflow-hidden border-2 border-blue-200">
                <MapDisplay
                  latitude={branch.latitude}
                  longitude={branch.longitude}
                  popupText={branch.name}
                />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">الإحداثيات:</span> {branch.latitude.toFixed(6)}, {branch.longitude.toFixed(6)}
                </div>
                <Link href={`https://www.google.com/maps?q=${branch.latitude},${branch.longitude}`} target="_blank">
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
  );
}





