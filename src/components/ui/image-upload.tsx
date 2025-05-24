'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export function ImageUpload({
  value,
  onChange,
  disabled = false,
  className = '',
  accept = 'image/*',
  maxSize = 2
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset error
    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('يُسمح فقط برفع ملفات الصور');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`حجم الملف يجب أن يكون أقل من ${maxSize} ميجابايت`);
      return;
    }

    try {
      setIsUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في رفع الصورة');
      }

      const data = await response.json();
      onChange(data.url);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'فشل في رفع الصورة');
      setPreview(value || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />

      <div className="flex flex-col space-y-2">
        {preview ? (
          <div className="relative group">
            <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={disabled || isUploading}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
          >
            <PhotoIcon className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 text-center">
              اضغط لاختيار صورة
              <br />
              <span className="text-xs">الحد الأقصى: {maxSize} ميجابايت</span>
            </p>
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            disabled={disabled || isUploading}
            className="flex-1"
          >
            {isUploading ? 'جاري الرفع...' : preview ? 'تغيير الصورة' : 'اختيار صورة'}
          </Button>
          {preview && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
              disabled={disabled || isUploading}
            >
              إزالة
            </Button>
          )}
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
