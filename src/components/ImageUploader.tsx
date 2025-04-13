
import React, { useState, useRef } from 'react';
import { User, Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  currentImage?: string;
  onImageUpload: (imageData: string) => void;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageUpload,
  size = 'md',
  shape = 'circle',
  className = '',
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-64 h-64',
  };

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageUpload(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`relative ${sizeClasses[size]} ${shapeClasses[shape]} overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={triggerFileInput}
    >
      {currentImage ? (
        <img 
          src={currentImage} 
          alt="Uploaded image" 
          className="w-full h-full object-cover"
        />
      ) : (
        <User className={`${size === 'sm' ? 'h-8 w-8' : size === 'md' ? 'h-16 w-16' : 'h-32 w-32'} text-gray-600`} />
      )}
      
      {isHovering && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center transition-opacity duration-200">
          <Camera className="h-6 w-6 text-white mb-2" />
          <span className="text-white text-xs sm:text-sm">Upload Photo</span>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
