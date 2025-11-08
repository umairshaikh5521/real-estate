"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, FileIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FileUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  accept?: string;
  maxSize?: number; // in bytes
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  value,
  onChange,
  accept = "*/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  placeholder = "Upload file",
  disabled = false,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `File size too large. Maximum size is ${formatFileSize(
          maxSize
        )}`;
      }

      if (accept !== "*/*") {
        const acceptedTypes = accept.split(",").map((type) => type.trim());
        const fileType = file.type;
        const fileName = file.name;

        const isValidType = acceptedTypes.some((acceptedType) => {
          if (acceptedType.startsWith(".")) {
            return fileName.toLowerCase().endsWith(acceptedType.toLowerCase());
          }
          if (acceptedType.includes("*")) {
            const pattern = acceptedType.replace("*", ".*");
            return new RegExp(pattern).test(fileType);
          }
          return fileType === acceptedType;
        });

        if (!isValidType) {
          return `Invalid file type. Accepted types: ${accept}`;
        }
      }

      return null;
    },
    [maxSize, accept]
  );

  const simulateUpload = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            // In a real app, you would upload to a server and return the URL
            const fileUrl = URL.createObjectURL(file);
            resolve(fileUrl);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      // Simulate potential upload failure
      setTimeout(() => {
        if (Math.random() > 0.95) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadProgress(0);
          reject(new Error("Upload failed. Please try again."));
        }
      }, 500);
    });
  };

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0];
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        return;
      }

      try {
        const fileUrl = await simulateUpload(file);
        onChange?.(fileUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    },
    [validateFile, onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemove = () => {
    onChange?.("");
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const isImage = accept.includes("image/");
  const hasValue = value && value.length > 0;

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {hasValue && !isUploading ? (
        <div className="relative">
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
            <div className="flex-shrink-0">
              {isImage ? (
                <div className="relative w-10 h-10 rounded overflow-hidden">
                  <Image
                    src={value}
                    alt="Preview"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                  <FileIcon className="w-5 h-5 text-primary" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {isImage ? "Image uploaded" : "File uploaded"}
              </p>
              <p className="text-xs text-muted-foreground">
                Click to change file
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
              className="flex-shrink-0 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={disabled ? undefined : handleClick}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            {isUploading ? (
              <>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Uploading...</p>
                  <Progress value={uploadProgress} className="w-32" />
                  <p className="text-xs text-muted-foreground">
                    {uploadProgress}% complete
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {isImage ? (
                    <ImageIcon className="w-6 h-6 text-primary" />
                  ) : (
                    <Upload className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{placeholder}</p>
                  <p className="text-xs text-muted-foreground">
                    Drag & drop or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Max size: {formatFileSize(maxSize)}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
