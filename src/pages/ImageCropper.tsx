
import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, RotateCcw, Crop } from 'lucide-react';
import TrendcastLayout from '@/components/trendcast/TrendcastLayout';
import TrendcastButton from '@/components/trendcast/TrendcastButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const predefinedSizes = [
  { label: '16:9', ratio: 16/9 },
  { label: '9:16', ratio: 9/16 },
  { label: '1:1', ratio: 1 },
  { label: '4:3', ratio: 4/3 },
  { label: '3:4', ratio: 3/4 },
  { label: '21:9', ratio: 21/9 }
];

const ImageCropper = () => {
  const { translate } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [customWidth, setCustomWidth] = useState<string>('1080');
  const [customHeight, setCustomHeight] = useState<string>('1920');
  const [selectedRatio, setSelectedRatio] = useState<number | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      toast.success('Image uploaded successfully!');
    } else {
      toast.error('Please select a valid image file');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleRatioSelect = (ratio: number) => {
    setSelectedRatio(ratio);
    // Calculate dimensions based on ratio
    const baseWidth = 1080;
    const calculatedHeight = Math.round(baseWidth / ratio);
    setCustomWidth(baseWidth.toString());
    setCustomHeight(calculatedHeight.toString());
  };

  const resetCrop = () => {
    setCropArea({ x: 0, y: 0, width: 100, height: 100 });
  };

  const downloadCroppedImage = async () => {
    if (!selectedImage || !canvasRef.current || !imageRef.current) {
      toast.error('No image to download');
      return;
    }

    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      const targetWidth = parseInt(customWidth);
      const targetHeight = parseInt(customHeight);

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Calculate crop dimensions
      const cropX = (cropArea.x / 100) * img.naturalWidth;
      const cropY = (cropArea.y / 100) * img.naturalHeight;
      const cropWidth = (cropArea.width / 100) * img.naturalWidth;
      const cropHeight = (cropArea.height / 100) * img.naturalHeight;

      // Draw cropped and resized image
      ctx?.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, targetWidth, targetHeight
      );

      // Download the image
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `cropped-${selectedImage.name}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success('Image downloaded successfully!');
        }
      }, 'image/png');
    } catch (error) {
      toast.error('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <TrendcastLayout
      title="Image Cropper"
      currentStep={1}
    >
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Resize & Crop Images
          </h2>
          <p className="text-gray-600">
            Upload an image, choose your desired dimensions, and crop to fit perfectly
          </p>
        </div>

        {/* Upload Area */}
        {!selectedImage ? (
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              isDragging 
                ? 'border-purple-400 bg-purple-50' 
                : 'border-gray-300 hover:border-purple-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Upload your image
            </h3>
            <p className="text-gray-500 mb-4">
              Drag and drop your image here, or click to browse
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
            >
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Size Options */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Output Dimensions</h3>
              
              {/* Predefined Ratios */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Predefined Ratios
                </Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {predefinedSizes.map((size) => (
                    <Button
                      key={size.label}
                      variant={selectedRatio === size.ratio ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRatioSelect(size.ratio)}
                      className="text-xs"
                    >
                      {size.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width" className="text-sm font-medium text-gray-700">
                    Width (px)
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    value={customWidth}
                    onChange={(e) => {
                      setCustomWidth(e.target.value);
                      setSelectedRatio(null);
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-sm font-medium text-gray-700">
                    Height (px)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={customHeight}
                    onChange={(e) => {
                      setCustomHeight(e.target.value);
                      setSelectedRatio(null);
                    }}
                    className="mt-1"
                  />
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Output size: {customWidth} x {customHeight} pixels
              </p>
            </div>

            {/* Image Preview with Crop Area */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Image Preview</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetCrop}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Crop
                </Button>
              </div>
              
              <div className="relative max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-sm">
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-auto max-h-96 object-contain"
                  onLoad={() => {
                    // Initialize crop area when image loads
                    setCropArea({ x: 10, y: 10, width: 80, height: 80 });
                  }}
                />
                
                {/* Crop Area Overlay */}
                <div
                  className="absolute border-2 border-purple-500 bg-purple-500/20"
                  style={{
                    left: `${cropArea.x}%`,
                    top: `${cropArea.y}%`,
                    width: `${cropArea.width}%`,
                    height: `${cropArea.height}%`,
                    cursor: 'move'
                  }}
                >
                  <div className="absolute top-0 left-0 w-2 h-2 bg-purple-500 cursor-nw-resize" />
                  <div className="absolute top-0 right-0 w-2 h-2 bg-purple-500 cursor-ne-resize" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 bg-purple-500 cursor-sw-resize" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-purple-500 cursor-se-resize" />
                </div>
              </div>

              <p className="text-sm text-gray-500 text-center mt-3">
                Drag the crop area to adjust the selection
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedImage(null);
                  setImageUrl('');
                  if (imageUrl) URL.revokeObjectURL(imageUrl);
                }}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload New Image
              </Button>

              <TrendcastButton
                onClick={downloadCroppedImage}
                disabled={!selectedImage}
                loading={isProcessing}
                icon={<Download className="ml-2 h-4 w-4" />}
              >
                {isProcessing ? 'Processing...' : 'Download Cropped Image'}
              </TrendcastButton>
            </div>
          </div>
        )}

        {/* Hidden Canvas for Processing */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </div>
    </TrendcastLayout>
  );
};

export default ImageCropper;
