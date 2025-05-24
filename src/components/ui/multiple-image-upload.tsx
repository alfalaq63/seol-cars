'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhotoIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

interface MultipleImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  className?: string;
  maxImages?: number;
  maxSize?: number; // in MB
}

export function MultipleImageUpload({
  value = [],
  onChange,
  disabled = false,
  className = '',
  maxImages = 5,
  maxSize = 2
}: MultipleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Reset error
    setError(null);

    // Check if adding these files would exceed the limit
    if (value.length + files.length > maxImages) {
      setError(`يمكن رفع ${maxImages} صور كحد أقصى`);
      return;
    }

    try {
      setIsUploading(true);
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError('يُسمح فقط برفع ملفات الصور');
          continue;
        }

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          setError(`حجم الملف يجب أن يكون أقل من ${maxSize} ميجابايت`);
          continue;
        }

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
        newUrls.push(data.url);
      }

      // Update the value with new URLs
      onChange([...value, ...newUrls]);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'فشل في رفع الصور');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Upload Button */}
      {value.length < maxImages && (
        <div
          onClick={handleClick}
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <PlusIcon className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 text-center">
            اضغط لإضافة صور
            <br />
            <span className="text-xs">
              {value.length}/{maxImages} صور • الحد الأقصى: {maxSize} ميجابايت
            </span>
          </p>
        </div>
      )}

      {/* Images Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={url}
                  alt={`صورة ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Error loading image:', url);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleRemove(index)}
                disabled={disabled || isUploading}
                className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1 h-auto"
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add More Button */}
      {value.length > 0 && value.length < maxImages && (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={disabled || isUploading}
          className="w-full"
        >
          {isUploading ? 'جاري الرفع...' : 'إضافة المزيد من الصور'}
        </Button>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
          {error}
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-gray-500">
        يمكن رفع {maxImages} صور كحد أقصى، كل صورة يجب أن تكون أقل من {maxSize} ميجابايت
      </div>
    </div>
  );
}
