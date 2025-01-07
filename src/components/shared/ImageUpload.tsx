import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  image?: string;
  onChange: (image: string) => void;
  onRemove: () => void;
  className?: string;
}

export function ImageUpload({
  image,
  onChange,
  onRemove,
  className = '',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {image && (
        <div className='relative'>
          <img
            src={image}
            alt='Uploaded image'
            className='w-16 h-16 object-contain rounded border'
          />
          <button
            type='button'
            onClick={onRemove}
            className='absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200'
          >
            <X className='w-3 h-3' />
          </button>
        </div>
      )}
      <button
        type='button'
        onClick={() => fileInputRef.current?.click()}
        className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
      >
        <Upload className='w-4 h-4' />
        Upload Image
      </button>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleImageChange}
        className='hidden'
      />
    </div>
  );
}
