"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmModal } from "@/components/ui/modal";
import {
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

interface Branch {
  id: string;
  name: string;
  address: string;
  primaryPhone: string;
  secondaryPhone?: string;
  latitude?: number;
  longitude?: number;
  companyId: string;
  company: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function BranchesPage() {
  //const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/branches");

        if (!response.ok) {
          throw new Error("Failed to fetch branches");
        }

        const data = await response.json();
        setBranches(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message || "An error occurred");
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleDelete = async () => {
    if (!branchToDelete) return;

    try {
      const response = await fetch(`/api/branches/${branchToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete branch");
      }

      // Remove the deleted branch from the state
      setBranches(branches.filter((branch) => branch.id !== branchToDelete));

      // Close the modal
      setDeleteModalOpen(false);
      setBranchToDelete(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "An error occurred");
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const openDeleteModal = (id: string) => {
    setBranchToDelete(id);
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
    <div className="w- 80% m-auto">
      <div className="flex justify-between items-center mb-6 mx-9">
        <h1 className="text-2xl font-bold">إدارة الفروع</h1>
        <Link href="/dashboard/branches/new">
          <Button>إضافة فرع جديد</Button>
        </Link>
      </div>

      {branches.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">لا توجد فروع حالياً</p>
          <Link href="/dashboard/branches/new">
            <Button>إضافة فرع جديد</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <Card key={branch.id}>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">{branch.name}</h2>
                <p className="text-gray-600 mb-1 text-sm">
                  شركة: {branch.company.name}
                </p>

                <div className="flex items-start mt-4 text-gray-500">
                  <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p>{branch.address}</p>
                </div>

                <div className="flex items-center mt-2 text-gray-500">
                  <PhoneIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p>{branch.primaryPhone}</p>
                </div>

                {branch.secondaryPhone && (
                  <div className="flex items-center mt-2 text-gray-500">
                    <PhoneIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p>{branch.secondaryPhone}</p>
                  </div>
                )}

                {/* Display coordinates if available */}
                {branch.latitude && branch.longitude && (
                  <div className="flex items-center mt-2 text-gray-500">
                    <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p>
                      الموقع: {branch.latitude.toFixed(6)},{" "}
                      {branch.longitude.toFixed(6)}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Link href={`/dashboard/branches/${branch.id}`}>
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
                    onClick={() => openDeleteModal(branch.id)}
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
        title="حذف الفرع"
        message="هل أنت متأكد من رغبتك في حذف هذا الفرع؟ هذا الإجراء لا يمكن التراجع عنه."
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />
    </div>
  );
}
