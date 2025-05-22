'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/modal';
import Image from 'next/image';
import { PencilIcon, TrashIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface Company {
  id: string;
  name: string;
  speciality: string;
  address: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string;
  latitude?: number | null;
  longitude?: number | null;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/companies');

        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }

        const data = await response.json();
        setCompanies(data);
      } catch (error: unknown) {
  if (error instanceof Error) {
    setError(error.message || 'An error occurred');
  } else {
    setError('An unknown error occurred');
  }
} finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleDelete = async () => {
    if (!companyToDelete) return;

    try {
      const response = await fetch(`/api/companies/${companyToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete company');
      }

      // Remove the deleted company from the state
      setCompanies(companies.filter(company => company.id !== companyToDelete));

      // Close the modal
      setDeleteModalOpen(false);
      setCompanyToDelete(null);
    } catch (error: unknown) {
  if (error instanceof Error) {
    setError(error.message || 'An error occurred');
  } else {
    setError('An unknown error occurred');
  }
}
  };

  const openDeleteModal = (id: string) => {
    setCompanyToDelete(id);
    setDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الشركات</h1>
        <Link href="/dashboard/companies/new">
          <Button>إضافة شركة جديدة</Button>
        </Link>
      </div>

      {companies.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">لا توجد شركات حالياً</p>
          <Link href="/dashboard/companies/new">
            <Button>إضافة شركة جديدة</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {companies.map((company) => (
            <Card key={company.id} className="overflow-hidden flex flex-col h-full">
              <div className="h-36 w-full relative bg-white p-2">
                {company.logoUrl ? (
                  <div className="relative h-full w-full flex items-center justify-center">
                    <Image
                      src={company.logoUrl}
                      alt={company.name}
                      width={120}
                      height={120}
                      className="object-contain max-h-32"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">لا يوجد شعار</span>
                  </div>
                )}
              </div>
              <CardContent className="p-3 flex-grow flex flex-col">
                <h2 className="text-lg font-bold mb-1">{company.name}</h2>
                <p className="text-gray-600 text-sm mb-1">{company.speciality}</p>
                <p className="text-gray-500 text-xs mb-1">{company.address}</p>

                {/* Display coordinates if available */}
                {company.latitude && company.longitude && (
                  <p className="text-gray-500 text-xs mb-2 flex items-center">
                    <MapPinIcon className="h-3 w-3 ml-1 text-gray-400" />
                    الموقع: {company.latitude.toFixed(4)}, {company.longitude.toFixed(4)}
                  </p>
                )}

                <div className="mt-auto pt-2 flex justify-between items-center border-t border-gray-100">
                  <Link href={`/dashboard/companies/${company.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center text-xs py-1 px-2 h-7">
                      <PencilIcon className="h-3 w-3 ml-1" />
                      تعديل
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteModal(company.id)}
                    className="flex items-center text-red-600 border-red-200 hover:bg-red-50 text-xs py-1 px-2 h-7"
                  >
                    <TrashIcon className="h-3 w-3 ml-1" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="حذف الشركة"
        message="هل أنت متأكد من رغبتك في حذف هذه الشركة؟ هذا الإجراء لا يمكن التراجع عنه."
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />
    </div>
  );
}
