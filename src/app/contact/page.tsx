"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema, type MessageFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = async (data: MessageFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "حدث خطأ أثناء إرسال الرسالة");
      }

      setSuccess(true);
      reset();
    } catch (error: unknown) {
      setError((error as Error).message || "حدث خطأ أثناء إرسال الرسالة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          اتصل بنا
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          نحن هنا للإجابة على استفساراتك ومساعدتك في كل ما تحتاجه
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            معلومات الاتصال
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">العنوان</h3>
              <p className="mt-2 text-gray-600">طرابلس، ليبيا</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                البريد الإلكتروني
              </h3>
              <p className="mt-2 text-gray-600">info@siol-libya.com</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">الهاتف</h3>
              <p className="mt-2 text-gray-600">+218 91 1234567</p>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>أرسل لنا رسالة</CardTitle>
            </CardHeader>
            <CardContent>
              <Form
                form={form}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {success && (
                  <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
                    تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <FormField name="name">
                  <FormLabel required>الاسم</FormLabel>
                  <FormControl>
                    <Input
                      {...register("name")}
                      placeholder="أدخل اسمك"
                      disabled={isLoading}
                    />
                  </FormControl>
                  {errors.name && (
                    <FormMessage>{errors.name.message}</FormMessage>
                  )}
                </FormField>

                <FormField name="email">
                  <FormLabel required>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...register("email")}
                      placeholder="أدخل بريدك الإلكتروني"
                      disabled={isLoading}
                    />
                  </FormControl>
                  {errors.email && (
                    <FormMessage>{errors.email.message}</FormMessage>
                  )}
                </FormField>

                <FormField name="message">
                  <FormLabel required>الرسالة</FormLabel>
                  <FormControl>
                    <Textarea
                      {...register("message")}
                      placeholder="أدخل رسالتك"
                      rows={5}
                      disabled={isLoading}
                    />
                  </FormControl>
                  {errors.message && (
                    <FormMessage>{errors.message.message}</FormMessage>
                  )}
                </FormField>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "جاري الإرسال..." : "إرسال"}
                </Button>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
