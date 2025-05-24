"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsSchema, type NewsFormValues } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload";

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
  const [mainImageUrl, setMainImageUrl] = useState<string>(
    initialData?.mainImage || ""
  );
  const [additionalImageUrls, setAdditionalImageUrls] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      mainImage: "",
    },
  });





  const onSubmit = async (data: NewsFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // Set main image URL
      data.mainImage = mainImageUrl;

      // Create or update news
      const url = isEditing ? `/api/news/${initialData?.id}` : "/api/news";
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
        throw new Error(errorData.error || "Failed to save news");
      }

      const newsData = await response.json();

      // Save additional images
      if (additionalImageUrls.length > 0) {
        for (const imageUrl of additionalImageUrls) {
          try {
            await fetch("/api/images", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                url: imageUrl,
                newsId: newsData.id || initialData?.id,
              }),
            });
          } catch (error) {
            console.error("Failed to save additional image:", error);
          }
        }
      }

      router.push("/dashboard/news");
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
        <CardTitle>{isEditing ? "تعديل الخبر" : "إضافة خبر جديد"}</CardTitle>
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
                {...register("title")}
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
                {...register("content")}
                placeholder="أدخل محتوى الخبر"
                rows={10}
                disabled={isLoading}
              />
            </FormControl>
            {errors.content && (
              <FormMessage>{errors.content.message}</FormMessage>
            )}
          </FormField>

          <FormField name="mainImage">
            <FormLabel>الصورة الرئيسية</FormLabel>
            <FormControl>
              <ImageUpload
                value={mainImageUrl}
                onChange={setMainImageUrl}
                disabled={isLoading}
                maxSize={2}
              />
            </FormControl>
            <input type="hidden" {...register("mainImage")} value={mainImageUrl} />
          </FormField>

          <div>
            <FormLabel>الصور الإضافية</FormLabel>
            <FormControl>
              <MultipleImageUpload
                value={additionalImageUrls}
                onChange={setAdditionalImageUrls}
                disabled={isLoading}
                maxImages={5}
                maxSize={2}
              />
            </FormControl>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/news")}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "جاري الحفظ..."
                : isEditing
                ? "حفظ التغييرات"
                : "إضافة الخبر"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
