"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  advertisementSchema,
  type AdvertisementFormValues,
} from "@/lib/validations";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AdvertisementFormProps {
  initialData?: AdvertisementFormValues & { id: string };
  isEditing?: boolean;
}

export function AdvertisementForm({
  initialData,
  isEditing = false,
}: AdvertisementFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdvertisementFormValues>({
    resolver: zodResolver(
      advertisementSchema
    ) as Resolver<AdvertisementFormValues>,
    defaultValues: initialData || {
      content: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: AdvertisementFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // Create or update advertisement
      const url = isEditing
        ? `/api/advertisements/${initialData?.id}`
        : "/api/advertisements";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save advertisement");
      }

      router.push("/dashboard/advertisements");
      router.refresh();
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "تعديل الإعلان" : "إضافة إعلان جديد"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <FormField name="date">
            <FormLabel required>تاريخ الإعلان</FormLabel>
            <FormControl>
              <Input type="date" {...register("date")} disabled={isLoading} />
            </FormControl>
            {errors.date && <FormMessage>{errors.date.message}</FormMessage>}
          </FormField>

          <FormField name="content">
            <FormLabel required>محتوى الإعلان</FormLabel>
            <FormControl>
              <Textarea
                {...register("content")}
                placeholder="أدخل محتوى الإعلان"
                rows={5}
                disabled={isLoading}
              />
            </FormControl>
            {errors.content && (
              <FormMessage>{errors.content.message}</FormMessage>
            )}
          </FormField>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/advertisements")}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "جاري الحفظ..."
                : isEditing
                ? "حفظ التغييرات"
                : "إضافة الإعلان"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
