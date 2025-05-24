"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmModal } from "@/components/ui/modal";
import { TrashIcon, UserIcon } from "@heroicons/react/24/outline";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/messages");

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        setMessages(data);
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

    fetchMessages();
  }, []);

  const handleDelete = async () => {
    if (!messageToDelete) return;

    try {
      const response = await fetch(`/api/messages/${messageToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }

      // Remove the deleted message from the state
      setMessages(messages.filter((message) => message.id !== messageToDelete));

      // Close the modal
      setDeleteModalOpen(false);
      setMessageToDelete(null);
    } catch (error: unknown) {
  if (error instanceof Error) {
    setError(error.message || 'An error occurred');
  } else {
    setError('An unknown error occurred');
  }
}
  };

  const openDeleteModal = (id: string) => {
    setMessageToDelete(id);
    setDeleteModalOpen(true);
  };

  const toggleExpandMessage = (id: string) => {
    if (expandedMessage === id) {
      setExpandedMessage(null);
    } else {
      setExpandedMessage(id);
    }
  };

  // Format date function
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("ar-LY", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الرسائل</h1>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">لا توجد رسائل حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{message.name}</h2>
                    <p className="text-gray-500 text-sm">{message.email}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                </div>

                <div
                  className={`bg-gray-50 p-4 rounded-md mb-4 ${
                    expandedMessage === message.id ? "" : "line-clamp-3"
                  }`}
                  onClick={() => toggleExpandMessage(message.id)}
                >
                  <p className="text-gray-700 whitespace-pre-line">
                    {message.message}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteModal(message.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
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
        title="حذف الرسالة"
        message="هل أنت متأكد من رغبتك في حذف هذه الرسالة؟ هذا الإجراء لا يمكن التراجع عنه."
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />
    </div>
  );
}
