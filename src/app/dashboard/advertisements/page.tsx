"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmModal } from "@/components/ui/modal";
import {
  PencilIcon,
  TrashIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Advertisement {
  id: string;
  content: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdvertisementsPage() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/advertisements");

        if (!response.ok) {
          throw new Error("Failed to fetch advertisements");
        }

        const data = await response.json();
        setAdvertisements(data);
      } catch (error: unknown) {
  setError((error as Error).message || "An error occurred");
} finally {
  setIsLoading(false);
}
    };

    fetchAdvertisements();
  }, []);

  const handleDelete = async () => {
    if (!adToDelete) return;

    try {
      const response = await fetch(`/api/advertisements/${adToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete advertisement");
      }

      // Remove the deleted advertisement from the state
      setAdvertisements(advertisements.filter((ad) => ad.id !== adToDelete));

      // Close the modal
      setDeleteModalOpen(false);
      setAdToDelete(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "An error occurred");
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const openDeleteModal = (id: string) => {
    setAdToDelete(id);
    setDeleteModalOpen(true);
  };

  // Format date function
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("ar-LY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
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
    <div className="w-80% m-auto">
      <div className="flex justify-between items-center mb-6 mx-8">
        <h1 className="text-2xl font-bold">إدارة الاعلانات</h1>
        <Link href="/dashboard/advertisements/new">
          <Button>إضافة إعلان جديد</Button>
        </Link>
      </div>

      {advertisements.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">لا توجد إعلانات حالياً</p>
          <Link href="/dashboard/advertisements/new">
            <Button>إضافة إعلان جديد</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {advertisements.map((ad) => (
            <Card key={ad.id}>
              <CardContent className="p-6">
                <div className="flex items-center text-gray-500 mb-3">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <p className="text-sm">{formatDate(ad.date)}</p>
                </div>

                <p className="text-lg mb-4">{ad.content}</p>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Link href={`/dashboard/advertisements/${ad.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <PencilIcon className="h-4 w-4 ml-1" />
                      تعديل
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteModal(ad.id)}
                    className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4 ml-1" />
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
        title="حذف الإعلان"
        message="هل أنت متأكد من رغبتك في حذف هذا الإعلان؟ هذا الإجراء لا يمكن التراجع عنه."
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />
    </div>
  );
}
